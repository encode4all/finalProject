export class TransactionFailedError extends Error {
  constructor(hash: string) {
    super(`Transaction with hash ${hash} failed.`);
  }
}
