/**
 * utilityFunctions.gs
 * Utility Functions for Skeeball League Management System
 * Version: 1.0.1
 * Last Updated: 2024-03-XX
 * 
 * This file contains shared utility functions used throughout the application.
 * 
 * Updates:
 * - Added JSON data management functions
 * - Added team statistics and analysis functions
 * - Added comprehensive test suite
 * 
 * Dependencies:
 * - config.gs (for SHEETS constant)
 * - errorHandler.gs (for error logging)
 */

/**
 * =============================================================================
 * Core Utility Functions
 * Base functionality used throughout the application
 * =============================================================================
 */

/**
 * Generates a unique ID with optional prefix
 * @param {string} prefix - Optional prefix for the ID
 * @return {string} Unique ID
 */
function generateUniqueID(prefix = '') {
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 10000);
  return `${prefix}${timestamp}_${random}`;
}

/**
 * Finds a row by ID in a specified sheet
 * @param {string} sheetName - Name of the sheet to search
 * @param {string} idColumnName - Name of the ID column
 * @param {string} idValue - ID to find
 * @return {number|null} Row number or null if not found
 */
function findRowByID(sheetName, idColumnName, idValue) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const idColumn = headers.indexOf(idColumnName);
    
    if (idColumn === -1) {
      throw new Error(`Column ${idColumnName} not found in ${sheetName}`);
    }
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][idColumn] === idValue) {
        return i + 1;
      }
    }
    
    return null;
  } catch (e) {
    handleError(e, `Error finding row by ID in ${sheetName}`, 'UtilityFunctions');
    return null;
  }
}

/**
 * Gets the header row indices for a sheet
 * @param {string} sheetName - Name of the sheet
 * @return {Object} Map of header names to column indices
 */
function getHeaderIndices(sheetName) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    
    const headerMap = {};
    headers.forEach((header, index) => {
      headerMap[header] = index;
    });
    
    return headerMap;
  } catch (e) {
    handleError(e, `Error getting header indices for ${sheetName}`, 'UtilityFunctions');
    return null;
  }
}

/**
 * Formats a date in standard format
 * @param {Date} date - Date to format
 * @return {string} Formatted date string
 */
function formatDate(date) {
  return Utilities.formatDate(date, Session.getScriptTimeZone(), 'yyyy-MM-dd');
}

/**
 * Validates an email address
 * @param {string} email - Email to validate
 * @return {boolean} Whether email is valid
 */
function validateEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

// ... (previous code remains the same until JSON Data Management section) ...

/**
 * =============================================================================
 * JSON Data Management Functions
 * Functions for handling JSON data storage and retrieval
 * =============================================================================
 */

/**
 * Updates the teams played against for a team
 * @param {string} teamID - ID of the team to update
 * @param {string} opposingTeamID - ID of team they played against
 * @return {Object} Result of operation {success: boolean, error?: string}
 */
function updateTeamMatchHistory(teamID, opposingTeamID) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEETS.TEAMS);
    const row = findRowByID(SHEETS.TEAMS, 'TeamID', teamID);
    
    if (!row) {
      return { success: false, error: 'Team not found' };
    }
    
    const headerIndices = getHeaderIndices(SHEETS.TEAMS);
    const playedAgainstCol = headerIndices['PlayedAgainstTeams'];
    const matchCountsCol = headerIndices['MatchCounts'];
    
    // Get current data
    let playedAgainst = [];
    let matchCounts = {};
    
    const playedAgainstValue = sheet.getRange(row, playedAgainstCol + 1).getValue();
    const matchCountsValue = sheet.getRange(row, matchCountsCol + 1).getValue();
    
    if (playedAgainstValue) {
      playedAgainst = JSON.parse(playedAgainstValue);
    }
    if (matchCountsValue) {
      matchCounts = JSON.parse(matchCountsValue);
    }
    
    // Update arrays
    if (!playedAgainst.includes(opposingTeamID)) {
      playedAgainst.push(opposingTeamID);
    }
    
    // Update match counts
    matchCounts[opposingTeamID] = (matchCounts[opposingTeamID] || 0) + 1;
    
    // Save updates
    sheet.getRange(row, playedAgainstCol + 1).setValue(JSON.stringify(playedAgainst));
    sheet.getRange(row, matchCountsCol + 1).setValue(JSON.stringify(matchCounts));
    
    return { success: true };
  } catch (e) {
    handleError(e, 'Error updating team match history', 'UtilityFunctions');
    return { success: false, error: 'Internal error updating match history' };
  }
}

