# Flex Flow SDK

SDK for interaction with Flex protocol [contracts](https://github.com/swaps-io/flex-contracts) flows. See:

- [installation](#installation) for instructions on how to setup SDK in a project
- [modules](./modules.html) for all available SDK classes/types/etc

## Development

### Installation

The SDK installation process assumes that [Node.js](https://nodejs.org/en) (version 22 is recommended) is installed on
machine and a project where SDK is planned to be integrated is already created.

1. Install `@swaps-io/flex-flow-sdk` as a package dependency of the project:
   - `npm install @swaps-io/flex-flow-sdk`
   - `yarn add @swaps-io/flex-flow-sdk`
2. Install [peer dependencies](#peer-dependencies) of SDK according to the needs of the project

Both ESM and CJS targets are supported.

### Peer Dependencies

Flex Flow SDK expects installed peer dependencies as listed in the table below.

| Dependency           | Version |
| -------------------- |:-------:|
| `@swaps-io/flex-sdk` |  v1+    |
