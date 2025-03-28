/**
 * dataValidation.gs
 * Data Validation System for Skeeball League Management System
 * Version: 1.0.0
 * Last Updated: 2024-03-XX
 * 
 * This file provides centralized data validation functionality for all data
 * entering the system. It ensures data integrity and provides consistent
 * validation across all components.
 * 
 * Dependencies:
 * - config.gs (for SHEETS constant)
 * - errorHandler.gs (for error logging)
 * - utilityFunctions.gs (for utility functions)
 */

// Test suite for data validation functions
function testDataValidation() {
  const tests = {
    testValidatePlayer: function() {
      // Test valid player data
      const validPlayer = {
        FirstName: 'John',
        LastName: 'Doe',
        Email: 'john.doe@example.com',
        Phone: '123-456-7890',
        Status: 'Active'
      };
      const validResult = validatePlayer(validPlayer);
      if (!validResult.isValid) {
        throw new Error(`Valid player marked invalid: ${validResult.error}`);
      }
      
      // Test invalid player data
      const invalidPlayer = {
        FirstName: '',  // Empty name
        LastName: 'Doe',
        Email: 'not.an.email',  // Invalid email
        Phone: '123',  // Invalid phone
        Status: 'Invalid'  // Invalid status
      };
      const invalidResult = validatePlayer(invalidPlayer);
      if (invalidResult.isValid) {
        throw new Error('Invalid player marked as valid');
      }
    },
    
    testValidateTeam: function() {
      // Test valid team data
      const validTeam = {
        TeamName: 'Awesome Team',
        Player1ID: 'PLAYER_123',
        Player2ID: 'PLAYER_456',
        Status: 'Active',
        SeasonID: 'SEASON_789'
      };
      const validResult = validateTeam(validTeam);
      if (!validResult.isValid) {
        throw new Error(`Valid team marked invalid: ${validResult.error}`);
      }
      
      // Test invalid team data
      const invalidTeam = {
        TeamName: '',  // Empty name
        Player1ID: 'PLAYER_123',
        Player2ID: 'PLAYER_123',  // Same as Player1
        Status: 'Invalid',  // Invalid status
        SeasonID: ''  // Missing season
      };
      const invalidResult = validateTeam(invalidTeam);
      if (invalidResult.isValid) {
        throw new Error('Invalid team marked as valid');
      }
    },
    
    testValidateScore: function() {
      // Test valid score
      const validScore = {
        PlayerID: 'PLAYER_123',
        Score: 340,
        WeekNumber: 1,
        RoundNumber: 2
      };
      const validResult = validateScore(validScore);
      if (!validResult.isValid) {
        throw new Error(`Valid score marked invalid: ${validResult.error}`);
      }
      
      // Test invalid score
      const invalidScore = {
        PlayerID: 'PLAYER_123',
        Score: 1000,  // Impossible score
        WeekNumber: 0,  // Invalid week
        RoundNumber: 4  // Invalid round
      };
      const invalidResult = validateScore(invalidScore);
      if (invalidResult.isValid) {
        throw new Error('Invalid score marked as valid');
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

/**
 * Validates player data before insertion or update
 * @param {Object} playerData - The player data to validate
 * @return {Object} Validation result {isValid: boolean, error: string}
 */
function validatePlayer(playerData) {
  try {
    // Required fields
    if (!playerData.FirstName || !playerData.LastName) {
      return { isValid: false, error: 'First and last name are required' };
    }
    
    // Email validation
    if (playerData.Email && !validateEmail(playerData.Email)) {
      return { isValid: false, error: 'Invalid email format' };
    }
    
    // Phone validation (if provided)
    if (playerData.Phone) {
      const phoneRegex = /^\d{3}[-.]?\d{3}[-.]?\d{4}$/;
      if (!phoneRegex.test(playerData.Phone.replace(/\s/g, ''))) {
        return { isValid: false, error: 'Invalid phone number format' };
      }
    }
    
    // Status validation
    const validStatuses = ['Active', 'Inactive', 'Substitute'];
    if (!validStatuses.includes(playerData.Status)) {
      return { isValid: false, error: 'Invalid status' };
    }
    
    return { isValid: true, error: null };
  } catch (e) {
    handleError(e, 'Error validating player data', 'DataValidation');
    return { isValid: false, error: 'Internal validation error' };
  }
}

/**
 * Validates team data before insertion or update
 * @param {Object} teamData - The team data to validate
 * @return {Object} Validation result {isValid: boolean, error: string}
 */
function validateTeam(teamData) {
  try {
    // Required fields
    if (!teamData.TeamName) {
      return { isValid: false, error: 'Team name is required' };
    }
    
    if (!teamData.Player1ID || !teamData.Player2ID) {
      return { isValid: false, error: 'Both players are required' };
    }
    
    // Check for duplicate players
    if (teamData.Player1ID === teamData.Player2ID) {
      return { isValid: false, error: 'Cannot have the same player twice' };
    }
    
    // Status validation
    const validStatuses = ['Active', 'Inactive'];
    if (!validStatuses.includes(teamData.Status)) {
      return { isValid: false, error: 'Invalid status' };
    }
    
    // Season validation
    if (!teamData.SeasonID) {
      return { isValid: false, error: 'Season ID is required' };
    }
    
    return { isValid: true, error: null };
  } catch (e) {
    handleError(e, 'Error validating team data', 'DataValidation');
    return { isValid: false, error: 'Internal validation error' };
  }
}

/**
 * Validates score data before insertion
 * @param {Object} scoreData - The score data to validate
 * @return {Object} Validation result {isValid: boolean, error: string}
 */
function validateScore(scoreData) {
  try {
    // Required fields
    if (!scoreData.PlayerID) {
      return { isValid: false, error: 'Player ID is required' };
    }
    
    // Score validation (assuming max possible score is 900)
    if (!Number.isInteger(scoreData.Score) || scoreData.Score < 0 || scoreData.Score > 900) {
      return { isValid: false, error: 'Invalid score value' };
    }
    
    // Week number validation
    if (!Number.isInteger(scoreData.WeekNumber) || scoreData.WeekNumber < 1) {
      return { isValid: false, error: 'Invalid week number' };
    }
    
    // Round number validation (1-3 rounds per night)
    if (!Number.isInteger(scoreData.RoundNumber) || 
        scoreData.RoundNumber < 1 || 
        scoreData.RoundNumber > 3) {
      return { isValid: false, error: 'Invalid round number' };
    }
    
    return { isValid: true, error: null };
  } catch (e) {
    handleError(e, 'Error validating score data', 'DataValidation');
    return { isValid: false, error: 'Internal validation error' };
  }
}

/**
 * Validates season data before insertion or update
 * @param {Object} seasonData - The season data to validate
 * @return {Object} Validation result {isValid: boolean, error: string}
 */
function validateSeason(seasonData) {
  try {
    // Required fields
    if (!seasonData.SeasonName || !seasonData.SeasonNumber) {
      return { isValid: false, error: 'Season name and number are required' };
    }
    
    // Date validation
    if (!seasonData.StartDate || !seasonData.EndDate) {
      return { isValid: false, error: 'Start and end dates are required' };
    }
    
    const startDate = new Date(seasonData.StartDate);
    const endDate = new Date(seasonData.EndDate);
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return { isValid: false, error: 'Invalid date format' };
    }
    
    if (endDate <= startDate) {
      return { isValid: false, error: 'End date must be after start date' };
    }
    
    // Status validation
    const validStatuses = ['Upcoming', 'Active', 'Completed'];
    if (!validStatuses.includes(seasonData.Status)) {
      return { isValid: false, error: 'Invalid status' };
    }
    
    // Number of weeks validation
    if (!Number.isInteger(seasonData.NumberOfWeeks) || 
        seasonData.NumberOfWeeks < 1 || 
        seasonData.NumberOfWeeks > 52) {
      return { isValid: false, error: 'Invalid number of weeks' };
    }
    
    return { isValid: true, error: null };
  } catch (e) {
    handleError(e, 'Error validating season data', 'DataValidation');
    return { isValid: false, error: 'Internal validation error' };
  }
}