import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { deployments, ethers, getNamedAccounts } from "hardhat";
import { BOX_V2 } from "../../constants/constants";
import { BoxV2 } from "../../typechain-types";

describe("BoxV2", function () {
  async function deployContracts() {
    await deployments.fixture("all");
    const { deployer } = await getNamedAccounts();
    const boxV2Contract: BoxV2 = await ethers.getContract(BOX_V2, deployer);
    return { boxV2Contract, deployer };
  }
  it("Should start value with zero", async function () {
    const { boxV2Contract } = await loadFixture(deployContracts);
    expect((await boxV2Contract.retrive()).toString()).to.equal("0");
  });
  it("Should return correct version", async function () {
    const { boxV2Contract } = await loadFixture(deployContracts);
    expect(await boxV2Contract.getVersion()).to.equal("2");
  });
  it("Should update value", async function () {
    const { boxV2Contract } = await loadFixture(deployContracts);
    for (let i = 1; i <= 20; ++i) {
      const txResponse = await boxV2Contract.setValue(`${i}`);
      const txReceipt = await txResponse.wait(1);
      expect(txReceipt).to.emit(boxV2Contract, "valueUpdated").withArgs(`${i}`);
      expect((await boxV2Contract.retrive()).toString()).to.equal(`${i}`);
    }
  });
  it("Should increment value", async function () {
    const { boxV2Contract } = await loadFixture(deployContracts);
    for (let i = 0; i < 20; ++i) {
      const txResponse = await boxV2Contract.increment();
      const txReceipt = await txResponse.wait(1);
      expect(txReceipt)
        .to.emit(boxV2Contract, "valueUpdated")
        .withArgs(`${i + 1}`);
      expect((await boxV2Contract.retrive()).toString()).to.equal(`${i + 1}`);
    }
  });
});
