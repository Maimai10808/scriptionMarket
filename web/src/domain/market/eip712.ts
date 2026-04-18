import type { Address, MarketStorage } from "./types";

export function buildListingTypedData(params: {
  chainId: number;
  marketAddress: Address;
  listing: MarketStorage;
}) {
  const { chainId, marketAddress, listing } = params;

  return {
    domain: {
      name: "MscMarketV1",
      version: "1.0",
      chainId,
      verifyingContract: marketAddress,
    },
    types: {
      Listing: [
        { name: "maker", type: "address" },
        { name: "time", type: "uint256" },
        { name: "amount", type: "uint256" },
        { name: "price", type: "uint256" },
        { name: "tick", type: "string" },
      ],
    },
    message: {
      maker: listing.maker,
      time: listing.time,
      amount: listing.amount,
      price: listing.price,
      tick: listing.tick,
    },
  };
}
