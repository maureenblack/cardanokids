# Cardano Kids Technical Architecture

## System Architecture Diagram

```
+---------------------+         +---------------------+
|                     |         |                     |
|  Frontend (React)   |<------->|  Backend (Node.js)  |
|                     |  REST   |                     |
+----------+----------+   API   +----------+----------+
           ^                               |
           |                               |
           |                               v
+----------+----------+         +----------+----------+
|                     |         |                     |
|  User Interface     |         |  Haskell Services   |
|  Components         |         |  (Cardano API)      |
|                     |         |                     |
+---------------------+         +----------+----------+
                                           |
                                           |
                                           v
+---------------------+         +----------+----------+
|                     |         |                     |
|  PostgreSQL         |<------->|  Cardano Blockchain |
|  Database           |         |  (Plutus Contracts) |
|                     |         |                     |
+---------------------+         +---------------------+
           ^                               ^
           |                               |
           v                               v
+---------------------+         +---------------------+
|                     |         |                     |
|  User Management    |         |  Wallet Integration |
|  & Progress Tracking|         |  (Nami, Eternl)     |
|                     |         |                     |
+---------------------+         +---------------------+
```

## Component Descriptions

### Frontend Layer
- **React with TypeScript**: Provides a responsive, interactive user interface
- **Age-toggle Component**: Adjusts content complexity based on selected age group
- **Interactive Simulations**: Visual demonstrations of blockchain concepts
- **Dashboard**: Tracks learning progress through "blockchain milestones"
- **Character Guides**: Animated characters that explain concepts and guide users

### Backend Layer
- **Node.js Server**: Handles API requests, user authentication, and business logic
- **Haskell Components**: Specialized modules for interacting with the Cardano blockchain
- **Content Management System**: Manages educational content for different age groups

### Database Layer
- **PostgreSQL**: Stores user data, learning progress, and content metadata
- **User Profiles**: Maintains separate profiles for children and parent/teacher accounts
- **Progress Tracking**: Records completed lessons, earned achievements, and milestones

### Blockchain Integration
- **Cardano API**: Interfaces with the Cardano blockchain for demonstrations
- **Plutus Smart Contracts**: Educational examples of smart contracts
- **Transaction Simulator**: Demonstrates how transactions work without using real ADA
- **Wallet Integration**: Connects to Cardano wallets for parent/teacher accounts only

### Security & Access Control
- **Parental Controls**: Allows parents/teachers to monitor progress and manage content
- **Role-based Access**: Different permissions for children, parents, and administrators
- **Safe Environment**: All blockchain interactions are simulated or in a sandbox environment

## Data Flow

1. **User Authentication**:
   - Children log in with simplified credentials
   - Parents/teachers can authenticate using Cardano wallets or traditional methods

2. **Content Delivery**:
   - Age-appropriate content is fetched from the backend based on user profile
   - Interactive elements are rendered client-side with React

3. **Blockchain Interactions**:
   - Simulated transactions show how the Cardano blockchain works
   - Real blockchain data is fetched and simplified for educational purposes
   - Smart contract demonstrations use test environments

4. **Progress Tracking**:
   - Learning activities are recorded in the PostgreSQL database
   - Achievements and milestones update the user's profile
   - Parents/teachers can view detailed progress reports

5. **Wallet Integration** (for parent/teacher accounts only):
   - Connect to Nami, Eternl, or other Cardano wallets
   - View simplified transaction history
   - Demonstrate wallet functionality in a controlled environment
