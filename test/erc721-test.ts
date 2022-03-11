const { expect } = require("chai");
const { ethers } = require("hardhat");

import * as Configs from "../config"

describe("ERC20", function ()  {

    let Token: any;
    let hardhatToken: any;
    let owner: any;
    let addr1: any;
    let zeroAddress = ethers.utils.getAddress(Configs.zeroAddress)

    beforeEach(async function() {
        [owner, addr1] = await ethers.getSigners();

        Token = await ethers.getContractFactory("Erc721");
        const name = Configs.name;
        const symbol = Configs.symbol;
        const baseUri = Configs.baseUri;
        const maxElements = Configs.maxElements;

        hardhatToken = await Token.deploy(name, symbol, baseUri, maxElements);
        await hardhatToken.deployed();
    });

    describe("Deployment", function() {

        it("Should initialize correctly", async function() {
            expect(await hardhatToken.name()).to.equal(Configs.name);
            expect(await hardhatToken.symbol()).to.equal(Configs.symbol);
            expect(await hardhatToken.baseUri()).to.equal(Configs.baseUri);
            expect(await hardhatToken.maxElements()).to.equal(Configs.maxElements);
            expect(await hardhatToken.supportsInterface(0xffffffff)).to.be.false;
            expect(await hardhatToken.supportsInterface(0x80ac58cd)).to.be.true;
            expect(await hardhatToken.supportsInterface(0x01ffc9a7)).to.be.true;
        });
    });

    describe("Setters", function() {

        it("Should set correctly", async function() {
            await hardhatToken.setBaseUri("uri");
            expect(await hardhatToken.baseUri()).to.equal("uri");

            await hardhatToken.setMaxElements(1000);
            expect(await hardhatToken.maxElements()).to.equal(1000);

        });
    });

    describe("mint", function() {

        it("Should revert", async function() {
            await expect(hardhatToken.mint(zeroAddress, 1)).to.be.revertedWith("Mint to zero address");
            await expect(hardhatToken.mint(addr1.address, 0)).to.be.revertedWith("Amount should be positive");
            await expect(hardhatToken.mint(addr1.address, 100)).to.be.revertedWith("Cannot mint");
        });

        it("Should mint 1 NFT", async function() {
            await hardhatToken.mint(addr1.address, 1);
            expect(await hardhatToken.currentIdx()).to.be.equal(1);
        });

        it("Should mint and get tokenUri", async function() {
            await hardhatToken.mint(addr1.address, 1);
            expect(await hardhatToken.currentIdx()).to.be.equal(1);

            expect(await hardhatToken.tokenURI(1)).to.be.equal(
                "ipfs://QmeWf8JrewQ7j4oDEA6f5urHwgVu7CSoZHmDoYkbkfrkkn/1.json"
            );
        });
    });

    describe("Token URI", function() {

        it("Should revert due to non-existing id", async function() {
            await expect(hardhatToken.tokenURI(1)).to.be.revertedWith("Token doesn't exist");
        });
    });

    describe("Token URI", function() {
        it("Should call child contract to test internal function", async function() {
            const TestToken = await ethers.getContractFactory("TestErc721");
            const name = Configs.name;
            const symbol = Configs.symbol;
            const baseUri = Configs.baseUri;
            const maxElements = Configs.maxElements;
    
            const testToken = await TestToken.deploy(name, symbol, baseUri, maxElements);
            await testToken.deployed();

            expect(await testToken.baseURI()).to.be.equal(baseUri);
        });    
    });

});