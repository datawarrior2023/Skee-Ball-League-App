 /**
 * standingsCalculator.gs
 * Standings Calculation System for Skeeball League Management System
 * Version: 1.0.0
 * Last Updated: 2024-03-XX
 * 
 * This file handles all standings-related calculations including:
 * - League standings
 * - Team rankings
 * - Tiebreakers
 * - Playoff qualification
 */

/**
 * Calculates current season standings
 * @param {string} seasonID - Season to calculate standings for
 * @return {Array} Sorted array of team standings
 */
function calculateSeasonStandings(seasonID) {
  try {
    const teams = getActiveTeams(seasonID);
    const standings = [];
    
    // Calculate standings for each team
    for (const team of teams) {
      const stats = calculateTeamStats(team.teamID, seasonID);
      standings.push({
        teamID: team.teamID,
        teamName: team.teamName,
        wins: stats.wins,
        losses: stats.losses,
        totalPoints: stats.totalPoints,
        averageScore: stats.averageScore,
        winPercentage: stats.wins / (stats.wins + stats.losses) || 0,
        rank: 0 // Will be set after sorting
      });
    }
    
    // Sort standings by win percentage, then points for tiebreaker
    standings.sort((a, b) => {
      if (a.winPercentage !== b.winPercentage) {
        return b.winPercentage - a.winPercentage;
      }
      return b.totalPoints - a.totalPoints;
    });
    
    // Assign ranks
    standings.forEach((team, index) => {
      team.rank = index + 1;
    });
    
    // Update standings sheet
    updateStandingsSheet(standings, seasonID);
    
    return standings;
    
  } catch (e) {
    handleError(e, 'Error calculating season standings', 'StandingsCalculator');
    return null;
  }
}

/**
 * Calculates team statistics for standings
 * @param {string} teamID - Team to calculate stats for
 * @param {string} seasonID - Season context
 * @return {Object} Team statistics
 */
function calculateTeamStats(teamID, seasonID) {
  try {
    const matchResults = SpreadsheetApp.getActiveSpreadsheet()
                          .getSheetByName(SHEETS.MATCH_RESULTS)
                          .getDataRange()
                          .getValues();
    
    const stats = {
      wins: 0,
      losses: 0,
      totalPoints: 0,
      matchesPlayed: 0,
      averageScore: 0
    };
    
    // Process match results
    for (const match of matchResults.slice(1)) { // Skip header row
      if (match[1] !== seasonID || match[19] !== 'Completed') continue;
      
      const isTeam1 = match[6] === teamID;
      const isTeam2 = match[7] === teamID;
      
      if (!isTeam1 && !isTeam2) continue;
      
      stats.matchesPlayed++;
      const teamScore = isTeam1 ? match[16] : match[17];
      stats.totalPoints += teamScore;
      
      if (match[18] === teamID) {
        stats.wins++;
      } else {
        stats.losses++;
      }
    }
    
    stats.averageScore = stats.matchesPlayed > 0 ? 
      stats.totalPoints / stats.matchesPlayed : 0;
    
    return stats;
    
  } catch (e) {
    handleError(e, 'Error calculating team stats', 'StandingsCalculator');
    return null;
  }
}

/**
 * Updates the standings sheet with current standings
 * @param {Array} standings - Current standings data
 * @param {string} seasonID - Season context
 * @return {boolean} Success of operation
 */
function updateStandingsSheet(standings, seasonID) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEETS.TEAM_STATS);
    
    // Create standings rows
    const standingsRows = standings.map(team => [
      seasonID,
      new Date(), // Last updated
      team.rank,
      team.teamID,
      team.teamName,
      team.wins,
      team.losses,
      team.winPercentage,
      team.totalPoints,
      team.averageScore
    ]);
    
    // Clear existing standings for this season
    const existingData = sheet.getDataRange().getValues();
    const lastRow = sheet.getLastRow();
    
    if (lastRow > 1) {
      sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).clearContent();
    }
    
    // Write new standings
    if (standingsRows.length > 0) {
      sheet.getRange(2, 1, standingsRows.length, standingsRows[0].length)
           .setValues(standingsRows);
    }
    
    return true;
    
  } catch (e) {
    handleError(e, 'Error updating standings sheet', 'StandingsCalculator');
    return false;
  }
}

/**
 * Determines playoff qualification status
 * @param {string} seasonID - Season to check
 * @return {Object} Playoff qualification results
 */
function determinePlayoffQualification(seasonID) {
  try {
    const standings = calculateSeasonStandings(seasonID);
    const playoffTeams = parseInt(getConfig('DefaultPlayoffTeams'));
    
    const qualifiedTeams = standings.slice(0, playoffTeams);
    const onBubble = standings.slice(playoffTeams, playoffTeams + 2);
    
    return {
      qualified: qualifiedTeams,
      onBubble: onBubble,
      eliminated: standings.slice(playoffTeams + 2)
    };
    
  } catch (e) {
    handleError(e, 'Error determining playoff qualification', 'StandingsCalculator');
    return null;
  }
}