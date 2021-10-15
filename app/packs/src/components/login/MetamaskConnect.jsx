import React, { useState, useCallback, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { ethers } from "ethers";
import { OnChain } from "src/onchain";

import MetamaskFox from "images/metamask-fox.svg";
import { patch } from "../../utils/requests";

export const NoMetamask = ({ show, hide }) => (
  <Modal show={show} onHide={hide} centered>
    <Modal.Header closeButton>
      <Modal.Title>
        Metamask <img src={MetamaskFox} height={32} alt="Metamask Fox" />
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <p>
        We couldn't find metamask installed on your browser. You can install it{" "}
        <a href="https://metamask.io/download">here</a>.
      </p>
      <p>
        If you think this is a mistake and you have metamask installed, reach
        out to us on <a href="https://discord.gg/rEXPJZVh">Discord</a>.
      </p>
    </Modal.Body>
  </Modal>
);

const MetamaskConnect = ({ user_id }) => {
  const [requestingMetamask, setRequestingMetamask] = useState("false");
  const [connected, setConnected] = useState(false);
  const [showNoMetamask, setShowNoMetamask] = useState(true);
  const [chainAPI, setChainAPI] = useState(null);
  const [loading, setLoading] = useState(true);

  const setupChain = useCallback(async () => {
    const newOnChain = new OnChain();

    await newOnChain.initialize().catch(() => setLoading(false));

    if (newOnChain) {
      setChainAPI(newOnChain);
      setShowNoMetamask(false);
    }

    setLoading(false);
  });

  useEffect(() => {
    setupChain();
  }, []);

  const connectMetamask = async (e) => {
    e.preventDefault();

    setRequestingMetamask("true");
    if (chainAPI) {
      const account = await chainAPI.connect().catch((e) => {
        if (e?.code == 4001) {
          return;
        }
        setShowNoMetamask(true);
      });

      if (account) {
        const result = await patch(`/api/v1/users/${user_id}`, {
          wallet_id: account.toLowerCase(),
        });

        if (result) {
          setConnected(true);
        }
        setRequestingMetamask("false");
      }
    } else {
      setShowNoMetamask(true);
    }
  };

  const allowConnect = () =>
    loading == false &&
    requestingMetamask == "false" &&
    chainAPI?.provider != null;

  return (
    <>
      {loading == false && (
        <NoMetamask
          show={showNoMetamask}
          hide={() => setShowNoMetamask(false)}
        />
      )}
      <small disabled={!allowConnect()} onClick={connectMetamask}>
        {connected ? "Connected" : loading ? "Loading..." : "Connect Wallet"}{" "}
        <img src={MetamaskFox} height={16} alt="Metamask Fox" />
      </small>
    </>
  );
};

export default MetamaskConnect;
