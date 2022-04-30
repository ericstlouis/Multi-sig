//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.10;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";


contract MultiSig {
    using ECDSA for bytes32;

    //VARIABLES
    uint256 public numberOfSignatures;
    mapping(address => bool) public isSigner;
    uint public nonce;

    struct Signatures {
        uint8 v;
        bytes32 r;
        bytes32 s;
    }

    bytes32 public immutable domainSeparator;

    bytes32 public constant EXECUTE_TYPEHASH = 
        keccak256('Execute(address to,uint256 value,bytes data,uint256 nonce)');

    //EVENTS


    //MODIFERS


    //FUNCTIONS
    constructor(
        string memory name,
        address[] memory _signers,
        uint256 _numberOfSignatures
        ) payable {
            require(_numberOfSignatures > 0, "constructor: numberOfSignature must greater than zero ");
            numberOfSignatures = _numberOfSignatures;

            for (uint i = 0; i < _signers.length; i++) {
                require(_signers[i] != address(0));
                isSigner[_signers[i]] = true;
            }

            domainSeparator = keccak256(
                abi.encode(keccak256(
                    'EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)'
                ),
                keccak256(bytes(name)),
                keccak256(bytes('1')),
                block.chainid,
                address(this)
                )
            );

        }


    function execute(
        address payable to, 
        uint256 value, 
        bytes calldata data,
        Signatures[] memory sigsVRS
    ) public payable {
        require(isSigner[msg.sender]);

        bytes32 hash = keccak256(
            abi.encodePacked(
                '\x19\x01',
                domainSeparator,
                keccak256(abi.encode(EXECUTE_TYPEHASH, to, value, data, nonce++))
        ));

        address previousLoopAddress;

        for (uint256 i = 0; i < numberOfSignatures; i++) {
            address currentLoopAddress = ecrecover(hash, sigsVRS[i].v, sigsVRS[i].r, sigsVRS[i].s);
        }
        
    }

}