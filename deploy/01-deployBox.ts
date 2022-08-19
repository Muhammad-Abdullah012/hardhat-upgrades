import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { BOX, DEVELOPMENT_CHAINS } from "../constants/constants";
import { network } from "hardhat";
import { verify } from "../utils/verify";

const deployBox: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy, log } = hre.deployments;

  const args: any[] = [];
  const box = await deploy(BOX, {
    from: deployer,
    args,
    log: true,
    waitConfirmations: !DEVELOPMENT_CHAINS.includes(network.name)
      ? 6
      : undefined,
    proxy: {
      proxyContract: "OpenZeppelinTransparentProxy",
      viaAdminContract: {
        name: "BoxProxyAdmin",
        artifact: "BoxProxyAdmin",
      },
    },
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

deployBox.tags = ["all", "deployBox"];
export default deployBox;
