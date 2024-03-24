import { ethers, network } from "hardhat";

async function main() {
  const DonationContract = await ethers.getContractFactory("Donation");
  const donationContract = await DonationContract.deploy();

  await donationContract.waitForDeployment();

  console.log(`Donation contract deployed to: ${donationContract.getAddress}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