/**
 * Gets the match history for a team
 * @param {string} teamID - ID of the team
 * @return {Object} Match history {playedAgainst: string[], matchCounts: Object}
 */
function getTeamMatchHistory(teamID) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEETS.TEAMS);
    const row = findRowByID(SHEETS.TEAMS, 'TeamID', teamID);
    
    if (!row) {
      return null;
    }
    
    const headerIndices = getHeaderIndices(SHEETS.TEAMS);
    const playedAgainstCol = headerIndices['PlayedAgainstTeams'];
    const matchCountsCol = headerIndices['MatchCounts'];
    
    const playedAgainstValue = sheet.getRange(row, playedAgainstCol + 1).getValue();
    const matchCountsValue = sheet.getRange(row, matchCountsCol + 1).getValue();
    
    return {
      playedAgainst: playedAgainstValue ? JSON.parse(playedAgainstValue) : [],
      matchCounts: matchCountsValue ? JSON.parse(matchCountsValue) : {}
    };
  } catch (e) {
    handleError(e, 'Error getting team match history', 'UtilityFunctions');
    return null;
  }
}

/**
 * =============================================================================
 * Team Statistics and Analysis Functions
 * Functions for analyzing team and player performance
 * =============================================================================
 */

/**
 * Gets comprehensive team statistics
 * @param {string} teamID - Team to analyze
 * @param {string} seasonID - Optional season filter
 * @return {Object} Team statistics
 */
function getTeamStats(teamID, seasonID = null) {
  try {
    const matchResults = SpreadsheetApp.getActiveSpreadsheet()
                          .getSheetByName(SHEETS.MATCH_RESULTS)
                          .getDataRange()
                          .getValues();
    
    const stats = {
      totalMatches: 0,
      wins: 0,
      losses: 0,
      totalPoints: 0,
      averagePoints: 0,
      highestScore: 0,
      lowestScore: 999999,
      winStreak: 0,
      currentStreak: 0,
      pointsByRound: {
        round1: 0,
        round2: 0,
        round3: 0
      },
      averageByRound: {
        round1: 0,
        round2: 0,
        round3: 0
      }
    };
    
    // Process match results
    for (const match of matchResults.slice(1)) { // Skip header
      if (seasonID && match[1] !== seasonID) continue; // SeasonID check
      
      if (match[6] === teamID || match[7] === teamID) { // Team1ID or Team2ID
        if (match[19] !== 'Completed') continue; // Only count completed matches
        
        stats.totalMatches++;
        const isTeam1 = match[6] === teamID;
        const teamScore = isTeam1 ? match[16] : match[17]; // Team1TotalScore or Team2TotalScore
        
        // Update win/loss stats
        if (match[18] === teamID) { // WinningTeamID
          stats.wins++;
          stats.currentStreak = stats.currentStreak > 0 ? stats.currentStreak + 1 : 1;
        } else {
          stats.losses++;
          stats.currentStreak = stats.currentStreak < 0 ? stats.currentStreak - 1 : -1;
        }
        
        // Update streaks
        stats.winStreak = Math.max(stats.winStreak, stats.currentStreak);
        
        // Update scores
        stats.totalPoints += teamScore;
        stats.highestScore = Math.max(stats.highestScore, teamScore);
        stats.lowestScore = Math.min(stats.lowestScore, teamScore);
        
        // Update round scores
        const roundScores = isTeam1 ? 
          [match[12], match[13], match[14]] : // Player1Score, Player2Score, Player3Score for Team1
          [match[13], match[14], match[15]];  // Player2Score, Player3Score, Player4Score for Team2
        
        stats.pointsByRound.round1 += roundScores[0] || 0;
        stats.pointsByRound.round2 += roundScores[1] || 0;
        stats.pointsByRound.round3 += roundScores[2] || 0;
      }
    }
    
    // Calculate averages
    if (stats.totalMatches > 0) {
      stats.averagePoints = stats.totalPoints / stats.totalMatches;
      stats.averageByRound.round1 = stats.pointsByRound.round1 / stats.totalMatches;
      stats.averageByRound.round2 = stats.pointsByRound.round2 / stats.totalMatches;
      stats.averageByRound.round3 = stats.pointsByRound.round3 / stats.totalMatches;
    }
    
    return stats;
  } catch (e) {
    handleError(e, 'Error getting team stats', 'UtilityFunctions');
    return null;
  }
}

