/**
 * config.gs
 * Configuration and Constants for Skeeball League Management System
 * Version: 1.0.0
 * Last Updated: 2024-03-XX
 * 
 * This file contains all configuration settings, constants, and shared utility functions
 * used throughout the application. It serves as the central point for system-wide settings.
 */

// Constants for sheet names and named ranges
const SHEETS = {
  PLAYERS: 'Players',
  TEAMS: 'Teams',
  SEASONS: 'Seasons',
  WEEKLY_SCHEDULE: 'WeeklySchedule',
  SCORES: 'Scores',
  SUBSTITUTE_PLAYERS: 'SubstitutePlayers',
  MATCH_RESULTS: 'MatchResults',
  TOP_TEAMS_RESTRICTION: 'TopTeamsRestriction',
  TEAM_STATS: 'TeamStats',
  PLAYER_STATS: 'PlayerStats',
  ACHIEVEMENTS: 'Achievements',
  SYSTEM_LOG: 'SystemLog',
  CONFIG: 'Config'
};

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

// Configuration validation rules
const CONFIG_RULES = {
  SystemName: { type: 'string', required: true },
  ActiveSeasonID: { type: 'string', required: false },
  DefaultSeasonWeeks: { type: 'number', min: 1, max: 52, required: true },
  DefaultRoundsPerNight: { type: 'number', min: 1, max: 10, required: true },
  EnableSubstitutes: { type: 'boolean', required: true },
  EnablePlayoffs: { type: 'boolean', required: true },
  DefaultPlayoffTeams: { type: 'number', min: 2, max: 16, required: true },
  RestrictTopTeams: { type: 'boolean', required: true },
  TopTeamsCount: { type: 'number', min: 1, max: 10, required: true }
};

/**
 * Gets a configuration value from the Config sheet
 * @param {string} key - The configuration key to retrieve
 * @return {string|null} The configuration value or null if not found
 */
function getConfig(key) {
  const configSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEETS.CONFIG);
  const configData = configSheet.getDataRange().getValues();
  
  for (let i = 1; i < configData.length; i++) {
    if (configData[i][0] === key) {
      return configData[i][1];
    }
  }
  
  return null;
}

/**
 * Sets a configuration value in the Config sheet
 * @param {string} key - The configuration key to set
 * @param {string} value - The value to set
 * @param {string} description - Optional description of the config
 * @return {boolean} True if successful, false otherwise
 */
function setConfig(key, value, description = null) {
  // Validate the config value first
  const validation = validateConfig(key, value);
  if (!validation.isValid) {
    throw new Error(`Invalid config value: ${validation.error}`);
  }
  
  const configSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEETS.CONFIG);
  const configData = configSheet.getDataRange().getValues();
  
  // Look for existing key
  for (let i = 1; i < configData.length; i++) {
    if (configData[i][0] === key) {
      // Update existing config
      configSheet.getRange(i + 1, 2).setValue(value);
      if (description) {
        configSheet.getRange(i + 1, 3).setValue(description);
      }
      configSheet.getRange(i + 1, 4).setValue(new Date());
      configSheet.getRange(i + 1, 5).setValue(Session.getActiveUser().getEmail());
      return true;
    }
  }
  
  // Add new config
  configSheet.appendRow([
    key,
    value,
    description || '',
    new Date(),
    Session.getActiveUser().getEmail()
  ]);
  
  return true;
}

/**
 * Validates a configuration value against defined rules
 * @param {string} key - The configuration key to validate
 * @param {string} value - The value to validate
 * @return {Object} Validation result {isValid: boolean, error: string}
 */
function validateConfig(key, value) {
  const rule = CONFIG_RULES[key];
  if (!rule) {
    return { isValid: false, error: `No validation rule found for ${key}` };
  }
  
  // Check required
  if (rule.required && (value === null || value === undefined || value === '')) {
    return { isValid: false, error: `${key} is required` };
  }
  
  // Type validation
  switch (rule.type) {
    case 'boolean':
      if (value !== 'TRUE' && value !== 'FALSE') {
        return { isValid: false, error: `${key} must be TRUE or FALSE` };
      }
      break;
      
    case 'number':
      const num = Number(value);
      if (isNaN(num)) {
        return { isValid: false, error: `${key} must be a number` };
      }
      if (rule.min !== undefined && num < rule.min) {
        return { isValid: false, error: `${key} must be at least ${rule.min}` };
      }
      if (rule.max !== undefined && num > rule.max) {
        return { isValid: false, error: `${key} must be no more than ${rule.max}` };
      }
      break;
      
    case 'string':
      if (typeof value !== 'string') {
        return { isValid: false, error: `${key} must be a string` };
      }
      break;
  }
  
  return { isValid: true, error: null };
}

// Test suite for config functions
function testConfigFunctions() {
  const tests = {
    testGetConfig: function() {
      // Test getting existing config
      const result = getConfig('SystemName');
      if (result !== 'Skeeball League Management System') {
        throw new Error('Failed to get existing config value');
      }
      
      // Test getting non-existent config
      const nullResult = getConfig('NonExistentKey');
      if (nullResult !== null) {
        throw new Error('Non-existent key should return null');
      }
    },
    
    testSetConfig: function() {
      // Test setting new config
      setConfig('TestKey', 'TestValue', 'Test Description');
      const result = getConfig('TestKey');
      if (result !== 'TestValue') {
        throw new Error('Failed to set and retrieve config value');
      }
      
      // Test updating existing config
      setConfig('TestKey', 'UpdatedValue');
      const updatedResult = getConfig('TestKey');
      if (updatedResult !== 'UpdatedValue') {
        throw new Error('Failed to update config value');
      }
    },
    
    testValidateConfig: function() {
      // Test valid config
      const validResult = validateConfig('EnableSubstitutes', 'TRUE');
      if (!validResult.isValid) {
        throw new Error('Valid config marked as invalid');
      }
      
      // Test invalid config
      const invalidResult = validateConfig('DefaultSeasonWeeks', 'NotANumber');
      if (invalidResult.isValid) {
        throw new Error('Invalid config marked as valid');
      }
    }
  };
  
  // Run all tests
  for (const [testName, testFn] of Object.entries(tests)) {
    try {
      testFn();
      Logger.log(`✓ ${testName} passed`);
    } catch (error) {
      Logger.log(`✗ ${testName} failed: ${error.message}`);
    }
  }
}
'@

# Write to errorHandler.gs
Set-Content -Path "07_TempDevGoogleSheets/googleSheets_Code/errorHandler.gs" -Value @'
[Previous errorHandler.gs code here]
'@

# Write to utilityFunctions.gs
Set-Content -Path "07_TempDevGoogleSheets/googleSheets_Code/utilityFunctions.gs" -Value @'
[Previous utilityFunctions.gs code here]
'@