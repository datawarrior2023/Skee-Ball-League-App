/**
 * playerTeamManager.gs
 * Player and Team Management System for Skeeball League Management System
 * Version: 1.0.0
 * Last Updated: 2024-03-XX
 * 
 * This file handles all player and team management operations including:
 * - Player registration and updates
 * - Team creation and management
 * - Player-team relationships
 * - Status management
 * 
 * Dependencies:
 * - config.gs (for SHEETS constant)
 * - errorHandler.gs (for error logging)
 * - utilityFunctions.gs (for utility functions)
 * - dataValidation.gs (for data validation)
 */

// Test suite for player and team management
function testPlayerTeamManager() {
  const tests = {
    testAddPlayer: function() {
      // Test adding valid player
      const validPlayer = {
        FirstName: 'John',
        LastName: 'Test',
        Email: 'john.test@example.com',
        Phone: '123-456-7890',
        Status: 'Active'
      };
      const result = addPlayer(validPlayer);
      if (!result.success || !result.playerID) {
        throw new Error('Failed to add valid player');
      }
      
      // Test duplicate email
      const duplicatePlayer = {...validPlayer};
      const dupResult = addPlayer(duplicatePlayer);
      if (dupResult.success) {
        throw new Error('Should not allow duplicate email');
      }
      
      // Clean up test data
      deletePlayer(result.playerID);
    },
    
    testUpdatePlayer: function() {
      // Add test player
      const player = {
        FirstName: 'Update',
        LastName: 'Test',
        Email: 'update.test@example.com',
        Phone: '123-456-7890',
        Status: 'Active'
      };
      const addResult = addPlayer(player);
      
      // Test updating player
      const updates = {
        Phone: '987-654-3210',
        Status: 'Inactive'
      };
      const updateResult = updatePlayer(addResult.playerID, updates);
      if (!updateResult.success) {
        throw new Error('Failed to update player');
      }
      
      // Verify updates
      const updatedPlayer = getPlayer(addResult.playerID);
      if (updatedPlayer.Phone !== updates.Phone || 
          updatedPlayer.Status !== updates.Status) {
        throw new Error('Player updates not saved correctly');
      }
      
      // Clean up
      deletePlayer(addResult.playerID);
    },
    
    testCreateTeam: function() {
      // Add test players
      const player1 = addPlayer({
        FirstName: 'Team',
        LastName: 'Player1',
        Email: 'team.player1@example.com',
        Status: 'Active'
      });
      const player2 = addPlayer({
        FirstName: 'Team',
        LastName: 'Player2',
        Email: 'team.player2@example.com',
        Status: 'Active'
      });
      
      // Test creating valid team
      const teamData = {
        TeamName: 'Test Team',
        Player1ID: player1.playerID,
        Player2ID: player2.playerID,
        Status: 'Active',
        SeasonID: 'SEASON_TEST'
      };
      const result = createTeam(teamData);
      if (!result.success || !result.teamID) {
        throw new Error('Failed to create valid team');
      }
      
      // Clean up
      deleteTeam(result.teamID);
      deletePlayer(player1.playerID);
      deletePlayer(player2.playerID);
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
 * Adds a new player to the system
 * @param {Object} playerData - Player information
 * @return {Object} Result of operation {success: boolean, playerID?: string, error?: string}
 */
function addPlayer(playerData) {
  try {
    // Validate player data
    const validation = validatePlayer(playerData);
    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }
    
    // Check for duplicate email
    if (playerData.Email) {
      const existingPlayer = findPlayerByEmail(playerData.Email);
      if (existingPlayer) {
        return { success: false, error: 'Email already registered' };
      }
    }
    
    // Generate player ID
    const playerID = generateUniqueID('PLAYER_');
    
    // Prepare player row
    const playerRow = [
      playerID,
      playerData.FirstName,
      playerData.LastName,
      playerData.Email || '',
      playerData.Phone || '',
      playerData.Status,
      new Date(),  // JoinDate
      '',  // SeasonsPlayed
      playerData.IsEligibleAsSub || true,
      playerData.EmergencyContactName || '',
      playerData.EmergencyContactPhone || '',
      'Unpaid',  // Initial PaymentStatus
      '',  // ProfilePicURL
      true,  // IsEligibleForPlayoffs
      ''  // Notes
    ];
    
    // Add to Players sheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEETS.PLAYERS);
    sheet.appendRow(playerRow);
    
    logInfo(`Added new player: ${playerID}`, 'PlayerManager');
    return { success: true, playerID: playerID };
    
  } catch (e) {
    handleError(e, 'Error adding player', 'PlayerManager');
    return { success: false, error: 'Internal error adding player' };
  }
}

/**
 * Updates existing player information
 * @param {string} playerID - ID of player to update
 * @param {Object} updates - Fields to update
 * @return {Object} Result of operation {success: boolean, error?: string}
 */
function updatePlayer(playerID, updates) {
  try {
    // Get current player data
    const player = getPlayer(playerID);
    if (!player) {
      return { success: false, error: 'Player not found' };
    }
    
    // Merge updates with existing data
    const updatedData = {...player, ...updates};
    
    // Validate updated data
    const validation = validatePlayer(updatedData);
    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }
    
    // Find player row
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEETS.PLAYERS);
    const row = findRowByID(SHEETS.PLAYERS, 'PlayerID', playerID);
    if (!row) {
      return { success: false, error: 'Player row not found' };
    }
    
    // Update fields
    const headerIndices = getHeaderIndices(SHEETS.PLAYERS);
    for (const [field, value] of Object.entries(updates)) {
      if (headerIndices[field] !== undefined) {
        sheet.getRange(row, headerIndices[field] + 1).setValue(value);
      }
    }
    
    logInfo(`Updated player: ${playerID}`, 'PlayerManager');
    return { success: true };
    
  } catch (e) {
    handleError(e, 'Error updating player', 'PlayerManager');
    return { success: false, error: 'Internal error updating player' };
  }
}

