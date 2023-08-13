// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract NameRegistry is ERC721Enumerable, Ownable {
    using SafeMath for uint256;
    using Strings for uint256;

    uint256 public nextTokenId = 1;
    uint256 public baseRegistrationPrice = 0.1 ether - 0.0002 ether; // Reduced by 0.0002 ether
    uint256 public registrationDuration = 365 days; // Default registration duration
    string private tld = ".mode"; // The top-level domain

    mapping(string => uint256) public namePrices;
    mapping(string => bool) public nameExists;
    mapping(uint256 => string) public tokenIdToName;
    mapping(uint256 => uint256) public tokenIdToCreationTimestamp;
    mapping(uint256 => string) private tokenURIs;
    mapping(string => uint256) public nameExpiry;

    event RegistrationPriceChanged(uint256 newPrice);
    event TransferPriceChanged(uint256 newPrice);
    event NameRegistered(address indexed owner, string name, uint256 expiryTimestamp);
    event NameTransferred(address indexed from, address indexed to, string name);
    event NameRenewed(address indexed owner, string name, uint256 newExpiryTimestamp);

    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {}

    function setBaseRegistrationPrice(uint256 price) external onlyOwner {
        baseRegistrationPrice = price;
        emit RegistrationPriceChanged(price);
    }

    function setRegistrationPrice(string memory name, uint256 price) external onlyOwner {
        namePrices[name] = price;
    }

    function setRegistrationDuration(uint256 duration) external onlyOwner {
        registrationDuration = duration;
    }

    function getRegistrationPrice(string memory name) public view returns (uint256) {
        uint256 basePrice = namePrices[name] > 0 ? namePrices[name] : baseRegistrationPrice;
        uint256 nameLength = bytes(name).length;

        for (uint256 i = 0; i < nameLength; i++) {
            if (_isDigit(bytes(name)[i])) {
                return basePrice.sub(0.02 ether); // Reduce price by 0.02 ether
            }
        }

        return basePrice.add(nameLength.mul(0.02 ether));
    }

    function _isDigit(bytes1 _char) internal pure returns (bool) {
        return (_char >= bytes1("0") && _char <= bytes1("9"));
    }

    function _isAddressRegistered(address addr) internal view returns (bool) {
        for (uint256 tokenId = 1; tokenId < nextTokenId; tokenId++) {
            if (_exists(tokenId) && ownerOf(tokenId) == addr) {
                return true;
            }
        }
        return false;
    }

    function Registered(address addr) external view returns (bool) {
        for (uint256 tokenId = 1; tokenId < nextTokenId; tokenId++) {
            if (_exists(tokenId) && ownerOf(tokenId) == addr) {
                return true;
            }
        }
        return false;
    }

    function registerName(string memory name, string memory metadataURI) external payable {
        require(nameExists[name] == false, "Name is already registered");

        string memory fullName = string(abi.encodePacked(name, tld));

        // New change: Check if the address is already registered
        require(!_isAddressRegistered(msg.sender), "Address is already registered with a name");

        uint256 currentPrice = getRegistrationPrice(name);
        require(msg.value >= currentPrice, "Insufficient funds sent");

        _mint(msg.sender, nextTokenId);  // Mint a new NFT with the nextTokenId
        nameExists[fullName] = true;
        tokenIdToName[nextTokenId] = name;
        tokenIdToCreationTimestamp[nextTokenId] = block.timestamp;
        tokenURIs[nextTokenId] = metadataURI;
        nameExpiry[name] = block.timestamp + registrationDuration; // Set expiry timestamp
        emit NameRegistered(msg.sender, name, nameExpiry[name]);
        
        // Increment the nextTokenId after minting
        nextTokenId++;

        uint256 excessAmount = msg.value.sub(currentPrice);
        if (excessAmount > 0) {
            payable(msg.sender).transfer(excessAmount);
        }
    }

    function setTokenURI(uint256 tokenId, string memory metadataURI) external onlyOwner {
        require(_exists(tokenId), "Token does not exist");
        tokenURIs[tokenId] = metadataURI;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        return tokenURIs[tokenId];
    }

    function transferName(address to, uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Only the owner can transfer");

        string memory name = tokenIdToName[tokenId];
        _transfer(msg.sender, to, tokenId);

        emit NameTransferred(msg.sender, to, name);
    }

    function renewName(string memory name) external payable {
        require(nameExists[name], "Name is not registered");
        require(ownerOf(tokenIdOf(name)) == msg.sender, "Only the owner can renew");

        uint256 renewalPrice = getRegistrationPrice(name);
        require(msg.value >= renewalPrice, "Insufficient funds sent");

        nameExpiry[name] += registrationDuration;

        uint256 excessAmount = msg.value.sub(renewalPrice);
        if (excessAmount > 0) {
            payable(msg.sender).transfer(excessAmount);
        }

        emit NameRenewed(msg.sender, name, nameExpiry[name]);
    }

    function resolveName(string memory name) external view returns (address) {
        string memory fullName = string(abi.encodePacked(name, tld));
        uint256 tokenId = tokenIdOf(fullName);
        if (tokenId != 0) {
            return ownerOf(tokenId);
        }
        return address(0);
    }

    function tokenIdOf(string memory name) public view returns (uint256) {
        string memory fullName = string(abi.encodePacked(name, tld));
        return uint256(keccak256(abi.encodePacked(fullName))) % nextTokenId;
    }

    function getNameByAddress(address addr) external view returns (
        string memory nameValue,
        uint256 creationTimestamp,
        uint256 registrationPrice,
        uint256 expiryTimestamp,
        string memory tokenURIValue
    ) {
        for (uint256 tokenId = 1; tokenId < nextTokenId; tokenId++) {
            if (_exists(tokenId) && ownerOf(tokenId) == addr) {
                string memory name = tokenIdToName[tokenId];
                return (
                    name,
                    tokenIdToCreationTimestamp[tokenId],
                    getRegistrationPrice(name),
                    nameExpiry[name],
                    tokenURIs[tokenId]
                );
            }
        }
        return ("", 0, 0, 0, "");
    }

    function withdraw() external onlyOwner {
        uint256 contractBalance = address(this).balance;
        payable(owner()).transfer(contractBalance);
    }
}
