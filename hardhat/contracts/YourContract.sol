pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
// import "hardhat/console.sol";

contract MerkleTest {
    // Our rootHash
    bytes32 public root = 0xb7cb61815274765ef8247c4d18f2cb6ee85ea792454ea3f1df96986673010fd2;

    function checkValidity(bytes32[] calldata _merkleProof) public view returns (bool){
        // console.log(_merkleProof);
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender));
        // console.log(leaf);
        require(MerkleProof.verify(_merkleProof, root, leaf), "Incorrect proof");
        return true; // Or you can mint tokens here
    }

}