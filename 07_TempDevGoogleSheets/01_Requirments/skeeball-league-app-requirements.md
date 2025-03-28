
# Skeeball League Management Application - Planning Document

## 1. Application Overview & Goals

### Purpose
To create a comprehensive league management system for a skeeball league in an arcade/bar setting that automates score tracking, league standings, scheduling, and provides real-time information to players and spectators.

### Core Goals
- Replace manual score tracking with an efficient digital system
- Automate schedule generation and standings calculations
- Provide real-time score updates and player information during games
- Create an intuitive interface for staff to manage league operations
- Display live statistics and standings on monitors during gameplay
- Build a foundation that can scale to include advanced features over time

### League Context
- Small arcade/bar setting with only two skeeball lanes
- Weekly league night format
- Two-person teams playing head-to-head matches
- Four teams (8 players) active at any given time
- Sequential play with teams rotating through until all scheduled matches are complete

### Success Metrics
- Reduction in time spent on administrative tasks
- Increased accuracy in score tracking and standings calculations
- Enhanced player engagement through real-time information access
- Ease of use for staff without requiring extensive training

## 2. User Roles & Requirements

### 2.1 Admin (Owner/Staff)
**Core Requirements:**
- Full administrative access to all system functions
- Step-by-step guidance for managing league events
- Score entry interface with validation
- League and playoff bracket generation
- Player/team management capabilities
- Score verification during off-league play

**Key Tasks:**
- Create and manage seasons, leagues, and tournaments
- Enter and verify scores during gameplay
- Generate and adjust schedules
- Manage player registrations and team formations
- Assign teams to lanes for each round
- Track which teams are up next to play

### 2.2 Players
**Core Requirements:**
- Access to personal and team statistics
- Live score updates during gameplay
- Visibility into standings and rankings
- Information about upcoming matches and schedules

**Key Tasks:**
- View personal scores and team standings
- Track progress throughout the season
- See live updates during matches
- Submit scores (with staff verification)

### 2.3 Spectators
**Core Requirements:**
- Access to live score displays
- View of current matches and player information
- League standings and statistics

**Key Tasks:**
- Follow live games and player performances
- View league standings and statistics
- Engage with live score updates and animations

## 3. Data Structure Design

### 3.1 Google Sheets as Database

Given we're using Google Sheets as a flat database structure, we'll organize our data into separate sheets while maintaining relational integrity through key references. Each sheet will function as a table in our database.

### 3.2 Sheet Structure Definitions

#### 3.2.1 Players Sheet
**Sheet Name:** `Players`
**Purpose:** Store all player information and individual stats
**Structure:**
| Column | Data Type | Description | Notes |
|--------|-----------|-------------|-------|
| PlayerID | String | Unique identifier for each player | Auto-generated (PLAYER_prefix + number) |
| FirstName | String | Player's first name | |
| LastName | String | Player's last name | |
| Email | String | Contact email | For notifications |
| Phone | String | Contact phone number | Optional |
| Status | String | Player status | "Active", "Inactive", "Substitute" |
| JoinDate | Date | When player joined league | YYYY-MM-DD format |
| SeasonsPlayed | String | List of seasons participated in | Comma-separated list of SeasonIDs |
| IsEligibleAsSub | Boolean | Whether player can sub | TRUE/FALSE |
| EmergencyContactName | String | Emergency contact name | Optional |
| EmergencyContactPhone | String | Emergency contact number | Optional |
| PaymentStatus | String | Payment tracking | "Paid", "Unpaid", "Partial" |
| ProfilePicURL | String | Link to profile picture | Optional |
| IsEligibleForPlayoffs | Boolean | Playoff eligibility flag | TRUE/FALSE |
| Notes | String | Admin notes on player | Optional |

#### 3.2.2 Teams Sheet
**Sheet Name:** `Teams`
**Purpose:** Store team compositions and basic team information
**Structure:**
| Column | Data Type | Description | Notes |
|--------|-----------|-------------|-------|
| TeamID | String | Unique identifier for team | Auto-generated (TEAM_prefix + number) |
| TeamName | String | Name of the team | |
| Player1ID | String | Reference to first player | FK to Players.PlayerID |
| Player2ID | String | Reference to second player | FK to Players.PlayerID |
| Status | String | Team status | "Active", "Inactive" |
| SeasonID | String | Season team is registered for | FK to Seasons.SeasonID |
| FormationDate | Date | When team was formed | YYYY-MM-DD format |
| IsEligibleForPlayoffs | Boolean | Playoff eligibility | TRUE/FALSE |
| Notes | String | Admin notes on team | Optional |

#### 3.2.3 Seasons Sheet
**Sheet Name:** `Seasons`
**Purpose:** Track different league seasons
**Structure:**
| Column | Data Type | Description | Notes |
|--------|-----------|-------------|-------|
| SeasonID | String | Unique identifier for season | Auto-generated (SEASON_prefix + number) |
| SeasonName | String | Name of the season | e.g., "Fall 2024" |
| SeasonNumber | String | Season number | e.g., "24" |
| StartDate | Date | Season start date | YYYY-MM-DD format |
| EndDate | Date | Season end date | YYYY-MM-DD format |
| Status | String | Season status | "Upcoming", "Active", "Completed" |
| NumberOfWeeks | Number | Total weeks in season | Integer |
| IncludePlayoffs | Boolean | Whether playoffs included | TRUE/FALSE |
| PlayoffTeamCount | Number | Number of teams in playoffs | Integer |
| Notes | String | Admin notes on season | Optional |

#### 3.2.4 WeeklySchedule Sheet
**Sheet Name:** `WeeklySchedule`
**Purpose:** Store the generated schedule for each week
**Structure:**
| Column | Data Type | Description | Notes |
|--------|-----------|-------------|-------|
| ScheduleID | String | Unique identifier for schedule entry | Auto-generated (SCHED_prefix + number) |
| SeasonID | String | Reference to season | FK to Seasons.SeasonID |
| WeekNumber | Number | Week number in season | Integer |
| WeeklyRoundNumber | Number | Round within week (1-3) | Integer (1, 2, or 3) |
| CumulativeRoundNumber | Number | Cumulative round in season | Integer (1-21 for 7 weeks × 3 rounds) |
| MatchDate | Date | Date of match | YYYY-MM-DD format |
| Team1ID | String | First team in match | FK to Teams.TeamID |
| Team2ID | String | Second team in match | FK to Teams.TeamID |
| LaneNumber | Number | Lane assignment (1 or 2) | Integer |
| Status | String | Match status | "Scheduled", "Completed", "Postponed" |

#### 3.2.5 Scores Sheet
**Sheet Name:** `Scores`
**Purpose:** Track all individual player scores
**Structure:**
| Column | Data Type | Description | Notes |
|--------|-----------|-------------|-------|
| ScoreID | String | Unique identifier for score entry | Auto-generated (SCORE_prefix + number) |
| ScheduleID | String | Reference to schedule | FK to WeeklySchedule.ScheduleID |
| PlayerID | String | Player who scored | FK to Players.PlayerID |
| TeamID | String | Player's team | FK to Teams.TeamID |
| Score | Number | Actual score value | Integer |
| IsSubstituteScore | Boolean | Whether score is from a sub | TRUE/FALSE |
| RegularPlayerID | String | Player being substituted | FK to Players.PlayerID (if sub) |
| WeekNumber | Number | Week number | Integer |
| WeeklyRoundNumber | Number | Round within week (1-3) | Integer (1, 2, or 3) |
| CumulativeRoundNumber | Number | Cumulative round | Integer (1-21) |
| VerifiedBy | String | Staff who verified score | Optional |
| EntryTimestamp | Timestamp | When score was entered | Auto-generated |
| Modified | Boolean | If score was modified | TRUE/FALSE |
| ModificationReason | String | Reason for modification | Optional |

#### 3.2.6 SubstitutePlayers Sheet
**Sheet Name:** `SubstitutePlayers`
**Purpose:** Track substitute player appearances
**Structure:**
| Column | Data Type | Description | Notes |
|--------|-----------|-------------|-------|
| SubID | String | Unique identifier | Auto-generated (SUB_prefix + number) |
| MatchID | String | Reference to match | FK to WeeklySchedule.ScheduleID |
| RegularPlayerID | String | Player being replaced | FK to Players.PlayerID |
| SubstitutePlayerID | String | Substitute player | FK to Players.PlayerID (if registered) or null |
| SubstitutePlayerName | String | Sub's name (if not registered) | For non-registered subs |
| TeamID | String | Team subbed for | FK to Teams.TeamID |
| WeekNumber | Number | Week of substitution | Integer |
| WeeklyRoundNumber | Number | Round within week (1-3) | Integer (1, 2, or 3) |
| CumulativeRoundNumber | Number | Cumulative round in season | Integer (1-21) |
| IsPreArranged | Boolean | Whether sub was pre-arranged | TRUE/FALSE |
| Status | String | Substitution status | "Pending", "Approved", "Completed" |
| Notes | String | Admin notes | Optional |

