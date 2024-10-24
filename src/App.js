import logo from "./logo.svg";
import "./App.css";
import React, { Component } from "react";
import { ethers } from "ethers";
import AgriVerify from "./artifacts/contracts/AgriVerify.sol/AgriVerify.json";
import Navbar from "./Navbar";
import Main from "./Main";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      account: '',
      cropCount: 0,
      crops: [],
      loading: true,
      provider: null,
      signer: null,
      contract: null
    }
    this.addCrop = this.addCrop.bind(this);
    this.addFarmer = this.addFarmer.bind(this);
  }

  async componentDidMount() {
    await this.loadEthers();
    await this.loadBlockchainData();
  }

  async loadEthers() {
    try {
      let provider;
      let signer;

      if (window.ethereum) {
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        // Connect to Hardhat's local network
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();

        // Request network switch to localhost:8545 (Hardhat's default)
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x53A' }], // 31337 in hex
          });
        } catch (switchError) {
          // This error code indicates that the chain has not been added to MetaMask
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0x53A',
                chainName: 'Localhost 8545',
                nativeCurrency: {
                  name: 'ETH',
                  symbol: 'ETH',
                  decimals: 18
                },
                rpcUrls: ['http://localhost:8545']
              }]
            });
          }
        }
        
        this.setState({ provider, signer });
      } else {
        window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
      }
    } catch (error) {
      console.error("Error loading ethers:", error);
      window.alert('Error connecting to MetaMask. Please make sure it is installed and unlocked.');
    }
  }

  async loadBlockchainData() {
    try {
      const { provider, signer } = this.state;
      
      if (!provider || !signer) {
        console.error("Provider or signer not initialized");
        return;
      }

      // Get the connected account
      const account = await signer.getAddress();
      this.setState({ account });

      // For Hardhat local network, we need to use the deployed contract address
      // This address should be logged when you deploy your contract using Hardhat
      const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Replace with your contract address
      
      try {
        const contract = new ethers.Contract(
          contractAddress,
          AgriVerify.abi,
          signer
        );
        
        this.setState({ contract });

        // Get crop count
        const cropCount = await contract.cropCount();
        this.setState({ cropCount: cropCount.toNumber() });

        // Load all crops
        const crops = [];
        for (let i = 1; i <= cropCount; i++) {
          const crop = await contract.crops(i);
          crops.push({
            ...crop,
            id: i
          });
        }
        this.setState({ crops });
      } catch (error) {
        console.error("Contract interaction error:", error);
        window.alert('Error interacting with the contract. Make sure it is deployed correctly.');
      }
    } catch (error) {
      console.error("Error loading blockchain data:", error);
    } finally {
      this.setState({ loading: false });
    }
  }

  // Add Crop function
  async addCrop(name, variety, price) {
    try {
      this.setState({ loading: true });
      const { contract } = this.state;
      const tx = await contract.addCrop(name, variety, price);
      await tx.wait();
      await this.loadBlockchainData(); // Reload the data
    } catch (error) {
      console.error("Error adding crop:", error);
      window.alert('Error adding crop. Please check console for details.');
    } finally {
      this.setState({ loading: false });
    }
  }

  // Add Farmer function
  async addFarmer(address, name, location) {
    try {
      this.setState({ loading: true });
      const { contract } = this.state;
      const tx = await contract.addFarmer(address, name, location);
      await tx.wait();
      await this.loadBlockchainData(); // Reload the data
    } catch (error) {
      console.error("Error adding farmer:", error);
      window.alert('Error adding farmer. Please check console for details.');
    } finally {
      this.setState({ loading: false });
    }
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        {this.state.loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <Main
            crops={this.state.crops}
            addCrop={this.addCrop}
            addFarmer={this.addFarmer}
          />
        )}
      </div>
    );
  }
}

export default App;