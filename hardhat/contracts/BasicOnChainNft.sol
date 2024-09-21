// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";

contract BasicOnChainNft is ERC721 {
    struct m_Meta {
        string imageURI;
        string description;
    }
    mapping(uint256 tokenId => m_Meta t_metadata) private s_tokenIdToMetadata;
    uint256 private s_tokenCounter;

    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {
        s_tokenCounter = 0;
    }

    function getTokenCounter() public view returns (uint256) {
        return s_tokenCounter;
    }

    function mintNft(string memory _imageUri, string memory _description) public {
        s_tokenIdToMetadata[s_tokenCounter] = m_Meta({ imageURI: _imageUri, description: _description });
        _safeMint(msg.sender, s_tokenCounter);
        s_tokenCounter++;
    }
 
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        m_Meta memory tokenMetadata = s_tokenIdToMetadata[tokenId];

        return string(
            abi.encodePacked(
            "data:application/json;base64,",
            Base64.encode(
                 abi.encodePacked(
                    '{',
                        '"name": "', name(), '",',
                        '"description": "', tokenMetadata.description, '",',
                        '"attributes": [],',
                        '"image": "', tokenMetadata.imageURI,'"'
                    '}'
                 )
            )
            )
        );
    }
}
