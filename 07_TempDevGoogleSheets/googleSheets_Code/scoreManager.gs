 /**
 * scoreManager.gs
 * Score Management System for Skeeball League Management System
 * Version: 1.0.0
 * Last Updated: 2024-03-XX
 * 
 * This file handles all score-related operations including:
 * - Score entry and validation
 * - Score history tracking
 * - Match result processing
 * - Score statistics calculation
 */

/**
 * Enters scores for a match
 * @param {string} matchID - Match ID
 * @param {Array} scores - Array of player scores [player1Score, player2Score, player3Score, player4Score]
 * @return {Object} Result of score entry
 */
function enterMatchScores(matchID, scores) {
  try {
    // Validate match exists and is ready for scoring
    const match = getMatchDetails(matchID);
    if (!match) {
      return { success: false, error: 'Match not found' };
    }
    
    if (match.status === 'Completed') {
      return { success: false, error: 'Match already completed' };
    }
    
    // Validate scores
    const validation = validateScores(scores);
    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }
    
    // Calculate team totals
    const team1Total = scores[0] + scores[2];
    const team2Total = scores[1] + scores[3];
    
    // Determine winner
    const winningTeamID = team1Total > team2Total ? match.team1ID : 
                         team2Total > team1Total ? match.team2ID : null;
    
    // Update match results
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEETS.MATCH_RESULTS);
    const row = findRowByID(SHEETS.MATCH_RESULTS, 'MatchID', matchID);
    const headers = getHeaderIndices(SHEETS.MATCH_RESULTS);
    
    // Update individual scores
    for (let i = 0; i < 4; i++) {
      sheet.getRange(row, headers[`Player${i+1}Score`] + 1).setValue(scores[i]);
    }
    
    // Update team totals and winner
    sheet.getRange(row, headers['Team1Total'] + 1).setValue(team1Total);
    sheet.getRange(row, headers['Team2Total'] + 1).setValue(team2Total);
    sheet.getRange(row, headers['WinningTeamID'] + 1).setValue(winningTeamID);
    sheet.getRange(row, headers['Status'] + 1).setValue('Completed');
    
    // Update statistics
    updateTeamStatistics(match.team1ID);
    updateTeamStatistics(match.team2ID);
    updatePlayerStatistics(match.player1ID);
    updatePlayerStatistics(match.player2ID);
    updatePlayerStatistics(match.player3ID);
    updatePlayerStatistics(match.player4ID);
    
    return { 
      success: true, 
      matchResult: {
        team1Total: team1Total,
        team2Total: team2Total,
        winningTeamID: winningTeamID
      }
    };
    
  } catch (e) {
    handleError(e, 'Error entering match scores', 'ScoreManager');
    return { success: false, error: 'Internal error entering scores' };
  }
}

/**
 * Validates an array of scores
 * @param {Array} scores - Array of scores to validate
 * @return {Object} Validation result
 */
function validateScores(scores) {
  try {
    if (!Array.isArray(scores) || scores.length !== 4) {
      return { isValid: false, error: 'Invalid number of scores' };
    }
    
    for (let i = 0; i < scores.length; i++) {
      const score = scores[i];
      
      // Check if score is a number
      if (typeof score !== 'number') {
        return { isValid: false, error: `Score ${i+1} is not a number` };
      }
      
      // Check if score is within valid range (0-900)
      if (score < 0 || score > 900) {
        return { isValid: false, error: `Score ${i+1} is out of valid range` };
      }
      
      // Check if score is a multiple of 10 (valid Skeeball score)
      if (score % 10 !== 0) {
        return { isValid: false, error: `Score ${i+1} must be a multiple of 10` };
      }
    }
    
    return { isValid: true, error: null };
  } catch (e) {
    handleError(e, 'Error validating scores', 'ScoreManager');
    return { isValid: false, error: 'Internal validation error' };
  }
}

/**
 * Gets match details
 * @param {string} matchID - Match ID to retrieve
 * @return {Object|null} Match details or null if not found
 */
function getMatchDetails(matchID) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEETS.MATCH_RESULTS);
    const row = findRowByID(SHEETS.MATCH_RESULTS, 'MatchID', matchID);
    
    if (!row) {
      return null;
    }
    
    const headers = getHeaderIndices(SHEETS.MATCH_RESULTS);
    const data = sheet.getRange(row, 1, 1, Object.keys(headers).length).getValues()[0];
    
    return {
      matchID: matchID,
      team1ID: data[headers['Team1ID']],
      team2ID: data[headers['Team2ID']],
      player1ID: data[headers['Player1ID']],
      player2ID: data[headers['Player2ID']],
      player3ID: data[headers['Player3ID']],
      player4ID: data[headers['Player4ID']],
      status: data[headers['Status']]
    };
    
  } catch (e) {
    handleError(e, 'Error getting match details', 'ScoreManager');
    return null;
  }
}