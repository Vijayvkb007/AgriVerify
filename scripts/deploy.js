// const { ethers } = require("ethers");

async function main() {
    const [deployer] = await ethers.getSigners();

    const AgriVerify = await ethers.getContractFactory("AgriVerify");
    const agriverify = await AgriVerify.deploy();
    console.log("AgriVerify deployed to:", agriverify.address);
}

main().then(()=> process.exit(0)).catch((error) => {console.error(error); process.exit(1)});