/**
 * Creates a new team
 * @param {Object} teamData - Team information
 * @return {Object} Result of operation {success: boolean, teamID?: string, error?: string}
 */
function createTeam(teamData) {
  try {
    // Validate team data
    const validation = validateTeam(teamData);
    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }
    
    // Verify both players exist and are active
    const player1 = getPlayer(teamData.Player1ID);
    const player2 = getPlayer(teamData.Player2ID);
    
    if (!player1 || !player2) {
      return { success: false, error: 'One or both players not found' };
    }
    
    if (player1.Status !== 'Active' || player2.Status !== 'Active') {
      return { success: false, error: 'Both players must be active' };
    }
    
    // Generate team ID
    const teamID = generateUniqueID('TEAM_');
    
    // Prepare team row
    const teamRow = [
      teamID,
      teamData.TeamName,
      teamData.Player1ID,
      teamData.Player2ID,
      teamData.Status,
      teamData.SeasonID,
      new Date(),  // FormationDate
      true,  // IsEligibleForPlayoffs
      ''  // Notes
    ];
    
    // Add to Teams sheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEETS.TEAMS);
    sheet.appendRow(teamRow);
    
    logInfo(`Created new team: ${teamID}`, 'TeamManager');
    return { success: true, teamID: teamID };
    
  } catch (e) {
    handleError(e, 'Error creating team', 'TeamManager');
    return { success: false, error: 'Internal error creating team' };
  }
}

/**
 * Gets player information by ID
 * @param {string} playerID - ID of player to retrieve
 * @return {Object|null} Player data or null if not found
 */
function getPlayer(playerID) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEETS.PLAYERS);
    const row = findRowByID(SHEETS.PLAYERS, 'PlayerID', playerID);
    
    if (!row) {
      return null;
    }
    
    const headers = getHeaderIndices(SHEETS.PLAYERS);
    const data = sheet.getRange(row, 1, 1, Object.keys(headers).length).getValues()[0];
    
    const player = {};
    Object.entries(headers).forEach(([header, index]) => {
      player[header] = data[index];
    });
    
    return player;
    
  } catch (e) {
    handleError(e, 'Error getting player', 'PlayerManager');
    return null;
  }
}

/**
 * Finds a player by email address
 * @param {string} email - Email address to search for
 * @return {Object|null} Player data or null if not found
 */
function findPlayerByEmail(email) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEETS.PLAYERS);
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const emailCol = headers.indexOf('Email');
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][emailCol] === email) {
        const player = {};
        headers.forEach((header, index) => {
          player[header] = data[i][index];
        });
        return player;
      }
    }
    
    return null;
    
  } catch (e) {
    handleError(e, 'Error finding player by email', 'PlayerManager');
    return null;
  }
}

/**
 * Deletes a player (for testing purposes only)
 * @param {string} playerID - ID of player to delete
 * @return {boolean} Success of operation
 */
function deletePlayer(playerID) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEETS.PLAYERS);
    const row = findRowByID(SHEETS.PLAYERS, 'PlayerID', playerID);
    
    if (row) {
      sheet.deleteRow(row);
      return true;
    }
    
    return false;
    
  } catch (e) {
    handleError(e, 'Error deleting player', 'PlayerManager');
    return false;
  }
}

/**
 * Deletes a team (for testing purposes only)
 * @param {string} teamID - ID of team to delete
 * @return {boolean} Success of operation
 */
function deleteTeam(teamID) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEETS.TEAMS);
    const row = findRowByID(SHEETS.TEAMS, 'TeamID', teamID);
    
    if (row) {
      sheet.deleteRow(row);
      return true;
    }
    
    return false;
    
  } catch (e) {
    handleError(e, 'Error deleting team', 'TeamManager');
    return false;
  }
}