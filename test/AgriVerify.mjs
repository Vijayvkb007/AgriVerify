import {expect, use} from 'chai';
import { solidity } from 'ethereum-waffle';
import { Web3 } from 'web3';

use(solidity);

describe('AgriVerify Contract', () => {
    let AgriVerify;
    let agriverify;
    let owner;
    let addr1;
    let addr2;
    let addrs;
    let web3 = new Web3();

    beforeEach(async () => {
        AgriVerify = await ethers.getContractFactory('AgriVerify');
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
        agriverify = await AgriVerify.deploy();
        
    });

    describe('Deployment', () => {
        it('Should set the right owner', async () => {
            expect(await agriverify.owner()).to.equal(owner.address);
        });

        it('Should deploy successfully', async () => {
            expect(agriverify.address).to.be.properAddress;
        });

        it("Should have a name", async () => {
            expect(await agriverify.name()).to.equal("AgriVerify");
        });
    });
    
    describe('Adding Farmer', () => {
        it('Should add a farmer', async () => {
            await agriverify.addFarmer(addr1.address, 35);
            // expect(await agriverify.farmers(addr1.address)).to.be.true;
            // console.log(expect(await agriverify.farmers(addr1.address)));
            
        });

        it('Should not add a farmer twice', async () => {
            await agriverify.addFarmer(addr1.address, 35);
            await expect(agriverify.addFarmer(addr1.address, 35)).to.be.revertedWith("Farmer already registered");
        });
    });

    describe('Verify Crop', () => {
        let farmer;
        let crop;
        let cropCount;
        beforeEach(async () => {
            farmer = await agriverify.addFarmer(owner.address, 35);
            crop = await agriverify.addCrop("Ragi", "Millets", web3.utils.toWei('2', 'ether'));
            cropCount = await agriverify.cropCount();
        });

        it('Should be a valid crop', async () => {
            // const result = await agriverify.connect(addr1.address).verifyCrop(cropCount);

            // const event = result.logs[0].args;
            // console.log(event); 
        });

        it('Should be a valid verifier', async () => {
            await expect(agriverify.connect(farmer.farmerAdd).verifyCrop(cropCount)).to.be.reverted;
        })
    })
})
