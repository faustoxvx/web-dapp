import React from "react";
import { ethers } from "ethers";
import Modal from "react-bootstrap/Modal";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { parseAndCommify } from "src/onchain/utils";
import ClaimRewardsDropdown from "src/components/design_system/dropdowns/claim_rewards_dropdown";
import Divider from "src/components/design_system/other/Divider";
import { P1, P2 } from "src/components/design_system/typography";
import Button from "src/components/design_system/button";
import { useWindowDimensionsHook } from "../../../utils/window";
import { ArrowLeft } from "src/components/icons";

const RewardsModal = ({
  show,
  setShow,
  claim,
  loadingRewards,
  activeContract,
  rewardValues,
  supportedTalents,
  mode,
  railsContext
}) => {
  if (!activeContract) {
    return null;
  }

  const { width } = useWindowDimensionsHook();
  const mobile = width < 992;
  const availableRewards = rewardValues[activeContract] || "0";
  const activeTalent = supportedTalents.find(talent => talent.contract_id == activeContract.toLowerCase()) || {};

  // eslint-disable-next-line no-unused-vars
  const loadAvailableSupply = ethers.utils.formatUnits(parseInt(activeTalent.totalSupply) || 0);

  return (
    <Modal
      scrollable={true}
      show={show}
      centered={mobile ? false : true}
      onHide={() => setShow(false)}
      dialogClassName={mobile ? "mw-100 mh-100 m-0" : "remove-background rewards-modal"}
      fullscreen={"md-down"}
    >
      <>
        <Modal.Header closeButton className="pt-4 px-4 pb-0">
          {mobile && (
            <button onClick={() => setShow(false)} className="text-black remove-background remove-border mr-3">
              <ArrowLeft color="currentColor" />
            </button>
          )}
          <P1
            className="text-black"
            text={`Claim rewards ${railsContext.disableSmartContracts == "true" ? "(currently unavailable)" : ""}`}
            bold
          />
        </Modal.Header>
        <Modal.Body className="show-grid px-4 pb-4 d-flex flex-column justify-content-between">
          <P2
            className="mb-6"
            text={
              railsContext.disableSmartContracts == "true"
                ? "For security reasons buying talent tokens is currently disabled, we're working to solve this and apologize for any inconvenience."
                : "Rewards are calculated in real time and are always displayed in $TAL."
            }
            mode={mode}
          />
          <P2 className="text-black mb-2" text="Claim method" bold />
          <ClaimRewardsDropdown mode={mode} talentSymbol={activeTalent.symbol} className="mb-2" />
          <P2
            className="text-primary-04"
            text="This will use all your accumulated rewards. If no more talent tokens can
          be minted the leftover amount will be returned to you."
          />
          <Divider mode={mode} className="mt-6 mb-3" />
          <div className="d-flex justify-content-between mb-2">
            <P2 className="text-gray-300" text="Unclaimed Rewards" />
            <P2 className="text-right text-black" text={`${parseAndCommify(availableRewards)} $TAL`} />
          </div>
          <div className="d-flex justify-content-between">
            <P2 className="text-gray-300" text={`$${activeTalent.symbol} Unclaimed Price`} />
            <P2 className="text-right text-black" text="$0.1" />
          </div>
          <Divider mode={mode} className="mt-3 mb-3" />
          <div className="d-flex justify-content-between">
            <P1 className="text-black" text="You will receive" bold />
            <P1 className="text-black" text={`${parseAndCommify(availableRewards / 5)} $${activeTalent.symbol}`} bold />
          </div>
          <Divider mode={mode} className="mt-3 mb-3" />
          <Button
            className="w-100"
            type="primary-default"
            size="big"
            onClick={claim}
            disabled={loadingRewards || railsContext.disableSmartContracts == "true"}
          >
            Buy ${activeTalent.symbol} {loadingRewards ? <FontAwesomeIcon icon={faSpinner} spin /> : ""}
          </Button>
        </Modal.Body>
      </>
    </Modal>
  );
};

export default RewardsModal;
