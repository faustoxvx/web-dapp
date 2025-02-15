import React, { useState } from "react";
import currency from "currency.js";
import { displayableAmount } from "src/utils/viewHelpers";
import { useWindowDimensionsHook } from "src/utils/window";
import Modal from "react-bootstrap/Modal";
import { OrderBy } from "src/components/icons";

import TalentProfilePicture from "./TalentProfilePicture";
import Table from "src/components/design_system/table";
import Tag from "src/components/design_system/tag";
import Button from "src/components/design_system/button";
import { P1, P2, P3, Caption } from "src/components/design_system/typography";

import { parsedVariance } from "src/utils/viewHelpers";

import cx from "classnames";

const MobileTalentTableDropdown = ({
  show,
  hide,
  mode,
  selectedOption,
  order,
  onOptionClick,
  showFirstBoughtField
}) => {
  const selectedClass = option => (option == selectedOption ? " text-primary" : "text-black");
  return (
    <Modal show={show} fullscreen="true" onHide={hide} dialogClassName={"m-0 mw-100 table-options-dropdown"}>
      <Modal.Body className="d-flex flex-column p-0 pb-5">
        <P3 bold className="text-primary-04 py-3 px-4" text="View" />
        <div className={`divider mb-2 ${mode}`}></div>
        <Button
          onClick={() => onOptionClick("Supporters")}
          type="white-ghost"
          mode={mode}
          className="d-flex flex-row justify-content-between px-4"
        >
          <P1 className={cx(selectedClass("Supporters"))} bold text="Supporters" />
          {selectedOption == "Supporters" && <OrderBy className={order == "asc" ? "" : "rotate-180"} />}
        </Button>
        <Button
          onClick={() => onOptionClick("Occupation")}
          type="white-ghost"
          mode={mode}
          className="d-flex flex-row justify-content-between px-4"
        >
          <P1 className={cx(selectedClass("Occupation"))} bold text="Occupation" />
          {selectedOption == "Occupation" && <OrderBy className={order == "asc" ? "" : "rotate-180"} />}
        </Button>
        <Button
          onClick={() => onOptionClick("Market Cap")}
          type="white-ghost"
          mode={mode}
          className="d-flex flex-row justify-content-between px-4"
        >
          <P1 className={cx(selectedClass("Market Cap"))} bold text="Market Cap" />
          {selectedOption == "Market Cap" && <OrderBy className={order == "asc" ? "" : "rotate-180"} />}
        </Button>
        <Button
          onClick={() => onOptionClick("Alphabetical Order")}
          type="white-ghost"
          mode={mode}
          className="d-flex flex-row justify-content-between px-4"
        >
          <P1 className={cx(selectedClass("Alphabetical Order"))} bold text="Alphabetical Order" />
          {selectedOption == "Alphabetical Order" && <OrderBy className={order == "asc" ? "" : "rotate-180"} />}
        </Button>
        {showFirstBoughtField && (
          <Button
            onClick={() => onOptionClick("First Buy")}
            type="white-ghost"
            mode={mode}
            className="d-flex flex-row justify-content-between px-4"
          >
            <P1 className={cx(selectedClass("First Buy"))} bold text="Since" />
            {selectedOption == "First Buy" && <OrderBy className={order == "asc" ? "" : "rotate-180"} />}
          </Button>
        )}
      </Modal.Body>
    </Modal>
  );
};

