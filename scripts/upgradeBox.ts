import { ethers } from "hardhat";
import {
  BOX,
  BOX_PROXY,
  BOX_PROXY_ADMIN,
  BOX_V2,
} from "../constants/constants";

// Manual way
async function main() {
  const boxProxyAdmin = await ethers.getContract(BOX_PROXY_ADMIN);
  const transparentProxy = await ethers.getContract(BOX_PROXY); //Our proxy contract
  const boxV2 = await ethers.getContract(BOX_V2);

  const boxProxyV1 = await ethers.getContractAt(BOX, transparentProxy.address);
  const version1 = (await boxProxyV1.getVersion()).toString();
  console.log(version1);

  // Upgrade
  const upgradeTx = await boxProxyAdmin.upgrade(
    transparentProxy.address,
    boxV2.address
  );
  await upgradeTx.wait(1);

  const boxProxyV2 = await ethers.getContractAt(
    BOX_V2,
    transparentProxy.address
  );
  const version2 = (await boxProxyV2.getVersion()).toString();
  console.log(version2);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