/**
 * Gets head-to-head statistics between two teams
 * @param {string} team1ID - First team
 * @param {string} team2ID - Second team
 * @param {string} seasonID - Optional season filter
 * @return {Object} Head-to-head statistics
 */
function getHeadToHeadStats(team1ID, team2ID, seasonID = null) {
  try {
    const matchResults = SpreadsheetApp.getActiveSpreadsheet()
                          .getSheetByName(SHEETS.MATCH_RESULTS)
                          .getDataRange()
                          .getValues();
    
    const stats = {
      totalMatches: 0,
      team1Wins: 0,
      team2Wins: 0,
      team1TotalPoints: 0,
      team2TotalPoints: 0,
      team1HighScore: 0,
      team2HighScore: 0,
      lastMatch: null,
      matchHistory: []
    };
    
    // Process matches
    for (const match of matchResults.slice(1)) {
      if (seasonID && match[1] !== seasonID) continue;
      
      if ((match[6] === team1ID && match[7] === team2ID) ||
          (match[6] === team2ID && match[7] === team1ID)) {
            
        if (match[19] !== 'Completed') continue;
        
        stats.totalMatches++;
        const team1IsTeam1 = match[6] === team1ID;
        
        // Get scores
        const team1Score = team1IsTeam1 ? match[16] : match[17];
        const team2Score = team1IsTeam1 ? match[17] : match[16];
        
        // Update stats
        if (match[18] === team1ID) {
          stats.team1Wins++;
        } else {
          stats.team2Wins++;
        }
        
        stats.team1TotalPoints += team1Score;
        stats.team2TotalPoints += team2Score;
        stats.team1HighScore = Math.max(stats.team1HighScore, team1Score);
        stats.team2HighScore = Math.max(stats.team2HighScore, team2Score);
        
        // Track match history
        stats.matchHistory.push({
          date: match[4], // MatchDate
          team1Score: team1Score,
          team2Score: team2Score,
          winner: match[18]
        });
      }
    }
    
    // Sort match history by date and get last match
    stats.matchHistory.sort((a, b) => b.date - a.date);
    stats.lastMatch = stats.matchHistory[0] || null;
    
    // Calculate averages
    if (stats.totalMatches > 0) {
      stats.team1Average = stats.team1TotalPoints / stats.totalMatches;
      stats.team2Average = stats.team2TotalPoints / stats.totalMatches;
    }
    
    return stats;
  } catch (e) {
    handleError(e, 'Error getting head-to-head stats', 'UtilityFunctions');
    return null;
  }
}


/**
 * Gets player performance statistics
 * @param {string} playerID - Player to analyze
 * @param {string} seasonID - Optional season filter
 * @return {Object} Player statistics
 */
function getPlayerStats(playerID, seasonID = null) {
  try {
    const matchResults = SpreadsheetApp.getActiveSpreadsheet()
                          .getSheetByName(SHEETS.MATCH_RESULTS)
                          .getDataRange()
                          .getValues();
    
    const stats = {
      totalGames: 0,
      totalPoints: 0,
      averageScore: 0,
      highestScore: 0,
      lowestScore: 999999,
      scoresByPosition: {
        first: { total: 0, count: 0, avg: 0 },
        second: { total: 0, count: 0, avg: 0 },
        third: { total: 0, count: 0, avg: 0 },
        fourth: { total: 0, count: 0, avg: 0 }
      },
      scoresByLane: {
        lane1: { total: 0, count: 0, avg: 0 },
        lane2: { total: 0, count: 0, avg: 0 }
      },
      recentScores: [] // Last 5 scores
    };
    
    // Process matches
    for (const match of matchResults.slice(1)) {
      if (seasonID && match[1] !== seasonID) continue;
      if (match[19] !== 'Completed') continue;
      
      // Check all player positions
      for (let i = 8; i <= 11; i++) { // Player1ID to Player4ID
        if (match[i] === playerID) {
          const score = match[i + 4]; // Corresponding score column
          const position = i - 7; // 1-4
          const lane = match[5]; // LaneNumber
          
          stats.totalGames++;
          stats.totalPoints += score;
          stats.highestScore = Math.max(stats.highestScore, score);
          stats.lowestScore = Math.min(stats.lowestScore, score);
          
          // Update position stats
          const posKey = ['first', 'second', 'third', 'fourth'][position - 1];
          stats.scoresByPosition[posKey].total += score;
          stats.scoresByPosition[posKey].count++;
          
          // Update lane stats
          const laneKey = `lane${lane}`;
          stats.scoresByLane[laneKey].total += score;
          stats.scoresByLane[laneKey].count++;
          
          // Track recent scores
          stats.recentScores.push({
            date: match[4],
            score: score,
            position: position,
            lane: lane
          });
        }
      }
    }
    
    // Calculate averages
    if (stats.totalGames > 0) {
      stats.averageScore = stats.totalPoints / stats.totalGames;
      
      // Position averages
      Object.keys(stats.scoresByPosition).forEach(pos => {
        const posStats = stats.scoresByPosition[pos];
        if (posStats.count > 0) {
          posStats.avg = posStats.total / posStats.count;
        }
      });
      
      // Lane averages
      Object.keys(stats.scoresByLane).forEach(lane => {
        const laneStats = stats.scoresByLane[lane];
        if (laneStats.count > 0) {
          laneStats.avg = laneStats.total / laneStats.count;
        }
      });
    }
    
    // Sort and limit recent scores
    stats.recentScores.sort((a, b) => b.date - a.date);
    stats.recentScores = stats.recentScores.slice(0, 5);
    
    return stats;
  } catch (e) {
    handleError(e, 'Error getting player stats', 'UtilityFunctions');
    return null;
  }
}

