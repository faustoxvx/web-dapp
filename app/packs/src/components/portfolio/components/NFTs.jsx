import React, { useState, useEffect } from "react";

import NFTCard from "src/components/design_system/cards/NFTCard";

import { LoadingPortfolio } from "../NewPortfolio";

const NFTs = ({ userNFT, memberNFT, chainAPI, mode, chainId }) => {
  const [loading, setLoading] = useState(true);
  const [nftImages, setNFTImages] = useState({});

  useEffect(() => {
    if (!userNFT.id) {
      return;
    }

    chainAPI.getNFTImg(userNFT.tokenAddress, userNFT.id).then(imageURL => {
      setNFTImages(prev => ({ ...prev, userNFT: imageURL }));
      setLoading(false);
    });
  }, [userNFT]);

  useEffect(() => {
    if (!memberNFT.id) {
      return;
    }

    chainAPI.getNFTImg(memberNFT.tokenAddress, memberNFT.id).then(imageURL => {
      setNFTImages(prev => ({ ...prev, memberNFT: imageURL }));
      setLoading(false);
    });
  }, [memberNFT]);

  const linkToNFT = nft => {
    const baseUrl = chainAPI.getEnvBlockExplorerUrls(chainId);

    return `${baseUrl}token/${nft.tokenAddress}/instance/${nft.id}`;
  };

  if (loading) {
    return <LoadingPortfolio />;
  }

  return (
    <div className="d-flex flex-row flex-wrap py-4 nfts-wrapper">
      {!!userNFT.id && (
        <NFTCard
          imageUrl={nftImages.userNFT}
          address={userNFT.tokenAddress}
          tokenId={userNFT.id}
          href={linkToNFT(userNFT)}
          mode={mode}
        />
      )}
      {!!memberNFT.id && (
        <NFTCard
          imageUrl={nftImages.memberNFT}
          address={memberNFT.tokenAddress}
          tokenId={memberNFT.id}
          href={linkToNFT(memberNFT)}
          mode={mode}
        />
      )}
    </div>
  );
};

export default NFTs;
