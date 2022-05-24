const { expect } = require("chai");
const { parseEther } = require("ethers/lib/utils");
const { ethers } = require("hardhat");
const hre = require('hardhat');




describe("intialized MultiSig", function () {
  let multiSigFactory, MultiSig, signer1, signer2, signer3, alice, numberOfSigs;

  beforeEach(async () => {
    [signer1, signer2, signer3, alice] = await ethers.getSigners();

    multiSigFactory = await ethers.getContractFactory('MultiSig');
    MultiSig = await multiSigFactory.deploy(
      'test',
      [signer1.address, signer2.address, signer3.address],
      3
    );
    const Sigs = await MultiSig.numberOfSignatures();
    numberOfSigs = Sigs.toNumber();
  });

  


  it('sign typed data', async function () {
    //EIP-712 data sig
    const domain = {
      name: 'test',
      version: '1',
      chainId: 1337,
      verifyingContract: MultiSig.address,
    };

    // The named list of all type definitions
    const types = {
      Person: [
        { name: 'name', type: 'string' },
        { name: 'wallet', type: 'address' },
      ],
      Mail: [
        { name: 'from', type: 'Person' },
        { name: 'to', type: 'Person' },
        { name: 'contents', type: 'string' },
      ],
    };
    // The data to sign
    const value = {
      from: {
        name: 'Cow',
        wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
      },
      to: {
        name: 'Bob',
        wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
      },
      contents: 'Hello, Bob!',
    };
    const signature1 = new Array(
      await signer1._signTypedData(domain, types, value)
    );
    const signature2 = new Array(
      await signer2._signTypedData(domain, types, value)
    );
    const signature3 = new Array(
      await signer3._signTypedData(domain, types, value)
    );

    let sigArray = [signature1, signature2, signature3];

    let newArray = new Array();

    let ABI = ['function transfer(address to, uint amount)'];
    let iface = new ethers.utils.Interface(ABI);

    const data = iface.encodeFunctionData('transfer', [
      alice.address,
      parseEther('1.0'),
    ]);

    // console.log("data:", data)

    for (let i = 0; i < sigArray.length; i++) {
      for (let j = 0; j < sigArray[i].length; j++) {
        const wholeSignature = sigArray[i][j];
        const splitSig = wholeSignature.substring(2);
        const r = '0x' + splitSig.substring(0, 64);
        const s = '0x' + splitSig.substring(64, 128);
        const v = parseInt(splitSig.substring(128, 130), 16);
        // console.log("r:", r);
        // console.log('s:', s);
        // console.log('v:', v);
        let SigArray = new Array(v, r, s);
        newArray.push(SigArray);
      }
    } 
    // console.log("newArray:", newArray)

    const firstBalance = await MultiSig.getBalance(alice.address);
    firstFormatBalance = ethers.utils.formatEther(firstBalance);
    console.log('pre-balance:', firstFormatBalance);

    const executeTX = await MultiSig.execute(alice.address, data, newArray, 1, {
      value: ethers.utils.parseEther('1.0'),
    });

    const secondBalance = await MultiSig.getBalance(alice.address);
    secondFormatBalance = ethers.utils.formatEther(secondBalance);
    console.log('post-balance:', secondFormatBalance);
  });

  it('Add signers', async function () {
    //EIP-712 data sig
    const domain = {
      name: 'test',
      version: '1',
      chainId: 1337,
      verifyingContract: MultiSig.address,
    };

    // The named list of all type definitions
    const types = {
      Person: [
        { name: 'name', type: 'string' },
        { name: 'wallet', type: 'address' },
      ],
      Mail: [
        { name: 'from', type: 'Person' },
        { name: 'to', type: 'Person' },
        { name: 'contents', type: 'string' },
      ],
    };
    // The data to sign
    const value = {
      from: {
        name: 'Cow',
        wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
      },
      to: {
        name: 'Bob',
        wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
      },
      contents: 'Hello, Bob!',
    };

    
    const signature1 = new Array(
      await signer1._signTypedData(domain, types, value)
    );
    const signature2 = new Array(
      await signer2._signTypedData(domain, types, value)
    );
    const signature3 = new Array(
      await signer3._signTypedData(domain, types, value)
    );

    
    let sigArray = [signature1, signature2, signature3];

    let newArray = new Array();

    let ABI = ['function transfer(address to, uint amount)'];
    let iface = new ethers.utils.Interface(ABI);

    const data = iface.encodeFunctionData('transfer', [
      alice.address,
      parseEther('1.0'),
    ]);

    // console.log("data:", data)

    for (let i = 0; i < sigArray.length; i++) {
      for (let j = 0; j < sigArray[i].length; j++) {
        const wholeSignature = sigArray[i][j];
        const splitSig = wholeSignature.substring(2);
        const r = '0x' + splitSig.substring(0, 64);
        const s = '0x' + splitSig.substring(64, 128);
        const v = parseInt(splitSig.substring(128, 130), 16);
        // console.log("r:", r);
        // console.log('s:', s);
        // console.log('v:', v);
        let SigArray = new Array(v, r, s);
        newArray.push(SigArray);
      }
    }

    const firstAddressTrue = await MultiSig.isSigner(alice.address);
    console.log(firstAddressTrue);

    const firstSignature = await MultiSig.numberOfSignatures();
    console.log(firstSignature)
    const executeTx = await MultiSig.addSigners(alice.address, true, newArray, {value: ethers.utils.parseEther("1.0")})
    const secondSignature = await MultiSig.numberOfSignatures();
    console.log(secondSignature)

    const secondAddressTrue = await MultiSig.isSigner(alice.address);
    console.log(secondAddressTrue)
  });
});































