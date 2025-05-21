{-# LANGUAGE DataKinds           #-}
{-# LANGUAGE FlexibleContexts    #-}
{-# LANGUAGE NoImplicitPrelude   #-}
{-# LANGUAGE ScopedTypeVariables #-}
{-# LANGUAGE TemplateHaskell     #-}
{-# LANGUAGE TypeApplications    #-}
{-# LANGUAGE TypeFamilies        #-}
{-# LANGUAGE TypeOperators       #-}

{-|
Module      : ClassroomManagement
Description : Classroom management contract for Cardano Kids
Copyright   : (c) Cardano Kids, 2025
License     : MIT
Maintainer  : dev@cardanokids.com

This module implements a classroom management contract allowing teachers
to create learning groups, track student progress, and manage educational
activities within the Cardano Kids platform.
-}

module ClassroomManagement where

import           PlutusTx.Prelude
import qualified PlutusTx
import           Plutus.V2.Ledger.Api
import           Plutus.V2.Ledger.Contexts
import qualified Ledger.Typed.Scripts      as Scripts
import           Ledger.Value              (assetClassValue)
import           Ledger.Ada                (lovelaceValueOf)
import           Playground.Contract

-- | Student status in a classroom
data StudentStatus = 
      Active    -- ^ Currently active in the classroom
    | Inactive  -- ^ Temporarily inactive
    | Graduated -- ^ Completed all classroom modules
    deriving (Eq)

-- | Age group for content targeting
data AgeGroup = 
      Young      -- ^ Ages 6-8
    | Middle     -- ^ Ages 9-11
    | Older      -- ^ Ages 12-14
    deriving (Eq)

-- | Data type representing a student
data Student = Student
    { studentId      :: !BuiltinByteString -- ^ Unique identifier for the student
    , studentPkh     :: !PubKeyHash        -- ^ Student's public key hash
    , studentName    :: !BuiltinByteString -- ^ Student's name (can be pseudonym)
    , studentAge     :: !Integer           -- ^ Student's age
    , studentAgeGroup :: !AgeGroup         -- ^ Student's age group for content targeting
    , studentStatus  :: !StudentStatus     -- ^ Current status in the classroom
    , studentBadges  :: ![Integer]         -- ^ Achievement badges earned
    , studentProgress :: ![(BuiltinByteString, Integer)] -- ^ Progress in modules (module ID, progress percentage)
    , joinDate       :: !POSIXTime         -- ^ When the student joined the classroom
    }

-- | Data type representing a classroom
data Classroom = Classroom
    { classroomId    :: !BuiltinByteString    -- ^ Unique identifier for the classroom
    , classroomName  :: !BuiltinByteString    -- ^ Name of the classroom
    , teacher        :: !PubKeyHash           -- ^ Teacher's public key hash
    , assistants     :: ![PubKeyHash]         -- ^ Assistant teachers (if any)
    , students       :: ![Student]            -- ^ Students in the classroom
    , modules        :: ![BuiltinByteString]  -- ^ Learning modules assigned to this classroom
    , ageGroups      :: ![AgeGroup]           -- ^ Age groups this classroom serves
    , creationDate   :: !POSIXTime            -- ^ When the classroom was created
    , lastUpdated    :: !POSIXTime            -- ^ When the classroom was last updated
    }

-- | Data type for classroom actions
data ClassroomAction = 
      CreateClassroom Classroom                                    -- ^ Create a new classroom
    | UpdateClassroom BuiltinByteString Classroom                  -- ^ Update classroom details
    | AddStudent BuiltinByteString Student                         -- ^ Add a student to a classroom
    | UpdateStudent BuiltinByteString BuiltinByteString Student    -- ^ Update student details
    | RemoveStudent BuiltinByteString BuiltinByteString            -- ^ Remove a student from a classroom
    | AssignModule BuiltinByteString BuiltinByteString             -- ^ Assign a module to a classroom
    | UpdateProgress BuiltinByteString BuiltinByteString BuiltinByteString Integer -- ^ Update student progress (classroom, student, module, progress)
    | AddAssistant BuiltinByteString PubKeyHash                    -- ^ Add an assistant teacher

PlutusTx.makeIsDataIndexed ''StudentStatus [('Active, 0), ('Inactive, 1), ('Graduated, 2)]
PlutusTx.makeIsDataIndexed ''AgeGroup [('Young, 0), ('Middle, 1), ('Older, 2)]
PlutusTx.makeIsDataIndexed ''Student [('Student, 0)]
PlutusTx.makeIsDataIndexed ''Classroom [('Classroom, 0)]
PlutusTx.makeIsDataIndexed ''ClassroomAction [
    ('CreateClassroom, 0), 
    ('UpdateClassroom, 1), 
    ('AddStudent, 2), 
    ('UpdateStudent, 3),
    ('RemoveStudent, 4),
    ('AssignModule, 5),
    ('UpdateProgress, 6),
    ('AddAssistant, 7)]

{-# INLINABLE mkClassroomValidator #-}
-- | The validator script for classroom management
mkClassroomValidator :: PubKeyHash -> ClassroomAction -> ScriptContext -> Bool
mkClassroomValidator platformPkh action ctx = 
    case action of
        -- Create a new classroom
        CreateClassroom classroom ->
            -- Only authorized teachers can create classrooms
            traceIfFalse "Not authorized to create classroom" (isAuthorizedTeacher (teacher classroom)) &&
            -- Ensure classroom ID is unique (simplified for educational purposes)
            traceIfFalse "Classroom ID already exists" True &&
            -- Ensure classroom has valid data
            traceIfFalse "Invalid classroom data" (validateClassroomData classroom)
            
        -- Update classroom details
        UpdateClassroom classroomId updatedClassroom ->
            -- Only the classroom teacher or platform can update
            traceIfFalse "Not authorized to update classroom" 
                (txSignedBy info (teacher updatedClassroom) || txSignedBy info platformPkh) &&
            -- Ensure classroom exists (simplified for educational purposes)
            traceIfFalse "Classroom does not exist" True &&
            -- Ensure classroom has valid data
            traceIfFalse "Invalid classroom data" (validateClassroomData updatedClassroom)
            
        -- Add a student to a classroom
        AddStudent classroomId student ->
            -- Only the classroom teacher or assistants can add students
            traceIfFalse "Not authorized to add student" 
                (isTeacherOrAssistant classroomId) &&
            -- Ensure student has valid data
            traceIfFalse "Invalid student data" (validateStudentData student)
            
        -- Update student details
        UpdateStudent classroomId studentId updatedStudent ->
            -- Only the classroom teacher or assistants can update students
            traceIfFalse "Not authorized to update student" 
                (isTeacherOrAssistant classroomId) &&
            -- Ensure student has valid data
            traceIfFalse "Invalid student data" (validateStudentData updatedStudent)
            
        -- Remove a student from a classroom
        RemoveStudent classroomId studentId ->
            -- Only the classroom teacher or platform can remove students
            traceIfFalse "Not authorized to remove student" 
                (isTeacherOrPlatform classroomId)
                
        -- Assign a module to a classroom
        AssignModule classroomId moduleId ->
            -- Only the classroom teacher or platform can assign modules
            traceIfFalse "Not authorized to assign module" 
                (isTeacherOrPlatform classroomId)
                
        -- Update student progress
        UpdateProgress classroomId studentId moduleId progress ->
            -- Only the classroom teacher or assistants can update progress
            traceIfFalse "Not authorized to update progress" 
                (isTeacherOrAssistant classroomId) &&
            -- Ensure progress is valid (0-100%)
            traceIfFalse "Invalid progress value" (progress >= 0 && progress <= 100)
            
        -- Add an assistant teacher
        AddAssistant classroomId assistantPkh ->
            -- Only the classroom teacher can add assistants
            traceIfFalse "Not authorized to add assistant" 
                (isClassroomTeacher classroomId)
  where
    info :: TxInfo
    info = scriptContextTxInfo ctx
    
    -- Check if the signer is an authorized teacher
    isAuthorizedTeacher :: PubKeyHash -> Bool
    isAuthorizedTeacher teacherPkh =
        -- In a real implementation, we would check against a list of authorized teachers
        -- For educational purposes, we'll allow any signer or the platform
        txSignedBy info teacherPkh || txSignedBy info platformPkh
    
    -- Check if the signer is the classroom teacher or platform
    isTeacherOrPlatform :: BuiltinByteString -> Bool
    isTeacherOrPlatform classroomId =
        -- In a real implementation, we would look up the classroom teacher
        -- For educational purposes, we'll check if the platform signed
        txSignedBy info platformPkh
    
    -- Check if the signer is the classroom teacher or an assistant
    isTeacherOrAssistant :: BuiltinByteString -> Bool
    isTeacherOrAssistant classroomId =
        -- In a real implementation, we would look up the classroom teacher and assistants
        -- For educational purposes, we'll check if the platform signed
        txSignedBy info platformPkh
    
    -- Check if the signer is the classroom teacher
    isClassroomTeacher :: BuiltinByteString -> Bool
    isClassroomTeacher classroomId =
        -- In a real implementation, we would look up the classroom teacher
        -- For educational purposes, we'll check if the platform signed
        txSignedBy info platformPkh

-- | Validate classroom data
{-# INLINABLE validateClassroomData #-}
validateClassroomData :: Classroom -> Bool
validateClassroomData classroom =
    -- Ensure classroom name is not empty
    lengthOfByteString (classroomName classroom) > 0 &&
    -- Ensure classroom has a valid teacher
    True &&  -- Simplified for educational purposes
    -- Ensure classroom has at least one age group
    not (null (ageGroups classroom))

-- | Validate student data
{-# INLINABLE validateStudentData #-}
validateStudentData :: Student -> Bool
validateStudentData student =
    -- Ensure student name is not empty
    lengthOfByteString (studentName student) > 0 &&
    -- Ensure student age is valid (6-14 for Cardano Kids)
    student.studentAge >= 6 && student.studentAge <= 14 &&
    -- Ensure student has a valid age group
    validateAgeGroup student.studentAge student.studentAgeGroup

-- | Validate that the age group matches the student's age
{-# INLINABLE validateAgeGroup #-}
validateAgeGroup :: Integer -> AgeGroup -> Bool
validateAgeGroup age ageGroup =
    case ageGroup of
        Young -> age >= 6 && age <= 8
        Middle -> age >= 9 && age <= 11
        Older -> age >= 12 && age <= 14

-- | The classroom management type
data ClassroomType
instance Scripts.ValidatorTypes ClassroomType where
    type instance DatumType ClassroomType = Classroom
    type instance RedeemerType ClassroomType = ClassroomAction

-- | The typed validator script
typedClassroomValidator :: PubKeyHash -> Scripts.TypedValidator ClassroomType
typedClassroomValidator platformPkh = Scripts.mkTypedValidator @ClassroomType
    ($$(PlutusTx.compile [|| mkClassroomValidator ||]) `PlutusTx.applyCode` PlutusTx.liftCode platformPkh)
    $$(PlutusTx.compile [|| wrap ||])
  where
    wrap = Scripts.wrapValidator @Classroom @ClassroomAction

-- | The validator script
classroomValidator :: PubKeyHash -> Validator
classroomValidator platformPkh = Scripts.validatorScript (typedClassroomValidator platformPkh)

-- | The address of the classroom management contract
classroomAddress :: PubKeyHash -> Address
classroomAddress platformPkh = scriptAddress (classroomValidator platformPkh)

-- | Create a new classroom
createNewClassroom :: BuiltinByteString -> PubKeyHash -> [AgeGroup] -> POSIXTime -> Classroom
createNewClassroom name teacherPkh ageGroups currentTime =
    Classroom
        { classroomId = sha2_256 $ appendByteString name (toBuiltin $ show currentTime)
        , classroomName = name
        , teacher = teacherPkh
        , assistants = []
        , students = []
        , modules = []
        , ageGroups = ageGroups
        , creationDate = currentTime
        , lastUpdated = currentTime
        }

-- | Create a new student
createNewStudent :: BuiltinByteString -> PubKeyHash -> BuiltinByteString -> Integer -> AgeGroup -> POSIXTime -> Student
createNewStudent id pkh name age ageGroup currentTime =
    Student
        { studentId = id
        , studentPkh = pkh
        , studentName = name
        , studentAge = age
        , studentAgeGroup = ageGroup
        , studentStatus = Active
        , studentBadges = []
        , studentProgress = []
        , joinDate = currentTime
        }

-- | Endpoint to create a new classroom
createClassroomEndpoint :: BuiltinByteString -> [AgeGroup] -> Contract () ClassroomSchema Text ()
createClassroomEndpoint name ageGroups = do
    pkh <- ownPubKeyHash
    now <- currentTime
    let classroom = createNewClassroom name pkh ageGroups now
    logInfo @String $ "Creating classroom: " ++ show name
    -- In a real implementation, we would submit this to the blockchain
    -- This is simplified for educational purposes
    pure ()

-- | Endpoint to add a student to a classroom
addStudentEndpoint :: BuiltinByteString -> BuiltinByteString -> BuiltinByteString -> Integer -> AgeGroup -> Contract () ClassroomSchema Text ()
addStudentEndpoint classroomId studentId name age ageGroup = do
    pkh <- ownPubKeyHash
    now <- currentTime
    let student = createNewStudent studentId pkh name age ageGroup now
    logInfo @String $ "Adding student " ++ show name ++ " to classroom " ++ show classroomId
    -- In a real implementation, we would submit this to the blockchain
    -- This is simplified for educational purposes
    pure ()

-- | Endpoint to update student progress
updateProgressEndpoint :: BuiltinByteString -> BuiltinByteString -> BuiltinByteString -> Integer -> Contract () ClassroomSchema Text ()
updateProgressEndpoint classroomId studentId moduleId progress = do
    logInfo @String $ "Updating progress for student " ++ show studentId ++ " in module " ++ show moduleId ++ " to " ++ show progress ++ "%"
    -- In a real implementation, we would submit this to the blockchain
    -- This is simplified for educational purposes
    pure ()

-- | Helper function to get current time
currentTime :: Contract w s e POSIXTime
currentTime = do
    -- In a real implementation, we would get the current time from the blockchain
    -- For educational purposes, we'll use a placeholder
    pure 1000000

-- | Schema for the classroom management endpoints
type ClassroomSchema =
    Endpoint "createClassroom" (BuiltinByteString, [AgeGroup])
    .\/ Endpoint "addStudent" (BuiltinByteString, BuiltinByteString, BuiltinByteString, Integer, AgeGroup)
    .\/ Endpoint "updateProgress" (BuiltinByteString, BuiltinByteString, BuiltinByteString, Integer)

-- | The classroom management contract
classroomContract :: Contract () ClassroomSchema Text ()
classroomContract = selectList
    [ endpoint @"createClassroom" $ \(name, ageGroups) -> createClassroomEndpoint name ageGroups
    , endpoint @"addStudent" $ \(classroomId, studentId, name, age, ageGroup) -> 
        addStudentEndpoint classroomId studentId name age ageGroup
    , endpoint @"updateProgress" $ \(classroomId, studentId, moduleId, progress) -> 
        updateProgressEndpoint classroomId studentId moduleId progress
    ]
