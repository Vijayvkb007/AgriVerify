import React, { Component } from 'react';
import { ethers } from 'ethers';

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ensName: null,
      isConnected: false
    };
  }

  async componentDidMount() {
    await this.checkConnection();
    if (this.props.account) {
      await this.lookupENS();
    }
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.account !== this.props.account && this.props.account) {
      await this.lookupENS();
    }
  }

  async checkConnection() {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.listAccounts();
      this.setState({ isConnected: accounts.length > 0 });
    } catch (error) {
      console.error("Error checking connection:", error);
      this.setState({ isConnected: false });
    }
  }

  async lookupENS() {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
    
      const network = await provider.getNetwork();
      if (network.chainId === 1338) {
        console.log("ENS is not supported on the Hardhat local network.");
        return;
      }
      const ensName = await provider.lookupAddress(this.props.account);
      if (ensName) {
        this.setState({ ensName });
      }
    } catch (error) {
      console.error("Error looking up ENS:", error);
    }
  }

  formatAddress(address) {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  }

  async connectWallet() {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      if (this.props.onConnect) {
        this.props.onConnect(address);
      }
      this.setState({ isConnected: true });
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  }

  render() {
    const { account } = this.props;
    const { ensName, isConnected } = this.state;

    return (
      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <a
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          href="/"
          rel="noopener noreferrer"
        >
          AgriVerify
        </a>
        
        <ul className="navbar-nav px-3">
          <li className="text-white nav-item text-nowrap d-none d-sm-none d-sm-block">
            {!isConnected ? (
              <button 
                onClick={() => this.connectWallet()}
                className="btn btn-outline-light btn-sm"
              >
                Connect Wallet
              </button>
            ) : (
              <small className="text-white">
                <span id="account" title={account}>
                  {ensName || this.formatAddress(account)}
                </span>
              </small>
            )}
          </li>
          <li className='text-white'>Home</li>
        </ul>
      </nav>
    );
  }
}

export default Navbar;