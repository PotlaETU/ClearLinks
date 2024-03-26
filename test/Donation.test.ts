import { expect, assert } from "chai";
import {ethers} from "hardhat";
import { Donation } from "../typechain-types";

describe("Lock", function () {
  let donation: Donation;

  before(async function () {
    [this.owner, this.addr1, ...this.addrs] = await ethers.getSigners();
  })
});
