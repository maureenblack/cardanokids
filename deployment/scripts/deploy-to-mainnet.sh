#!/bin/bash
# Script to deploy a Plutus contract to Cardano mainnet

set -e

if [ $# -ne 1 ]; then
    echo "Usage: $0 <contract-file.plutus>"
    exit 1
fi

CONTRACT_FILE=$1
CONTRACT_NAME=$(basename "$CONTRACT_FILE" .plutus)
WALLET_ADDRESS=$(cat ../wallet/payment.addr)
WALLET_SIGNING_KEY="../wallet/payment.skey"
WALLET_VERIFICATION_KEY="../wallet/payment.vkey"

echo "CAUTION: Deploying contract: $CONTRACT_NAME to MAINNET"
echo "This will use real ADA. Are you sure you want to continue? (y/n)"
read -r confirmation

if [ "$confirmation" != "y" ]; then
    echo "Deployment cancelled."
    exit 0
fi

# Check if protocol.json exists, if not, query it
if [ ! -f "protocol.json" ]; then
    echo "Querying protocol parameters..."
    cardano-cli query protocol-parameters \
        --mainnet \
        --out-file protocol.json
fi

# Query UTxO for the wallet
echo "Querying UTxO for wallet: $WALLET_ADDRESS"
cardano-cli query utxo \
    --mainnet \
    --address $WALLET_ADDRESS \
    --out-file utxo.json

# Get the first UTxO
TX_IN=$(jq -r 'keys[0]' utxo.json)
if [ -z "$TX_IN" ] || [ "$TX_IN" == "null" ]; then
    echo "No UTxO found for address: $WALLET_ADDRESS"
    exit 1
fi

# Calculate min ADA required
MIN_ADA=10000000

# Create metadata JSON if it doesn't exist
if [ ! -f "${CONTRACT_FILE%.plutus}.json" ]; then
    echo "Creating metadata JSON for $CONTRACT_NAME"
    cat > "${CONTRACT_FILE%.plutus}.json" << EOF
{
    "721": {
        "$(cat ../wallet/policy.id)": {
            "$CONTRACT_NAME": {
                "name": "$CONTRACT_NAME",
                "description": "Cardano Kids educational smart contract",
                "version": "1.0.0",
                "deployedAt": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
            }
        }
    }
}
EOF
fi

echo "Building transaction..."
cardano-cli transaction build \
    --mainnet \
    --tx-in $TX_IN \
    --tx-out "$WALLET_ADDRESS+$MIN_ADA" \
    --change-address $WALLET_ADDRESS \
    --metadata-json-file "${CONTRACT_FILE%.plutus}.json" \
    --out-file tx.raw \
    --protocol-params-file protocol.json

echo "Signing transaction..."
cardano-cli transaction sign \
    --tx-body-file tx.raw \
    --signing-key-file $WALLET_SIGNING_KEY \
    --mainnet \
    --out-file tx.signed

echo "FINAL CONFIRMATION: You are about to submit a transaction to MAINNET."
echo "This will use real ADA. Are you absolutely sure? (type 'CONFIRM' to proceed)"
read -r final_confirmation

if [ "$final_confirmation" != "CONFIRM" ]; then
    echo "Deployment cancelled."
    exit 0
fi

echo "Submitting transaction..."
TXID=$(cardano-cli transaction submit \
    --mainnet \
    --tx-file tx.signed)

echo "Contract $CONTRACT_NAME deployed to mainnet."
echo "Transaction ID: $TXID"

# Save deployment info
mkdir -p ../deployments/mainnet
cat > "../deployments/mainnet/$CONTRACT_NAME.deployment" << EOF
{
    "contractName": "$CONTRACT_NAME",
    "contractFile": "$CONTRACT_FILE",
    "transactionId": "$TXID",
    "deployedAt": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
    "network": "mainnet",
    "walletAddress": "$WALLET_ADDRESS"
}
EOF

echo "Deployment information saved to ../deployments/mainnet/$CONTRACT_NAME.deployment"
