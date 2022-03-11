import { task } from "hardhat/config";
import * as Configs from "../config"


task("mint", "Mint NFT")
    .addParam("token", "Token address")
    .addParam("to", "Address where to send NFT")
    .addParam("amount", "How much")
    .setAction(async  (taskArgs, { ethers }) => {

    // const [signer] = await ethers.getSigners();
    const contract = await ethers.getContractAt("Erc721", taskArgs.token);
    
    await contract.mint(taskArgs.to, taskArgs.amount);
});