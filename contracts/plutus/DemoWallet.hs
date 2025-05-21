{-# LANGUAGE DataKinds           #-}
{-# LANGUAGE FlexibleContexts    #-}
{-# LANGUAGE NoImplicitPrelude   #-}
{-# LANGUAGE ScopedTypeVariables #-}
{-# LANGUAGE TemplateHaskell     #-}
{-# LANGUAGE TypeApplications    #-}
{-# LANGUAGE TypeFamilies        #-}
{-# LANGUAGE TypeOperators       #-}

{-|
Module      : DemoWallet
Description : A non-custodial demonstration wallet for educational purposes
Copyright   : (c) Cardano Kids, 2025
License     : MIT
Maintainer  : dev@cardanokids.com

This module implements a demonstration wallet contract that simulates 
transactions for educational purposes. It's designed to be safe for children
to use while learning about blockchain transactions.
-}

module DemoWallet where

import           PlutusTx.Prelude
import qualified PlutusTx
import           Plutus.V2.Ledger.Api
import           Plutus.V2.Ledger.Contexts
import qualified Ledger.Typed.Scripts      as Scripts
import           Ledger.Value              (assetClassValue)
import           Ledger.Ada                (lovelaceValueOf)
import           Playground.Contract

-- | Data type representing a demo wallet
data DemoWallet = DemoWallet
    { owner          :: !PubKeyHash       -- ^ The owner of the wallet
    , demoBalance    :: !Integer          -- ^ Simulated balance (not real ADA)
    , transactionLog :: ![DemoTransaction] -- ^ Log of educational transactions
    }

-- | Data type representing a demo transaction
data DemoTransaction = DemoTransaction
    { txId          :: !BuiltinByteString -- ^ Transaction ID
    , txAmount      :: !Integer           -- ^ Amount transferred
    , txFrom        :: !PubKeyHash        -- ^ Sender
    , txTo          :: !PubKeyHash        -- ^ Recipient
    , txDescription :: !BuiltinByteString -- ^ Educational description
    , txTimestamp   :: !POSIXTime         -- ^ When the transaction occurred
    }

-- | Data type for wallet actions
data DemoWalletAction = 
      SimulateTransfer Integer PubKeyHash BuiltinByteString -- ^ Simulate a transfer (amount, recipient, description)
    | ViewTransactionHistory                                -- ^ View transaction history
    | ResetWallet                                           -- ^ Reset the wallet to initial state

PlutusTx.makeIsDataIndexed ''DemoWallet [('DemoWallet, 0)]
PlutusTx.makeIsDataIndexed ''DemoTransaction [('DemoTransaction, 0)]
PlutusTx.makeIsDataIndexed ''DemoWalletAction [('SimulateTransfer, 0), ('ViewTransactionHistory, 1), ('ResetWallet, 2)]

{-# INLINABLE mkDemoWalletValidator #-}
-- | The validator script for the demo wallet
mkDemoWalletValidator :: DemoWallet -> DemoWalletAction -> ScriptContext -> Bool
mkDemoWalletValidator wallet action ctx = 
    -- Check that the transaction is signed by the wallet owner
    traceIfFalse "Not signed by owner" (txSignedBy info (owner wallet)) &&
    case action of
        -- Simulate a transfer (educational only - no real assets moved)
        SimulateTransfer amount recipient description -> 
            -- Ensure amount is positive
            traceIfFalse "Amount must be positive" (amount > 0) &&
            -- Ensure simulated balance is sufficient
            traceIfFalse "Insufficient demo balance" (demoBalance wallet >= amount) &&
            -- Ensure description is not empty
            traceIfFalse "Description cannot be empty" (lengthOfByteString description > 0)
            
        -- View transaction history (always succeeds if signed by owner)
        ViewTransactionHistory -> True
        
        -- Reset wallet to initial state
        ResetWallet -> True
  where
    info :: TxInfo
    info = scriptContextTxInfo ctx

-- | Create a new transaction ID
createTxId :: DemoWallet -> PubKeyHash -> Integer -> BuiltinByteString
createTxId wallet recipient amount = 
    -- This is a simplified version for educational purposes
    -- In a real contract, we would use a more sophisticated method
    sha2_256 $ consByteString (fromInteger amount) $ 
               consByteString (getPubKeyHash $ owner wallet) $
               consByteString (getPubKeyHash recipient) emptyByteString
  where
    getPubKeyHash :: PubKeyHash -> Integer
    getPubKeyHash = decodeUtf8 . fromBuiltin . getPubKeyHash

-- | Helper function to get current time from context
getCurrentTime :: ScriptContext -> POSIXTime
getCurrentTime = txInfoValidRange . scriptContextTxInfo

-- | Helper function to add a transaction to the log
addTransaction :: DemoWallet -> Integer -> PubKeyHash -> BuiltinByteString -> ScriptContext -> DemoWallet
addTransaction wallet amount recipient description ctx =
    wallet { 
        demoBalance = demoBalance wallet - amount,
        transactionLog = newTransaction : transactionLog wallet
    }
  where
    newTransaction = DemoTransaction
        { txId = createTxId wallet recipient amount
        , txAmount = amount
        , txFrom = owner wallet
        , txTo = recipient
        , txDescription = description
        , txTimestamp = getCurrentTime ctx
        }

-- | The demo wallet type
data DemoWalletType
instance Scripts.ValidatorTypes DemoWalletType where
    type instance DatumType DemoWalletType = DemoWallet
    type instance RedeemerType DemoWalletType = DemoWalletAction

-- | The typed validator script
typedDemoWalletValidator :: Scripts.TypedValidator DemoWalletType
typedDemoWalletValidator = Scripts.mkTypedValidator @DemoWalletType
    $$(PlutusTx.compile [|| mkDemoWalletValidator ||])
    $$(PlutusTx.compile [|| wrap ||])
  where
    wrap = Scripts.wrapValidator @DemoWallet @DemoWalletAction

-- | The validator script
demoWalletValidator :: Validator
demoWalletValidator = Scripts.validatorScript typedDemoWalletValidator

-- | The address of the demo wallet
demoWalletAddress :: Address
demoWalletAddress = scriptAddress demoWalletValidator

-- | Create a new demo wallet for a user
createDemoWallet :: PubKeyHash -> DemoWallet
createDemoWallet ownerPkh = DemoWallet
    { owner = ownerPkh
    , demoBalance = 1000000  -- Start with 1,000,000 demo lovelace (1 ADA)
    , transactionLog = []
    }

-- | Endpoint to create a new demo wallet
createDemoWalletEndpoint :: Contract () DemoWalletSchema Text ()
createDemoWalletEndpoint = do
    pkh <- ownPubKeyHash
    let wallet = createDemoWallet pkh
    logInfo @String $ "Created demo wallet for " ++ show pkh ++ " with initial balance of 1 ADA"
    -- In a real implementation, we would submit this to the blockchain
    -- This is simplified for educational purposes
    pure ()

-- | Endpoint to simulate a transfer
simulateTransferEndpoint :: Integer -> PubKeyHash -> BuiltinByteString -> Contract () DemoWalletSchema Text ()
simulateTransferEndpoint amount recipient description = do
    logInfo @String $ "Simulating transfer of " ++ show amount ++ " lovelace to " ++ show recipient
    -- In a real implementation, we would submit this to the blockchain
    -- This is simplified for educational purposes
    pure ()

-- | Endpoint to view transaction history
viewTransactionHistoryEndpoint :: Contract () DemoWalletSchema Text ()
viewTransactionHistoryEndpoint = do
    logInfo @String "Viewing transaction history"
    -- In a real implementation, we would query the blockchain
    -- This is simplified for educational purposes
    pure ()

-- | Endpoint to reset the wallet
resetWalletEndpoint :: Contract () DemoWalletSchema Text ()
resetWalletEndpoint = do
    logInfo @String "Resetting wallet to initial state"
    -- In a real implementation, we would submit this to the blockchain
    -- This is simplified for educational purposes
    pure ()

-- | Schema for the demo wallet endpoints
type DemoWalletSchema =
    Endpoint "createDemoWallet" ()
    .\/ Endpoint "simulateTransfer" (Integer, PubKeyHash, BuiltinByteString)
    .\/ Endpoint "viewTransactionHistory" ()
    .\/ Endpoint "resetWallet" ()

-- | The demo wallet contract
demoWalletContract :: Contract () DemoWalletSchema Text ()
demoWalletContract = selectList
    [ endpoint @"createDemoWallet" $ \_ -> createDemoWalletEndpoint
    , endpoint @"simulateTransfer" $ \(amount, recipient, description) -> 
        simulateTransferEndpoint amount recipient description
    , endpoint @"viewTransactionHistory" $ \_ -> viewTransactionHistoryEndpoint
    , endpoint @"resetWallet" $ \_ -> resetWalletEndpoint
    ]
