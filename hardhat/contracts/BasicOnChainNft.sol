// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";
import {IVerifier} from "./IVerifier.sol";

contract BasicOnChainNft is ERC721 {
    error BasicNft__TokenUriNotFound();
    error BasicOnChainNft__CollectionHasOnlyUniquePieces();
    error BasicOnChainNft__InvalidHash();
    error BasicOnChainNft__NftAlreadyClaimed();
    IVerifier public ownershipVerifierContract;

    uint256 private s_tokenCounter;
    string private description = "Group 4 - Encode EVM Bootcamp Q3 2024.";
    string private imageUri = "https://ipfs.io/ipfs/QmbzTZm4jDh9cWPceF6C6WKtWSBRDq384tKp8VCJg5h9rx";
    string private artist = "@lau.mural";

    bool private nftClaimed = false;

    constructor(
        string memory _name, 
        string memory _symbol,
        address _ownershipVerifierContract
        ) 
        ERC721(_name, _symbol) {
        s_tokenCounter = 0;
        ownershipVerifierContract = IVerifier(_ownershipVerifierContract);
    }
    modifier onlyUnclaimed() {
        if (nftClaimed) {
            revert BasicOnChainNft__NftAlreadyClaimed();
        }
        _;
    }
    function getTokenCounter() public view returns (uint256) {
        return s_tokenCounter;
    }

    function mintNft() public {
        _mintNftFor(msg.sender);
    }

    function mintNftFor(address to) public {
        _mintNftFor(to);
    }

    function _mintNftFor(address to) private {
        // if (msg.sender !=== "us") // make them pay
        // require(msg.sender.balanceOf() > 34, "");
        // burnFrom();
        // TODO use a modifier
        if (s_tokenCounter != 0) {
            revert BasicOnChainNft__CollectionHasOnlyUniquePieces();
        }

        _safeMint(to, s_tokenCounter);
        s_tokenCounter++;
    }
 
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
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
                        '"description": "', description, '",',
                        // solhint-disable-next-line quotes
                        '"attributes": [],',
                        // TODO have the NFT already on ipfs
                        // solhint-disable-next-line quotes
                        '"image": "', imageUri ,'"',
                        // solhint-disable-next-line quotes
                        '"artist": "', artist, '"'
                    "}"
                 )
            )
            )
        );
    }

    function claimOwnership(address to, string calldata answer, uint256 tokenId) public onlyUnclaimed {
        // implement burning gas here
        // assert not owner of contract
        // burnFrom(msg.sender, 100); // 
        // if youre already owner, just quit
        // run CommitReveal
        if (!ownershipVerifierContract.checkSecret(answer)) {
            revert BasicOnChainNft__InvalidHash();
        }
        nftClaimed = true;
        _safeTransfer(_ownerOf(tokenId), to, tokenId);
    }

    function claimOwnershipHash(address to, bytes calldata answerHash, uint256 tokenId) public onlyUnclaimed{
        if (ownershipVerifierContract.checkSecretByHash(answerHash)) {
            revert BasicOnChainNft__InvalidHash();
        }
        nftClaimed = true;
        _safeTransfer(_ownerOf(tokenId), to, tokenId);
    }

    function totalSupply() public view virtual returns (uint256) {
        return 1;
    }
}
