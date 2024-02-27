# Heurist Imaginaries NFT

## Development

### Compile

```shell
$ forge compile
```

### Deploy

1. Create a `.env` file in the root directory of this project, and fill in required environment variables. See `.env.example` for an example.
2. Configure constructor parameters in `scripts/Deploy.s.sol`
3. Run the following command to deploy contracts:

```shell    
# deploy on Sepolia testnet
forge script script/Deploy.s.sol:DeploySepolia --rpc-url sepolia --broadcast --verify

# deploy on mainnet
forge script script/Deploy.s.sol:DeployMainnet --rpc-url mainnet --broadcast --verify