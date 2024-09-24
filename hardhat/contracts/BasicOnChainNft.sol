// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";
import {IVerifier} from "./Iverifier.sol";



contract BasicOnChainNft is ERC721 {
    error BasicNft__TokenUriNotFound();
    error BasicOnChainNft__CollectionHasOnlyUniquePieces();
    error BasicOnChainNft__InvalidHash();

    IVerifier public ownershipVerifierContract;

    struct m_Meta {
        string imageURI;
        string description;
    }
    mapping(uint256 tokenId => m_Meta t_metadata) private s_tokenIdToMetadata;
    uint256 private s_tokenCounter;
    string private _description = "";
    string private _imageUri = "ipfs://"; 

    constructor(string memory _name, string memory _symbol, address _ownershipVerifierContract) ERC721(_name, _symbol) {
        s_tokenCounter = 0;
        ownershipVerifierContract = IVerifier(_ownershipVerifierContract);
    }

    function getTokenCounter() public view returns (uint256) {
        return s_tokenCounter;
    }

    function mintNft() public {
        // if (msg.sender !=== "us") // make them pay
        // require(msg.sender.balanceOf() > 34, "");
        // burnFrom();

        // TODO use a modifier
        if (s_tokenCounter != 0) {
            revert BasicOnChainNft__CollectionHasOnlyUniquePieces();
        }


        s_tokenIdToMetadata[s_tokenCounter] = m_Meta({ imageURI: _imageUri, description: _description });
        _safeMint(msg.sender, s_tokenCounter);
        s_tokenCounter++;

        // potentially return the hash
    }

    function mintNftFor(address to) public {
        // TODO use a modifier
        if (s_tokenCounter != 0) {
            revert BasicOnChainNft__CollectionHasOnlyUniquePieces();
        }

        s_tokenIdToMetadata[s_tokenCounter] = m_Meta({ imageURI: _imageUri, description: _description });
        _safeMint(to, s_tokenCounter);
        s_tokenCounter++;
    }
 
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        m_Meta memory tokenMetadata = s_tokenIdToMetadata[tokenId];
        // Assert it actually exist
        if (ownerOf(tokenId) == address(0)) {
            revert BasicNft__TokenUriNotFound();
        }

        return string(
            abi.encodePacked(
            "data:application/json;base64,",
            Base64.encode(
                // We can put symbol, question
                 abi.encodePacked(
                    "{",
                    // solhint-disable-next-line quotes
                        '"name": "', name(), '",',
                        // TODO have a description here
                        // solhint-disable-next-line quotes
                        '"description": "', tokenMetadata.description, '",',
                        // solhint-disable-next-line quotes
                        '"attributes": [],',
                        // TODO have the NFT already on ipfs
                        // solhint-disable-next-line quotes
                        '"image": "', tokenMetadata.imageURI,'"'
                    "}"
                 )
            )
            )
        );
    }

    function claimOwnership(address to, uint16 answer, uint256 tokenId) public {
        // implement burning gas here
        // assert not owner of contract
        // burnFrom(msg.sender, 100); // 
        // if youre already owner, just quit
        // run CommitReveal
        if (!ownershipVerifierContract.checkSecret(answer)) {
            revert BasicOnChainNft__InvalidHash();
        }

        _safeTransfer(_ownerOf(tokenId), to, tokenId);
    }

    function claimOwnershipHash(address to, bytes32 answerHash, uint256 tokenId) public {
        if (ownershipVerifierContract.checkSecretHash(answerHash)) {
            revert BasicOnChainNft__InvalidHash();
        }
        _safeTransfer(_ownerOf(tokenId), to, tokenId);
    }
}
