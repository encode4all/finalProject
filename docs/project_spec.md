Encode Workshop assignment

# Group 4 Encode workshop end of course project

## END DATE 26-09-24
Two suggestions for the end of course project:
1. A dApp that swaps tokens (we will implement 1 or more ERC-20 standard tokens (payment token) and ERC-721 (NFT) and facilitate swaps between these).
2. A dApp that allows recovery of NFTs


### NFT recovery dApp

In [lesson 19](https://youtu.be/6trWml_1RJQ) (randomness) there is some talk about hashing secrets (which is a one way function).
We plan to utilise this as a way for users to verify they actually own the NFT, by matching against the “hashed” / “signed”

The basic idea is we couple a real world physical art object  with an onchain NFT double/extension.
Both have their merits and we want to utilise the best of both worlds.
While physical art is great to showcase, has subjectivily more artistic finesse, is physically ownable and tangible and much more selling points. NFT's on the other hand are less prone to tear, damage and have scalable and global collector markets, is very close to efficient liquidity, programmable, verifiable, easy to lend, borrow against, buy/sell/showcase.

However NFT's dont have the physical protection layer a physical object has. And while it is practically impossible to guess someone's private key, one is subject to all kind of attack vectors including hacks, keyloggers, wrong permits or signatures on hacked websites/ wrong links etc. To mitigate this we would like to introduce the recovery function.

If done correctly we can add a safety net for highly valuable art objects and increase the value proposition in tandem of both physical and virtual object.

### Objections

There might be better ways

Also a question about how this renders the private keys obsolete.

Shawn raised a question about a private key.

## The dApp: technical details

Expose a `recovery()` 

Commit and reveal scheme more info [here](https://blog.jarrodwatts.com/understanding-the-commit-reveal-scheme-with-solidity-examples)

## The NFT: technical details

To implement the NFT we can extends the ERC721.

## Storage for the NFT

Save / host the NFT  on the ifs protocol or on chain (if its small enough).

In order to host files onchain most projects utilize svg files.


### Scope

TBD


### User Stories

#### Minting

- As a user i want to only be able to use the web app when i am connected to my wallet address

- As a user (0x617F2E2fD72FD9D5503197092aC168c91465E7f2) i want to be able to mint an NFT from the web UI.


- As a user when i mint an NFT, i want to mint an already created art, so i am not supplying any art


- As a user when i mint an NFT from the web UI, I want to have  feedback i.e success / error messages

- As a user i can only mint the NFT once

- As a user, after minting the NFT, it belongs to me.

#### Claiming ownership via retrieval

- As a user, I want to be able to basically transfer ownership of an NFT to an address (im logged in on the webapp).

- As a user, to do this, i want to be able to call the `claimOwnership` function, `claimOwnership(theAnswer, theTokenId)`

- As an API, we want to hash `theAnswer` provided by user off chain and calls the contract function `claimOwnership` on the contract

- As a user, the new address now has ownership of the NFT.

