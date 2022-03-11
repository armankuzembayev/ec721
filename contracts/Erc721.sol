//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Strings.sol";


contract Erc721 is ERC721, AccessControl {

    bytes32 public constant ADMIN = keccak256("ADMIN");
    string public constant EXTENSION = ".json";

    string public baseUri;
    uint256 public maxElements;
    uint256 public currentIdx;

    constructor (
        string memory _name,
        string memory _symbol,
        string memory _baseUri,
        uint256 _maxElements
    ) ERC721(_name, _symbol) {
        _setupRole(ADMIN, msg.sender);

        baseUri = _baseUri;
        maxElements = _maxElements;
    }
    
    function _baseURI() internal view virtual override returns (string memory) {
        return baseUri;
    }

    function tokenURI(uint256 _tokenId) public view virtual override returns (string memory) { 
        require(_exists(_tokenId), "Token doesn't exist");

        return string(abi.encodePacked(baseUri, Strings.toString(_tokenId), EXTENSION));
    } 

    function mint(address _to, uint256 _amount) public {
        require(_to != address(0), "Mint to zero address");
        require(_amount > 0, "Amount should be positive");
        require(_amount + currentIdx <= maxElements, "Cannot mint");

        for (uint256 idx = 1; idx <= _amount; idx++) {
            _safeMint(_to, currentIdx + idx);
        }

        currentIdx += _amount;
    }

    function supportsInterface(bytes4 _interfaceId) public view virtual override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(_interfaceId);
    }

    function setBaseUri(string memory _baseUri) public onlyRole(ADMIN) {
        baseUri = _baseUri;
    }

    function setMaxElements(uint256 _maxElements) public onlyRole(ADMIN) {
        maxElements = _maxElements;
    }
}

contract TestErc721 is Erc721 {

    constructor (
        string memory _name,
        string memory _symbol,
        string memory _baseUri,
        uint256 _maxElements
    ) Erc721(_name, _symbol, _baseUri, _maxElements) {}

    function baseURI() public view returns (string memory) {
        return _baseURI();
    }
}
