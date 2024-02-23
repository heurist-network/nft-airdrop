// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract HeuristImaginaries is ERC721Enumerable, Ownable {
    using Strings for uint256;

    mapping(bytes => bool) public signatureUsed;
    uint256 immutable MAX_SUPPLY = 500;
    string private baseTokenURI;

    event Claimed(address indexed recipient, uint256 indexed tokenId);

    constructor(string memory name, string memory symbol, string memory baseURI) ERC721(name, symbol) Ownable(msg.sender) {
        baseTokenURI = baseURI;
    }

    function recoverSigner(bytes32 hash, bytes memory signature) public pure returns (address) {
        bytes32 messageDigest = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", hash));
        return ECDSA.recover(messageDigest, signature);
    }

    function claimNFT(bytes32 hash, bytes memory signature) external {
        require(hash == keccak256(abi.encodePacked(msg.sender)), "Hash mismatch");
        require(recoverSigner(hash, signature) == owner(), "Not allowed");
        require(!signatureUsed[signature], "Signature used");
        require(totalSupply() < MAX_SUPPLY, "Max supply");

        signatureUsed[signature] = true;

        uint256 tokenId = totalSupply() + 1;
        _safeMint(msg.sender, tokenId);

        emit Claimed(msg.sender, tokenId);
    }

    function mint(address to) external onlyOwner {
        require(totalSupply() < MAX_SUPPLY, "Max supply");
        uint256 tokenId = totalSupply() + 1;
        _safeMint(to, tokenId);
        emit Claimed(to, tokenId);
    }

    function _baseURI() internal view override returns (string memory) {
        return baseTokenURI;
    }

    function setBaseURI(string calldata baseURI) external onlyOwner {
        baseTokenURI = baseURI;
    }
}
