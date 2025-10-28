// src/utils/blockchain.js
import { ethers } from "ethers";
import WarehouseABI from "../abis/WarehouseRental.json";

/**
 * IMPORTANT:
 * - This code uses ethers v5 (ContractFactory.deploy uses .deployed()).
 */

const RPC_URL = process.env.RPC_URL; // e.g. https://volta-rpc.energyweb.org
const PRIVATE_KEY = process.env.PRIVATE_KEY; // admin private key (0x...)
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS; // deployed address

if (!RPC_URL) throw new Error("RPC_URL not set in .env");
if (!CONTRACT_ADDRESS) throw new Error("CONTRACT_ADDRESS not set in .env");

/**
 * Return provider and signer (wallet) for backend actions that need to sign tx.
 * In many flows, you won't need to sign (reads) so you can use provider only.
 */
export function getProviderAndSigner() {
  const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
  let signer = null;
  if (PRIVATE_KEY && PRIVATE_KEY.length > 0) {
    signer = new ethers.Wallet(PRIVATE_KEY, provider);
  }
  return { provider, signer };
}

/**
 * Return contract instance.
 * - If signer provided → can send transactions (register/update/endLease).
 * - If only provider → read-only calls.
 */
export function getContract(
  signerOrProvider: ethers.Signer | ethers.providers.Provider
) {
  return new ethers.Contract(
    CONTRACT_ADDRESS || "",
    WarehouseABI.abi,
    signerOrProvider
  );
}
