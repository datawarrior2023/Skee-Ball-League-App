 /**
 * substituteManager.gs
 * Substitute Player Management System for Skeeball League Management System
 * Version: 1.0.0
 * Last Updated: 2024-03-XX
 * 
 * This file handles all substitute player operations including:
 * - Substitute registration and eligibility
 * - Substitute assignment to matches
 * - Tracking substitute usage
 * - Substitute statistics
 */

/**
 * Registers a new substitute player
 * @param {Object} playerData - Player information
 * @return {Object} Result of registration
 */
function registerSubstitute(playerData) {
  try {
    // Validate player data
    const validation = validatePlayer(playerData);
    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }
    
    // Check if player already exists
    const existingPlayer = findPlayerByEmail(playerData.Email);
    if (existingPlayer) {
      return { success: false, error: 'Player already registered' };
    }
    
    // Generate player ID
    const playerID = generateUniqueID('SUB_');
    
    // Add to substitute players sheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEETS.SUBSTITUTE_PLAYERS);
    const headers = getHeaderIndices(SHEETS.SUBSTITUTE_PLAYERS);
    
    const newRow = [
      playerID,
      playerData.FirstName,
      playerData.LastName,
      playerData.Email,
      playerData.Phone || '',
      'Active', // Status
      new Date(), // Registration Date
      0, // Times Subbed
      JSON.stringify([]), // Teams Subbed For
      playerData.PreferredPosition || '',
      playerData.Availability || '',
      playerData.Notes || ''
    ];
    
    sheet.appendRow(newRow);
    
    return {
      success: true,
      playerID: playerID,
      message: 'Substitute player registered successfully'
    };
    
  } catch (e) {
    handleError(e, 'Error registering substitute', 'SubstituteManager');
    return { success: false, error: 'Internal error registering substitute' };
  }
}

/**
 * Assigns a substitute to a match
 * @param {string} matchID - Match ID
 * @param {string} substituteID - Substitute player ID
 * @param {string} replacedPlayerID - Player being replaced
 * @return {Object} Result of assignment
 */
function assignSubstitute(matchID, substituteID, replacedPlayerID) {
  try {
    // Validate substitute eligibility
    const eligibility = checkSubstituteEligibility(substituteID, matchID);
    if (!eligibility.isEligible) {
      return { success: false, error: eligibility.reason };
    }
    
    // Get match details
    const match = getMatchDetails(matchID);
    if (!match) {
      return { success: false, error: 'Match not found' };
    }
    
    if (match.status === 'Completed') {
      return { success: false, error: 'Cannot assign substitute to completed match' };
    }
    
    // Update match with substitute
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEETS.MATCH_RESULTS);
    const row = findRowByID(SHEETS.MATCH_RESULTS, 'MatchID', matchID);
    const headers = getHeaderIndices(SHEETS.MATCH_RESULTS);
    
    // Find position of replaced player
    let position = 0;
    for (let i = 1; i <= 4; i++) {
      if (match[`player${i}ID`] === replacedPlayerID) {
        position = i;
        break;
      }
    }
    
    if (!position) {
      return { success: false, error: 'Replaced player not found in match' };
    }
    
    // Update player position
    sheet.getRange(row, headers[`Player${position}ID`] + 1).setValue(substituteID);
    
    // Update substitute usage tracking
    updateSubstituteUsage(substituteID, match.team1ID, match.team2ID);
    
    return {
      success: true,
      message: 'Substitute assigned successfully'
    };
    
  } catch (e) {
    handleError(e, 'Error assigning substitute', 'SubstituteManager');
    return { success: false, error: 'Internal error assigning substitute' };
  }
}

/**
 * Checks if a substitute is eligible for a match
 * @param {string} substituteID - Substitute player ID
 * @param {string} matchID - Match ID
 * @return {Object} Eligibility result
 */
function checkSubstituteEligibility(substituteID, matchID) {
  try {
    const substitute = getSubstituteDetails(substituteID);
    if (!substitute) {
      return { isEligible: false, reason: 'Substitute not found' };
    }
    
    if (substitute.Status !== 'Active') {
      return { isEligible: false, reason: 'Substitute is not active' };
    }
    
    // Check if substitute has reached maximum allowed substitutions
    const maxSubs = parseInt(getConfig('MaxSubstitutionsPerSeason'));
    if (substitute.TimesSubbed >= maxSubs) {
      return { isEligible: false, reason: 'Substitute has reached maximum allowed substitutions' };
    }
    
    return { isEligible: true, reason: null };
    
  } catch (e) {
    handleError(e, 'Error checking substitute eligibility', 'SubstituteManager');
    return { isEligible: false, reason: 'Internal error checking eligibility' };
  }
}

/**
 * Updates substitute usage tracking
 * @param {string} substituteID - Substitute player ID
 * @param {string} team1ID - First team in match
 * @param {string} team2ID - Second team in match
 */
function updateSubstituteUsage(substituteID, team1ID, team2ID) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEETS.SUBSTITUTE_PLAYERS);
    const row = findRowByID(SHEETS.SUBSTITUTE_PLAYERS, 'PlayerID', substituteID);
    const headers = getHeaderIndices(SHEETS.SUBSTITUTE_PLAYERS);
    
    // Update times subbed
    const timesSubbed = sheet.getRange(row, headers['TimesSubbed'] + 1).getValue();
    sheet.getRange(row, headers['TimesSubbed'] + 1).setValue(timesSubbed + 1);
    
    // Update teams subbed for
    const teamsSubbedFor = JSON.parse(sheet.getRange(row, headers['TeamsSubbedFor'] + 1).getValue());
    const newTeam = team1ID; // Assuming substitute is for team1
    
    if (!teamsSubbedFor.includes(newTeam)) {
      teamsSubbedFor.push(newTeam);
      sheet.getRange(row, headers['TeamsSubbedFor'] + 1).setValue(JSON.stringify(teamsSubbedFor));
    }
    
  } catch (e) {
    handleError(e, 'Error updating substitute usage', 'SubstituteManager');
  }
}