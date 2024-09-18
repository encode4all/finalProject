Encode Workshop assignment

# Group 4 Encode workshop end of course project

Two suggestions for the end of course project:
1. A dApp that swaps tokens (we will implement multiple ERC20s and try to enable exchanging between them)
2. A dApp that allows recovery of NFTs


### NFT recovery dApp

In [lesson 19](https://youtu.be/6trWml_1RJQ) (randomness) there is some talk about hashing secrets (which is a one way function).
We plan to utilise this as a way for users to verify they actually own the NFT, by matching against the “hashed” / “signed”

There might be better ways

Also a question about how this renders the private keys obsolete.

Shawn raised a question about a private key.

## The dApp: technical details

Expose a `recovery()` 

Commit and reveal scheme more info [here](https://blog.jarrodwatts.com/understanding-the-commit-reveal-scheme-with-solidity-examples)

## The NFT: technical details

To implement the NFT we can extends the ERC721

## Storage for the NFT

Save / host the NFT  on the ifs protocol or on chain (if its small enough)


### Scope

TBD