/**
 * Analyzes lane performance statistics
 * @param {string} seasonID - Optional season filter
 * @return {Object} Lane statistics
 */
function getLaneStats(seasonID = null) {
  try {
    const matchResults = SpreadsheetApp.getActiveSpreadsheet()
                          .getSheetByName(SHEETS.MATCH_RESULTS)
                          .getDataRange()
                          .getValues();
    
    const stats = {
      lane1: {
        totalGames: 0,
        totalPoints: 0,
        averageScore: 0,
        highestScore: 0,
        timeOfDay: {
          early: { total: 0, count: 0, avg: 0 },
          middle: { total: 0, count: 0, avg: 0 },
          late: { total: 0, count: 0, avg: 0 }
        }
      },
      lane2: {
        totalGames: 0,
        totalPoints: 0,
        averageScore: 0,
        highestScore: 0,
        timeOfDay: {
          early: { total: 0, count: 0, avg: 0 },
          middle: { total: 0, count: 0, avg: 0 },
          late: { total: 0, count: 0, avg: 0 }
        }
      }
    };
    
    // Process matches
    for (const match of matchResults.slice(1)) {
      if (seasonID && match[1] !== seasonID) continue;
      if (match[19] !== 'Completed') continue;
      
      const lane = match[5];
      const laneStats = stats[`lane${lane}`];
      const matchTime = new Date(match[4]).getHours();
      
      // Determine time of day
      let timeSlot = 'middle';
      if (matchTime < 18) timeSlot = 'early';
      else if (matchTime >= 20) timeSlot = 'late';
      
      // Update stats
      laneStats.totalGames++;
      const totalMatchPoints = match[16] + match[17]; // Team1TotalScore + Team2TotalScore
      laneStats.totalPoints += totalMatchPoints;
      laneStats.highestScore = Math.max(laneStats.highestScore, totalMatchPoints);
      
      // Update time of day stats
      laneStats.timeOfDay[timeSlot].total += totalMatchPoints;
      laneStats.timeOfDay[timeSlot].count++;
    }
    
    // Calculate averages
    ['lane1', 'lane2'].forEach(lane => {
      const laneStats = stats[lane];
      if (laneStats.totalGames > 0) {
        laneStats.averageScore = laneStats.totalPoints / laneStats.totalGames;
        
        // Time of day averages
        Object.keys(laneStats.timeOfDay).forEach(timeSlot => {
          const timeStats = laneStats.timeOfDay[timeSlot];
          if (timeStats.count > 0) {
            timeStats.avg = timeStats.total / timeStats.count;
          }
        });
      }
    });
    
    return stats;
  } catch (e) {
    handleError(e, 'Error getting lane stats', 'UtilityFunctions');
    return null;
  }
}

/**
 * Calculates matchup compatibility score between two teams
 * @param {string} team1ID - First team
 * @param {string} team2ID - Second team
 * @return {Object} Compatibility metrics
 */
