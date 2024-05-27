import { ethers } from "ethers";
import LendingAgency from "../assets/LendingAgency.json";

export const contractAddress = "0x19f66A1e6ce02a9472568C4F4a249ea61c8B01CD";
export const agencyABI = LendingAgency.abi;

export async function getSigner() {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return signer;
}

export async function getAgencyContract() {
  const signer = await getSigner();
  const contract = new ethers.Contract(contractAddress, agencyABI, signer);
  return contract;
}
