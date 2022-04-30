import Login from "../Components/Login"
import { useState, useEffect } from "react";
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';


export default function Home() {

  const [address, setAddress] = useState("Connect wallet")
  const providerOptions = {
    coinbasewallet: {
      package: CoinbaseWalletSDK, // Required
      options: {
        appName: 'Multi-signature Wallet', // Required
        infuraId: process.env.NEXT_PUBLIC_INFURA_KEY, // Required
        rpc: '', // Optional if `infuraId` is provided; otherwise it's required
        chainId: 1337, // Optional. It defaults to 1 if not provided
        darkMode: false, // Optional. Use dark theme, defaults to false
      },
    },
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        infuraId: process.env.NEXT_PUBLIC_INFURA_KEY, // required
      },
    },
  };

  let web3Modal;

  if (typeof window !== 'undefined') {
    web3Modal = new Web3Modal({
      network: 'rinkeby', // optional
      cacheProvider: false,
      disableInjectedProvider: false,
      providerOptions, // required
    });
  }

  const connect = async () => {
    web3Modal.clearCachedProvider();
    const instance = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(instance);
    const signer = provider.getSigner();
    const signerAddress = await signer.getAddress()
    setAddress(prevState =>  signerAddress)
    console.log(signerAddress)
  };
  return (
    <div>
      <button onClick={connect}>
        {address}
      </button>
    </div>
  )
}


