function calculateMatchupCompatibility(team1ID, team2ID) {
  try {
    const team1Stats = getTeamStats(team1ID);
    const team2Stats = getTeamStats(team2ID);
    const h2h = getHeadToHeadStats(team1ID, team2ID);
    
    if (!team1Stats || !team2Stats) {
      return null;
    }
    
    const compatibility = {
      skillMatch: 0,        // 0-100 score of how well matched the teams are
      competitiveness: 0,   // 0-100 score of how competitive their games are
      excitement: 0,        // 0-100 score based on close games and high scores
      overall: 0            // Weighted average of above scores
    };
    
    // Calculate skill match (closer averages = higher score)
    const avgDiff = Math.abs(team1Stats.averagePoints - team2Stats.averagePoints);
    compatibility.skillMatch = Math.max(0, 100 - (avgDiff * 2));
    
    // Calculate competitiveness (based on head-to-head if available)
    if (h2h && h2h.totalMatches > 0) {
      const winDiff = Math.abs(h2h.team1Wins - h2h.team2Wins);
      compatibility.competitiveness = Math.max(0, 100 - (winDiff / h2h.totalMatches * 100));
    } else {
      // Use overall records if no head-to-head
      const team1WinRate = team1Stats.wins / team1Stats.totalMatches;
      const team2WinRate = team2Stats.wins / team2Stats.totalMatches;
      const rateDiff = Math.abs(team1WinRate - team2WinRate);
      compatibility.competitiveness = Math.max(0, 100 - (rateDiff * 100));
    }
    
    // Calculate excitement factor
    const highScoreAvg = (team1Stats.highestScore + team2Stats.highestScore) / 2;
    const excitement = (highScoreAvg / 900) * 100; // Assuming 900 is max possible score
    compatibility.excitement = Math.min(100, excitement);
    
    // Calculate overall compatibility (weighted average)
    compatibility.overall = Math.round(
      (compatibility.skillMatch * 0.4) +
      (compatibility.competitiveness * 0.4) +
      (compatibility.excitement * 0.2)
    );
    
    return compatibility;
  } catch (e) {
    handleError(e, 'Error calculating matchup compatibility', 'UtilityFunctions');
    return null;
  }
}

/**
 * Analyzes trends for a team or player
 * @param {string} id - Team or player ID
 * @param {string} type - 'team' or 'player'
 * @param {number} gameCount - Number of recent games to analyze
 * @return {Object} Trend analysis
 */
function analyzeTrends(id, type, gameCount = 5) {
  try {
    const matchResults = SpreadsheetApp.getActiveSpreadsheet()
                          .getSheetByName(SHEETS.MATCH_RESULTS)
                          .getDataRange()
                          .getValues();
    
    const trends = {
      recentScores: [],
      scoresTrend: 'stable', // 'improving', 'declining', or 'stable'
      averageChange: 0,
      consistency: 0,        // 0-100 score
      momentum: 0           // -100 to 100 score
    };
    
    // Get recent scores
    const scores = [];
    for (const match of matchResults.slice(1)) {
      if (match[19] !== 'Completed') continue;
      
      if (type === 'team') {
        if (match[6] === id || match[7] === id) {
          const score = match[6] === id ? match[16] : match[17];
          scores.push({
            date: match[4],
            score: score
          });
        }
      } else { // player
        for (let i = 8; i <= 11; i++) {
          if (match[i] === id) {
            scores.push({
              date: match[4],
              score: match[i + 4]
            });
            break;
          }
        }
      }
    }
    
    // Sort by date and get recent scores
    scores.sort((a, b) => b.date - a.date);
    trends.recentScores = scores.slice(0, gameCount);
    
    if (trends.recentScores.length >= 2) {
      // Calculate score changes
      const changes = [];
      for (let i = 1; i < trends.recentScores.length; i++) {
        changes.push(trends.recentScores[i-1].score - trends.recentScores[i].score);
      }
      
      // Calculate average change
      trends.averageChange = changes.reduce((a, b) => a + b, 0) / changes.length;
      
      // Determine trend
      if (trends.averageChange > 10) trends.scoresTrend = 'improving';
      else if (trends.averageChange < -10) trends.scoresTrend = 'declining';
      
      // Calculate consistency (lower variance = higher consistency)
      const scores = trends.recentScores.map(s => s.score);
      const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
      const variance = scores.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / scores.length;
      trends.consistency = Math.max(0, 100 - (Math.sqrt(variance) / 2));
      
      // Calculate momentum (weighted recent performance)
      let momentum = 0;
      for (let i = 0; i < changes.length; i++) {
        const weight = 1 - (i / changes.length); // More recent games weighted higher
        momentum += changes[i] * weight;
      }
      trends.momentum = Math.max(-100, Math.min(100, momentum));
    }
    
    return trends;
  } catch (e) {
    handleError(e, 'Error analyzing trends', 'UtilityFunctions');
    return null;
  }
}