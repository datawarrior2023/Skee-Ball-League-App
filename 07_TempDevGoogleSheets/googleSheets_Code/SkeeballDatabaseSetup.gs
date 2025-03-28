/**
 * Skeeball League Management System
 * Database Setup Script
 * Version: 1.0.1
 * Last Updated: 2024-03-XX
 * 
 * Updates:
 * - Added play order columns to MatchResults
 * - Added match history tracking columns
 * - Updated data validation rules
 */

function setupDatabase() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Clear any existing sheets except the first one
  const sheets = ss.getSheets();
  for (let i = sheets.length - 1; i > 0; i--) {
    ss.deleteSheet(sheets[i]);
  }
  
  // Rename first sheet to Players
  let playersSheet = sheets[0];
  playersSheet.setName('Players');
  
  // Create all the sheets
  const teamsSheet = ss.insertSheet('Teams');
  const seasonsSheet = ss.insertSheet('Seasons');
  const weeklyScheduleSheet = ss.insertSheet('WeeklySchedule');
  const scoresSheet = ss.insertSheet('Scores');
  const substitutePlayersSheet = ss.insertSheet('SubstitutePlayers');
  const matchResultsSheet = ss.insertSheet('MatchResults');
  const topTeamsRestrictionSheet = ss.insertSheet('TopTeamsRestriction');
  const teamStatsSheet = ss.insertSheet('TeamStats');
  const playerStatsSheet = ss.insertSheet('PlayerStats');
  const achievementsSheet = ss.insertSheet('Achievements');
  const systemLogSheet = ss.insertSheet('SystemLog');
  const configSheet = ss.insertSheet('Config');
  
  // Setup all sheets with headers, validation, and formatting
  setupPlayersSheet(playersSheet);
  setupTeamsSheet(teamsSheet);
  setupSeasonsSheet(seasonsSheet);
  setupWeeklyScheduleSheet(weeklyScheduleSheet);
  setupScoresSheet(scoresSheet);
  setupSubstitutePlayersSheet(substitutePlayersSheet);
  setupMatchResultsSheet(matchResultsSheet);
  setupTopTeamsRestrictionSheet(topTeamsRestrictionSheet);
  setupTeamStatsSheet(teamStatsSheet);
  setupPlayerStatsSheet(playerStatsSheet);
  setupAchievementsSheet(achievementsSheet);
  setupSystemLogSheet(systemLogSheet);
  setupConfigSheet(configSheet);
  
  // Hide utility sheets
  systemLogSheet.hideSheet();
  configSheet.hideSheet();
  
  // Create named ranges
  createNamedRanges(ss);
  
  // Add initial config values
  addInitialConfig(configSheet);
  
  // Return to the first sheet
  ss.setActiveSheet(playersSheet);
  
  // Show completion message
  SpreadsheetApp.getUi().alert('Database setup complete!');
}

/**
 * Sets up the Players sheet with headers, validation, and formatting
 */
function setupPlayersSheet(sheet) {
  const headers = [
    'PlayerID', 'FirstName', 'LastName', 'Email', 'Phone', 'Status',
    'JoinDate', 'SeasonsPlayed', 'IsEligibleAsSub', 'EmergencyContactName',
    'EmergencyContactPhone', 'PaymentStatus', 'ProfilePicURL', 'IsEligibleForPlayoffs', 'Notes'
  ];
  
  // Add headers
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format headers
  formatHeaders(sheet, headers.length);
  
  // Add data validation
  // Status validation
  createDropdownValidation(sheet, 'F2:F1000', ['Active', 'Inactive', 'Substitute']);
  
  // Boolean validation
  createDropdownValidation(sheet, 'I2:I1000', ['TRUE', 'FALSE']);
  createDropdownValidation(sheet, 'N2:N1000', ['TRUE', 'FALSE']);
  
  // Payment status validation
  createDropdownValidation(sheet, 'L2:L1000', ['Paid', 'Unpaid', 'Partial']);
  
  // Date formatting
  sheet.getRange('G2:G1000').setNumberFormat('yyyy-mm-dd');
  
  // Protect header row
  protectHeaderRow(sheet);
  
  // Set column widths
  sheet.setColumnWidths(1, headers.length, 150);
  
  // Freeze header row
  sheet.setFrozenRows(1);
}

/**
 * Sets up the Teams sheet with headers, validation, and formatting
 */
