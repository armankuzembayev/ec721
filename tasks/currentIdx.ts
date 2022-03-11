import { task } from "hardhat/config";
import * as Configs from "../config"


task("currentIdx", "Mint NFT")
    .addParam("token", "Token address")
    .setAction(async  (taskArgs, { ethers }) => {

    const contract = await ethers.getContractAt("Erc721", taskArgs.token);
    
    const idx = await contract.currentIdx();
    console.log("Idx: ", ethers.utils.formatUnits(idx, 0));
});