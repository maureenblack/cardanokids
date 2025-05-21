{-# LANGUAGE DataKinds           #-}
{-# LANGUAGE FlexibleContexts    #-}
{-# LANGUAGE NoImplicitPrelude   #-}
{-# LANGUAGE ScopedTypeVariables #-}
{-# LANGUAGE TemplateHaskell     #-}
{-# LANGUAGE TypeApplications    #-}
{-# LANGUAGE TypeFamilies        #-}
{-# LANGUAGE TypeOperators       #-}

{-|
Module      : ContentAccess
Description : Content access management for Cardano Kids
Copyright   : (c) Cardano Kids, 2025
License     : MIT
Maintainer  : dev@cardanokids.com

This module implements a content access contract that manages progressive
unlocking of educational materials based on student achievements and progress
within the Cardano Kids platform.
-}

module ContentAccess where

import           PlutusTx.Prelude
import qualified PlutusTx
import           Plutus.V2.Ledger.Api
import           Plutus.V2.Ledger.Contexts
import qualified Ledger.Typed.Scripts      as Scripts
import           Ledger.Value              (assetClassValue)
import           Ledger.Ada                (lovelaceValueOf)
import           Playground.Contract

-- | Content difficulty level
data ContentLevel = 
      Level1  -- ^ Beginner content (ages 6-8)
    | Level2  -- ^ Intermediate content (ages 9-11)
    | Level3  -- ^ Advanced content (ages 12-14)
    deriving (Eq)

-- | Content type
data ContentType =
      Lesson       -- ^ Educational lesson
    | Activity     -- ^ Interactive activity
    | Quiz         -- ^ Knowledge assessment
    | Game         -- ^ Educational game
    | Certificate  -- ^ Achievement certificate
    deriving (Eq)

-- | Access requirement type
data RequirementType =
      BadgeRequired Integer                -- ^ Specific achievement badge required
    | ModuleCompleted BuiltinByteString    -- ^ Previous module must be completed
    | ProgressRequired BuiltinByteString Integer -- ^ Minimum progress in a module required
    | AgeGroupRequired AgeGroup            -- ^ Specific age group required
    | NoRequirement                        -- ^ No prerequisites
    deriving (Eq)

-- | Age group for content targeting
data AgeGroup = 
      Young      -- ^ Ages 6-8
    | Middle     -- ^ Ages 9-11
    | Older      -- ^ Ages 12-14
    deriving (Eq)

-- | Data type representing educational content
data EducationalContent = EducationalContent
    { contentId          :: !BuiltinByteString   -- ^ Unique identifier for the content
    , contentName        :: !BuiltinByteString   -- ^ Name of the content
    , contentDescription :: !BuiltinByteString   -- ^ Description of the content
    , contentType        :: !ContentType         -- ^ Type of content
    , contentLevel       :: !ContentLevel        -- ^ Difficulty level
    , targetAgeGroups    :: ![AgeGroup]          -- ^ Target age groups
    , contentIPFS        :: !BuiltinByteString   -- ^ IPFS hash of the content
    , metadataIPFS       :: !BuiltinByteString   -- ^ IPFS hash of additional metadata
    , accessRequirements :: ![RequirementType]   -- ^ Requirements to access this content
    , moduleId           :: !BuiltinByteString   -- ^ Which learning module this content belongs to
    , contentOrder       :: !Integer             -- ^ Order within the module (for sequential learning)
    , creationDate       :: !POSIXTime           -- ^ When the content was created
    , lastUpdated        :: !POSIXTime           -- ^ When the content was last updated
    , creator            :: !PubKeyHash          -- ^ Who created the content
    }

-- | Data type representing a user's access rights
data UserAccess = UserAccess
    { userPkh           :: !PubKeyHash           -- ^ User's public key hash
    , accessibleContent :: ![BuiltinByteString]  -- ^ Content IDs the user can access
    , completedContent  :: ![BuiltinByteString]  -- ^ Content IDs the user has completed
    , moduleProgress    :: ![(BuiltinByteString, Integer)] -- ^ Progress in modules (module ID, progress percentage)
    , earnedBadges      :: ![Integer]            -- ^ Achievement badges earned
    , userAgeGroup      :: !AgeGroup             -- ^ User's age group
    , lastAccessTime    :: !POSIXTime            -- ^ When the user last accessed content
    }

-- | Data type for content access actions
data ContentAction = 
      RegisterContent EducationalContent                   -- ^ Register new educational content
      | UpdateContent BuiltinByteString EducationalContent -- ^ Update existing content
      | GrantAccess PubKeyHash BuiltinByteString           -- ^ Grant a user access to content
      | RevokeAccess PubKeyHash BuiltinByteString          -- ^ Revoke a user's access to content
      | RecordCompletion PubKeyHash BuiltinByteString      -- ^ Record that a user completed content
      | UpdateProgress PubKeyHash BuiltinByteString Integer -- ^ Update a user's progress in a module
      | CheckAccess PubKeyHash BuiltinByteString           -- ^ Check if a user can access content

PlutusTx.makeIsDataIndexed ''ContentLevel [('Level1, 0), ('Level2, 1), ('Level3, 2)]
PlutusTx.makeIsDataIndexed ''ContentType [('Lesson, 0), ('Activity, 1), ('Quiz, 2), ('Game, 3), ('Certificate, 4)]
PlutusTx.makeIsDataIndexed ''AgeGroup [('Young, 0), ('Middle, 1), ('Older, 2)]
PlutusTx.makeIsDataIndexed ''RequirementType [
    ('BadgeRequired, 0), 
    ('ModuleCompleted, 1), 
    ('ProgressRequired, 2), 
    ('AgeGroupRequired, 3),
    ('NoRequirement, 4)]
PlutusTx.makeIsDataIndexed ''EducationalContent [('EducationalContent, 0)]
PlutusTx.makeIsDataIndexed ''UserAccess [('UserAccess, 0)]
PlutusTx.makeIsDataIndexed ''ContentAction [
    ('RegisterContent, 0), 
    ('UpdateContent, 1), 
    ('GrantAccess, 2), 
    ('RevokeAccess, 3),
    ('RecordCompletion, 4),
    ('UpdateProgress, 5),
    ('CheckAccess, 6)]

{-# INLINABLE mkContentAccessValidator #-}
-- | The validator script for content access management
mkContentAccessValidator :: PubKeyHash -> ContentAction -> ScriptContext -> Bool
mkContentAccessValidator platformPkh action ctx = 
    case action of
        -- Register new educational content
        RegisterContent content ->
            -- Only authorized content creators can register content
            traceIfFalse "Not authorized to register content" 
                (txSignedBy info (creator content) || txSignedBy info platformPkh) &&
            -- Ensure content ID is unique (simplified for educational purposes)
            traceIfFalse "Content ID already exists" True &&
            -- Ensure content has valid data
            traceIfFalse "Invalid content data" (validateContentData content)
            
        -- Update existing content
        UpdateContent contentId updatedContent ->
            -- Only the content creator or platform can update
            traceIfFalse "Not authorized to update content" 
                (txSignedBy info (creator updatedContent) || txSignedBy info platformPkh) &&
            -- Ensure content exists (simplified for educational purposes)
            traceIfFalse "Content does not exist" True &&
            -- Ensure content has valid data
            traceIfFalse "Invalid content data" (validateContentData updatedContent)
            
        -- Grant a user access to content
        GrantAccess userPkh contentId ->
            -- Only the platform can grant access
            traceIfFalse "Not authorized to grant access" (txSignedBy info platformPkh) &&
            -- Ensure content exists (simplified for educational purposes)
            traceIfFalse "Content does not exist" True
            
        -- Revoke a user's access to content
        RevokeAccess userPkh contentId ->
            -- Only the platform can revoke access
            traceIfFalse "Not authorized to revoke access" (txSignedBy info platformPkh) &&
            -- Ensure content exists (simplified for educational purposes)
            traceIfFalse "Content does not exist" True
            
        -- Record that a user completed content
        RecordCompletion userPkh contentId ->
            -- Only the user or platform can record completion
            traceIfFalse "Not authorized to record completion" 
                (txSignedBy info userPkh || txSignedBy info platformPkh) &&
            -- Ensure content exists (simplified for educational purposes)
            traceIfFalse "Content does not exist" True &&
            -- Ensure user has access to the content
            traceIfFalse "User does not have access to this content" 
                (userHasAccess userPkh contentId)
                
        -- Update a user's progress in a module
        UpdateProgress userPkh moduleId progress ->
            -- Only the user or platform can update progress
            traceIfFalse "Not authorized to update progress" 
                (txSignedBy info userPkh || txSignedBy info platformPkh) &&
            -- Ensure module exists (simplified for educational purposes)
            traceIfFalse "Module does not exist" True &&
            -- Ensure progress is valid (0-100%)
            traceIfFalse "Invalid progress value" (progress >= 0 && progress <= 100)
            
        -- Check if a user can access content
        CheckAccess userPkh contentId ->
            -- Anyone can check access (read-only operation)
            True
  where
    info :: TxInfo
    info = scriptContextTxInfo ctx
    
    -- Check if a user has access to content (simplified for educational purposes)
    userHasAccess :: PubKeyHash -> BuiltinByteString -> Bool
    userHasAccess _ _ = True  -- In a real implementation, we would check the user's access rights

-- | Validate content data
{-# INLINABLE validateContentData #-}
validateContentData :: EducationalContent -> Bool
validateContentData content =
    -- Ensure content name is not empty
    lengthOfByteString (contentName content) > 0 &&
    -- Ensure content description is not empty
    lengthOfByteString (contentDescription content) > 0 &&
    -- Ensure content IPFS hash is valid
    lengthOfByteString (contentIPFS content) > 0 &&
    -- Ensure metadata IPFS hash is valid
    lengthOfByteString (metadataIPFS content) > 0 &&
    -- Ensure content has at least one target age group
    not (null (targetAgeGroups content)) &&
    -- Ensure content order is valid
    contentOrder content >= 0

-- | The content access type
data ContentAccessType
instance Scripts.ValidatorTypes ContentAccessType where
    type instance DatumType ContentAccessType = EducationalContent
    type instance RedeemerType ContentAccessType = ContentAction

-- | The typed validator script
typedContentAccessValidator :: PubKeyHash -> Scripts.TypedValidator ContentAccessType
typedContentAccessValidator platformPkh = Scripts.mkTypedValidator @ContentAccessType
    ($$(PlutusTx.compile [|| mkContentAccessValidator ||]) `PlutusTx.applyCode` PlutusTx.liftCode platformPkh)
    $$(PlutusTx.compile [|| wrap ||])
  where
    wrap = Scripts.wrapValidator @EducationalContent @ContentAction

-- | The validator script
contentAccessValidator :: PubKeyHash -> Validator
contentAccessValidator platformPkh = Scripts.validatorScript (typedContentAccessValidator platformPkh)

-- | The address of the content access contract
contentAccessAddress :: PubKeyHash -> Address
contentAccessAddress platformPkh = scriptAddress (contentAccessValidator platformPkh)

-- | Create new educational content
createEducationalContent :: BuiltinByteString -> BuiltinByteString -> BuiltinByteString -> ContentType -> ContentLevel -> [AgeGroup] -> BuiltinByteString -> BuiltinByteString -> [RequirementType] -> BuiltinByteString -> Integer -> POSIXTime -> PubKeyHash -> EducationalContent
createEducationalContent id name description cType level ageGroups contentIpfs metadataIpfs requirements moduleId order currentTime creator =
    EducationalContent
        { contentId = id
        , contentName = name
        , contentDescription = description
        , contentType = cType
        , contentLevel = level
        , targetAgeGroups = ageGroups
        , contentIPFS = contentIpfs
        , metadataIPFS = metadataIpfs
        , accessRequirements = requirements
        , moduleId = moduleId
        , contentOrder = order
        , creationDate = currentTime
        , lastUpdated = currentTime
        , creator = creator
        }

-- | Create a new user access record
createUserAccess :: PubKeyHash -> AgeGroup -> POSIXTime -> UserAccess
createUserAccess pkh ageGroup currentTime =
    UserAccess
        { userPkh = pkh
        , accessibleContent = []
        , completedContent = []
        , moduleProgress = []
        , earnedBadges = []
        , userAgeGroup = ageGroup
        , lastAccessTime = currentTime
        }

-- | Check if a user meets the requirements for content
checkRequirements :: UserAccess -> EducationalContent -> Bool
checkRequirements userAccess content =
    -- Check each requirement
    all (meetsSingleRequirement userAccess) (accessRequirements content) &&
    -- Check age group compatibility
    any (\ag -> ag == userAgeGroup userAccess) (targetAgeGroups content)

-- | Check if a user meets a single requirement
meetsSingleRequirement :: UserAccess -> RequirementType -> Bool
meetsSingleRequirement userAccess requirement =
    case requirement of
        -- Check if user has the required badge
        BadgeRequired badgeId ->
            badgeId `elem` earnedBadges userAccess
            
        -- Check if user has completed the required module
        ModuleCompleted moduleId ->
            any (\contentId -> contentId `elem` completedContent userAccess) 
                [moduleId] -- In a real implementation, we would look up all content IDs in the module
                
        -- Check if user has the required progress in a module
        ProgressRequired moduleId minProgress ->
            case find (\(mid, _) -> mid == moduleId) (moduleProgress userAccess) of
                Just (_, progress) -> progress >= minProgress
                Nothing -> False
                
        -- Check if user is in the required age group
        AgeGroupRequired requiredAgeGroup ->
            userAgeGroup userAccess == requiredAgeGroup
            
        -- No requirements
        NoRequirement ->
            True

-- | Endpoint to register new content
registerContentEndpoint :: EducationalContent -> Contract () ContentAccessSchema Text ()
registerContentEndpoint content = do
    logInfo @String $ "Registering new content: " ++ show (contentName content)
    -- In a real implementation, we would submit this to the blockchain
    -- This is simplified for educational purposes
    pure ()

-- | Endpoint to grant access to content
grantAccessEndpoint :: PubKeyHash -> BuiltinByteString -> Contract () ContentAccessSchema Text ()
grantAccessEndpoint userPkh contentId = do
    logInfo @String $ "Granting access to content " ++ show contentId ++ " for user " ++ show userPkh
    -- In a real implementation, we would submit this to the blockchain
    -- This is simplified for educational purposes
    pure ()

-- | Endpoint to record content completion
recordCompletionEndpoint :: BuiltinByteString -> Contract () ContentAccessSchema Text ()
recordCompletionEndpoint contentId = do
    pkh <- ownPubKeyHash
    logInfo @String $ "Recording completion of content " ++ show contentId ++ " for user " ++ show pkh
    -- In a real implementation, we would submit this to the blockchain
    -- This is simplified for educational purposes
    pure ()

-- | Endpoint to check access to content
checkAccessEndpoint :: BuiltinByteString -> Contract () ContentAccessSchema Text ()
checkAccessEndpoint contentId = do
    pkh <- ownPubKeyHash
    logInfo @String $ "Checking access to content " ++ show contentId ++ " for user " ++ show pkh
    -- In a real implementation, we would query the blockchain
    -- This is simplified for educational purposes
    pure ()

-- | Helper function to get current time
currentTime :: Contract w s e POSIXTime
currentTime = do
    -- In a real implementation, we would get the current time from the blockchain
    -- For educational purposes, we'll use a placeholder
    pure 1000000

-- | Schema for the content access endpoints
type ContentAccessSchema =
    Endpoint "registerContent" EducationalContent
    .\/ Endpoint "grantAccess" (PubKeyHash, BuiltinByteString)
    .\/ Endpoint "recordCompletion" BuiltinByteString
    .\/ Endpoint "checkAccess" BuiltinByteString

-- | The content access contract
contentAccessContract :: Contract () ContentAccessSchema Text ()
contentAccessContract = selectList
    [ endpoint @"registerContent" registerContentEndpoint
    , endpoint @"grantAccess" $ \(userPkh, contentId) -> grantAccessEndpoint userPkh contentId
    , endpoint @"recordCompletion" recordCompletionEndpoint
    , endpoint @"checkAccess" checkAccessEndpoint
    ]
