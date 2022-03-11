import { ethers } from "hardhat";

import * as Configs from "../config"

async function main() {

  const Erc721 = await ethers.getContractFactory("Erc721");
  const erc721 = await Erc721.deploy
  (
    Configs.name,
    Configs.symbol,
    Configs.baseUri,
    Configs.maxElements
  );

  await erc721.deployed();

  console.log("ERC721 deployed to:", erc721.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