#### 3.2.7 MatchResults Sheet
**Sheet Name:** `MatchResults`
**Purpose:** Store final results of each match
**Structure:**
| Column | Data Type | Description | Notes |
|--------|-----------|-------------|-------|
| ResultID | String | Unique identifier for result | Auto-generated (RESULT_prefix + number) |
| ScheduleID | String | Reference to schedule | FK to WeeklySchedule.ScheduleID |
| Team1TotalScore | Number | Total score for team 1 | Calculated from Scores |
| Team2TotalScore | Number | Total score for team 2 | Calculated from Scores |
| Team1MatchPoints | Number | Match points for team 1 | 0, 0.5, or 1 |
| Team2MatchPoints | Number | Match points for team 2 | 0, 0.5, or 1 |
| HasForfeit | Boolean | Whether match had a forfeit | TRUE/FALSE |
| ForfeitingTeamID | String | Team that forfeited | FK to Teams.TeamID, if applicable |
| WinningTeamID | String | Team that won the match | FK to Teams.TeamID |
| LosingTeamID | String | Team that lost the match | FK to Teams.TeamID |
| IsTie | Boolean | Whether match ended in tie | TRUE/FALSE |
| CompletionTimestamp | Timestamp | When match was completed | Auto-generated |
| Notes | String | Admin notes | Optional |

#### 3.2.8 TopTeamsRestriction Sheet
**Sheet Name:** `TopTeamsRestriction`
**Purpose:** Track which teams are restricted from substituting each week
**Structure:**
| Column | Data Type | Description | Notes |
|--------|-----------|-------------|-------|
| RestrictionID | String | Unique identifier | Auto-generated (RESTRICT_prefix + number) |
| SeasonID | String | Season reference | FK to Seasons.SeasonID |
| WeekNumber | Number | Week number | Integer |
| TeamID | String | Restricted team | FK to Teams.TeamID |
| RestrictionReason | String | Why team is restricted | e.g., "Top 3 ranking" |
| IsActive | Boolean | Whether restriction active | TRUE/FALSE |

#### 3.2.9 TeamStats Sheet
**Sheet Name:** `TeamStats`
**Purpose:** Calculated team statistics (can be formula-driven)
**Structure:**
| Column | Data Type | Description | Notes |
|--------|-----------|-------------|-------|
| StatID | String | Unique identifier for stat entry | Auto-generated (STAT_prefix + number) |
| TeamID | String | Reference to team | FK to Teams.TeamID |
| SeasonID | String | Season reference | FK to Seasons.SeasonID |
| SeasonNumber | String | Season number | e.g., "24" |
| WeekNumber | Number | Week number (0 for season total) | Integer (0 = season aggregate) |
| WeeklyRoundNumber | Number | Round within week (0 for weekly agg) | Integer (0, 1, 2, or 3) |
| CumulativeRoundNumber | Number | Cumulative round (0 for agg) | Integer (0-21) |
| GamesPlayed | Number | Number of games played | Integer |
| Wins | Number | Number of wins | Integer |
| Losses | Number | Number of losses | Integer |
| Ties | Number | Number of ties | Integer |
| Forfeits | Number | Number of forfeits | Integer |
| MatchPoints | Number | Total match points | Win = 1, Tie = 0.5, Loss/Forfeit = 0 |
| TotalScore | Number | Cumulative score | Integer |
| AverageScore | Number | Average score per game | Decimal |
| HighestScore | Number | Highest single game score | Integer |
| CurrentRank | Number | Current team ranking | Integer |
| LastUpdated | Timestamp | When stats were updated | Auto-generated |

#### 3.2.10 PlayerStats Sheet
**Sheet Name:** `PlayerStats`
**Purpose:** Calculated player statistics (can be formula-driven)
**Structure:**
| Column | Data Type | Description | Notes |
|--------|-----------|-------------|-------|
| StatID | String | Unique identifier for stat entry | Auto-generated (PSTAT_prefix + number) |
| PlayerID | String | Reference to player | FK to Players.PlayerID |
| SeasonID | String | Season reference | FK to Seasons.SeasonID |
| SeasonNumber | String | Season number | e.g., "24" |
| WeekNumber | Number | Week number (0 for season total) | Integer (0 = season aggregate) |
| WeeklyRoundNumber | Number | Round within week (0 for weekly agg) | Integer (0, 1, 2, or 3) |
| CumulativeRoundNumber | Number | Cumulative round (0 for agg) | Integer (0-21) |
| GamesPlayed | Number | Number of games played | Integer |
| SubAppearances | Number | Number of times as substitute | Integer |
| TotalScore | Number | Cumulative score | Integer |
| AverageScore | Number | Average score per game | Decimal |
| HighestScore | Number | Highest single game score | Integer |
| LastUpdated | Timestamp | When stats were updated | Auto-generated |

#### 3.2.11 Achievements Sheet
**Sheet Name:** `Achievements`
**Purpose:** Track notable player achievements
**Structure:**
| Column | Data Type | Description | Notes |
|--------|-----------|-------------|-------|
| AchievementID | String | Unique identifier for achievement | Auto-generated (ACH_prefix + number) |
| PlayerID | String | Reference to player | FK to Players.PlayerID |
| AchievementType | String | Type of achievement | e.g., "High Score", "Perfect Game" |
| AchievementDate | Date | When achieved | YYYY-MM-DD format |
| WeekNumber | Number | Week when achieved | Integer |
| WeeklyRoundNumber | Number | Round within week | Integer (1, 2, or 3) |
| CumulativeRoundNumber | Number | Cumulative round | Integer (1-21) |
| Description | String | Detailed description | e.g., "Season high score of 920" |
| ScoreID | String | Reference to related score | FK to Scores.ScoreID (optional) |
| IsPublic | Boolean | Whether to display publicly | TRUE/FALSE |

#### 3.2.12 SystemLog Sheet
**Sheet Name:** `SystemLog`
**Purpose:** Error logging and system events
**Structure:**
| Column | Data Type | Description | Notes |
|--------|-----------|-------------|-------|
| LogID | String | Unique identifier for log entry | Auto-generated (LOG_prefix + number) |
| Timestamp | Timestamp | When event occurred | Auto-generated |
| EventType | String | Type of system event | "Error", "Warning", "Info" |
| Component | String | System component | e.g., "Scheduler", "ScoreEntry" |
| Message | String | Log message | Detailed description |
| UserEmail | String | User who triggered event | Google account email |
| StackTrace | String | Error stack trace | For errors only |

#### 3.2.13 Config Sheet
**Sheet Name:** `Config`
**Purpose:** System configuration and settings
**Structure:**
| Column | Data Type | Description | Notes |
|--------|-----------|-------------|-------|
| ConfigKey | String | Setting identifier | e.g., "ActiveSeasonID" |
| ConfigValue | String | Setting value | e.g., "SEASON_001" |
| Description | String | Setting description | Human-readable explanation |
| LastModified | Timestamp | When last changed | Auto-generated |
| ModifiedBy | String | Who changed it | Google account email |

### 3.3 Named Ranges and References

To improve script readability, we'll define named ranges for each table:

```javascript
// In config.gs
const NAMED_RANGES = {
  PLAYERS_TABLE: "Players!A:O",
  TEAMS_TABLE: "Teams!A:I",
  SEASONS_TABLE: "Seasons!A:J",
  WEEKLY_SCHEDULE_TABLE: "WeeklySchedule!A:J",
  SCORES_TABLE: "Scores!A:N",
  SUBSTITUTE_PLAYERS_TABLE: "SubstitutePlayers!A:L",
  MATCH_RESULTS_TABLE: "MatchResults!A:M",
  TOP_TEAMS_RESTRICTION_TABLE: "TopTeamsRestriction!A:F",
  TEAM_STATS_TABLE: "TeamStats!A:R",
  PLAYER_STATS_TABLE: "PlayerStats!A:N",
  ACHIEVEMENTS_TABLE: "Achievements!A:J",
  SYSTEM_LOG_TABLE: "SystemLog!A:G",
  CONFIG_TABLE: "Config!A:E"
};
```

## 4. Workflow Mapping

### 4.1 League Setup Process
1. Admin creates a new season
2. Admin registers players or confirms returning players
3. Admin forms teams (pairs of players)
4. System generates league schedule
5. Admin reviews and approves schedule

### 4.2 Weekly League Night Process
1. Admin opens the app and selects current week/round
2. System displays matches for the current round
3. Admin assigns teams to lanes
4. Admin enters any substitute players (pre-arranged or impromptu)
5. Players complete their games
6. Admin enters scores via the interface
7. System validates scores and updates standings
8. System displays which teams are up next
9. Process repeats until all matches for the round are complete

