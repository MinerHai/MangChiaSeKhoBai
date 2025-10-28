import { ethers } from "ethers";
import WarehouseABI from "../abis/WarehouseRental.json";

const CONTRACT_ADDRESS = "0xDaA6167b73763072E609c711b88f11e317c566Ea";

export const getContract = (provider: ethers.providers.Web3Provider) => {
  const signer = provider.getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, WarehouseABI.abi, signer);
};
