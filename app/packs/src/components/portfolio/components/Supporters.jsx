import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { ethers } from "ethers";
import currency from "currency.js";

import { parseAndCommify } from "src/onchain/utils";
import { useQuery, GET_TALENT_PORTFOLIO_FOR_ID, PAGE_SIZE } from "src/utils/thegraph";
import { get } from "src/utils/requests";
import { shortenAddress } from "src/utils/viewHelpers";

import { H4, H5, P1, P2, P3, Caption } from "src/components/design_system/typography";
import Button from "src/components/design_system/button";
import TalentProfilePicture from "src/components/talent/TalentProfilePicture";
import Table from "src/components/design_system/table";
import Link from "src/components/design_system/link";
import { Spinner, OrderBy, ArrowLeft } from "src/components/icons";

const arrayToObject = (inputArray, key) => {
  const obj = {};

  inputArray.forEach(element => (obj[element[key]] = element));

  return obj;
};

const concatenateSupporterAddresses = supporters => `?supporters[]=${supporters.map(s => s.id).join("&supporters[]=")}`;

const MobileSupporterAction = ({
  show,
  hide,
  mode,
  name,
  profilePicture,
  tokensHeld,
  unclaimedRewards,
  ticker,
  userId,
  currentUserId,
  messagingDisabled
}) => {
  return (
    <Modal show={show} fullscreen="true" onHide={hide} dialogClassName={"m-0 w-100 h-100"} contentClassName={"h-100"}>
      <Modal.Body className="d-flex flex-column h-100 p-0">
        <div className="d-flex flex-row align-items-center w-100 py-4">
          <Button onClick={hide} type="white-ghost" mode={mode} className="mx-3 p-2">
            <ArrowLeft color="currentColor" />
          </Button>
          <TalentProfilePicture src={profilePicture} height="24" />
          <P2 className="ml-2 p-0" bold>
            {name}
          </P2>
        </div>
        <div className={`divider ${mode}`}></div>
        <P3 className="mx-3 mt-4" bold>
          Tokens Held
        </P3>
        <H4 className="mx-3 mb-4" bold>
          {tokensHeld} {ticker}
        </H4>
        <div className={`divider mx-3 ${mode}`}></div>
        <div className="d-flex flex-row justify-content-between align-items-center mx-3 mt-4">
          <P2 bold className="text-gray-300">
            Unclaimed Rewards
          </P2>
          <P1 bold>{unclaimedRewards}</P1>
        </div>
        <Button
          onClick={() => (window.location.href = `/messages?user=${userId}`)}
          type="white-subtle"
          mode={mode}
          disabled={!userId || userId == currentUserId || messagingDisabled}
          className="mx-3 mt-auto mb-3"
        >
          Message
        </Button>
      </Modal.Body>
    </Modal>
  );
};

const MobileSupportersDropdown = ({ show, hide, mode, selectedOption, order, onOptionClick }) => {
  const selectedClass = option => (option == selectedOption ? " text-primary" : "");
  return (
    <Modal show={show} fullscreen="true" onHide={hide} dialogClassName={"m-0 mw-100 table-options-dropdown"}>
      <Modal.Body className="d-flex flex-column p-0">
        <small className="text-muted p-3">View</small>
        <div className={`divider ${mode}`}></div>
        <Button
          onClick={() => onOptionClick("Amount")}
          type="white-ghost"
          mode={mode}
          className={`d-flex flex-row justify-content-between px-4 my-2${selectedClass("Supporters")}`}
        >
          Amount {selectedOption == "Amount" && <OrderBy className={order == "asc" ? "" : "rotate-180"} />}
        </Button>
        <Button
          onClick={() => onOptionClick("Rewards")}
          type="white-ghost"
          mode={mode}
          className={`d-flex flex-row justify-content-between px-4 my-2${selectedClass("Occupation")}`}
        >
          Unclaimed Rewards {selectedOption == "Rewards" && <OrderBy className={order == "asc" ? "" : "rotate-180"} />}
        </Button>
        <Button
          onClick={() => onOptionClick("Alphabetical Order")}
          type="white-ghost"
          mode={mode}
          className={`d-flex flex-row justify-content-between px-4 my-2${selectedClass("Alphabetical Order")}`}
        >
          Alphabetical Order
          {selectedOption == "Alphabetical Order" && <OrderBy className={order == "asc" ? "" : "rotate-180"} />}
        </Button>
      </Modal.Body>
    </Modal>
  );
};

