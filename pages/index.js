import Login from "../Components/Login"
import { useState, useEffect } from "react";
import { ethers } from 'ethers';
import { makeStorageClient, getAccessToken } from "../helpers/storageClient";
import { Web3Storage } from 'web3.storage';



export default function Home() {

  const client = getAccessToken()

  function storage() {
    client.put
  }

  return (
    <>
        <Login />
    </>
  )
}



















