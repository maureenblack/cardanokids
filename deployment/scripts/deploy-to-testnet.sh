#!/bin/bash
# Script to deploy a Plutus contract to Cardano testnet

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
TESTNET_MAGIC=1097911063

echo "Deploying contract: $CONTRACT_NAME to testnet"

# Check if protocol.json exists, if not, query it
if [ ! -f "protocol.json" ]; then
    echo "Querying protocol parameters..."
    cardano-cli query protocol-parameters \
        --testnet-magic $TESTNET_MAGIC \
        --out-file protocol.json
fi

# Query UTxO for the wallet
echo "Querying UTxO for wallet: $WALLET_ADDRESS"
cardano-cli query utxo \
    --testnet-magic $TESTNET_MAGIC \
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
    --testnet-magic $TESTNET_MAGIC \
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
    --testnet-magic $TESTNET_MAGIC \
    --out-file tx.signed

echo "Submitting transaction..."
TXID=$(cardano-cli transaction submit \
    --testnet-magic $TESTNET_MAGIC \
    --tx-file tx.signed)

echo "Contract $CONTRACT_NAME deployed to testnet."
echo "Transaction ID: $TXID"

# Save deployment info
mkdir -p ../deployments/testnet
cat > "../deployments/testnet/$CONTRACT_NAME.deployment" << EOF
{
    "contractName": "$CONTRACT_NAME",
    "contractFile": "$CONTRACT_FILE",
    "transactionId": "$TXID",
    "deployedAt": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
    "network": "testnet",
    "walletAddress": "$WALLET_ADDRESS"
}
EOF

echo "Deployment information saved to ../deployments/testnet/$CONTRACT_NAME.deployment"