### 4.3 Score Entry Workflow
1. Admin selects the active match
2. Interface displays player names and score entry fields
3. If a player has a substitute, the interface shows the sub's name
4. Admin enters individual player scores
5. System calculates team totals
6. System validates scores for accuracy
7. Admin confirms scores
8. System updates standings and statistics
9. System checks for forfeits based on substitute status
10. System applies match points according to win/loss/forfeit rules

### 4.4 Substitute Management Workflow
1. Admin identifies a player needs a substitute
2. Admin indicates whether sub is pre-arranged
3. Admin enters substitute information
4. System validates substitute eligibility (not on opposing team, not restricted)
5. System flags substitution status for match result calculations
6. If substitution is not pre-arranged, system tracks for potential forfeit

### 4.5 Playoff Generation Process
1. Regular season concludes
2. Admin initiates playoff generation
3. System selects top teams based on standings (match points, with score points as tiebreaker)
4. System generates playoff brackets
5. Admin reviews and approves brackets
6. System displays playoff schedule

## 5. Technical Architecture

### 5.1 Google Sheets Structure
- Primary data storage for all league information
- Separate sheets for different data entities
- Formulas for calculations and validations
- Named ranges for easy script reference

### 5.2 Apps Script Components

#### File Structure
- **config.gs** - Configuration settings and constants
- **main.gs** - Main entry point and core functionality
- **scheduleGenerator.gs** - Schedule generation logic
- **scoreManager.gs** - Score entry and validation
- **standingsCalculator.gs** - League standings calculations
- **playerTeamManager.gs** - Player and team management
- **substituteManager.gs** - Substitute handling and forfeit detection
- **uiController.gs** - User interface control
- **dataValidation.gs** - Data validation functions
- **utilityFunctions.gs** - Shared utility functions
- **errorHandler.gs** - Error handling and logging
- **reportGenerator.gs** - Statistical reports

#### UI Components
- **sidebar.html** - Main administrative interface
- **scoreEntry.html** - Score entry form
- **substituteEntry.html** - Substitute player registration
- **liveDisplay.html** - Live score display for monitors
- **standingsDisplay.html** - League standings display
- **playerStats.html** - Individual player statistics

### 5.3 Automation Points
- Schedule generation
- Score calculation and validation
- Standings updates
- Next match determination
- Playoff bracket generation
- Top team restriction updates
- Substitute eligibility checks

## 6. Implementation Plan

### 6.1 Phase 1: Core System Foundation (MVP)
**Timeframe:** Weeks 1-2
**Goals:** Establish data structure and basic player/team management

**Key Deliverables:**
1. **Database Setup**
   - Create all core sheets with proper column structures
   - Set up data validation rules and formatting
   - Implement basic formula calculations
   - Create Config sheet with essential settings

2. **Player Registration System**
   - Create player registration form (HTML)
   - Implement player record creation and storage
   - Player status management functionality

3. **Team Formation**
   - Team creation interface
   - Player-to-team assignment functionality
   - Simple team listing and management

4. **Basic Admin Dashboard**
   - System status overview
   - Simple navigation to core functions
   - Configuration management

**Success Criteria:**
- All core data tables created and functioning
- Ability to add/edit/deactivate players
- Ability to create and manage teams
- System configuration is working properly

### 6.2 Phase 2: Schedule Management & Core Scoring
**Timeframe:** Weeks 3-4
**Goals:** Implement scheduling and basic scoring functionality

**Key Deliverables:**
1. **Schedule Generation**
   - Algorithm for season schedule creation
   - Weekly schedule display
   - Lane assignment functionality

2. **Basic Score Entry System**
   - Score entry interface for staff
   - Score validation logic
   - Match result calculation

3. **Admin Controls**
   - Match status management
   - Schedule adjustment tools

**Success Criteria:**
- Ability to generate a complete season schedule
- Functional score entry system
- Basic match management capabilities

### 6.3 Phase 3: Substitutes & Advanced Scoring
**Timeframe:** Weeks 5-6
**Goals:** Implement substitute management and enhanced scoring rules

**Key Deliverables:**
1. **Substitute Management**
   - Substitute registration interface
   - Pre-arranged vs. impromptu sub tracking
   - Top team restriction implementation
   - Sub eligibility validation

2. **Advanced Scoring Logic**
   - Forfeit detection and handling
   - Proper match point assignment
   - Team total calculations

3. **Basic Statistics**
   - Win/loss tracking
   - Match point tallying
   - Basic team rankings

**Success Criteria:**
- Complete substitute management functionality
- Proper handling of forfeits
- Accurate match point calculations
- Basic standings generation

### 6.4 Phase 4: Statistics & Displays
**Timeframe:** Weeks 7-8
**Goals:** Implement comprehensive statistics and display systems

**Key Deliverables:**
1. **Statistical Processing**
   - Team rankings calculation with tiebreakers
   - Individual player statistics
   - Historical performance tracking

2. **Live Display Interface**
   - Real-time score board for monitors
   - Current match status display
   - Next-up team notifications

3. **Reporting Tools**
   - Weekly league report generation
   - Player performance summaries
   - Team standing reports

**Success Criteria:**
- Comprehensive statistics calculation
- Functional live display system
- Automated report generation

### 6.5 Phase 5: Playoffs & Advanced Features
**Timeframe:** Weeks 9-10
**Goals:** Implement playoff system and additional enhancements

**Key Deliverables:**
1. **Playoff System**
   - Playoff eligibility tracking
   - Bracket generation algorithm
   - Playoff progress visualization

2. **Achievement System**
   - Automatic achievement detection
   - Achievement display and tracking
   - Historical records management

3. **System Optimization**
   - Performance enhancements
   - Error handling improvements
   - User experience refinements

**Success Criteria:**
- Fully functional playoff system
- Automated achievement tracking
- Optimized system performance

## 7. Function Logic Planning

### 7.1 Round Management Functions

```
FUNCTION calculateCumulativeRoundNumber(weekNumber, weeklyRoundNumber)
  // Week 1, Round 1 = Cumulative Round 1
  // Week 1, Round 2 = Cumulative Round 2
  // Week 2, Round 1 = Cumulative Round 4
  RETURN ((weekNumber - 1) * 3) + weeklyRoundNumber
END FUNCTION

FUNCTION getRoundInfo(cumulativeRoundNumber)
  // Calculate week and round from cumulative number
  SET weekNumber = Math.ceil(cumulativeRoundNumber / 3)
  SET weeklyRoundNumber = ((cumulativeRoundNumber - 1) % 3) + 1
  
  RETURN {
    weekNumber: weekNumber,
    weeklyRoundNumber: weeklyRoundNumber
  }
END FUNCTION
```

### 7.2 Player Management Functions

```
FUNCTION registerNewPlayer(playerData)
  // Input validation
  IF any required fields in playerData are empty THEN
    Log error and return error message
  END IF
  
  // Generate unique PlayerID
  SET newPlayerID = generateUniqueID("PLAYER_")
  
  // Format data for insertion
  SET formattedPlayerData = formatPlayerData(playerData, newPlayerID)
  
  // Insert into Players sheet
  TRY
    appendRowToSheet("Players", formattedPlayerData)
    RETURN {success: true, playerID: newPlayerID}
  CATCH error
    Log error
    RETURN {success: false, error: error.message}
  END TRY
END FUNCTION

FUNCTION updatePlayerStatus(playerID, newStatus)
  // Find player record
  SET playerRow = findRowByID("Players", "PlayerID", playerID)
  
  IF playerRow is null THEN
    RETURN {success: false, error: "Player not found"}
  END IF
  
  // Update status field
  TRY
    updateCellValue("Players", playerRow, "Status", newStatus)
    RETURN {success: true}
  CATCH error
    Log error
    RETURN {success: false, error: error.message}
  END TRY
END FUNCTION
```

### 7.3 Team Management Functions

