{-# LANGUAGE DataKinds           #-}
{-# LANGUAGE FlexibleContexts    #-}
{-# LANGUAGE NoImplicitPrelude   #-}
{-# LANGUAGE ScopedTypeVariables #-}
{-# LANGUAGE TemplateHaskell     #-}
{-# LANGUAGE TypeApplications    #-}
{-# LANGUAGE TypeFamilies        #-}
{-# LANGUAGE TypeOperators       #-}

{-|
Module      : AchievementNFT
Description : Achievement NFT contract for learning milestones
Copyright   : (c) Cardano Kids, 2025
License     : MIT
Maintainer  : dev@cardanokids.com

This module implements an NFT contract that issues achievement badges
for learning milestones. Each badge represents a completed learning module
or achievement within the Cardano Kids educational platform.
-}

module AchievementNFT where

import           PlutusTx.Prelude
import qualified PlutusTx
import           Plutus.V2.Ledger.Api
import           Plutus.V2.Ledger.Contexts
import qualified Ledger.Typed.Scripts      as Scripts
import           Ledger.Value              (assetClassValue, assetClassValueOf)
import qualified Ledger.Value              as Value
import           Ledger.Ada                (lovelaceValueOf)
import           Playground.Contract

-- | Achievement levels
data AchievementLevel = 
      Beginner      -- ^ Basic level achievements
    | Intermediate  -- ^ Mid-level achievements
    | Advanced      -- ^ Advanced level achievements
    | Expert        -- ^ Expert level achievements
    deriving (Eq)

-- | Achievement categories
data AchievementCategory =
      BlockchainBasics     -- ^ Understanding blockchain fundamentals
    | CardanoEcosystem     -- ^ Knowledge about Cardano
    | SmartContracts       -- ^ Smart contract concepts
    | TokensAndAssets      -- ^ Understanding of tokens and assets
    | CommunityAndGovernance -- ^ Participation in governance
    deriving (Eq)

-- | Data type representing an achievement badge NFT
data AchievementBadge = AchievementBadge
    { badgeId          :: !Integer             -- ^ Unique identifier for the badge
    , badgeName        :: !BuiltinByteString   -- ^ Name of the achievement
    , badgeDescription :: !BuiltinByteString   -- ^ Description of the achievement
    , badgeLevel       :: !AchievementLevel    -- ^ Level of the achievement
    , badgeCategory    :: !AchievementCategory -- ^ Category of the achievement
    , badgeImageIPFS   :: !BuiltinByteString   -- ^ IPFS hash of the badge image
    , badgeMetadataIPFS :: !BuiltinByteString  -- ^ IPFS hash of additional metadata
    , issueDate        :: !POSIXTime           -- ^ When the badge was issued
    , recipient        :: !PubKeyHash          -- ^ Who earned the achievement
    , issuer           :: !PubKeyHash          -- ^ Authority that issued the badge (Cardano Kids platform)
    }

-- | Data type for badge actions
data AchievementAction = 
      MintBadge AchievementBadge  -- ^ Mint a new achievement badge
    | TransferBadge PubKeyHash    -- ^ Transfer a badge to another user (e.g., for display purposes)
    | RevokeBadge BuiltinByteString -- ^ Revoke a badge with reason (rare, used for administrative purposes)

PlutusTx.makeIsDataIndexed ''AchievementLevel [('Beginner, 0), ('Intermediate, 1), ('Advanced, 2), ('Expert, 3)]
PlutusTx.makeIsDataIndexed ''AchievementCategory [
    ('BlockchainBasics, 0), 
    ('CardanoEcosystem, 1), 
    ('SmartContracts, 2), 
    ('TokensAndAssets, 3),
    ('CommunityAndGovernance, 4)]
PlutusTx.makeIsDataIndexed ''AchievementBadge [('AchievementBadge, 0)]
PlutusTx.makeIsDataIndexed ''AchievementAction [('MintBadge, 0), ('TransferBadge, 1), ('RevokeBadge, 2)]

-- | Policy for achievement NFTs
{-# INLINABLE mkAchievementPolicy #-}
mkAchievementPolicy :: PubKeyHash -> AchievementAction -> ScriptContext -> Bool
mkAchievementPolicy platformPkh action ctx =
    case action of
        -- Mint a new achievement badge
        MintBadge badge ->
            -- Only the platform can mint badges
            traceIfFalse "Not signed by platform" (txSignedBy info platformPkh) &&
            -- Ensure the badge ID is unique
            traceIfFalse "Badge ID already exists" (validateUniqueBadgeId (badgeId badge)) &&
            -- Ensure the badge has valid metadata
            traceIfFalse "Invalid badge metadata" (validateBadgeMetadata badge) &&
            -- Ensure only one token is minted
            traceIfFalse "Must mint exactly one token" (validateSingleMint info (badgeId badge))
            
        -- Transfer a badge to another user
        TransferBadge newOwner ->
            -- The current owner must sign the transaction
            traceIfFalse "Not signed by current owner" (txSignedBy info (findCurrentOwner info)) &&
            -- Ensure the badge is properly transferred
            traceIfFalse "Invalid transfer" (validateTransfer info newOwner)
            
        -- Revoke a badge (administrative function)
        RevokeBadge reason ->
            -- Only the platform can revoke badges
            traceIfFalse "Not signed by platform" (txSignedBy info platformPkh) &&
            -- Ensure a valid reason is provided
            traceIfFalse "Revocation reason required" (lengthOfByteString reason > 0) &&
            -- Ensure the badge is properly burned
            traceIfFalse "Badge not properly burned" (validateBurn info)
  where
    info :: TxInfo
    info = scriptContextTxInfo ctx

-- | Validate that the badge ID is unique (simplified for educational purposes)
{-# INLINABLE validateUniqueBadgeId #-}
validateUniqueBadgeId :: Integer -> Bool
validateUniqueBadgeId _ = True  -- In a real implementation, we would check against existing badge IDs

-- | Validate badge metadata
{-# INLINABLE validateBadgeMetadata #-}
validateBadgeMetadata :: AchievementBadge -> Bool
validateBadgeMetadata badge =
    -- Ensure name is not empty
    lengthOfByteString (badgeName badge) > 0 &&
    -- Ensure description is not empty
    lengthOfByteString (badgeDescription badge) > 0 &&
    -- Ensure image IPFS hash is valid
    lengthOfByteString (badgeImageIPFS badge) > 0 &&
    -- Ensure metadata IPFS hash is valid
    lengthOfByteString (badgeMetadataIPFS badge) > 0

-- | Validate that exactly one token is minted
{-# INLINABLE validateSingleMint #-}
validateSingleMint :: TxInfo -> Integer -> Bool
validateSingleMint info badgeId =
    let 
        -- Create the token name from the badge ID
        tokenName = Value.TokenName $ toBuiltin $ consByteString (fromInteger badgeId) emptyByteString
        -- Get the currency symbol from the policy
        cs = ownCurrencySymbol ctx
        -- Check that exactly one token is minted
        mintedAmount = assetClassValueOf (txInfoMint info) (Value.AssetClass (cs, tokenName))
    in
        mintedAmount == 1

-- | Find the current owner of the badge (simplified for educational purposes)
{-# INLINABLE findCurrentOwner #-}
findCurrentOwner :: TxInfo -> PubKeyHash
findCurrentOwner _ = platformPkh  -- In a real implementation, we would look up the current owner

-- | Validate badge transfer
{-# INLINABLE validateTransfer #-}
validateTransfer :: TxInfo -> PubKeyHash -> Bool
validateTransfer _ _ = True  -- In a real implementation, we would validate the transfer

-- | Validate badge burn (revocation)
{-# INLINABLE validateBurn #-}
validateBurn :: TxInfo -> Bool
validateBurn info =
    -- Check that the token is properly burned
    let 
        cs = ownCurrencySymbol ctx
        -- In a real implementation, we would identify the specific token being burned
    in
        True  -- Simplified for educational purposes

-- | The achievement NFT type
data AchievementNFTType
instance Scripts.ValidatorTypes AchievementNFTType where
    type instance DatumType AchievementNFTType = AchievementBadge
    type instance RedeemerType AchievementNFTType = AchievementAction

-- | The typed validator script
typedAchievementValidator :: PubKeyHash -> Scripts.TypedValidator AchievementNFTType
typedAchievementValidator platformPkh = Scripts.mkTypedValidator @AchievementNFTType
    ($$(PlutusTx.compile [|| mkAchievementPolicy ||]) `PlutusTx.applyCode` PlutusTx.liftCode platformPkh)
    $$(PlutusTx.compile [|| wrap ||])
  where
    wrap = Scripts.wrapValidator @AchievementBadge @AchievementAction

-- | The monetary policy script
achievementPolicy :: PubKeyHash -> MintingPolicy
achievementPolicy platformPkh = mkMintingPolicyScript $
    $$(PlutusTx.compile [|| Scripts.wrapMintingPolicy . mkAchievementPolicy ||])
    `PlutusTx.applyCode`
    PlutusTx.liftCode platformPkh

-- | Create a new achievement badge
createAchievementBadge :: Integer -> BuiltinByteString -> BuiltinByteString -> AchievementLevel -> AchievementCategory -> BuiltinByteString -> BuiltinByteString -> POSIXTime -> PubKeyHash -> PubKeyHash -> AchievementBadge
createAchievementBadge id name description level category imageIPFS metadataIPFS date recip iss =
    AchievementBadge
        { badgeId = id
        , badgeName = name
        , badgeDescription = description
        , badgeLevel = level
        , badgeCategory = category
        , badgeImageIPFS = imageIPFS
        , badgeMetadataIPFS = metadataIPFS
        , issueDate = date
        , recipient = recip
        , issuer = iss
        }

-- | Endpoint to mint a new achievement badge
mintAchievementBadgeEndpoint :: AchievementBadge -> Contract () AchievementSchema Text ()
mintAchievementBadgeEndpoint badge = do
    logInfo @String $ "Minting achievement badge: " ++ show (badgeName badge)
    -- In a real implementation, we would submit this to the blockchain
    -- This is simplified for educational purposes
    pure ()

-- | Endpoint to transfer a badge
transferBadgeEndpoint :: Integer -> PubKeyHash -> Contract () AchievementSchema Text ()
transferBadgeEndpoint badgeId newOwner = do
    logInfo @String $ "Transferring badge " ++ show badgeId ++ " to " ++ show newOwner
    -- In a real implementation, we would submit this to the blockchain
    -- This is simplified for educational purposes
    pure ()

-- | Endpoint to revoke a badge
revokeBadgeEndpoint :: Integer -> BuiltinByteString -> Contract () AchievementSchema Text ()
revokeBadgeEndpoint badgeId reason = do
    logInfo @String $ "Revoking badge " ++ show badgeId ++ " with reason: " ++ show reason
    -- In a real implementation, we would submit this to the blockchain
    -- This is simplified for educational purposes
    pure ()

-- | Schema for the achievement NFT endpoints
type AchievementSchema =
    Endpoint "mintAchievementBadge" AchievementBadge
    .\/ Endpoint "transferBadge" (Integer, PubKeyHash)
    .\/ Endpoint "revokeBadge" (Integer, BuiltinByteString)

-- | The achievement NFT contract
achievementContract :: Contract () AchievementSchema Text ()
achievementContract = selectList
    [ endpoint @"mintAchievementBadge" mintAchievementBadgeEndpoint
    , endpoint @"transferBadge" $ \(badgeId, newOwner) -> transferBadgeEndpoint badgeId newOwner
    , endpoint @"revokeBadge" $ \(badgeId, reason) -> revokeBadgeEndpoint badgeId reason
    ]
