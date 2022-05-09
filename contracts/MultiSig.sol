//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.10;
import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

/// @title Multi Sig
/// @author Eric St. Louis
/// @notice A Multisig using EIP-712 Standard
contract MultiSig {
    using ECDSA for bytes32;

    //VARIABLES
    ///@notice the number of signatures the needed to execute a transaction
    uint256 public numberOfSignatures;

    ///@notice a list of signature that is eithier trusted or not
    mapping(address => bool) public isSigner;

    //@notice how many times a transaction was perform
    uint public nonce;

    ///@notice the components of the signautre
    struct Signatures {
        uint8 v;
        bytes32 r;
        bytes32 s;
    }

    ///@notice EIP-712 domain separator 
    bytes32 public immutable domainSeparator;

    ///@notice EIP-712 execute typehash
    bytes32 public constant EXECUTE_TYPEHASH = 
        keccak256('Execute(address to,uint256 value,bytes data,uint256 nonce)');
    
    ///@notice EIP-712 add signer typehash
     bytes32 public constant ADDSIGNER_TYPEHASH = 
        keccak256('AddSigners(address newSigner,bool shouldTrust,uint256 nonce');

    //EVENTS

    ///@notice emitted if the execute function was sucessful
    ///@param to the address the that recieving the eth
    ///@param valueEth  the amount of eth
    ///@param data the data of the transaction
    ///@param previousLoop the signature address
    event Executed(address to, uint256 valueEth, bytes data, address previousLoop);


    ///@notice emitted when a new signer is added
    ///@param newSigner the address of the newSigner 
    ///@param shouldTrust is the newSigner trrusted?
    event UpdatedSigners(address newSigner, bool shouldTrust);
    //MODIFERS


    //FUNCTIONS

    ///@notice deployed an instance on the multi-sig also set domainSeparator
    ///@param name the name of the multisig
    ///@param _signers the address os the signers
    ///@param _numberOfSignatures the number of signatures that is required
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

    ///@notice execute the transaction verifying the signatures
    ///@param to the address the value is going to
    ///@param data the data of the transaction
    ///@param sigsVRS An array of the required signatures
    ///@param value the amount Eth that is being sent to the to address
    function execute(
        address payable to, 
        bytes calldata data,
        Signatures[] memory sigsVRS,
        uint256 value
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
            
            require(!isSigner[currentLoopAddress] || previousLoopAddress >= currentLoopAddress, "not valid address");

            previousLoopAddress = currentLoopAddress;
        }
    emit Executed(to, value, data, previousLoopAddress);
    
    (bool success, ) = to.call{ value: msg.value}("");
    require(success, "execute failed to transact");
    }

    ///@notice add a signer to the multiSig, also increment then amoount signatures required
    ///@param newSigner the address of new signer
    ///@param shouldTrust should the address be truseted
    ///@param sigsVRS array of signatures
    function addSigners(
        address newSigner,
        bool shouldTrust,
        Signatures[] memory sigsVRS
    ) public payable {
        require(isSigner[msg.sender]);
        require(!isSigner[newSigner], "This address is already a Signer");

        bytes32 hash = keccak256(
            abi.encodePacked(
                '\x19\x01',
                domainSeparator,
                keccak256(abi.encode(ADDSIGNER_TYPEHASH, newSigner, shouldTrust, nonce++))
            ));    
            
            address previousAddress;

            for(uint256 i = 0; i < numberOfSignatures; i++ ) {
                address currentLoopAddress = ecrecover(hash, sigsVRS[i].v, sigsVRS[i].r,sigsVRS[i].s);

                require(!isSigner[currentLoopAddress] || previousAddress >= currentLoopAddress, "not valid Address");

                previousAddress = currentLoopAddress;
            }

            numberOfSignatures++;
            isSigner[newSigner] = shouldTrust;

        emit UpdatedSigners(newSigner, shouldTrust);
        }
    ///@notice get the balacnce of an account
    ///@param ethAddress an account you want to get the addess from
     function getBalance(address ethAddress) public view returns (uint256) {
        return ethAddress.balance;
    }

    receive() external payable {}

}