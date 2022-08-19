import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { BOX_V2, DEVELOPMENT_CHAINS } from "../constants/constants";
import { network } from "hardhat";
import { verify } from "../utils/verify";

const deployBoxV2: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy, log } = hre.deployments;

  const args: any[] = [];
  const box = await deploy(BOX_V2, {
    from: deployer,
    args,
    log: true,
    waitConfirmations: !DEVELOPMENT_CHAINS.includes(network.name)
      ? 6
      : undefined,
  });
  log("Deployed!!");
  if (
    !DEVELOPMENT_CHAINS.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log("Verifying....");
    verify(box.address, args);
  }
};

deployBoxV2.tags = ["all", "deployBoxV2"];
export default deployBoxV2;