function setupTeamsSheet(sheet) {
  const headers = [
    'TeamID', 'TeamName', 'Player1ID', 'Player2ID', 'Status',
    'SeasonID', 'FormationDate', 'IsEligibleForPlayoffs', 'Notes'
  ];
  
  // Add headers
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format headers
  formatHeaders(sheet, headers.length);
  
  // Add data validation
  // Status validation
  createDropdownValidation(sheet, 'E2:E1000', ['Active', 'Inactive']);
  
  // Boolean validation
  createDropdownValidation(sheet, 'H2:H1000', ['TRUE', 'FALSE']);
  
  // Date formatting
  sheet.getRange('G2:G1000').setNumberFormat('yyyy-mm-dd');
  
  // Protect header row
  protectHeaderRow(sheet);
  
  // Set column widths
  sheet.setColumnWidths(1, headers.length, 150);
  
  // Freeze header row
  sheet.setFrozenRows(1);
}

/**
 * Sets up the Seasons sheet with headers, validation, and formatting
 */
function setupSeasonsSheet(sheet) {
  const headers = [
    'SeasonID', 'SeasonName', 'SeasonNumber', 'StartDate', 'EndDate',
    'Status', 'NumberOfWeeks', 'IncludePlayoffs', 'PlayoffTeamCount', 'Notes'
  ];
  
  // Add headers
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format headers
  formatHeaders(sheet, headers.length);
  
  // Add data validation
  // Status validation
  createDropdownValidation(sheet, 'F2:F1000', ['Upcoming', 'Active', 'Completed']);
  
  // Boolean validation
  createDropdownValidation(sheet, 'H2:H1000', ['TRUE', 'FALSE']);
  
  // Date formatting
  sheet.getRange('D2:E1000').setNumberFormat('yyyy-mm-dd');
  
  // Protect header row
  protectHeaderRow(sheet);
  
  // Set column widths
  sheet.setColumnWidths(1, headers.length, 150);
  
  // Freeze header row
  sheet.setFrozenRows(1);
}

/**
 * Sets up the WeeklySchedule sheet with headers, validation, and formatting
 */
function setupWeeklyScheduleSheet(sheet) {
  const headers = [
    'ScheduleID', 'SeasonID', 'WeekNumber', 'WeeklyRoundNumber', 'CumulativeRoundNumber',
    'MatchDate', 'Team1ID', 'Team2ID', 'LaneNumber', 'Status'
  ];
  
  // Add headers
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format headers
  formatHeaders(sheet, headers.length);
  
  // Add data validation
  // Weekly round number validation
  createDropdownValidation(sheet, 'D2:D1000', ['1', '2', '3']);
  
  // Lane number validation
  createDropdownValidation(sheet, 'I2:I1000', ['1', '2']);
  
  // Status validation
  createDropdownValidation(sheet, 'J2:J1000', ['Scheduled', 'Completed', 'Postponed']);
  
  // Date formatting
  sheet.getRange('F2:F1000').setNumberFormat('yyyy-mm-dd');
  
  // Protect header row
  protectHeaderRow(sheet);
  
  // Set column widths
  sheet.setColumnWidths(1, headers.length, 150);
  
  // Freeze header row
  sheet.setFrozenRows(1);
}

/**
 * Sets up the Scores sheet with headers, validation, and formatting
 */
function setupScoresSheet(sheet) {
  const headers = [
    'ScoreID', 'ScheduleID', 'PlayerID', 'TeamID', 'Score',
    'IsSubstituteScore', 'RegularPlayerID', 'WeekNumber', 'WeeklyRoundNumber',
    'CumulativeRoundNumber', 'VerifiedBy', 'EntryTimestamp', 'Modified', 'ModificationReason'
  ];
  
  // Add headers
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format headers
  formatHeaders(sheet, headers.length);
  
  // Add data validation
  // Boolean validation
  createDropdownValidation(sheet, 'F2:F1000', ['TRUE', 'FALSE']);
  createDropdownValidation(sheet, 'M2:M1000', ['TRUE', 'FALSE']);
  
  // Weekly round number validation
  createDropdownValidation(sheet, 'I2:I1000', ['1', '2', '3']);
  
  // Timestamp formatting
  sheet.getRange('L2:L1000').setNumberFormat('yyyy-mm-dd hh:mm:ss');
  
  // Protect header row
  protectHeaderRow(sheet);
  
  // Set column widths
  sheet.setColumnWidths(1, headers.length, 150);
  
  // Freeze header row
  sheet.setFrozenRows(1);
}

/**
 * Sets up the SubstitutePlayers sheet with headers, validation, and formatting
 */
