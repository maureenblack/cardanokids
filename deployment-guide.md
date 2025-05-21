# Cardano Kids Platform Deployment Guide

This document outlines the complete deployment strategy for the Cardano Kids educational platform, including smart contract deployment, frontend hosting, database setup, load testing, and monitoring.

## Table of Contents

1. [Smart Contract Deployment](#1-smart-contract-deployment)
2. [Frontend Hosting with CDN](#2-frontend-hosting-with-cdn)
3. [Database Setup](#3-database-setup)
4. [Load Testing](#4-load-testing)
5. [Monitoring](#5-monitoring)

## 1. Smart Contract Deployment

### Prerequisites

- Cardano node (running locally or accessible via API)
- Cardano CLI tools
- Plutus Application Backend (PAB)
- Wallet with sufficient funds (tADA for testnet, ADA for mainnet)

### Testnet Deployment Process

1. **Compile Smart Contracts**

   Navigate to the Plutus contracts directory and compile each contract:

   ```bash
   cd /contracts/plutus
   cabal build
   cabal run plutus-compile -- --input DemoWallet.hs --output ../compiled/demo-wallet.plutus
   cabal run plutus-compile -- --input AchievementNFT.hs --output ../compiled/achievement-nft.plutus
   cabal run plutus-compile -- --input ClassroomManagement.hs --output ../compiled/classroom-management.plutus
   cabal run plutus-compile -- --input ContentAccess.hs --output ../compiled/content-access.plutus
   ```

2. **Create Policy IDs for NFTs**

   ```bash
   cardano-cli transaction policyid --script-file ../compiled/achievement-nft.plutus > ../compiled/achievement-nft-policy-id.txt
   ```

3. **Deploy to Testnet**

   Set up environment variables:
   
   ```bash
   export CARDANO_NETWORK="testnet"
   export CARDANO_NODE_SOCKET_PATH="/path/to/testnet/node.socket"
   ```

   Deploy each contract using the deployment script:
   
   ```bash
   ./scripts/deploy-to-testnet.sh ../compiled/demo-wallet.plutus
   ./scripts/deploy-to-testnet.sh ../compiled/achievement-nft.plutus
   ./scripts/deploy-to-testnet.sh ../compiled/classroom-management.plutus
   ./scripts/deploy-to-testnet.sh ../compiled/content-access.plutus
   ```

4. **Verify Deployment**

   Check that contracts are deployed correctly:
   
   ```bash
   cardano-cli query utxo --testnet-magic 1097911063 --address $(cat wallet/payment.addr)
   ```

### Mainnet Deployment Process

Only proceed to mainnet deployment after thorough testing on testnet.

1. **Set Environment Variables for Mainnet**

   ```bash
   export CARDANO_NETWORK="mainnet"
   export CARDANO_NODE_SOCKET_PATH="/path/to/mainnet/node.socket"
   ```

2. **Create Policy IDs for Mainnet**

   ```bash
   cardano-cli transaction policyid --script-file ../compiled/achievement-nft.plutus > ../compiled/achievement-nft-policy-id-mainnet.txt
   ```

3. **Deploy to Mainnet**

   ```bash
   ./scripts/deploy-to-mainnet.sh ../compiled/demo-wallet.plutus
   ./scripts/deploy-to-mainnet.sh ../compiled/achievement-nft.plutus
   ./scripts/deploy-to-mainnet.sh ../compiled/classroom-management.plutus
   ./scripts/deploy-to-mainnet.sh ../compiled/content-access.plutus
   ```

4. **Update Contract Addresses in Configuration**

   Update the application configuration with the new contract addresses:
   
   ```bash
   ./scripts/update-contract-config.sh --network mainnet
   ```

## 2. Frontend Hosting with CDN

### AWS Infrastructure Setup

1. **Create S3 Bucket for Frontend Assets**

   ```bash
   aws s3 mb s3://cardano-kids-frontend --region us-east-1
   aws s3 website s3://cardano-kids-frontend --index-document index.html --error-document error.html
   ```

2. **Configure CloudFront Distribution**

   ```bash
   # Create CloudFront distribution using the S3 bucket as origin
   aws cloudfront create-distribution \
     --origin-domain-name cardano-kids-frontend.s3-website-us-east-1.amazonaws.com \
     --default-root-object index.html \
     --enabled \
     --output json > cloudfront-distribution.json
   ```

3. **Set Up DNS with Route 53**

   ```bash
   # Create hosted zone if not exists
   aws route53 create-hosted-zone \
     --name cardanokids.example.com \
     --caller-reference $(date +%s)
     
   # Create A record for the CloudFront distribution
   DISTRIBUTION_DOMAIN=$(cat cloudfront-distribution.json | jq -r '.Distribution.DomainName')
   aws route53 change-resource-record-sets \
     --hosted-zone-id YOUR_HOSTED_ZONE_ID \
     --change-batch '{
       "Changes": [
         {
           "Action": "CREATE",
           "ResourceRecordSet": {
             "Name": "cardanokids.example.com",
             "Type": "A",
             "AliasTarget": {
               "HostedZoneId": "Z2FDTNDATAQYW2",
               "DNSName": "'$DISTRIBUTION_DOMAIN'",
               "EvaluateTargetHealth": false
             }
           }
         }
       ]
     }'
   ```

### Frontend Build and Deployment

1. **Configure Environment Variables**

   Create a `.env.production` file:
   
   ```
   REACT_APP_API_URL=https://api.cardanokids.example.com
   REACT_APP_CARDANO_NETWORK=testnet
   REACT_APP_CONTENT_CDN=https://content.cardanokids.example.com
   ```

2. **Build the Frontend**

   ```bash
   npm install
   npm run build
   ```

3. **Deploy to S3**

   ```bash
   aws s3 sync build/ s3://cardano-kids-frontend --delete
   ```

4. **Invalidate CloudFront Cache**

   ```bash
   aws cloudfront create-invalidation \
     --distribution-id YOUR_DISTRIBUTION_ID \
     --paths "/*"
   ```

## 3. Database Setup

### Database Initialization

1. **Create PostgreSQL Database**

   ```bash
   createdb -h localhost -U postgres cardanokids
   createuser -h localhost -U postgres cardanokids_user
   psql -h localhost -U postgres -c "ALTER USER cardanokids_user WITH PASSWORD 'your_secure_password';"
   psql -h localhost -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE cardanokids TO cardanokids_user;"
   ```

2. **Initialize Schema**

   ```bash
   psql -h localhost -U cardanokids_user -d cardanokids -f database/schema.sql
   ```

3. **Seed Initial Data**

   ```bash
   psql -h localhost -U cardanokids_user -d cardanokids -f database/seed-data.sql
   ```

### Database Migration Strategy

1. **Create Migration Scripts**

   For each migration, create a numbered SQL file in the `database/migrations` directory:
   
   ```
   database/migrations/
   ├── 001_add_user_roles.sql
   ├── 002_add_content_verification.sql
   └── 003_add_blockchain_records.sql
   ```

2. **Run Migrations**

   ```bash
   for migration in database/migrations/*.sql; do
     psql -h localhost -U cardanokids_user -d cardanokids -f $migration
   done
   ```

3. **Backup Strategy**

   Set up daily backups:
   
   ```bash
   # Add to crontab
   0 0 * * * pg_dump -h localhost -U cardanokids_user cardanokids > /backups/cardanokids_$(date +\%Y\%m\%d).sql
   ```

## 4. Load Testing

### Setup Load Testing Environment

1. **Install k6 Load Testing Tool**

   ```bash
   brew install k6
   ```

2. **Create Test Scenarios**

   Create a classroom simulation scenario:
   
   ```javascript
   // classroom-scenario.js
   import http from 'k6/http';
   import { sleep, check } from 'k6';
   
   export const options = {
     stages: [
       // Ramp up to 30 users (typical classroom size)
       { duration: '1m', target: 30 },
       // Stay at 30 users for 5 minutes
       { duration: '5m', target: 30 },
       // Ramp up to 100 users (multiple classrooms)
       { duration: '2m', target: 100 },
       // Stay at 100 users for 5 minutes
       { duration: '5m', target: 100 },
       // Ramp down to 0
       { duration: '1m', target: 0 },
     ],
     thresholds: {
       http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
       http_req_failed: ['rate<0.01'],   // Less than 1% of requests should fail
     },
   };
   
   // Main test function
   export default function() {
     // Simulate student login
     const loginRes = http.post('https://api.cardanokids.example.com/auth/login', JSON.stringify({
       username: `student${Math.floor(Math.random() * 100)}`,
       password: 'password123',
     }), {
       headers: { 'Content-Type': 'application/json' },
     });
     
     // Get token and access content
     if (loginRes.status === 200) {
       const token = loginRes.json('token');
       const headers = {
         'Authorization': `Bearer ${token}`,
         'Content-Type': 'application/json',
       };
       
       // Access learning modules
       http.get('https://api.cardanokids.example.com/modules', { headers });
       
       // Access specific content
       http.get('https://api.cardanokids.example.com/content/123', { headers });
       
       // Update progress
       http.post('https://api.cardanokids.example.com/content/123/progress', JSON.stringify({
         progress: 50,
         completed: false,
       }), { headers });
     }
     
     // Simulate user thinking time
     sleep(Math.random() * 5 + 5);
   }
   ```

3. **Run Load Tests**

   ```bash
   k6 run classroom-scenario.js --out json=results.json
   ```

4. **Analyze Results**

   ```bash
   # Generate HTML report
   k6 report results.json
   ```

### Specific Load Testing Scenarios

1. **Classroom Login Surge**

   Test simultaneous logins at the start of a class:
   
   ```bash
   k6 run classroom-login-surge.js
   ```

2. **Content Access Patterns**

   Test multiple students accessing the same content:
   
   ```bash
   k6 run content-access-patterns.js
   ```

3. **Blockchain Interaction Load**

   Test load on blockchain interactions:
   
   ```bash
   k6 run blockchain-interactions.js
   ```

## 5. Monitoring

### Prometheus and Grafana Setup

1. **Install Prometheus**

   ```bash
   docker run -d \
     --name prometheus \
     -p 9090:9090 \
     -v /path/to/prometheus.yml:/etc/prometheus/prometheus.yml \
     prom/prometheus
   ```

2. **Install Grafana**

   ```bash
   docker run -d \
     --name grafana \
     -p 3000:3000 \
     grafana/grafana
   ```

3. **Configure Prometheus**

   Create `prometheus.yml`:
   
   ```yaml
   global:
     scrape_interval: 15s
     evaluation_interval: 15s
   
   alerting:
     alertmanagers:
       - static_configs:
           - targets: ['alertmanager:9093']
   
   rule_files:
     - "alert_rules.yml"
   
   scrape_configs:
     - job_name: 'cardano-node'
       static_configs:
         - targets: ['cardano-node-exporter:12798']
   
     - job_name: 'api-server'
       static_configs:
         - targets: ['api-server:9090']
   
     - job_name: 'frontend'
       static_configs:
         - targets: ['frontend-metrics:9091']
   
     - job_name: 'database'
       static_configs:
         - targets: ['postgres-exporter:9187']
   ```

4. **Set Up Cardano-Specific Metrics**

   Configure the Cardano node to expose metrics:
   
   ```
   # In cardano-node configuration
   hasEKG: 12788
   hasPrometheus:
     - 12798
     - "0.0.0.0"
   ```

### Key Metrics to Monitor

1. **Blockchain Metrics**
   - Block height
   - Transaction submission rate
   - Transaction confirmation time
   - Slot leader schedule (for stake pool operators)

2. **Application Metrics**
   - API request rate
   - API error rate
   - User login rate
   - Content access rate
   - Database query performance

3. **Infrastructure Metrics**
   - CPU usage
   - Memory usage
   - Disk I/O
   - Network traffic

### Alerting Setup

Create `alert_rules.yml`:

```yaml
groups:
  - name: cardano_alerts
    rules:
      - alert: CardanoNodeDown
        expr: up{job="cardano-node"} == 0
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Cardano node is down"
          description: "Cardano node has been down for more than 5 minutes."

      - alert: HighTransactionLatency
        expr: cardano_transaction_submission_latency_seconds > 10
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High transaction submission latency"
          description: "Transaction submission latency is higher than 10 seconds for 5 minutes."

      - alert: APIHighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m]) > 0.05
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High API error rate"
          description: "More than 5% of API requests are failing."
```

## Conclusion

This deployment guide provides a comprehensive approach to deploying the Cardano Kids educational platform. By following these steps, you can ensure a secure, scalable, and reliable deployment that leverages the Cardano blockchain for educational content delivery.

For any issues or questions, please contact the development team at dev@cardanokids.example.com.
