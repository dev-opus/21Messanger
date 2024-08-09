# 21Messsanger 🚀🚀

## Overview

**21Messsanger 🚀🚀** is a PoC message board smart contract and decentralised application that allow users to perform the following:

- Add messages
- View messages
- Clap for (non-owned) messages
- Mark messages as spam/not-spam (only available to contract owner)

## Functionalities, Structures and Setup

### Structures

1. Message

   A struct for holding associated details of a particular Message

```solidity
    struct Message {
        uint timestamp;
        address creator;
        string text;
        bool isSpam;
        uint claps;
        uint messageId;
    }

```

2. messages: `Message[]`

   An array of Message objects

```solidity
  Message[] messages;
```

### Functionalities

1. **create**

   - **functionality**: Creates a new Message and adds it to the messages array

   - **params**: `solidity string _text`
   - **returns**: `solidity uint _messageId`

2. **clap**

   - **functionality**: increase the `claps` count of a Message by `1`
   - **params**: `solidity uint _messageId` and `solidity uint _clap`

3. **markAsSpam**

   - **functionality**: marks a non-spam Message as spam. Only available to the contract owner.
   - **params**: tokenId
   - **returns**: messageId

4. **unMarkAsSpam**

- **functionality**: marks a spam Message as non-spam. Only available to the contract owner.
  - **returns**: messageId

5. **get**
   - **functionality**: retrieves all the added Messagess
   - **returns**: `solidity Message[] messages`

### Setup

1. Installation: run `pnpm i` in the `nft` directory to install required dependencies
2. Compilation: run `pnpm exec hardhat compile`
3. Testing: run `pnpm exec hardhat test`
4. Deployment: run `pnpm exec hardhat run ignition/module/MessageBoard.ts` for local deployment and `pnpm exec hardhat run --network alfajores ignition/module/MessageBoard.ts` for deployment on Celo's Alfajores' testnet.

## User Interface

The user interface has been developed with a JavaScript framework, Next.js v14 and helper libraries mainly

- **RainbowKit** and **TransactQuery** for wallet connections
- **Wagmi** for contract interaction (send read and write transactions)
- **Viem** for utilities and interfaces (parsing and formatting ether, etc)

### Setup

1. Installation: run `pnpm i` in the `dapp` directory to install required dependencies
2. Local deployment: run `pnpm dev` to use the DApp in the development.
3. Production deployment: run `pnpm build` and follow the instructions for your preferred hosting platform to host the DApp and use it in live mode.