```
FUNCTION createNewTeam(teamData)
  // Input validation
  IF teamData.TeamName is empty OR teamData.Player1ID is empty OR teamData.Player2ID is empty THEN
    Log error and return error message
  END IF
  
  // Check if players exist
  IF NOT playerExists(teamData.Player1ID) OR NOT playerExists(teamData.Player2ID) THEN
    RETURN {success: false, error: "One or both players not found"}
  END IF
  
  // Check if players are already on teams for this season
  IF isPlayerOnTeam(teamData.Player1ID, teamData.SeasonID) OR isPlayerOnTeam(teamData.Player2ID, teamData.SeasonID) THEN
    RETURN {success: false, error: "Player already assigned to a team this season"}
  END IF
  
  // Generate unique TeamID
  SET newTeamID = generateUniqueID("TEAM_")
  
  // Format data for insertion
  SET formattedTeamData = {
    TeamID: newTeamID,
    TeamName: teamData.TeamName,
    Player1ID: teamData.Player1ID,
    Player2ID: teamData.Player2ID,
    Status: "Active",
    SeasonID: teamData.SeasonID,
    FormationDate: getCurrentDate(),
    IsEligibleForPlayoffs: true,
    Notes: teamData.Notes || ""
  }
  
  // Insert into Teams sheet
  TRY
    appendRowToSheet("Teams", formattedTeamData)
    RETURN {success: true, teamID: newTeamID}
  CATCH error
    Log error
    RETURN {success: false, error: error.message}
  END TRY
END FUNCTION

FUNCTION getTeamRoster(teamID)
  // Find team record
  SET teamData = findRecordByID("Teams", "TeamID", teamID)
  
  IF teamData is null THEN
    RETURN {success: false, error: "Team not found"}
  END IF
  
  // Get player details
  SET player1Data = findRecordByID("Players", "PlayerID", teamData.Player1ID)
  SET player2Data = findRecordByID("Players", "PlayerID", teamData.Player2ID)
  
  // Compile roster info
  SET rosterData = {
    team: teamData,
    players: [player1Data, player2Data]
  }
  
  RETURN {success: true, data: rosterData}
END FUNCTION
```

### 7.4 Substitute Management Functions

```
FUNCTION registerSubstitute(matchID, regularPlayerID, substituteInfo, isPreArranged)
  // Input validation
  IF matchID is empty OR regularPlayerID is empty THEN
    RETURN {success: false, error: "Missing required parameters"}
  END IF
  
  // Get match details
  SET matchData = findRecordByID("WeeklySchedule", "ScheduleID", matchID)
  IF matchData is null THEN
    RETURN {success: false, error: "Match not found"}
  END IF
  
  // Verify player is part of this match
  SET playerTeamID = getPlayerTeamForMatch(regularPlayerID, matchData)
  IF playerTeamID is null THEN
    RETURN {success: false, error: "Player not part of this match"}
  END IF
  
  // If substitute is a registered player, check eligibility
  IF substituteInfo.hasRegisteredSub THEN
    // Check if substitute is eligible (not on opposing team, not restricted)
    IF NOT isPlayerEligibleToSub(substituteInfo.substitutePlayerID, playerTeamID, matchData.WeekNumber) THEN
      RETURN {success: false, error: "Substitute player is not eligible"}
    END IF
  END IF
  
  // Generate unique sub ID
  SET subID = generateUniqueID("SUB_")
  
  // Prepare substitute data
  SET subData = {
    SubID: subID,
    MatchID: matchID,
    RegularPlayerID: regularPlayerID,
    SubstitutePlayerID: substituteInfo.hasRegisteredSub ? substituteInfo.substitutePlayerID : null,
    SubstitutePlayerName: substituteInfo.hasRegisteredSub ? null : substituteInfo.substituteName,
    TeamID: playerTeamID,
    WeekNumber: matchData.WeekNumber,
    WeeklyRoundNumber: matchData.WeeklyRoundNumber,
    CumulativeRoundNumber: matchData.CumulativeRoundNumber,
    IsPreArranged: isPreArranged,
    Status: "Approved",
    Notes: substituteInfo.notes || ""
  }
  
  // Save to SubstitutePlayers sheet
  TRY
    appendRowToSheet("SubstitutePlayers", subData)
    RETURN {success: true, subID: subID}
  CATCH error
    Log error
    RETURN {success: false, error: error.message}
  END TRY
END FUNCTION

FUNCTION updateTopTeamsRestrictions(seasonID, weekNumber)
  // Get current team standings
  SET teamStandings = getTeamSt

FUNCTION updateTopTeamsRestrictions(seasonID, weekNumber)
  // Get current team standings
  SET teamStandings = getTeamStandings(seasonID, weekNumber - 1)
  
  // Get top 3 teams
  SET topTeams = teamStandings.slice(0, 3)
  
  // Clear existing restrictions for this week
  clearTopTeamRestrictions(seasonID, weekNumber)
  
  // Create new restrictions
  FOR EACH team IN topTeams
    SET restrictionID = generateUniqueID("RESTRICT_")
    
    SET restrictionData = {
      RestrictionID: restrictionID,
      SeasonID: seasonID,
      WeekNumber: weekNumber,
      TeamID: team.TeamID,
      RestrictionReason: "Top 3 ranking",
      IsActive: true
    }
    
    appendRowToSheet("TopTeamsRestriction", restrictionData)
    
    // Update player eligibility
    updatePlayersSubEligibility(team.TeamID, false)
  END FOR
  
  RETURN {success: true, restrictedTeams: topTeams}
END FUNCTION

FUNCTION isPlayerEligibleToSub(playerID, targetTeamID, weekNumber)
  // Get player's team
  SET playerTeam = getPlayerTeam(playerID, getCurrentSeasonID())
  
  // Get match for target team
  SET targetMatch = getCurrentMatchForTeam(targetTeamID)
  
  // Check if player's team is the opponent
  IF targetMatch AND playerTeam AND (targetMatch.Team1ID === playerTeam OR targetMatch.Team2ID === playerTeam) THEN
    RETURN false
  END IF
  
  // Check if player's team is restricted
  SET teamRestriction = getTeamRestriction(playerTeam, weekNumber)
  IF teamRestriction AND teamRestriction.IsActive THEN
    RETURN false
  END IF
  
  RETURN true
END FUNCTION

FUNCTION hasNonPrearrangedSub(substituteInfo, teamID)
  // Filter substitutes for this team
  SET teamSubs = substituteInfo.filter(sub => sub.TeamID === teamID)
  
  // Check if any substitutes were not pre-arranged
  RETURN teamSubs.some(sub => sub.IsPreArranged === false)
END FUNCTION
```

### 7.5 Score Entry Functions

