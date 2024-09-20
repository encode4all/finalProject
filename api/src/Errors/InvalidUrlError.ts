export class InvalidUrlError extends Error {
    constructor(url: string) {
        super(`Url: ${url} is invalid.`);
    }
}