function setupSubstitutePlayersSheet(sheet) {
  const headers = [
    'SubID', 'MatchID', 'RegularPlayerID', 'SubstitutePlayerID', 'SubstitutePlayerName',
    'TeamID', 'WeekNumber', 'WeeklyRoundNumber', 'CumulativeRoundNumber',
    'IsPreArranged', 'Status', 'Notes'
  ];
  
  // Add headers
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format headers
  formatHeaders(sheet, headers.length);
  
  // Add data validation
  // Boolean validation
  createDropdownValidation(sheet, 'J2:J1000', ['TRUE', 'FALSE']);
  
  // Weekly round number validation
  createDropdownValidation(sheet, 'H2:H1000', ['1', '2', '3']);
  
  // Status validation
  createDropdownValidation(sheet, 'K2:K1000', ['Pending', 'Approved', 'Completed']);
  
  // Protect header row
  protectHeaderRow(sheet);
  
  // Set column widths
  sheet.setColumnWidths(1, headers.length, 150);
  
  // Freeze header row
  sheet.setFrozenRows(1);
}

function setupMatchResultsSheet(sheet) {
  // Set headers
  const headers = [
    'MatchID',
    'SeasonID',
    'WeekNumber',
    'RoundNumber',
    'MatchDate',
    'LaneNumber',
    'Team1ID',
    'Team2ID',
    'Player1ID',    // First player to play
    'Player2ID',    // Second player to play
    'Player3ID',    // Third player to play
    'Player4ID',    // Fourth player to play
    'Player1Score', // Score for first player
    'Player2Score', // Score for second player
    'Player3Score', // Score for third player
    'Player4Score', // Score for fourth player
    'Team1TotalScore',
    'Team2TotalScore',
    'WinningTeamID',
    'Status',       // Scheduled, InProgress, Completed, Cancelled
    'Notes'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Add data validation
  const statusRange = sheet.getRange(2, headers.indexOf('Status') + 1, sheet.getMaxRows() - 1, 1);
  const statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Scheduled', 'InProgress', 'Completed', 'Cancelled'], true)
    .build();
  statusRange.setDataValidation(statusRule);
  
  // Format headers
  formatHeaders(sheet, headers.length);
}

function setupTeamsSheet(sheet) {
  // Set headers
  const headers = [
    'TeamID',
    'TeamName',
    'Player1ID',
    'Player2ID',
    'Status',
    'SeasonID',
    'FormationDate',
    'IsEligibleForPlayoffs',
    'PlayedAgainstTeams',  // JSON string array of TeamIDs played against
    'MatchCounts',         // JSON object of TeamID:count of matches played
    'Notes'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Add data validation
  const statusRange = sheet.getRange(2, headers.indexOf('Status') + 1, sheet.getMaxRows() - 1, 1);
  const statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Active', 'Inactive'], true)
    .build();
  statusRange.setDataValidation(statusRule);
  
  // Format headers
  formatHeaders(sheet, headers.length);
}

function setupWeeklyScheduleSheet(sheet) {
  // Set headers
  const headers = [
    'ScheduleID',
    'SeasonID',
    'WeekNumber',
    'ScheduleDate',
    'RoundNumber',
    'LaneNumber',
    'Team1ID',
    'Team2ID',
    'Team1FirstPlayer',  // PlayerID of team 1's first player
    'Team2FirstPlayer',  // PlayerID of team 2's first player
    'Status',
    'Notes'
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Add data validation
  const statusRange = sheet.getRange(2, headers.indexOf('Status') + 1, sheet.getMaxRows() - 1, 1);
  const statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Scheduled', 'InProgress', 'Completed', 'Cancelled'], true)
    .build();
  statusRange.setDataValidation(statusRule);
  
  // Format headers
  formatHeaders(sheet, headers.length);
}

// ... rest of existing code ...

/**
 * Creates named ranges for all sheets
 */
function createNamedRanges() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Define sheet ranges
  const ranges = {
    'Players_Table': 'Players!A:O',
    'Teams_Table': 'Teams!A:K',  // Updated to include new columns
    'Seasons_Table': 'Seasons!A:J',
    'WeeklySchedule_Table': 'WeeklySchedule!A:L',  // Updated to include new columns
    'Scores_Table': 'Scores!A:N',
    'SubstitutePlayers_Table': 'SubstitutePlayers!A:L',
    'MatchResults_Table': 'MatchResults!A:U',  // Updated to include new columns
    // ... rest of ranges ...
  };
  
  // Create/update named ranges
  for (const [name, range] of Object.entries(ranges)) {
    try {
      const existing = ss.getRangeByName(name);
      if (existing) {
        ss.removeNamedRange(name);
      }
      ss.setNamedRange(name, ss.getRange(range));
    } catch (e) {
      Logger.log(`Error creating named range ${name}: ${e.message}`);
    }
  }
}

/**
 * Sets up the TopTeamsRestriction sheet with headers, validation, and formatting
 */
function setupTopTeamsRestrictionSheet(sheet) {
  const headers = [
    'RestrictionID', 'SeasonID', 'WeekNumber', 'TeamID', 'RestrictionReason', 'IsActive'
  ];
  
  // Add headers
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format headers
  formatHeaders(sheet, headers.length);
  
  // Add data validation
  // Boolean validation
  createDropdownValidation(sheet, 'F2:F1000', ['TRUE', 'FALSE']);
  
  // Protect header row
  protectHeaderRow(sheet);
  
  // Set column widths
  sheet.setColumnWidths(1, headers.length, 150);
  
  // Freeze header row
  sheet.setFrozenRows(1);
}

/**
 * Sets up the TeamStats sheet with headers, validation, and formatting
 */
function setupTeamStatsSheet(sheet) {
  const headers = [
    'StatID', 'TeamID', 'SeasonID', 'SeasonNumber', 'WeekNumber',
    'WeeklyRoundNumber', 'CumulativeRoundNumber', 'GamesPlayed', 'Wins',
    'Losses', 'Ties', 'Forfeits', 'MatchPoints', 'TotalScore',
    'AverageScore', 'HighestScore', 'CurrentRank', 'LastUpdated'
  ];
  
  // Add headers
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format headers
  formatHeaders(sheet, headers.length);
  
  // Timestamp formatting
  sheet.getRange('R2:R1000').setNumberFormat('yyyy-mm-dd hh:mm:ss');
  
  // Protect header row
  protectHeaderRow(sheet);
  
  // Set column widths
  sheet.setColumnWidths(1, headers.length, 150);
  
  // Freeze header row
  sheet.setFrozenRows(1);
}

/**
 * Sets up the PlayerStats sheet with headers, validation, and formatting
 */
function setupPlayerStatsSheet(sheet) {
  const headers = [
    'StatID', 'PlayerID', 'SeasonID', 'SeasonNumber', 'WeekNumber',
    'WeeklyRoundNumber', 'CumulativeRoundNumber', 'GamesPlayed', 'SubAppearances',
    'TotalScore', 'AverageScore', 'HighestScore', 'LastUpdated'
  ];
  
  // Add headers
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format headers
  formatHeaders(sheet, headers.length);
  
  // Timestamp formatting
  sheet.getRange('M2:M1000').setNumberFormat('yyyy-mm-dd hh:mm:ss');
  
  // Protect header row
  protectHeaderRow(sheet);
  
  // Set column widths
  sheet.setColumnWidths(1, headers.length, 150);
  
  // Freeze header row
  sheet.setFrozenRows(1);
}

/**
 * Sets up the Achievements sheet with headers, validation, and formatting
 */
function setupAchievementsSheet(sheet) {
  const headers = [
    'AchievementID', 'PlayerID', 'AchievementType', 'AchievementDate', 'WeekNumber',
    'WeeklyRoundNumber', 'CumulativeRoundNumber', 'Description', 'ScoreID', 'IsPublic'
  ];
  
  // Add headers
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format headers
  formatHeaders(sheet, headers.length);
  
  // Add data validation
  // Weekly round number validation
  createDropdownValidation(sheet, 'F2:F1000', ['1', '2', '3']);
  
  // Boolean validation
  createDropdownValidation(sheet, 'J2:J1000', ['TRUE', 'FALSE']);
  
  // Date formatting
  sheet.getRange('D2:D1000').setNumberFormat('yyyy-mm-dd');
  
  // Achievement type validation
  createDropdownValidation(sheet, 'C2:C1000', ['High Score', 'Perfect Game', 'Most Improved', 'Consistent Player', 'Other']);
  
  // Protect header row
  protectHeaderRow(sheet);
  
  // Set column widths
  sheet.setColumnWidths(1, headers.length, 150);
  
  // Freeze header row
  sheet.setFrozenRows(1);
}

/**
 * Sets up the SystemLog sheet with headers, validation, and formatting
 */
function setupSystemLogSheet(sheet) {
  const headers = [
    'LogID', 'Timestamp', 'EventType', 'Component', 'Message', 'UserEmail', 'StackTrace'
  ];
  
  // Add headers
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format headers
  formatHeaders(sheet, headers.length);
  
  // Add data validation
  // Event type validation
  createDropdownValidation(sheet, 'C2:C1000', ['Error', 'Warning', 'Info']);
  
  // Timestamp formatting
  sheet.getRange('B2:B1000').setNumberFormat('yyyy-mm-dd hh:mm:ss');
  
  // Protect header row
  protectHeaderRow(sheet);
  
  // Set column widths
  sheet.setColumnWidths(1, headers.length, 150);
  
  // Freeze header row
  sheet.setFrozenRows(1);
}

/**
 * Sets up the Config sheet with headers, validation, and formatting
 */
function setupConfigSheet(sheet) {
  const headers = [
    'ConfigKey', 'ConfigValue', 'Description', 'LastModified', 'ModifiedBy'
  ];
  
  // Add headers
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format headers
  formatHeaders(sheet, headers.length);
  
  // Timestamp formatting
  sheet.getRange('D2:D1000').setNumberFormat('yyyy-mm-dd hh:mm:ss');
  
  // Protect header row and entire sheet
  sheet.protect().setDescription('Config protection').setWarningOnly(false);
  
  // Set column widths
  sheet.setColumnWidths(1, headers.length, 200);
  
  // Freeze header row
  sheet.setFrozenRows(1);
}

/**
 * Formats headers with bold text, background color, and borders
 */
function formatHeaders(sheet, columnCount) {
  const headerRange = sheet.getRange(1, 1, 1, columnCount);
  
  headerRange
    .setBackground('#4285F4')
    .setFontColor('#FFFFFF')
    .setFontWeight('bold')
    .setBorder(true, true, true, true, true, true, '#000000', SpreadsheetApp.BorderStyle.SOLID);
}

/**
 * Creates a dropdown validation for a range
 */
function createDropdownValidation(sheet, range, values) {
  const rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(values, true)
    .setAllowInvalid(false)
    .build();
  
  sheet.getRange(range).setDataValidation(rule);
}

/**
 * Protects the header row of a sheet
 */
function protectHeaderRow(sheet) {
  const protection = sheet.getRange(1, 1, 1, sheet.getLastColumn()).protect();
  protection.setDescription('Header protection');
  protection.setWarningOnly(false);
}

/**
 * Creates named ranges for all tables in the spreadsheet
 */
function createNamedRanges(ss) {
  // Define the ranges
  const namedRanges = {
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
  
  // Create each named range
  for (const [name, range] of Object.entries(namedRanges)) {
    // Remove any existing named range with the same name
    const existingRange = ss.getRangeByName(name);
    if (existingRange) {
      ss.removeNamedRange(name);
    }
    
    // Create the new named range
    ss.setNamedRange(name, ss.getRange(range));
  }
}

/**
 * Adds initial configuration values
 */
function addInitialConfig(sheet) {
  const timestamp = new Date();
  const userEmail = Session.getActiveUser().getEmail();
  
  const configData = [
    ['ActiveSeasonID', '', 'Current active season identifier', timestamp, userEmail],
    ['SystemName', 'Skeeball League Management System', 'Name of the system', timestamp, userEmail],
    ['DefaultSeasonWeeks', '7', 'Default number of weeks in a season', timestamp, userEmail],
    ['DefaultRoundsPerNight', '3', 'Default number of rounds per league night', timestamp, userEmail],
    ['EnableSubstitutes', 'TRUE', 'Whether substitutes are allowed', timestamp, userEmail],
    ['EnablePlayoffs', 'TRUE', 'Whether playoffs are enabled', timestamp, userEmail],
    ['DefaultPlayoffTeams', '4', 'Default number of teams in playoffs', timestamp, userEmail],
    ['RestrictTopTeams', 'TRUE', 'Whether to restrict top teams from substituting', timestamp, userEmail],
    ['TopTeamsCount', '3', 'Number of top teams to restrict', timestamp, userEmail]
  ];
  
  sheet.getRange(2, 1, configData.length, 5).setValues(configData);
}

/**
 * Creates menu items for the spreadsheet
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  
  ui.createMenu('Skeeball League')
    .addItem('Setup Database', 'setupDatabase')
    .addSeparator()
    .addItem('About', 'showAbout')
    .addToUi();
}

/**
 * Shows information about the system
 */
function showAbout() {
  const ui = SpreadsheetApp.getUi();
  ui.alert(
    'Skeeball League Management System',
    'Database Setup Script\n\n' +
    'This script sets up the Google Sheets database structure for the Skeeball League Management System.',
    ui.ButtonSet.OK
  );
}