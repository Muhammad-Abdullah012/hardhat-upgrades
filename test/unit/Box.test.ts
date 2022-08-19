import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { deployments, ethers, getNamedAccounts } from "hardhat";
import { BOX } from "../../constants/constants";
import { Box } from "../../typechain-types";

describe("Box", function () {
  async function deployContracts() {
    await deployments.fixture("all");
    const { deployer } = await getNamedAccounts();
    const boxContract: Box = await ethers.getContract(BOX, deployer);
    return { boxContract, deployer };
  }
  it("Should start value with zero", async function () {
    const { boxContract } = await loadFixture(deployContracts);
    expect((await boxContract.retrive()).toString()).to.equal("0");
  });
  it("Should return correct version", async function () {
    const { boxContract } = await loadFixture(deployContracts);
    expect(await boxContract.getVersion()).to.equal("1");
  });
  it("Should update value", async function () {
    const { boxContract } = await loadFixture(deployContracts);
    for (let i = 1; i <= 20; ++i) {
      const txResponse = await boxContract.setValue(`${i}`);
      const txReceipt = await txResponse.wait(1);
      expect(txReceipt).to.emit(boxContract, "valueUpdated").withArgs(`${i}`);
      expect((await boxContract.retrive()).toString()).to.equal(`${i}`);
    }
  });
});
