# Cardano Kids Development Guide

This guide provides instructions for setting up and contributing to the Cardano Kids educational platform.

## Prerequisites

- Node.js (v16+)
- npm or yarn
- PostgreSQL (v13+)
- Haskell and Cabal (for Cardano integration)
- Cardano node (for blockchain interaction)

## Frontend Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd cardano-kids
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. The application will be available at `http://localhost:3000`

## Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file with your database credentials and Cardano node configuration.

4. Start the backend server:
   ```bash
   npm run dev
   ```

5. The API will be available at `http://localhost:5000`

## Database Setup

1. Create a PostgreSQL database:
   ```bash
   createdb cardano_kids
   ```

2. Run migrations:
   ```bash
   cd backend
   npm run migrate
   ```

3. (Optional) Seed the database with initial content:
   ```bash
   npm run seed
   ```

## Cardano Integration

1. Ensure you have a Cardano node running (testnet recommended for development)

2. Configure the Haskell services:
   ```bash
   cd backend/cardano-services
   cabal build
   cabal run setup
   ```

3. Test the Cardano connection:
   ```bash
   npm run test:cardano
   ```

## Development Workflow

### Code Structure

- `/src` - Frontend React application
  - `/components` - Reusable UI components
  - `/pages` - Page components
  - `/context` - React context providers
  - `/hooks` - Custom React hooks
  - `/services` - API service functions
  - `/utils` - Utility functions
  - `/assets` - Static assets (images, fonts, etc.)

- `/backend` - Node.js backend
  - `/controllers` - Request handlers
  - `/models` - Database models
  - `/routes` - API routes
  - `/services` - Business logic
  - `/cardano-services` - Haskell services for Cardano integration

### Branching Strategy

- `main` - Production-ready code
- `development` - Integration branch for features
- `feature/*` - Feature branches

### Pull Request Process

1. Create a feature branch from `development`
2. Implement your changes
3. Write tests for your changes
4. Submit a pull request to `development`
5. Ensure CI passes
6. Request code review

## Design Guidelines

### UI/UX Principles

- Use Cardano's color palette (blues and greens) with brighter, more vibrant variations
- Ensure all UI elements are accessible and child-friendly
- Follow a consistent character-based theme throughout
- Design for different age groups (6-8, 9-11, 12-14)

### Component Design

- Create responsive components that work on various devices
- Use clear visual feedback for interactive elements
- Include accessibility features (screen reader support, keyboard navigation)
- Implement age-appropriate animations and transitions

## Content Development

### Age Groups

- **Ages 6-8**: Focus on basic concepts with simple visuals and minimal text
- **Ages 9-11**: Introduce more detailed explanations with interactive elements
- **Ages 12-14**: Provide comprehensive content with real-world applications

### Educational Modules

Each module should include:
- Engaging storyline with characters
- Interactive simulations
- Quizzes and activities
- Achievements and rewards
- Printable resources

## Testing

- Unit tests for components and functions
- Integration tests for API endpoints
- End-to-end tests for user flows
- User testing with children in target age groups

## Deployment

- Frontend: Vercel or Netlify
- Backend: AWS, Azure, or GCP
- Database: Managed PostgreSQL service
- Cardano Node: Dedicated server or cloud instance
