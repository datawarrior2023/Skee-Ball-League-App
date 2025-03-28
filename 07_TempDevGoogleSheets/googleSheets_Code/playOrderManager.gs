 /**
 * playOrderManager.gs
 * Play Order Management System for Skeeball League Management System
 * Version: 1.0.0
 * Last Updated: 2024-03-XX
 * 
 * This file handles all play order operations including:
 * - Generating valid play order combinations
 * - Validating play order sequences
 * - Managing play order assignments
 * - Tracking historical play orders
 * 
 * Dependencies:
 * - config.gs (for SHEETS constant)
 * - errorHandler.gs (for error logging)
 * - utilityFunctions.gs (for utility functions)
 */

// Test suite for play order management
function testPlayOrderManager() {
  const tests = {
    testGeneratePlayOrders: function() {
      const teamA = {
        teamID: 'TEAM_A',
        players: [
          { playerID: 'PLAYER_A1', name: 'Player A1' },
          { playerID: 'PLAYER_A2', name: 'Player A2' }
        ]
      };
      
      const teamB = {
        teamID: 'TEAM_B',
        players: [
          { playerID: 'PLAYER_B1', name: 'Player B1' },
          { playerID: 'PLAYER_B2', name: 'Player B2' }
        ]
      };
      
      const orders = generateValidPlayOrders(teamA, teamB);
      
      // Should generate exactly 4 possible orders
      if (orders.length !== 4) {
        throw new Error(`Expected 4 play orders, got ${orders.length}`);
      }
      
      // Validate each order follows rules
      orders.forEach(order => {
        if (!validatePlayOrder(order, teamA, teamB)) {
          throw new Error('Generated invalid play order');
        }
      });
    },
    
    testValidatePlayOrder: function() {
      // Valid play order
      const validOrder = [
        'PLAYER_A1', 'PLAYER_B1', 'PLAYER_A2', 'PLAYER_B2'
      ];
      
      const teamA = {
        teamID: 'TEAM_A',
        players: [
          { playerID: 'PLAYER_A1' },
          { playerID: 'PLAYER_A2' }
        ]
      };
      
      const teamB = {
        teamID: 'TEAM_B',
        players: [
          { playerID: 'PLAYER_B1' },
          { playerID: 'PLAYER_B2' }
        ]
      };
      
      if (!validatePlayOrder(validOrder, teamA, teamB)) {
        throw new Error('Valid play order marked as invalid');
      }
      
      // Invalid play order (same team consecutive plays)
      const invalidOrder = [
        'PLAYER_A1', 'PLAYER_A2', 'PLAYER_B1', 'PLAYER_B2'
      ];
      
      if (validatePlayOrder(invalidOrder, teamA, teamB)) {
        throw new Error('Invalid play order marked as valid');
      }
    },
    
    testAssignPlayOrder: function() {
      const matchID = 'MATCH_TEST';
      const playOrder = [
        'PLAYER_A1', 'PLAYER_B1', 'PLAYER_A2', 'PLAYER_B2'
      ];
      
      const result = assignPlayOrder(matchID, playOrder);
      if (!result.success) {
        throw new Error('Failed to assign valid play order');
      }
      
      // Verify assignment
      const stored = getMatchPlayOrder(matchID);
      if (!arraysEqual(stored, playOrder)) {
        throw new Error('Stored play order does not match assigned order');
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
 * Generates all valid play order combinations for two teams
 * @param {Object} teamA - First team object with players
 * @param {Object} teamB - Second team object with players
 * @return {Array} Array of valid play order combinations
 */
function generateValidPlayOrders(teamA, teamB) {
  const orders = [];
  
  // Generate all possible combinations where Team A starts
  teamA.players.forEach(playerA1 => {
    teamB.players.forEach(playerB1 => {
      // Get remaining players
      const playerA2 = teamA.players.find(p => p.playerID !== playerA1.playerID);
      const playerB2 = teamB.players.find(p => p.playerID !== playerB1.playerID);
      
      // Add valid combinations
      orders.push([
        playerA1.playerID,
        playerB1.playerID,
        playerA2.playerID,
        playerB2.playerID
      ]);
      
      orders.push([
        playerA1.playerID,
        playerB2.playerID,
        playerA2.playerID,
        playerB1.playerID
      ]);
    });
  });
  
  return orders;
}

/**
 * Validates a play order sequence
 * @param {Array} playOrder - Array of player IDs in play order
 * @param {Object} teamA - First team object
 * @param {Object} teamB - Second team object
 * @return {boolean} Whether the play order is valid
 */
function validatePlayOrder(playOrder, teamA, teamB) {
  try {
    // Check length
    if (playOrder.length !== 4) {
      return false;
    }
    
    // Create sets of team players
    const teamAPlayers = new Set(teamA.players.map(p => p.playerID));
    const teamBPlayers = new Set(teamB.players.map(p => p.playerID));
    
    // Check all players are from correct teams
    const firstTeamPlayers = new Set([playOrder[0], playOrder[2]]);
    const secondTeamPlayers = new Set([playOrder[1], playOrder[3]]);
    
    // Verify team alternation
    const isTeamAFirst = teamAPlayers.has(playOrder[0]);
    if (isTeamAFirst) {
      if (!setEquals(firstTeamPlayers, teamAPlayers)) return false;
      if (!setEquals(secondTeamPlayers, teamBPlayers)) return false;
    } else {
      if (!setEquals(firstTeamPlayers, teamBPlayers)) return false;
      if (!setEquals(secondTeamPlayers, teamAPlayers)) return false;
    }
    
    return true;
  } catch (e) {
    handleError(e, 'Error validating play order', 'PlayOrderManager');
    return false;
  }
}

/**
 * Assigns a play order to a match
 * @param {string} matchID - ID of the match
 * @param {Array} playOrder - Array of player IDs in play order
 * @return {Object} Result of operation {success: boolean, error?: string}
 */
function assignPlayOrder(matchID, playOrder) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEETS.MATCH_RESULTS);
    const row = findRowByID(SHEETS.MATCH_RESULTS, 'MatchID', matchID);
    
    if (!row) {
      return { success: false, error: 'Match not found' };
    }
    
    // Update play order columns
    const headerIndices = getHeaderIndices(SHEETS.MATCH_RESULTS);
    for (let i = 0; i < playOrder.length; i++) {
      const column = headerIndices[`Player${i + 1}ID`];
      sheet.getRange(row, column + 1).setValue(playOrder[i]);
    }
    
    logInfo(`Assigned play order for match: ${matchID}`, 'PlayOrderManager');
    return { success: true };
    
  } catch (e) {
    handleError(e, 'Error assigning play order', 'PlayOrderManager');
    return { success: false, error: 'Internal error assigning play order' };
  }
}

/**
 * Gets the play order for a match
 * @param {string} matchID - ID of the match
 * @return {Array|null} Array of player IDs in play order or null if not found
 */
function getMatchPlayOrder(matchID) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEETS.MATCH_RESULTS);
    const row = findRowByID(SHEETS.MATCH_RESULTS, 'MatchID', matchID);
    
    if (!row) {
      return null;
    }
    
    const headerIndices = getHeaderIndices(SHEETS.MATCH_RESULTS);
    const playOrder = [];
    
    for (let i = 1; i <= 4; i++) {
      const column = headerIndices[`Player${i}ID`];
      const playerID = sheet.getRange(row, column + 1).getValue();
      playOrder.push(playerID);
    }
    
    return playOrder;
    
  } catch (e) {
    handleError(e, 'Error getting match play order', 'PlayOrderManager');
    return null;
  }
}

/**
 * Helper function to compare sets for equality
 * @param {Set} set1 - First set
 * @param {Set} set2 - Second set
 * @return {boolean} Whether the sets are equal
 */
function setEquals(set1, set2) {
  if (set1.size !== set2.size) return false;
  for (const item of set1) {
    if (!set2.has(item)) return false;
  }
  return true;
}

/**
 * Helper function to compare arrays for equality
 * @param {Array} arr1 - First array
 * @param {Array} arr2 - Second array
 * @return {boolean} Whether the arrays are equal
 */
function arraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;
  return arr1.every((val, index) => val === arr2[index]);
}