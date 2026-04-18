export function computeProtocolFee(price: bigint, feeBps: bigint) {
  return (price * feeBps) / 100n;
}

export function computeSellerReceivable(price: bigint, feeBps: bigint) {
  return price - computeProtocolFee(price, feeBps);
}