const SupporterOverview = ({ loading, talentRewards, marketCap, mode, mobile }) => {
  const marketCapCUSD = loading ? 0.0 : Number.parseFloat(marketCap) * 0.02;
  const pendingRewardsCUSD = loading ? 0.0 : Number.parseFloat(talentRewards) * 0.02;

  if (mobile) {
    return (
      <div className="d-flex flex-column w-100 px-4">
        <div className="d-flex flex-column">
          <P3 mode={mode} text={"Market Cap"} />
          <div className="d-flex flex-row flex-wrap mt-3 align-items-end">
            <H4 mode={mode} text={currency(marketCapCUSD).format()} bold className="mb-0 mr-2" />
            <P2 mode={mode} text={`${ethers.utils.commify(Number.parseFloat(marketCap).toFixed(2))} $TAL`} bold />
          </div>
        </div>
        <div className="d-flex flex-column">
          <P3 mode={mode} text={"Unclaimed Rewards"} />
          <div className="d-flex flex-row flex-wrap mt-3 align-items-end">
            <H4 mode={mode} text={currency(pendingRewardsCUSD).format()} bold className="mb-0 mr-2" />
            <P2 mode={mode} text={`${ethers.utils.commify(Number.parseFloat(talentRewards).toFixed(2))} $TAL`} bold />
          </div>
        </div>
        <Button onClick={() => null} type="primary-default" mode={mode} disabled={true} className="my-3 w-100">
          Claim Rewards
        </Button>
      </div>
    );
  }

  return (
    <div className="d-flex flex-row justify-content-between flex-wrap w-100 mt-4">
      <div className="d-flex flex-column portfolio-amounts-overview p-3 w-32">
        <P3 mode={mode} text={"Market Cap"} />
        <div className="d-flex flex-row flex-wrap mt-3 align-items-end">
          <H4 mode={mode} text={currency(marketCapCUSD).format()} bold className="mb-0 mr-2" />
          <P2 mode={mode} text={`${ethers.utils.commify(Number.parseFloat(marketCap).toFixed(2))} $TAL`} bold />
        </div>
      </div>
      <div className="d-flex flex-column portfolio-amounts-overview p-3 w-32">
        <P3 mode={mode} text={"Total Rewards Claimed"} />
        <div className="d-flex flex-row flex-wrap mt-3 align-items-end">
          <H4 mode={mode} text={"$0.00"} bold className="mb-0 mr-2" />
          <P2 mode={mode} text={"0 $TAL"} bold />
        </div>
      </div>
      <div className="d-flex flex-column portfolio-amounts-overview p-3 w-32">
        <P3 mode={mode} text={"Unclaimed Rewards"} className="text-warning" />
        <div className="d-flex flex-row flex-wrap mt-3 align-items-end">
          <H4 mode={mode} text={currency(pendingRewardsCUSD).format()} bold className="mb-0 mr-2" />
          <P2 mode={mode} text={`${ethers.utils.commify(Number.parseFloat(talentRewards).toFixed(2))} $TAL`} bold />
        </div>
      </div>
    </div>
  );
};

