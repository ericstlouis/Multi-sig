import Login from "../Components/Login"
import Form from "../components/Form";
import { useState, useEffect } from "react";
import { ethers } from 'ethers';
import { supabase } from "../helpers/Client";


export default function Home() {

  return (
    <>
        <Login />
        <Form />
    </>
  )
}



















