import { Icon, Typography } from "@talentprotocol/design-system";
import React, { useEffect, useState } from "react";
import { Avatar, Button } from "@talentprotocol/design-system";
import { toast } from "react-toastify";
import { ToastBody } from "src/components/design_system/toasts";
import { careerCircle } from "src/api/career-circle";
//import { useSponsorship } from "./hooks/use-sponsorship";

import {
  NewSponsorsContainer,
  SponsorsContainer,
  SponsorCard,
  AvatarContainer,
  CardBanner,
  CardsContainer,
  ButtonContainer,
  NewSponsorsRow,
  ActionsContainer,
  NewSponsorsList,
  LoadMoreContainer,
  SponsorCardInfoContainer,
  MessageContainer
} from "./styled";

export const Sponsors = ({ currentUserId, railsContext }) => {
  //const sponsorship = useSponsorship(railsContext);

  const [activeSubscribers, setActiveSubscribers] = useState({
    subscribers: [],
    pagination: {}
  });
  const [pendingSubscribers, setPendingSubscribers] = useState({
    subscribers: [],
    pagination: {}
  });

  const activeSubscribersPerPage = 16;
  const pendingSubscribersPerPage = 6;

  useEffect(() => {
    if (!currentUserId) {
      return;
    }

    careerCircle
      .getActiveSubscribers(currentUserId, activeSubscribersPerPage)
      .then(({ data }) => {
        setActiveSubscribers(data);
      })
      .catch(() => {});

    careerCircle
      .getPendingSubscribers(currentUserId, pendingSubscribersPerPage)
      .then(({ data }) => {
        setPendingSubscribers(data);
      })
      .catch(() => {});
  }, [currentUserId]);

  const showLoadMoreActiveSubscribers = () => !!activeSubscribers.pagination.cursor;

  const loadMoreActiveSubscribers = () => {
    careerCircle
      .getActiveSubscribers(currentUserId, activeSubscribersPerPage, activeSubscribers.pagination.cursor)
      .then(({ data }) => {
        const newData = {
          subscribers: [...activeSubscribers.subscribers, ...data.subscribers],
          pagination: data.pagination
        };
        setActiveSubscribers(newData);
      })
      .catch(() => {});
  };

  const showLoadMorePendingSubscribers = () => !!pendingSubscribers.pagination.cursor;

  const loadMorePendingSubscribers = () => {
    careerCircle
      .getPendingSubscribers(currentUserId, pendingSubscribersPerPage, pendingSubscribers.pagination.cursor)
      .then(({ data }) => {
        const newData = {
          subscribers: [...pendingSubscribers.subscribers, ...data.subscribers],
          pagination: data.pagination
        };
        setPendingSubscribers(newData);
      })
      .catch(() => {});
  };

  const acceptSubscription = subscriber => {
    careerCircle
      .acceptSubscription(currentUserId, subscriber.id)
      .then(() => {
        toast.success(<ToastBody heading="Success!" body={"Subscription accepted!"} />, { autoClose: 5000 });
        removePendingSubscriber(subscriber);
        addActiveSubscriber(subscriber);
      })
      .catch(() => {
        toast.error(<ToastBody heading="Error!" body={"We were not able to accept the subscription."} />, {
          autoClose: 5000
        });
      });
  };

  const rejectSubscription = subscriber => {
    careerCircle
      .destroySubscription(currentUserId, subscriber.id)
      .then(({ data }) => {
        toast.success(<ToastBody heading="Success!" body={"Subscription rejected!"} />, { autoClose: 5000 });
        removePendingSubscriber(subscriber);
      })
      .catch(() => {
        toast.error(<ToastBody heading="Error!" body={"We were not able to reject the subscription."} />, {
          autoClose: 5000
        });
      });
  };

  const removePendingSubscriber = subscriber => {
    const subscribers = pendingSubscribers.subscribers;
    const subscriberIndex = subscribers.findIndex(existingSubscriber => existingSubscriber.id === subscriber.id);

    const newSubscribers = [...subscribers.slice(0, subscriberIndex), ...subscribers.slice(subscriberIndex + 1)];
    setPendingSubscribers({
      subscribers: newSubscribers,
      pagination: pendingSubscribers.pagination
    });
  };

  const addActiveSubscriber = subscriber => {
    const newData = {
      subscribers: [...activeSubscribers.subscribers, subscriber],
      pagination: activeSubscribers.pagination
    };
    setActiveSubscribers(newData);
  };
  return (
    <>
      {pendingSubscribers.subscribers.length > 0 && (
        <NewSponsorsContainer>
          <Typography specs={{ variant: "h5", type: "bold" }} color="primary01">
            New Sponsors ({pendingSubscribers.pagination.total})
          </Typography>
          <NewSponsorsList>
            {pendingSubscribers.subscribers.map(subscriber => (
              <React.Fragment key={subscriber.id}>
                <NewSponsorsRow>
                  <a href={`/u/${subscriber.username}`}>
                    <Avatar
                      size="md"
                      url={subscriber.profile_picture_url}
                      name={subscriber.name}
                      ticker={subscriber.ticker || ""}
                      occupation={subscriber.occupation}
                      isVerified={subscriber.verified}
                    />
                  </a>
                  <ActionsContainer>
                    <Button
                      hierarchy="primary"
                      size="small"
                      leftIcon="check-chat"
                      onClick={() => acceptSubscription(subscriber)}
                    />
                    <Button
                      hierarchy="secondary"
                      size="small"
                      leftIcon="remove"
                      iconColor="primary01"
                      onClick={() => rejectSubscription(subscriber)}
                    />
                  </ActionsContainer>
                </NewSponsorsRow>
                <MessageContainer>
                  <Typography specs={{ variant: "p2", type: "regular" }} color={"primary03"}>
                    This is a message
                  </Typography>
                </MessageContainer>
              </React.Fragment>
            ))}
            <LoadMoreContainer>
              {showLoadMorePendingSubscribers() ? (
                <Button
                  hierarchy="secondary"
                  size="medium"
                  text="Load more"
                  onClick={() => loadMorePendingSubscribers()}
                />
              ) : (
                <Typography specs={{ variant: "p3", type: "regular" }} color={"primary03"}>
                  You have reached the end of the list
                </Typography>
              )}
            </LoadMoreContainer>
          </NewSponsorsList>
        </NewSponsorsContainer>
      )}
      {activeSubscribers.subscribers.length > 0 && (
        <SponsorsContainer>
          <Typography specs={{ variant: "h5", type: "bold" }} color="primary01">
            Subscribers ({activeSubscribers.pagination.total})
          </Typography>
          <CardsContainer>
            {activeSubscribers.subscribers.map(subscriber => (
              <SponsorCard key={subscriber.uuid}>
                <CardBanner url={subscriber.banner_url} />
                <AvatarContainer>
                  <Avatar size="lg" url={subscriber.profile_picture_url} />
                </AvatarContainer>
                <Typography specs={{ variant: "p1", type: "bold" }} color={"primary01"}>
                  {subscriber.name} {subscriber.verified && <Icon name="verified-2" />}
                </Typography>
                <SponsorCardInfoContainer>
                  {!!subscriber.ticker && (
                    <Typography specs={{ variant: "p2", type: "bold" }} color={"primary03"}>
                      ${subscriber.ticker}
                    </Typography>
                  )}
                  <Typography specs={{ variant: "p2", type: "regular" }} color={"primary03"}>
                    {subscriber.occupation}
                  </Typography>
                </SponsorCardInfoContainer>
                <ButtonContainer>
                  <Button
                    hierarchy="primary"
                    size="small"
                    text="Visit profile"
                    onClick={() => (window.location.href = `/u/${subscriber.username}`)}
                  />
                </ButtonContainer>
              </SponsorCard>
            ))}
          </CardsContainer>
          <LoadMoreContainer>
            {showLoadMoreActiveSubscribers() ? (
              <Button hierarchy="secondary" size="medium" text="Load more" onClick={loadMoreActiveSubscribers} />
            ) : (
              <Typography specs={{ variant: "p2" }} color={"primary03"}>
                You have reached the end of the list
              </Typography>
            )}
          </LoadMoreContainer>
        </SponsorsContainer>
      )}
    </>
  );
};
