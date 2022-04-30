const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Greeter", function () {
  it("Should return the new greeting once it's changed", async function () {
    const Greeter = await ethers.getContractFactory("Greeter");
    const greeter = await Greeter.deploy("Hello, world!");
    await greeter.deployed();

    expect(await greeter.greet()).to.equal("Hello, world!");

    const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // wait until the transaction is mined
    await setGreetingTx.wait();

    expect(await greeter.greet()).to.equal("Hola, mundo!");
  });

  it("sign typed data", async function() {
    let signer = await ethers.getSigner()

    const domain = {
    name: 'Ether Mail',
    version: '1',
    chainId: 1,
    verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC'
};

// The named list of all type definitions
const types = {
    Person: [
        { name: 'name', type: 'string' },
        { name: 'wallet', type: 'address' }
    ],
    Mail: [
        { name: 'from', type: 'Person' },
        { name: 'to', type: 'Person' },
        { name: 'contents', type: 'string' }
    ]
};

[
  { name: 'Boruto', author: 'ike and kodachi', id: 1 },
  { name: 'DBZ', author: 'toriyama', id: 2 },
  { name: 'one piece', author: 'oda', id: 3 },
  { name: 'bleach', author: 'kubo', id: 4 },
]

[
  [ 'Boruto','ike and kodachi', 1 ],
  [ 'dbz','ike and kodachi', 1 ],
  [ 'one piece','ike and kodachi', 1 ],
  [ 'bleach','ike and kodachi', 1 ]
]


// The data to sign
const value = {
    from: {
        name: 'Cow',
        wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826'
    },
    to: {
        name: 'Bob',
        wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB'
    },
    contents: 'Hello, Bob!'
};

const signature = await signer._signTypedData(domain, types, value);
console.log(signature)

  })
});