```
FUNCTION enterPlayerScore(scheduleID, playerID, score, isSubstitute, regularPlayerID)
  // Validate inputs
  IF !scheduleID OR !playerID OR score === undefined THEN
    RETURN {success: false, error: "Missing required parameters"}
  END IF
  
  // Check if match exists
  SET matchData = findRecordByID("WeeklySchedule", "ScheduleID", scheduleID)
  IF matchData is null THEN
    RETURN {success: false, error: "Match not found"}
  END IF
  
  // Handle substitute scoring
  IF isSubstitute THEN
    // Verify there's a substitute record
    SET subRecord = findSubRecord(scheduleID, regularPlayerID)
    IF subRecord is null THEN
      RETURN {success: false, error: "No substitute record found"}
    END IF
    
    // Get team from substitute record
    SET teamID = subRecord.TeamID
  ELSE
    // Regular player - verify player is part of this match
    IF NOT isPlayerInMatch(playerID, matchData) THEN
      RETURN {success: false, error: "Player not part of this match"}
    END IF
    
    // Get player's team for this match
    SET teamID = getPlayerTeamForMatch(playerID, matchData)
  END IF
  
  // Generate unique score ID
  SET scoreID = generateUniqueID("SCORE_")
  
  // Prepare score data
  SET scoreData = {
    ScoreID: scoreID,
    ScheduleID: scheduleID,
    PlayerID: playerID,
    TeamID: teamID,
    Score: score,
    IsSubstituteScore: isSubstitute,
    RegularPlayerID: isSubstitute ? regularPlayerID : null,
    WeekNumber: matchData.WeekNumber,
    WeeklyRoundNumber: matchData.WeeklyRoundNumber,
    CumulativeRoundNumber: matchData.CumulativeRoundNumber,
    VerifiedBy: Session.getActiveUser().getEmail(),
    EntryTimestamp: new Date(),
    Modified: false,
    ModificationReason: ""
  }
  
  // Save to Scores sheet
  TRY
    appendRowToSheet("Scores", scoreData)
    
    // Check if all scores are entered for this match
    IF areAllScoresEntered(scheduleID) THEN
      finalizeMatch(scheduleID)
    END IF
    
    RETURN {success: true, scoreID: scoreID}
  CATCH error
    Log error
    RETURN {success: false, error: error.message}
  END TRY
END FUNCTION

FUNCTION finalizeMatch(scheduleID)
  // Get all scores for this match
  SET allScores = getScoresForMatch(scheduleID)
  
  // Get match details
  SET matchData = findRecordByID("WeeklySchedule", "ScheduleID", scheduleID)
  
  // Get substitute information
  SET substituteInfo = getSubstitutesForMatch(scheduleID)
  
  // Check for non-prearranged substitutes (forfeits)
  SET team1HasForfeit = hasNonPrearrangedSub(substituteInfo, matchData.Team1ID)
  SET team2HasForfeit = hasNonPrearrangedSub(substituteInfo, matchData.Team2ID)
  
  // Calculate team totals for score points
  SET team1Scores = allScores.filter(score => score.TeamID === matchData.Team1ID)
  SET team2Scores = allScores.filter(score => score.TeamID === matchData.Team2ID)
  
  SET team1Total = calculateTotal(team1Scores)
  SET team2Total = calculateTotal(team2Scores)
  
  // Assign match points based on scores and forfeit status
  SET team1MatchPoints = 0
  SET team2MatchPoints = 0
  SET hasForfeit = false
  SET forfeitingTeamID = null
  SET winningTeamID = null
  SET losingTeamID = null
  SET isTie = false
  
  IF team1HasForfeit AND team2HasForfeit THEN
    // Both teams forfeited - split the points
    team1MatchPoints = 0.5
    team2MatchPoints = 0.5
    hasForfeit = true
    // No specific forfeiting team since both forfeited
    isTie = true
  ELSE IF team1HasForfeit THEN
    // Team 1 forfeited - team 2 gets the match point
    team2MatchPoints = 1
    hasForfeit = true
    forfeitingTeamID = matchData.Team1ID
    winningTeamID = matchData.Team2ID
    losingTeamID = matchData.Team1ID
  ELSE IF team2HasForfeit THEN
    // Team 2 forfeited - team 1 gets the match point
    team1MatchPoints = 1
    hasForfeit = true
    forfeitingTeamID = matchData.Team2ID
    winningTeamID = matchData.Team1ID
    losingTeamID = matchData.Team2ID
  ELSE
    // No forfeits - normal scoring
    IF team1Total > team2Total THEN
      team1MatchPoints = 1
      winningTeamID = matchData.Team1ID
      losingTeamID = matchData.Team2ID
    ELSE IF team2Total > team1Total THEN
      team2MatchPoints = 1
      winningTeamID = matchData.Team2ID
      losingTeamID = matchData.Team1ID
    ELSE
      // Tie
      team1MatchPoints = 0.5
      team2MatchPoints = 0.5
      isTie = true
    END IF
  END IF
  
  // Create match result record
  SET resultID = generateUniqueID("RESULT_")
  
  SET resultData = {
    ResultID: resultID,
    ScheduleID: scheduleID,
    Team1TotalScore: team1Total,
    Team2TotalScore: team2Total,
    Team1MatchPoints: team1MatchPoints,
    Team2MatchPoints: team2MatchPoints,
    HasForfeit: hasForfeit,
    ForfeitingTeamID: forfeitingTeamID,
    WinningTeamID: winningTeamID,
    LosingTeamID: losingTeamID,
    IsTie: isTie,
    CompletionTimestamp: new Date(),
    Notes: ""
  }
  
  // Save to MatchResults sheet
  TRY
    appendRowToSheet("MatchResults", resultData)
    
    // Update match status to completed
    updateMatchStatus(scheduleID, "Completed")
    
    // Update team stats
    updateTeamStats(matchData.Team1ID, matchData.Team2ID, team1Total, team2Total, winningTeamID, losingTeamID, hasForfeit, forfeitingTeamID)
    
    // Update player stats
    updatePlayerStats(allScores)
    
    // Check for achievements
    checkForAchievements(allScores, resultData)
    
    RETURN {success: true, resultID: resultID}
  CATCH error
    Log error
    RETURN {success: false, error: error.message}
  END TRY
END FUNCTION
```

### 7.6 Stats Update Functions

```
FUNCTION updateTeamStats(team1ID, team2ID, team1Score, team2Score, winnerID, loserID, hasForfeit, forfeitingTeamID)
  // Update stats for team 1
  SET team1Record = {
    win: winnerID === team1ID ? 1 : 0,
    loss: loserID === team1ID ? 1 : 0,
    tie: winnerID === null && loserID === null ? 1 : 0,
    forfeit: forfeitingTeamID === team1ID ? 1 : 0,
    score: team1Score,
    matchPoints: team1ID === winnerID ? 1 : (winnerID === null ? 0.5 : 0)
  }
  updateSingleTeamStats(team1ID, team1Record)
  
  // Update stats for team 2
  SET team2Record = {
    win: winnerID === team2ID ? 1 : 0,
    loss: loserID === team2ID ? 1 : 0,
    tie: winnerID === null && loserID === null ? 1 : 0,
    forfeit: forfeitingTeamID === team2ID ? 1 : 0,
    score: team2Score,
    matchPoints: team2ID === winnerID ? 1 : (winnerID === null ? 0.5 : 0)
  }
  updateSingleTeamStats(team2ID, team2Record)
  
  // Recalculate rankings for all teams
  recalculateTeamRankings()
END FUNCTION

FUNCTION updatePlayerStats(scoreEntries)
  FOR EACH scoreEntry IN scoreEntries
    // Get player's current stats
    SET playerStats = getPlayerStats(scoreEntry.PlayerID, getCurrentSeasonID())
    
    // Determine if this is a sub appearance
    SET isSubAppearance = scoreEntry.IsSubstituteScore
    
    // Update stats with new score
    SET updatedStats = {
      GamesPlayed: isSubAppearance ? playerStats.GamesPlayed : playerStats.GamesPlayed + 1,
      SubAppearances: isSubAppearance ? playerStats.SubAppearances + 1 : playerStats.SubAppearances,
      TotalScore: playerStats.TotalScore + scoreEntry.Score,
      AverageScore: (playerStats.TotalScore + scoreEntry.Score) / 
                    (playerStats.GamesPlayed + (isSubAppearance ? 0 : 1) + playerStats.SubAppearances),
      HighestScore: Math.max(playerStats.HighestScore, scoreEntry.Score),
      LastUpdated: new Date()
    }
    
    // Save updated stats
    savePlayerStats(scoreEntry.PlayerID, getCurrentSeasonID(), updatedStats)
  END FOR
END FUNCTION
```

### 7.7 Team Ranking Functions

```
FUNCTION recalculateTeamRankings()
  // Get all team stats for current season
  SET allTeamStats = getAllTeamSeasonStats(getCurrentSeasonID())
  
  // Sort teams by match points first
  allTeamStats.sort((a, b) => b.MatchPoints - a.MatchPoints)
  
  // Create groups of teams with same match points
  SET pointGroups = {}
  FOR EACH team IN allTeamStats
    IF !pointGroups[team.MatchPoints]
      pointGroups[team.MatchPoints] = []
    END IF
    pointGroups[team.MatchPoints].push(team)
  END FOR
  
  // Sort each group by total score
  FOR EACH pointValue IN Object.keys(pointGroups)
    pointGroups[pointValue].sort((a, b) => b.TotalScore - a.TotalScore)
  END FOR
  
  // Flatten back to single array and assign ranks
  SET rankedTeams = []
  FOR EACH pointValue IN Object.keys(pointGroups).sort((a, b) => b - a)
    rankedTeams = rankedTeams.concat(pointGroups[pointValue])
  END FOR
  
  // Update rank for each team
  FOR i = 0 TO rankedTeams.length - 1
    updateTeamRank(rankedTeams[i].TeamID, i + 1)
  END FOR
  
  RETURN rankedTeams
END FUNCTION

FUNCTION updateTeamRank(teamID, newRank)
  // Find current team stats record
  SET statsRecord = findTeamStatsRecord(teamID, getCurrentSeasonID(), 0, 0)
  
  IF statsRecord is null THEN
    // Create new record if doesn't exist
    createTeamStatsRecord(teamID, getCurrentSeasonID(), { CurrentRank: newRank })
  ELSE
    // Update existing record
    updateRecordField("TeamStats", statsRecord.StatID, "CurrentRank", newRank)
  END IF
  
  RETURN { success: true }
END FUNCTION
```

### 7.8 Schedule Generation Functions

