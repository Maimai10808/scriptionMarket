import { marketDeployments } from "@/lib/contracts/market";

// Compatibility shim: frontend market addresses now come from the generated
// deployment manifest synced out of Foundry broadcasts.
export const MARKET_CONFIG = marketDeployments;
