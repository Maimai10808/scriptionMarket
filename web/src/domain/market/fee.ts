export function computeProtocolFee(price: bigint, feeBps: bigint) {
  return (price * feeBps) / BigInt(100);
}

export function computeSellerReceivable(price: bigint, feeBps: bigint) {
  return price - computeProtocolFee(price, feeBps);
}