const TalentTableListMode = ({
  talents,
  theme,
  selectedSort,
  setSelectedSort,
  sortDirection,
  setSortDirection,
  showFirstBoughtField = true
}) => {
  const { mobile } = useWindowDimensionsHook();
  const [showDropdown, setShowDropdown] = useState(false);

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

  const varianceClassNames = talent => {
    if (!talent.talentToken.contractId || !talent.marketCapVariance || Math.abs(talent.marketCapVariance) < 0.01)
      return "";

    return talent.marketCapVariance < 0 ? "text-danger" : "text-success";
  };

  const getSelectedOptionValue = talent => {
    const contractId = talent.talentToken.contractId;
    switch (selectedSort) {
      case "Supporters":
        return contractId ? talent.supportersCount : "-";
      case "Occupation":
        return talent.occupation;
      case "Market Cap":
        return contractId ? `$${displayableAmount(talent.marketCap)}` : "-";
      case "Market Cap Variance":
        return contractId ? parsedVariance(talent.marketCapVariance) : "-";
      case "Alphabetical Order":
        return talent.occupation;
      case "First Buy":
        return talent.firstTimeBoughtAt;
      default:
        return talent.occupation;
    }
  };

  const sortIcon = option => {
    if (option == selectedSort) {
      return sortDirection == "asc" ? " ▼" : " ▲";
    } else {
      return "";
    }
  };

  if (mobile) {
    return (
      <>
        <MobileTalentTableDropdown
          show={showDropdown}
          hide={() => setShowDropdown(false)}
          mode={theme.mode()}
          selectedOption={selectedSort}
          order={sortDirection}
          onOptionClick={onOptionClick}
          showFirstBoughtField={showFirstBoughtField}
        />
        <div className="w-100 talent-table-tabs mt-3 d-flex flex-row justify-content-between align-items-center">
          <P2 text="Talent" className="text-black ml-2" bold />
          <Button onClick={() => setShowDropdown(true)} type="white-ghost">
            {selectedSort} <OrderBy black={true} />
          </Button>
        </div>
        <Table mode={theme.mode()}>
          <Table.Body>
            {talents.map(talent => (
              <Table.Tr key={`talent-${talent.id}`}>
                <Table.Td>
                  <div className="d-flex flex-row align-items-center">
                    <div
                      className="d-flex flex-row align-items-center"
                      onClick={() => (window.location.href = `/u/${talent.user.username}`)}
                    >
                      <TalentProfilePicture src={talent.profilePictureUrl} userId={talent.id} height="24" />
                      <P2 text={talent.user.name} bold className="ml-2" />
                    </div>
                  </div>
                </Table.Td>
                <Table.Td
                  className="text-right pr-3"
                  onClick={() => (window.location.href = `/u/${talent.user.username}`)}
                >
                  <P2 text={getSelectedOptionValue(talent)} />
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Body>
        </Table>
      </>
    );
  }

  return (
    <Table mode={theme.mode()} className="px-3 horizontal-scroll">
      <Table.Head>
        <Table.Th>
          <Caption
            onClick={() => onOptionClick("Alphabetical Order")}
            bold
            text={`TALENT${sortIcon("Alphabetical Order")}`}
            className="cursor-pointer"
          />
        </Table.Th>
        <Table.Th>
          <Caption
            onClick={() => onOptionClick("Occupation")}
            bold
            text={`OCCUPATION${sortIcon("Occupation")}`}
            className="cursor-pointer"
          />
        </Table.Th>
        <Table.Th>
          <Caption
            onClick={() => onOptionClick("Supporters")}
            bold
            text={`SUPPORTERS${sortIcon("Supporters")}`}
            className="cursor-pointer"
          />
        </Table.Th>
        <Table.Th className="col-2 px-0">
          <Caption
            onClick={() => onOptionClick("Market Cap")}
            bold
            text={`MARKET CAP${sortIcon("Market Cap")}`}
            className="cursor-pointer"
          />
        </Table.Th>
        <Table.Th className="col-2 px-0">
          <Caption
            onClick={() => onOptionClick("Market Cap Variance")}
            bold
            text={`30 DAY MARKET CAP${sortIcon("Market Cap Variance")}`}
            className="cursor-pointer"
          />
        </Table.Th>
        {showFirstBoughtField && (
          <Table.Th>
            <Caption
              onClick={() => onOptionClick("First Buy")}
              bold
              text={`SINCE${sortIcon("First Buy")}`}
              className="cursor-pointer"
            />
          </Table.Th>
        )}
      </Table.Head>
      <Table.Body>
        {talents.map(talent => (
          <Table.Tr key={`talent-${talent.id}`}>
            <Table.Td onClick={() => (window.location.href = `/u/${talent.user.username}`)}>
              <div className="d-flex align-items-center">
                <TalentProfilePicture src={talent.profilePictureUrl} userId={talent.id} height="24" />
                <P2 text={talent.user.name} bold className="ml-2" />
                {talent.talentToken.contractId ? (
                  <P2 text={`$${talent.talentToken.ticker}`} bold className="text-primary-03 ml-2" />
                ) : (
                  <Tag className="coming-soon-tag ml-2">
                    <P3
                      className="current-color"
                      bold
                      text={talent.user.profileType == "waiting_for_approval" ? "Waiting For Approval" : "Coming Soon"}
                    />
                  </Tag>
                )}
              </div>
            </Table.Td>
            <Table.Td onClick={() => (window.location.href = `/u/${talent.user.username}`)}>
              <P2 text={talent.occupation} />
            </Table.Td>
            <Table.Td onClick={() => (window.location.href = `/u/${talent.user.username}`)}>
              <P2 text={talent.talentToken.contractId ? `${talent.supportersCount || 0}` : "-"} />
            </Table.Td>
            <Table.Td className="pr-3" onClick={() => (window.location.href = `/u/${talent.user.username}`)}>
              <P2
                className={cx(talent.talentToken.contractId ? "" : "d-flex justify-content-center")}
                text={talent.talentToken.contractId ? `${currency(displayableAmount(talent.marketCap)).format()}` : "-"}
              />
              {talent.talentToken.contractId && (
                <div className="progress" style={{ height: 6 }}>
                  <div
                    className="progress-bar bg-secondary"
                    role="progressbar"
                    aria-valuenow={talent.supplyProgress || 0}
                    style={{ width: `${talent.supplyProgress || 0}%` }}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
              )}
            </Table.Td>
            <Table.Td className="pr-5" onClick={() => (window.location.href = `/u/${talent.user.username}`)}>
              <P2
                className={varianceClassNames(talent)}
                text={talent.talentToken.contractId ? `${parsedVariance(talent.marketCapVariance)}` : "-"}
              />
            </Table.Td>
            {showFirstBoughtField && (
              <Table.Td>
                <P2 text={talent.firstTimeBoughtAt} />
              </Table.Td>
            )}
          </Table.Tr>
        ))}
      </Table.Body>
    </Table>
  );
};

export default TalentTableListMode;
