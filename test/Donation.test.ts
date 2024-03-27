import { expect, assert } from "chai";
import { ethers } from "hardhat";
import { Donation } from "../typechain-types";

describe("Donation", function () {
  let donation: Donation;
  let creator;
  let creatorAddress: any;

  before(async function () {
    [this.owner, this.addr1, ...this.addrs] = await ethers.getSigners();
    const Donation = await ethers.getContractFactory("Donation");
    donation = await Donation.deploy();
    creatorAddress = this.addrs[0].address;
  });

  describe("Deployment", function () {
    // On teste la création d'un créateur
    it("Should create a creator", async function () {
      await donation.registerCreator("TestCreator", "je teste", creatorAddress);
      creator = await donation.getCreator(creatorAddress);

      console.log("Créateur { ",  "Nom : " + creator.name, ", Description : "
        + creator.description, ", Balance : " + creator.balance.toString(),
         ", Adresse : " + creatorAddress.toString(), "}");

      expect(creator.name).to.equal("TestCreator");
      expect(creator.description).to.equal("je teste");
      assert(creator.balance.toString(), "0");
    });

    // On teste la donation (méthode la plus importante)
    it("Should emit NewMessageFromDonor event and update creator balance on donation", async function () {
      const donationAmount = { value: ethers.parseEther("1") }
      const donorName = "Alice";
      const donorMessage = "Force mon reuf";
      
      creator = await donation.getCreator(creatorAddress);
      console.log("Avant donation: ", creator.balance.toString());

      await expect(donation.connect(this.addr1).donation(donorName, donorMessage, creatorAddress, donationAmount)).to.emit(donation, "NewMessageFromDonor");
      creator = await donation.getCreator(creatorAddress);
      console.log("Après donation: ", creator.balance.toString());
      expect(creator.balance).to.equal(donationAmount.value);
    });

    // On teste le retrait de l'argent par le créateur
    it("Should withdraw creator balance", async function () {
      console.log("Addresse du créateur qui withdraw: ", creatorAddress.toString());
      let creator = await donation.getCreator(creatorAddress);
      
      console.log("Montant à retirer : ", creator.balance.toString());
      await expect(donation.connect(this.addrs[0]).withdraw()).to.emit(donation, "Withdraw");
      
      creator = await donation.getCreator(creatorAddress);
      console.log("Balance du créateur après le withdraw : ", creator.balance.toString());
      
      assert(creator.balance.toString(), "0");
    });

    // On teste la récupération des messages d'un donateur
    it("Should get the messages from a donar", async function () {
      const messages = await donation.getMessages();
      
      for (const message of messages) {
        console.log("Message: ", message);
      }
      
      expect(messages[0].from).to.equal(this.addr1.address);
      expect(messages[0].name).to.equal("Alice");
      expect(messages[0].message).to.equal("Force mon reuf");
    })

  })
});