const Supporters = ({ mode, ticker, tokenAddress, chainAPI, mobile, currentUserId, messagingDisabled }) => {
  const [supporterInfo, setSupporterInfo] = useState({});
  const [talentData, setTalentData] = useState({
    totalValueLocked: 0,
    supporterCounter: 0,
    totalSupply: 0,
    marketCap: 0,
    rewardsReady: 0
  });
  const [selectedSort, setSelectedSort] = useState("Alphabetical Order");
  const [sortDirection, setSortDirection] = useState("asc");
  const [showDropdown, setShowDropdown] = useState(false);
  const [returnValues, setReturnValues] = useState({});
  const [activeSupporter, setActiveSupporter] = useState(null);
  const [page, setPage] = useState(0);
  const [supporters, setSupporters] = useState([]);
  const [localLoading, setLocalLoading] = useState(true);

  const { loading, data } = useQuery(GET_TALENT_PORTFOLIO_FOR_ID, {
    variables: {
      id: tokenAddress?.toLowerCase(),
      skip: page * PAGE_SIZE,
      first: PAGE_SIZE
    }
  });

  const toggleDirection = () => {
    if (sortDirection == "asc") {
      setSortDirection("desc");
    } else {
      setSortDirection("asc");
    }
  };

  const onOptionClick = option => {
    if (option == selectedSort) {
      toggleDirection();
    } else {
      setSortDirection("asc");
      setSelectedSort(option);
    }
    setShowDropdown(false);
  };

  const loadReturns = async accountId => {
    if (chainAPI && accountId) {
      const value = await chainAPI.calculateEstimatedReturns(tokenAddress, accountId);

      return ethers.utils.formatUnits(value.talentRewards);
    }

    return "0";
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
  };

  useEffect(() => {
    if (loading || !data?.talentToken) {
      if (!loading) {
        setLocalLoading(false);
      }
      return;
    }

    const newTalentData = {
      totalValueLocked: ethers.utils.formatUnits(data.talentToken.totalValueLocked),
      supporterCounter: data.talentToken.supporterCounter,
      totalSupply: ethers.utils.formatUnits(data.talentToken.totalSupply),
      marketCap: ethers.utils.formatUnits(data.talentToken.marketCap),
      rewardsReady: ethers.utils.formatUnits(data.talentToken.rewardsReady)
    };

    const newSupporters = data.talentToken.supporters.map(({ amount, supporter }) => ({
      id: supporter.id,
      amount: ethers.utils.formatUnits(amount)
    }));

    setTalentData(prev => ({ ...prev, ...newTalentData }));
    setSupporters(prev => [...prev, ...newSupporters]);

    if (data.talentToken.supporters.length == PAGE_SIZE) {
      loadMore();
    }

    setLocalLoading(false);
  }, [data]);

  const populateNewSupporters = newSupporters => {
    if (newSupporters.length === 0) {
      return;
    }

    get(`/api/v1/portfolio_supporters/${concatenateSupporterAddresses(newSupporters)}`).then(response => {
      if (response.supporters.length > 0) {
        const supportersTransformed = arrayToObject(response.supporters, "wallet_id");

        setSupporterInfo(prev => ({
          ...prev,
          ...supportersTransformed
        }));
      }
    });
  };

  useEffect(() => {
    const supportersWithNoInfo = supporters.filter(item => !supporterInfo[item.id]);

    populateNewSupporters(supportersWithNoInfo);
  }, [supporters]);

  const updateAll = async () => {
    supporters.forEach(element => {
      loadReturns(element.id).then(returns => {
        setReturnValues(prev => ({
          ...prev,
          [element.id]: returns
        }));
      });
    });
  };

  useEffect(() => {
    updateAll();
  }, [supporters, chainAPI]);

  const compareName = (talent1, talent2) => {
    if (talent1.name > talent2.name) {
      return 1;
    } else if (talent1.name < talent2.name) {
      return -1;
    } else {
      return 0;
    }
  };

  const compareAmount = (user1, user2) => {
    if (parseFloat(user1.amount) < parseFloat(user2.amount)) {
      return 1;
    } else if (parseFloat(user1.amount) > parseFloat(user2.amount)) {
      return -1;
    } else {
      return 0;
    }
  };

  const returns = walletId => {
    if (returnValues[walletId]) {
      return parseAndCommify(talToUSD(returnValues[walletId].toString()));
    }

    return "0.0";
  };

  const compareRewards = (user1, user2) => {
    const talent1Amount = parseFloat(returns(user1.id).replaceAll(",", ""));
    const talent2Amount = parseFloat(returns(user2.id).replaceAll(",", ""));

    if (talent1Amount < talent2Amount) {
      return 1;
    } else if (talent1Amount > talent2Amount) {
      return -1;
    } else {
      return 0;
    }
  };

  const sortedSupporters = () => {
    let desiredSupporters = supporters;

    let comparisonFunction;

    switch (selectedSort) {
      case "Amount":
        comparisonFunction = compareAmount;
        break;
      case "Rewards":
        comparisonFunction = compareRewards;
        break;
      case "Alphabetical Order":
        comparisonFunction = compareName;
        break;
    }

    desiredSupporters.sort(comparisonFunction);
    if (sortDirection != "asc") {
      desiredSupporters.reverse();
    }

    return desiredSupporters;
  };

  const talToUSD = amount => {
    return parseFloat(amount) * 0.02;
  };

  const sortIcon = option => {
    if (option == selectedSort) {
      return sortDirection == "asc" ? " ▼" : " ▲";
    } else {
      return "";
    }
  };

  if (localLoading) {
    return (
      <div className="w-100 h-100 d-flex flex-column justify-content-center align-items-center mt-3">
        <Spinner />
      </div>
    );
  }

  if (!localLoading && sortedSupporters().length == 0) {
    return (
      <div className="w-100 h-100 d-flex flex-column justify-content-center align-items-center mt-3">
        <H5 mode={mode} text="You don't have any Supporter" bold />
        <P2 mode={mode} text="All your supporters will be listed here" bold />
      </div>
    );
  }

  const getSelectedOptionValue = supporter => {
    switch (selectedSort) {
      case "Amount":
        return `${parseAndCommify(supporter.amount)} ${ticker}`;
      case "Rewards":
        return `${parseAndCommify(returnValues[supporter.id] || "0")} TAL`;
      case "Alphabetical Order":
        return `${parseAndCommify(supporter.amount)} ${ticker}`;
    }
  };

  const getSelectedOptionValueUSD = supporter => {
    switch (selectedSort) {
      case "Amount":
        return `$${parseAndCommify(supporter.amount * 0.1)}`;
      case "Rewards":
        return `$${parseAndCommify(returnValues[supporter.id] * 0.02 || "0")}`;
      case "Alphabetical Order":
        return `$${parseAndCommify(supporter.amount * 0.1)}`;
    }
  };

  const supporterName = supporter => {
    if (supporterInfo[supporter.id]?.username) {
      return supporterInfo[supporter.id]?.username;
    } else {
      return `(${shortenAddress(supporter.id)})`;
    }
  };

  if (mobile) {
    return (
      <>
        {activeSupporter !== null && (
          <MobileSupporterAction
            show={true}
            hide={() => setActiveSupporter(null)}
            mode={mode}
            profilePicture={supporterInfo[activeSupporter.id]?.profile_picture_url}
            name={supporterName(activeSupporter)}
            tokensHeld={parseAndCommify(activeSupporter.amount)}
            unclaimedRewards={parseAndCommify(returnValues[activeSupporter.id] || "0")}
            ticker={ticker}
            userId={supporterInfo[activeSupporter.id]?.id}
            currentUserId={currentUserId}
            messagingDisabled={supporterInfo[activeSupporter.id]?.messaging_disabled || messagingDisabled}
          />
        )}
        <MobileSupportersDropdown
          show={showDropdown}
          hide={() => setShowDropdown(false)}
          mode={mode}
          selectedOption={selectedSort}
          order={sortDirection}
          onOptionClick={onOptionClick}
        />
        <SupporterOverview
          supporterCount={supporters.length}
          loading={localLoading}
          reserve={talentData.totalValueLocked}
          talentRewards={talentData.rewardsReady}
          marketCap={talentData.marketCap}
          mode={mode}
          mobile={mobile}
        />
        <div className="d-flex flex-row w-100 justify-content-between align-items-middle mt-3 px-2">
          <Button onClick={() => null} type="white-ghost" mode={mode}>
            Supporter
          </Button>
          <Button onClick={() => setShowDropdown(true)} type="white-ghost" mode={mode}>
            {selectedSort} <OrderBy black={true} />
          </Button>
        </div>
        <div className={`divider ${mode} my-2`}></div>
        <Table mode={mode} className="horizontal-scroll">
          <Table.Body>
            {sortedSupporters().map(supporter => (
              <Table.Tr
                key={`supporter-${supporter.id}`}
                className="px-2"
                onClick={() => setActiveSupporter(supporter)}
              >
                <Table.Td>
                  <div className="d-flex cursor-pointer pl-4 py-2">
                    <TalentProfilePicture
                      src={supporterInfo[supporter.id]?.profile_picture_url}
                      height="24"
                      userId={supporter.id}
                    />
                    <P2 text={supporterName(supporter)} bold className="ml-2" />
                  </div>
                </Table.Td>
                <Table.Td className="d-flex flex-column justify-content-center align-items-end pr-4 py-2">
                  <P2 bold text={getSelectedOptionValueUSD(supporter)} className="text-black" />
                  <P2 text={getSelectedOptionValue(supporter)} />
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Body>
        </Table>
      </>
    );
  }

  return (
    <>
      <SupporterOverview
        supporterCount={supporters.length}
        loading={localLoading}
        reserve={talentData.totalValueLocked}
        talentRewards={talentData.rewardsReady}
        marketCap={talentData.marketCap}
        mode={mode}
        mobile={mobile}
      />
      <Table mode={mode} className="px-3 horizontal-scroll mt-4">
        <Table.Head>
          <Table.Th>
            <Caption
              onClick={() => onOptionClick("Alphabetical Order")}
              bold
              text={`SUPPORTER${sortIcon("Alphabetical Order")}`}
              className="cursor-pointer"
            />
          </Table.Th>
          <Table.Th>
            <Caption
              onClick={() => onOptionClick("Amount")}
              bold
              text={`AMOUNT${sortIcon("Amount")}`}
              className="cursor-pointer"
            />
          </Table.Th>
          <Table.Th>
            <Caption
              onClick={() => onOptionClick("Rewards")}
              bold
              text={`REWARDS${sortIcon("Rewards")}`}
              className="cursor-pointer"
            />
          </Table.Th>
          <Table.Th>
            <Caption bold text="Action" />
          </Table.Th>
        </Table.Head>
        <Table.Body>
          {sortedSupporters().map(supporter => (
            <Table.Tr key={`supporter-${supporter.id}`} className="reset-cursor">
              <Table.Td>
                <div className="d-flex flex-row">
                  <TalentProfilePicture src={supporterInfo[supporter.id]?.profile_picture_url} height="24" />
                  {supporterInfo[supporter.id]?.username && (
                    <P2 text={`${supporterInfo[supporter.id]?.username}`} bold className="ml-2" />
                  )}
                  <P2 text={`(${shortenAddress(supporter.id)})`} className="ml-2" />
                </div>
              </Table.Td>
              <Table.Td>
                <div className="d-flex flex-column justify-content-center align-items-start">
                  <P2 bold text={`$${parseAndCommify(supporter.amount * 0.1)}`} className="text-black" />
                  <P2 text={`${parseAndCommify(supporter.amount)} ${ticker}`} />
                </div>
              </Table.Td>
              <Table.Td>
                <div className="d-flex flex-column justify-content-center align-items-start">
                  <P2
                    bold
                    text={`$${parseAndCommify(returnValues[supporter.id] * 0.02 || "0")}`}
                    className="text-black"
                  />
                  <P2 text={`${parseAndCommify(returnValues[supporter.id] || "0")} TAL`} />
                </div>
              </Table.Td>
              <Table.Td className="pr-3">
                <Link
                  text="Message"
                  bold
                  disabled={
                    !supporterInfo[supporter.id]?.id ||
                    supporterInfo[supporter.id]?.id == currentUserId ||
                    supporterInfo[supporter.id]?.messaging_disabled ||
                    messagingDisabled
                  }
                  href={`/messages?user=${supporterInfo[supporter.id]?.username}`}
                />
              </Table.Td>
            </Table.Tr>
          ))}
          {loading && (
            <Table.Tr>
              <Table.Td>
                <P2>Checking for more supporters...</P2>
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Body>
      </Table>
    </>
  );
};

export default Supporters;