```
FUNCTION generateSeasonSchedule(seasonID)
  // Get season details
  SET seasonData = findRecordByID("Seasons", "SeasonID", seasonID)
  
  IF seasonData is null THEN
    RETURN {success: false, error: "Season not found"}
  END IF
  
  // Get active teams for this season
  SET activeTeams = getActiveTeams(seasonID)
  
  IF activeTeams.length < 4 THEN
    RETURN {success: false, error: "Not enough teams for scheduling"}
  END IF
  
  // Clear existing schedule for this season if any
  clearExistingSchedule(seasonID)
  
  // Generate schedule for each week
  FOR weekNum = 1 TO seasonData.NumberOfWeeks
    // Generate match pairings for this week
    SET weekMatches = generateWeekMatches(activeTeams, weekNum, seasonID)
    
    // Process each match and assign to rounds
    SET roundAssignments = assignMatchesToRounds(weekMatches, weekNum)
    
    // Save to WeeklySchedule sheet
    saveRoundSchedule(roundAssignments, weekNum, seasonID)
  END FOR
  
  RETURN {success: true, message: "Schedule generated successfully"}
END FUNCTION

FUNCTION generateWeekMatches(teams, weekNumber, seasonID)
  // Initialize empty matches array
  SET matches = []
  
  // Check previously played matches to avoid immediate rematches when possible
  SET previousMatches = getPreviousMatches(teams, seasonID, weekNumber)
  
  // Create a copy of teams array and shuffle
  SET shuffledTeams = shuffle(teams.slice())
  
  // Create matches ensuring we don't repeat recent matchups when possible
  WHILE shuffledTeams.length > 1
    SET team1 = shuffledTeams.pop()
    
    // Try to find an opponent that hasn't played this team recently
    SET bestOpponentIndex = -1
    SET lowestMatchScore = Infinity
    
    FOR i = 0 TO shuffledTeams.length - 1
      SET potentialOpponent = shuffledTeams[i]
      SET matchScore = calculateMatchupScore(team1, potentialOpponent, previousMatches)
      
      IF matchScore < lowestMatchScore THEN
        lowestMatchScore = matchScore
        bestOpponentIndex = i
      END IF
    END FOR
    
    // If we found a valid opponent
    IF bestOpponentIndex >= 0 THEN
      SET team2 = shuffledTeams.splice(bestOpponentIndex, 1)[0]
      matches.push({team1: team1, team2: team2})
    END IF
  END WHILE
  
  // Handle odd number of teams - add bye if needed
  IF shuffledTeams.length == 1 THEN
    matches.push({team1: shuffledTeams[0], team2: "BYE"})
  END IF
  
  RETURN matches
END FUNCTION

FUNCTION assignMatchesToRounds(matches, weekNumber)
  // Given the two-lane constraint, we can have 2 matches active at once
  // Calculate number of rounds needed
  SET roundsNeeded = Math.ceil(matches.length / 2)
  
  // Initialize rounds array
  SET rounds = []
  FOR i = 1 TO roundsNeeded
    rounds[i] = []
  END FOR
  
  // Distribute matches to rounds
  FOR i = 0 TO matches.length - 1
    SET roundIndex = Math.floor(i / 2) + 1
    SET laneNumber = (i % 2) + 1
    
    // Calculate weekly and cumulative round numbers
    SET weeklyRoundNumber = roundIndex
    SET cumulativeRoundNumber = calculateCumulativeRoundNumber(weekNumber, weeklyRoundNumber)
    
    SET matchWithRoundInfo = {
      match: matches[i],
      weekNumber: weekNumber,
      weeklyRoundNumber: weeklyRoundNumber,
      cumulativeRoundNumber: cumulativeRoundNumber,
      lane: laneNumber
    }
    
    rounds[roundIndex].push(matchWithRoundInfo)
  END FOR
  
  RETURN rounds
END FUNCTION

FUNCTION saveRoundSchedule(roundAssignments, weekNumber, seasonID)
  FOR roundNumber IN Object.keys(roundAssignments)
    FOR EACH matchAssignment IN roundAssignments[roundNumber]
      // Generate unique schedule ID
      SET scheduleID = generateUniqueID("SCHED_")
      
      // Create schedule record
      SET scheduleData = {
        ScheduleID: scheduleID,
        SeasonID: seasonID,
        WeekNumber: weekNumber,
        WeeklyRoundNumber: matchAssignment.weeklyRoundNumber,
        CumulativeRoundNumber: matchAssignment.cumulativeRoundNumber,
        MatchDate: calculateMatchDate(seasonID, weekNumber),
        Team1ID: matchAssignment.match.team1.TeamID,
        Team2ID: matchAssignment.match.team2 === "BYE" ? "BYE" : matchAssignment.match.team2.TeamID,
        LaneNumber: matchAssignment.lane,
        Status: "Scheduled"
      }
      
      // Save to WeeklySchedule sheet
      appendRowToSheet("WeeklySchedule", scheduleData)
    END FOR
  END FOR
END FUNCTION
```

### 7.9 Playoff Functions

```
FUNCTION generatePlayoffBrackets(seasonID)
  // Get team rankings based on match points, breaking ties with score points
  SET rankedTeams = recalculateTeamRankings()
  
  // Get season configuration
  SET seasonConfig = getSeasonConfig(seasonID)
  
  // Take top N teams (from season configuration)
  SET topTeamCount = seasonConfig.PlayoffTeamCount || 10
  SET topTeams = rankedTeams.slice(0, topTeamCount)
  
  // Calculate the playoff week number (typically week 8)
  SET playoffWeekNumber = seasonConfig.NumberOfWeeks + 1
  
  // Seed teams into initial bracket
  SET playoffMatchups = seedPlayoffBracket(topTeams)
  
  // Save playoff matchups to schedule
  FOR roundIndex = 0 TO playoffMatchups.length - 1
    SET roundMatches = playoffMatchups[roundIndex]
    
    FOR matchIndex = 0 TO roundMatches.length - 1
      SET match = roundMatches[matchIndex]
      
      // Generate unique schedule ID
      SET scheduleID = generateUniqueID("SCHED_")
      
      // Week 8 always has 3 rounds for playoffs
      SET weeklyRoundNumber = roundIndex + 1
      SET cumulativeRoundNumber = calculateCumulativeRoundNumber(playoffWeekNumber, weeklyRoundNumber)
      
      // Calculate lane assignment
      SET laneNumber = (matchIndex % 2) + 1
      
      // Create schedule record for playoff matchup
      SET scheduleData = {
        ScheduleID: scheduleID,
        SeasonID: seasonID,
        WeekNumber: playoffWeekNumber,
        WeeklyRoundNumber: weeklyRoundNumber,
        CumulativeRoundNumber: cumulativeRoundNumber,
        MatchDate: calculateMatchDate(seasonID, playoffWeekNumber),
        Team1ID: match.team1.TeamID,
        Team2ID: match.team2.TeamID,
        LaneNumber: laneNumber,
        Status: "Scheduled"
      }
      
      // Save to WeeklySchedule sheet
      appendRowToSheet("WeeklySchedule", scheduleData)
    END FOR
  END FOR
  
  RETURN { success: true, message: "Playoff brackets generated successfully" }
END FUNCTION

FUNCTION seedPlayoffBracket(teams)
  // For a 10-team playoff, we need a structure that works for our 3-round, 2-lane format
  
  // Round 1: 4 matches (teams 3-10) - Seeds 1 and 2 get byes
  // Round 2: 3 matches (winners from round 1 plus seeds 1 and 2)
  // Round 3: Championship match (top 2 teams from round 2)
  
  SET rounds = [[], [], []]
  
  // Round 1 matchups: 
  // 3 vs 10, 4 vs 9, 5 vs 8, 6 vs 7
  rounds[0].push({ team1: teams[2], team2: teams[9] }) // 3 vs 10
  rounds[0].push({ team1: teams[3], team2: teams[8] }) // 4 vs 9
  rounds[0].push({ team1: teams[4], team2: teams[7] }) // 5 vs 8
  rounds[0].push({ team1: teams[5], team2: teams[6] }) // 6 vs 7
  
  // Round 2 and 3 are placeholders - actual teams determined after results
  // Here we're just establishing the structure
  
  // Round 2: Top seeds enter, winners from round 1 advance
  rounds[1].push({ team1: teams[0], team2: { TeamID: "TBD_R1_W2" } }) // 1 vs R1 Winner
  rounds[1].push({ team1: { TeamID: "TBD_R1_W1" }, team2: { TeamID: "TBD_R1_W3" } })
  rounds[1].push({ team1: teams[1], team2: { TeamID: "TBD_R1_W4" } }) // 2 vs R1 Winner
  
  // Round 3: Championship
  rounds[2].push({ team1: { TeamID: "TBD_R2_W1" }, team2: { TeamID: "TBD_R2_W2" } })
  
  RETURN rounds
END FUNCTION
```

### 7.10 UI and Display Functions

