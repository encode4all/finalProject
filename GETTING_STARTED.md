# Getting Started

This guide will help you set up and run the different components of our project: the frontend app, the backend API, and the Hardhat tests.

## Prerequisites

Before you begin, make sure you have the following installed:
- Node.js (version 18.17 or later)
- Yarn (v1 or v2+)
- Git

## Project Structure

Our project consists of three main parts:
1. Frontend (Next.js app)
2. Backend (NestJS API)
3. Smart Contracts (Hardhat)

## Setting Up

1. Clone the repository:
   ```
   git clone <repository-url>
   cd <project-directory>
   ```

2. Install dependencies:
   ```
   yarn install
   ```

## Running the Frontend (Next.js app)

1. Navigate to the webapp directory:
   ```
   cd webapp
   ```

2. Start the development server:
   ```
   yarn start
   ```

3. Open your browser and visit `http://localhost:3000`

## Running the Backend API (NestJS)

1. Navigate to the api directory:
   ```
   cd api
   ```

2. Start the API server:
   ```
   npm run start:dev
   ```

3. The API will be available at `http://localhost:3001`

## Running Hardhat Tests

1. Navigate to the hardhat directory:
   ```
   cd hardhat
   ```

2. Run the tests:
   ```
   npm run test
   ```

## Deploying Smart Contracts

To deploy smart contracts to the Sepolia testnet:

1. Make sure you're in the hardhat directory:
   ```
   cd hardhat
   ```

2. Run the deployment script:
   ```
   npx hardhat run scripts/deploy_contracts_with_viem.ts --network sepolia
   ```

## Additional Information

- The frontend app is configured to connect to the Sepolia/ or Neo X testnet depending on version. You can change this in the `scaffold.config.ts` file.
- Make sure you have a `.env` file in the root directory with the necessary environment variables (e.g., `PRIVATE_KEY`, `RPC_ENDPOINT`).
- For more detailed information about each component, refer to the README files in their respective directories.

## Troubleshooting

- If you encounter any issues with dependencies, try deleting the `node_modules` folder and running `yarn install` again.
- Make sure your Node.js version is compatible with the project requirements.
- If you're having trouble connecting to the Sepolia testnet, ensure your `.env` file is correctly set up with the right RPC endpoint and private key.
