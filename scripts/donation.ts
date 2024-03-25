import { ethers, network } from "hardhat";
import { verify } from "../utils/verification";
import "dotenv/config";

const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL || "";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";

async function main() {
  const DonationContract = await ethers.getContractFactory("Donation");
  const donationContract = await DonationContract.deploy();

  await donationContract.waitForDeployment();

  console.log(`Donation contract deployed to: ${donationContract.getAddress()}`);

  if (network.name === "goerli") {
    console.log("Verifying contract on Etherscan . . .");
    await donationContract.deploymentTransaction()?.wait(5);
    await verify((await donationContract.getAddress()), []);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
