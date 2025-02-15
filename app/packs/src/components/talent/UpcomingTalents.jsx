import React, { useState, useMemo, useContext } from "react";
import { useWindowDimensionsHook } from "../../utils/window";

import { Caret } from "src/components/icons";

import ThemeContainer, { ThemeContext } from "src/contexts/ThemeContext";

import TalentCard from "src/components/design_system/cards/Talent";
import Button from "src/components/design_system/button";

const UpcomingTalents = ({ talents }) => {
  const [start, setStart] = useState(0);
  const { width } = useWindowDimensionsHook();
  const [mobile, setMobile] = useState(0);
  const theme = useContext(ThemeContext);

  const itemsPerRow = useMemo(() => {
    if (width < 992) {
      setMobile(true);
      return talents.length;
    } else {
      setMobile(false);
    }

    const card = 272;
    const actualWidth = width > 1240 ? 1240 : width;

    const numberOfCards = actualWidth / card;

    return Math.floor(numberOfCards);
  }, [width]);

  const end = talents.length > itemsPerRow ? start + itemsPerRow : talents.length;

  const sliceInDisplay = talents.slice(start, end);

  const slideLeft = () => {
    if (start - itemsPerRow < 0) {
      setStart(0);
    } else {
      setStart(prev => prev - itemsPerRow);
    }
  };
  const slideRight = () => {
    if (start + itemsPerRow >= talents.length) {
      setStart(talents.length - 1);
    } else {
      setStart(prev => prev + itemsPerRow);
    }
  };
  const disableLeft = start === 0;
  const disableRight = start + itemsPerRow >= talents.length;

  if (talents.length === 0) {
    return <></>;
  }

  return (
    <div className={mobile ? "pl-4" : ""}>
      <div className="d-flex flex-row justify-content-between align-items-center">
        <div className="d-flex flex-row align-items-center">
          <h6 className="mb-0">
            <strong>Upcoming Talent</strong>
          </h6>
        </div>
        {talents.length > itemsPerRow && (
          <div className="d-flex flex-row">
            <Button onClick={slideLeft} disabled={disableLeft} type="white-ghost" mode={theme.mode()} className="mr-2">
              <Caret size={16} color="currentColor" className="rotate-90" />
            </Button>
            <Button onClick={slideRight} disabled={disableRight} type="white-ghost" mode={theme.mode()}>
              <Caret size={16} color="currentColor" className="rotate-270" />
            </Button>
          </div>
        )}
      </div>
      <div className="d-flex flex-row pb-6 pt-3 horizontal-scroll hide-scrollbar">
        {sliceInDisplay.map((talent, index) => (
          <TalentCard
            coming_soon={true}
            mobile={mobile}
            mode={theme.mode()}
            photo_url={talent.profilePictureUrl}
            name={talent.name}
            title={talent.occupation}
            key={`upcoming_talent_list_${talent.id}_${index}`}
            href={`/u/${talent.username}`}
          />
        ))}
      </div>
    </div>
  );
};

// eslint-disable-next-line no-unused-vars
export default (props, railsContext) => {
  return () => (
    <ThemeContainer {...props}>
      <UpcomingTalents {...props} />
    </ThemeContainer>
  );
};