```
FUNCTION generateLiveScoreboardHTML()
  // Get active matches
  SET activeMatches = getActiveMatches()
  
  // Start building HTML
  SET html = '<div class="scoreboard-container">'
  
  // If no active matches
  IF activeMatches.length === 0 THEN
    html += '<div class="no-matches">No active matches at this time</div>'
  ELSE
    // Process each active match
    FOR EACH match IN activeMatches
      // Get team details
      SET team1 = getTeamDetails(match.Team1ID)
      SET team2 = getTeamDetails(match.Team2ID)
      
      // Get current scores
      SET matchScores = getScoresForMatch(match.ScheduleID)
      
      // Calculate current totals
      SET team1Total = calculateTeamTotal(matchScores, match.Team1ID)
      SET team2Total = calculateTeamTotal(matchScores, match.Team2ID)
      
      // Get substitution info
      SET subs = getSubstitutesForMatch(match.ScheduleID)
      
      // Add match container
      html += '<div class="match-container">'
      html += '<div class="match-header">Lane ' + match.LaneNumber + ' - Round ' + match.WeeklyRoundNumber + '</div>'
      
      // Add team 1 info
      html += '<div class="team-container team1">'
      html += '<div class="team-name">' + team1.TeamName + '</div>'
      html += '<div class="team-score">' + team1Total + '</div>'
      html += '<div class="player-container">'
      
      // Add team 1 player info
      FOR EACH player IN team1.players
        // Check if player has substitute
        SET hasSub = subs.some(sub => sub.RegularPlayerID === player.PlayerID)
        SET activeName = hasSub ? getSubstituteName(subs, player.PlayerID) : player.FirstName + ' ' + player.LastName
        SET playerClass = hasSub ? 'player substitute' : 'player'
        
        SET playerScore = getPlayerScoreFromMatch(matchScores, hasSub ? getSubstituteID(subs, player.PlayerID) : player.PlayerID)
        
        html += '<div class="' + playerClass + '">'
        html += '<div class="player-name">' + activeName + (hasSub ? ' (Sub)' : '') + '</div>'
        html += '<div class="player-score">' + (playerScore || '-') + '</div>'
        html += '</div>'
      END FOR
      
      html += '</div></div>'
      
      // Add VS divider
      html += '<div class="vs-container">VS</div>'
      
      // Add team 2 info (similar structure to team 1)
      html += '<div class="team-container team2">'
      html += '<div class="team-name">' + team2.TeamName + '</div>'
      html += '<div class="team-score">' + team2Total + '</div>'
      html += '<div class="player-container">'
      
      // Add team 2 player info (similar to team 1)
      FOR EACH player IN team2.players
        // Check if player has substitute
        SET hasSub = subs.some(sub => sub.RegularPlayerID === player.PlayerID)
        SET activeName = hasSub ? getSubstituteName(subs, player.PlayerID) : player.FirstName + ' ' + player.LastName
        SET playerClass = hasSub ? 'player substitute' : 'player'
        
        SET playerScore = getPlayerScoreFromMatch(matchScores, hasSub ? getSubstituteID(subs, player.PlayerID) : player.PlayerID)
        
        html += '<div class="' + playerClass + '">'
        html += '<div class="player-name">' + activeName + (hasSub ? ' (Sub)' : '') + '</div>'
        html += '<div class="player-score">' + (playerScore || '-') + '</div>'
        html += '</div>'
      END FOR
      
      html += '</div></div>'
      
      html += '</div>'
    END FOR
  END IF
  
  html += '</div>'
  
  RETURN html
END FUNCTION

FUNCTION generateNextUpDisplay()
  // Get current round info
  SET currentInfo = getCurrentRoundInfo()
  
  // Get next teams
  SET nextMatchups = getNextMatchups(currentInfo.weekNumber, currentInfo.roundNumber)
  
  // Build HTML
  SET html = '<div class="next-up-container">'
  html += '<h2>Next Up</h2>'
  
  IF nextMatchups.length === 0 THEN
    html += '<div class="no-matches">No more matches scheduled today</div>'
  ELSE
    // Process each upcoming matchup
    FOR EACH matchup IN nextMatchups
      // Get team details
      SET team1 = getTeamDetails(matchup.Team1ID)
      SET team2 = getTeamDetails(matchup.Team2ID)
      
      html += '<div class="next-match">'
      html += '<div class="lane-info">Lane ' + matchup.LaneNumber + '</div>'
      html += '<div class="team-names">'
      html += '<span class="team1">' + team1.TeamName + '</span>'
      html += ' vs '
      html += '<span class="team2">' + team2.TeamName + '</span>'
      html += '</div>'
      html += '</div>'
    END FOR
  END IF
  
  html += '</div>'
  
  RETURN html
END FUNCTION

FUNCTION generateScoreEntryForm(scheduleID)
  // Get match details
  SET matchData = findRecordByID("WeeklySchedule", "ScheduleID", scheduleID)
  
  // Get team details
  SET team1 = getTeamDetails(matchData.Team1ID)
  SET team2 = getTeamDetails(matchData.Team2ID)
  
  // Get substitution info
  SET subs = getSubstitutesForMatch(scheduleID)
  
  // Start building HTML
  SET html = '<div class="score-entry-container">'
  html += '<h2>Score Entry</h2>'
  html += '<div class="match-info">Lane ' + matchData.LaneNumber + ' - Week ' + matchData.WeekNumber + ' Round ' + matchData.WeeklyRoundNumber + '</div>'
  
  // Team 1 score entry
  html += '<div class="team-score-entry">'
  html += '<div class="team-header">' + team1.TeamName + '</div>'
  
  // Player 1 of Team 1
  SET player1 = getPlayerDetails(team1.Player1ID)
  SET hasSub1 = subs.some(sub => sub.RegularPlayerID === player1.PlayerID)
  SET activePlayer1ID = hasSub1 ? getSubstituteID(subs, player1.PlayerID) : player1.PlayerID
  SET activeName1 = hasSub1 ? getSubstituteName(subs, player1.PlayerID) : player1.FirstName + ' ' + player1.LastName
  
  html += '<div class="player-score-entry">'
  html += '<div class="player-name">' + activeName1 + (hasSub1 ? ' (Sub)' : '') +

FUNCTION generateScoreEntryForm(scheduleID) (continued)
  html += '<div class="player-name">' + activeName1 + (hasSub1 ? ' (Sub)' : '') + '</div>'
  html += '<input type="number" id="score-' + activePlayer1ID + '" class="score-input" min="0" max="900">'
  html += '</div>'
  
  // Player 2 of Team 1
  SET player2 = getPlayerDetails(team1.Player2ID)
  SET hasSub2 = subs.some(sub => sub.RegularPlayerID === player2.PlayerID)
  SET activePlayer2ID = hasSub2 ? getSubstituteID(subs, player2.PlayerID) : player2.PlayerID
  SET activeName2 = hasSub2 ? getSubstituteName(subs, player2.PlayerID) : player2.FirstName + ' ' + player2.LastName
  
  html += '<div class="player-score-entry">'
  html += '<div class="player-name">' + activeName2 + (hasSub2 ? ' (Sub)' : '') + '</div>'
  html += '<input type="number" id="score-' + activePlayer2ID + '" class="score-input" min="0" max="900">'
  html += '</div>'
  
  html += '</div>' // End team 1
  
  // Team 2 score entry (similar structure)
  html += '<div class="team-score-entry">'
  html += '<div class="team-header">' + team2.TeamName + '</div>'
  
  // Player 1 of Team 2
  SET player3 = getPlayerDetails(team2.Player1ID)
  SET hasSub3 = subs.some(sub => sub.RegularPlayerID === player3.PlayerID)
  SET activePlayer3ID = hasSub3 ? getSubstituteID(subs, player3.PlayerID) : player3.PlayerID
  SET activeName3 = hasSub3 ? getSubstituteName(subs, player3.PlayerID) : player3.FirstName + ' ' + player3.LastName
  
  html += '<div class="player-score-entry">'
  html += '<div class="player-name">' + activeName3 + (hasSub3 ? ' (Sub)' : '') + '</div>'
  html += '<input type="number" id="score-' + activePlayer3ID + '" class="score-input" min="0" max="900">'
  html += '</div>'
  
  // Player 2 of Team 2
  SET player4 = getPlayerDetails(team2.Player2ID)
  SET hasSub4 = subs.some(sub => sub.RegularPlayerID === player4.PlayerID)
  SET activePlayer4ID = hasSub4 ? getSubstituteID(subs, player4.PlayerID) : player4.PlayerID
  SET activeName4 = hasSub4 ? getSubstituteName(subs, player4.PlayerID) : player4.FirstName + ' ' + player4.LastName
  
  html += '<div class="player-score-entry">'
  html += '<div class="player-name">' + activeName4 + (hasSub4 ? ' (Sub)' : '') + '</div>'
  html += '<input type="number" id="score-' + activePlayer4ID + '" class="score-input" min="0" max="900">'
  html += '</div>'
  
  html += '</div>' // End team 2
  
  // Submit button
  html += '<div class="button-container">'
  html += '<button id="submit-scores" onclick="submitScores(\'' + scheduleID + '\')">Submit Scores</button>'
  html += '</div>'
  
  html += '</div>' // End score entry container
  
  RETURN html
END FUNCTION

FUNCTION generateSubstituteForm(scheduleID)
  // Get match details
  SET matchData = findRecordByID("WeeklySchedule", "ScheduleID", scheduleID)
  
  // Get team details
  SET team1 = getTeamDetails(matchData.Team1ID)
  SET team2 = getTeamDetails(matchData.Team2ID)
  
  // Start building HTML
  SET html = '<div class="substitute-form-container">'
  html += '<h2>Register Substitute Player</h2>'
  html += '<div class="match-info">Lane ' + matchData.LaneNumber + ' - Week ' + matchData.WeekNumber + ' Round ' + matchData.WeeklyRoundNumber + '</div>'
  
  // Player selection dropdown
  html += '<div class="form-group">'
  html += '<label for="regular-player">Player Needing Substitute:</label>'
  html += '<select id="regular-player" class="form-select">'
  html += '<option value="">-- Select Player --</option>'
  
  // Add team 1 players
  html += '<optgroup label="' + team1.TeamName + '">'
  html += '<option value="' + team1.Player1ID + '">' + getPlayerName(team1.Player1ID) + '</option>'
  html += '<option value="' + team1.Player2ID + '">' + getPlayerName(team1.Player2ID) + '</option>'
  html += '</optgroup>'
  
  // Add team 2 players
  html += '<optgroup label="' + team2.TeamName + '">'
  html += '<option value="' + team2.Player1ID + '">' + getPlayerName(team2.Player1ID) + '</option>'
  html += '<option value="' + team2.Player2ID + '">' + getPlayerName(team2.Player2ID) + '</option>'
  html += '</optgroup>'
  
  html += '</select>'
  html += '</div>'
  
  // Substitute type selection
  html += '<div class="form-group">'
  html += '<label>Substitute Type:</label>'
  html += '<div class="radio-group">'
  html += '<input type="radio" id="registered-sub" name="sub-type" value="registered" checked>'
  html += '<label for="registered-sub">Registered Player</label>'
  html += '<input type="radio" id="guest-sub" name="sub-type" value="guest">'
  html += '<label for="guest-sub">Guest Substitute</label>'
  html += '</div>'
  html += '</div>'
  
  // Registered player selection (shown if "Registered Player" selected)
  html += '<div class="form-group" id="registered-sub-group">'
  html += '<label for="substitute-player">Select Substitute:</label>'
  html += '<select id="substitute-player" class="form-select">'
  html += '<option value="">-- Select Player --</option>'
  
  // Get eligible players
  SET eligibleSubs = getEligibleSubstitutes(matchData.Team1ID, matchData.Team2ID, matchData.WeekNumber)
  
  FOR EACH player IN eligibleSubs
    html += '<option value="' + player.PlayerID + '">' + player.FirstName + ' ' + player.LastName + '</option>'
  END FOR
  
  html += '</select>'
  html += '</div>'
  
  // Guest player details (shown if "Guest Substitute" selected)
  html += '<div class="form-group" id="guest-sub-group" style="display: none;">'
  html += '<label for="guest-name">Guest Name:</label>'
  html += '<input type="text" id="guest-name" class="form-input" placeholder="Enter guest name">'
  html += '</div>'
  
  // Pre-arranged checkbox
  html += '<div class="form-group">'
  html += '<div class="checkbox-group">'
  html += '<input type="checkbox" id="is-prearranged" checked>'
  html += '<label for="is-prearranged">This substitute was pre-arranged</label>'
  html += '</div>'
  html += '<div class="helper-text">Note: Non-prearranged substitutes will count as a forfeit for the match point.</div>'
  html += '</div>'
  
  // Notes field
  html += '<div class="form-group">'
  html += '<label for="sub-notes">Notes:</label>'
  html += '<textarea id="sub-notes" class="form-textarea" placeholder="Optional notes"></textarea>'
  html += '</div>'
  
  // Submit button
  html += '<div class="button-container">'
  html += '<button id="submit-substitute" onclick="registerSubstitute(\'' + scheduleID + '\')">Register Substitute</button>'
  html += '</div>'
  
  html += '</div>' // End substitute form container
  
  RETURN html
END FUNCTION
```

