# Cardano Kids Platform Deployment

This directory contains all the necessary files and scripts for deploying the Cardano Kids educational platform. The deployment strategy is designed specifically for a Cardano-based educational platform, with considerations for smart contract deployment, frontend hosting, database setup, load testing, and monitoring.

## Directory Structure

```
deployment/
├── scripts/                    # Deployment scripts
│   ├── deploy-to-testnet.sh    # Script for deploying contracts to testnet
│   └── deploy-to-mainnet.sh    # Script for deploying contracts to mainnet
├── terraform/                  # Infrastructure as code
│   ├── main.tf                 # Main Terraform configuration
│   └── variables.tf            # Terraform variables
├── database/                   # Database setup
│   ├── schema.sql              # Database schema
│   ├── migrate.sh              # Migration script
│   └── migrations/             # Migration files
│       └── 001_add_content_analytics.sql
├── load-testing/               # Load testing configuration
│   ├── classroom-scenario.js   # k6 load testing script
│   └── test-users.json         # Test user data
├── monitoring/                 # Monitoring setup
│   ├── prometheus.yml          # Prometheus configuration
│   └── alert_rules.yml         # Alert rules
├── docker-compose.yml          # Docker Compose for local deployment
└── README.md                   # This file
```

## Deployment Steps

### 1. Smart Contract Deployment

The `scripts` directory contains shell scripts for deploying Plutus smart contracts to both the Cardano testnet and mainnet.

```bash
# Deploy to testnet
cd deployment/scripts
chmod +x deploy-to-testnet.sh
./deploy-to-testnet.sh ../../contracts/plutus/compiled/ContentAccess.plutus

# Deploy to mainnet (only after thorough testing)
chmod +x deploy-to-mainnet.sh
./deploy-to-mainnet.sh ../../contracts/plutus/compiled/ContentAccess.plutus
```

### 2. Frontend and Infrastructure Setup

The `terraform` directory contains Terraform configurations for setting up the AWS infrastructure, including S3 buckets for frontend assets and CloudFront distributions for CDN.

```bash
# Initialize Terraform
cd deployment/terraform
terraform init

# Plan the deployment
terraform plan -out=tfplan

# Apply the configuration
terraform apply tfplan
```

### 3. Database Setup

The `database` directory contains scripts for initializing the database schema and running migrations.

```bash
# Initialize database schema
cd deployment/database
chmod +x migrate.sh
./migrate.sh --init

# Run migrations
./migrate.sh --migrate
```

### 4. Load Testing

The `load-testing` directory contains k6 scripts for simulating classroom-scale usage of the platform.

```bash
# Install k6
brew install k6

# Run load tests
cd deployment/load-testing
k6 run classroom-scenario.js
```

### 5. Monitoring Setup

The `monitoring` directory contains Prometheus and Grafana configurations for monitoring the platform, with special focus on Cardano-specific metrics.

```bash
# Start the monitoring stack
cd deployment
docker-compose up -d prometheus grafana alertmanager
```

### 6. Full Deployment with Docker Compose

For a complete local deployment or staging environment, use the provided Docker Compose file.

```bash
# Start all services
cd deployment
docker-compose up -d
```

## Deployment Environments

- **Development**: Local environment for development and testing
- **Staging**: Testnet deployment for integration testing
- **Production**: Mainnet deployment for the live platform

## Cardano-Specific Considerations

- Smart contracts are deployed using the Cardano CLI
- Blockchain interactions are monitored with custom metrics
- Content metadata is stored on-chain using Cardano's native token capabilities
- Achievement NFTs are minted using the AchievementNFT.hs contract

## Security Considerations

- Sensitive environment variables should be stored in a secure vault
- Private keys for transaction signing should never be committed to the repository
- API endpoints are protected with JWT authentication
- Database credentials are managed securely

## Maintenance and Updates

- Database migrations are versioned and applied sequentially
- Frontend updates can be deployed without affecting the backend
- Smart contract updates require careful planning and testing

For more detailed information, refer to the [deployment guide](../deployment-guide.md).
