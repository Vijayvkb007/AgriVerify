# AgriVerify - Decentralized Crop Verification System

AgriVerify is a decentralized application (DApp) built using Hardhat, Ethereum, and React. It allows users to register crops on the blockchain and display their verification status using a QR code.

## NOTE:
There are lots of things to change, for now this is final results! 
#### Several issues which are needed to be addressed:
- No Functionality for verifiers
- No functionality added to register a farmer
- More robust testing required

These issue will be fixed soon :)

## Prerequisites

Before running this project, make sure you have the following installed:

- Node.js (v20+)
- NPM (v6+)
- Hardhat
- MetaMask (for connecting to the Ethereum network)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-repository/agriverify.git
cd agriverify
```

### 2. Install dependencies

```bash
npm i
```

### 3. Local Hardhat

to run it on local hardhat account
```bash
npx hardhat node
```

### 4. Deploying the contract
copy the contract address to where the contract is deployed and paste it in App.js

```bash
npx hardhat run ./scripts/deploy.js --network localhost
```

### 5. Configuring frontend

- Open ```./src/App.js``` file in the project
- Replace the old address with the new address obtained from the previous step.

```jsx
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Replace with actual deployed contract address
```
### 6. Run the frontend

start the react app
```bash 
npm run start
```

This will start the client on ```http://localhost:3000```. Open your browser, and you can interact with the AgriVerify DApp.


### Example Image
After running ```npm run start``` you will be redirect to webpage similar to the following:
<img src="public\example.png"/>
The image above shows how the crop details and verification QR codes are displayed on the frontend.

Scanning the QRcode now generate a json resposne which will be further modified in future work
All other issues will be addressed in next update!