## 8. Technical Implementation Notes

### 8.1 Google Sheets Setup

When creating the Google Sheets database, follow these guidelines:

1. **Sheet Organization:**
   - Create each sheet as defined in the data structure section
   - Add appropriate headers to each sheet
   - Set up data validation for relevant columns (e.g., dropdowns for status fields)
   - Use appropriate cell formatting (dates, numbers, etc.)

2. **Named Ranges:**
   - Define named ranges for each table/sheet
   - Use named ranges for all script references to improve maintainability
   - Keep named range references updated if sheet structure changes

3. **Protected Ranges:**
   - Protect header rows to prevent accidental modification
   - Consider protecting formula cells that calculate critical values

4. **Hidden Sheets:**
   - Make utility sheets like SystemLog and Config "hidden" to reduce clutter
   - Keep calculation sheets separate from user-visible data

### 8.2 Apps Script Organization

1. **Project Structure:**
   - Create a consistent file naming convention
   - Group related functions together in the same script file
   - Use a modular approach with clear separation of concerns

2. **Code Style:**
   - Use consistent indentation and formatting
   - Add detailed comments, especially for complex logic
   - Create helper functions for repeated operations
   - Use descriptive variable and function names

3. **Error Handling:**
   - Implement try/catch blocks for all database operations
   - Log errors with contextual information
   - Provide user-friendly error messages
   - Use the centralized error handling system

4. **Performance Considerations:**
   - Minimize read/write operations to sheets
   - Batch operations when possible
   - Cache frequently accessed data
   - Use the Properties service for configuration

### 8.3 UI Implementation

1. **HTML Structure:**
   - Use responsive design principles
   - Implement a consistent layout across components
   - Use semantic HTML elements
   - Add appropriate CSS classes for styling

2. **CSS Styling:**
   - Create a central stylesheet for consistent appearance
   - Use variables for colors, fonts, and spacing
   - Implement media queries for different screen sizes
   - Add print-friendly styles for reports

3. **JavaScript:**
   - Separate concerns (DOM manipulation, data handling, etc.)
   - Add client-side validation for forms
   - Implement user-friendly feedback (loading indicators, success messages)
   - Ensure cross-browser compatibility

4. **User Experience:**
   - Minimize clicks for common operations
   - Add keyboard shortcuts where appropriate
   - Provide clear feedback for all user actions
   - Include help text for complex features

## 9. Testing Strategy

### 9.1 Unit Testing

1. **Function Testing:**
   - Test each function independently
   - Verify correct behavior with valid inputs
   - Test error handling with invalid inputs
   - Validate return values and side effects

2. **Data Validation:**
   - Test validation rules for all input fields
   - Verify required fields are enforced
   - Test boundary conditions (min/max values)
   - Check format validation (dates, emails, etc.)

### 9.2 Integration Testing

1. **Workflow Testing:**
   - Test complete workflows from start to finish
   - Verify data flows correctly between components
   - Test transaction integrity (no partial updates)
   - Validate calculations across multiple functions

2. **UI Testing:**
   - Test UI components in isolation
   - Verify form submissions work correctly
   - Test display components render properly
   - Validate user feedback mechanisms

### 9.3 System Testing

1. **End-to-End Testing:**
   - Test the complete system as users would experience it
   - Verify all components work together
   - Test realistic usage scenarios
   - Validate system integrity under load

2. **Edge Case Testing:**
   - Test with edge cases (e.g., odd number of teams)
   - Verify handling of rare conditions (e.g., both teams forfeit)
   - Test recovery from errors
   - Validate system boundaries

### 9.4 User Acceptance Testing

1. **Staff Testing:**
   - Have staff test the system with realistic scenarios
   - Collect feedback on usability and functionality
   - Verify training materials are adequate
   - Identify any missing features or issues

2. **Controlled Rollout:**
   - Deploy system in a controlled environment first
   - Test with a subset of users
   - Collect and address feedback
   - Gradually expand to full deployment

## 10. Deployment and Maintenance Plan

### 10.1 Deployment Process

1. **Setup and Configuration:**
   - Set up Google Sheets with all required tables
   - Deploy Apps Script code to production environment
   - Configure system settings in Config sheet
   - Set up necessary permissions and sharing

2. **Data Migration:**
   - Import existing player and team data
   - Validate imported data for integrity
   - Set up current season information
   - Generate initial schedules

3. **User Training:**
   - Conduct training sessions for staff
   - Create quick reference guides
   - Develop troubleshooting documentation
   - Establish support channels

4. **Go-Live:**
   - Communicate launch date to all stakeholders
   - Perform final system check
   - Activate the system
   - Monitor closely during initial period

### 10.2 Ongoing Maintenance

1. **Regular Backups:**
   - Implement scheduled backups of all data
   - Store backups in a secure location
   - Test restore procedures periodically
   - Document backup and recovery processes

2. **System Monitoring:**
   - Regularly review logs for errors or issues
   - Monitor system performance
   - Track usage patterns
   - Identify opportunities for optimization

3. **Feature Updates:**
   - Collect and prioritize enhancement requests
   - Develop new features in a staging environment
   - Test thoroughly before deployment
   - Document and communicate new features

4. **Seasonal Tasks:**
   - Archive completed seasons
   - Set up new seasons
   - Reset relevant statistics
   - Update any rule changes or configurations
