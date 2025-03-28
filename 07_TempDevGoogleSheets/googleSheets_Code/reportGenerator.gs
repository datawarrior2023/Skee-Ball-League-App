 /**
 * reportGenerator.gs
 * Report Generation System for Skeeball League Management System
 * Version: 1.0.0
 * Last Updated: 2024-03-XX
 * 
 * This file handles all report generation including:
 * - League statistics reports
 * - Player performance reports
 * - Team analysis reports
 * - Season summary reports
 * - Custom report generation
 */

/**
 * Generates a complete league report
 * @param {string} seasonID - Season to generate report for
 * @return {Object} Complete league report data
 */
function generateLeagueReport(seasonID) {
  try {
    const report = {
      seasonInfo: getSeasonDetails(seasonID),
      standings: calculateSeasonStandings(seasonID),
      teamStats: generateTeamStatistics(seasonID),
      playerStats: generatePlayerStatistics(seasonID),
      matchHistory: generateMatchHistory(seasonID),
      trends: analyzeLeagueTrends(seasonID),
      timestamp: new Date()
    };
    
    // Save report to sheet
    saveReportToSheet(report, seasonID);
    
    return report;
  } catch (e) {
    handleError(e, 'Error generating league report', 'ReportGenerator');
    return null;
  }
}

/**
 * Generates detailed team statistics
 * @param {string} seasonID - Season context
 * @return {Array} Array of team statistics
 */
function generateTeamStatistics(seasonID) {
  try {
    const teams = getActiveTeams(seasonID);
    const teamStats = [];
    
    for (const team of teams) {
      const stats = {
        teamID: team.teamID,
        teamName: team.teamName,
        performance: getTeamStats(team.teamID, seasonID),
        matchupHistory: getTeamMatchupHistory(team.teamID),
        trends: analyzeTeamTrends(team.teamID, 5),
        playerPerformance: getTeamPlayerStats(team.teamID, seasonID)
      };
      
      teamStats.push(stats);
    }
    
    return teamStats;
  } catch (e) {
    handleError(e, 'Error generating team statistics', 'ReportGenerator');
    return null;
  }
}

/**
 * Generates detailed player statistics
 * @param {string} seasonID - Season context
 * @return {Array} Array of player statistics
 */
function generatePlayerStatistics(seasonID) {
  try {
    const players = getActivePlayers(seasonID);
    const playerStats = [];
    
    for (const player of players) {
      const stats = {
        playerID: player.playerID,
        playerName: `${player.firstName} ${player.lastName}`,
        performance: getPlayerStats(player.playerID, seasonID),
        trends: analyzePlayerTrends(player.playerID, 5),
        achievements: getPlayerAchievements(player.playerID)
      };
      
      playerStats.push(stats);
    }
    
    return playerStats;
  } catch (e) {
    handleError(e, 'Error generating player statistics', 'ReportGenerator');
    return null;
  }
}

/**
 * Generates match history report
 * @param {string} seasonID - Season context
 * @return {Array} Match history data
 */
function generateMatchHistory(seasonID) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEETS.MATCH_RESULTS);
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const matches = [];
    
    for (const row of data.slice(1)) {
      if (row[1] !== seasonID) continue;
      
      matches.push({
        matchID: row[headers.indexOf('MatchID')],
        date: row[headers.indexOf('MatchDate')],
        team1: {
          teamID: row[headers.indexOf('Team1ID')],
          score: row[headers.indexOf('Team1Total')]
        },
        team2: {
          teamID: row[headers.indexOf('Team2ID')],
          score: row[headers.indexOf('Team2Total')]
        },
        winner: row[headers.indexOf('WinningTeamID')],
        status: row[headers.indexOf('Status')]
      });
    }
    
    return matches;
  } catch (e) {
    handleError(e, 'Error generating match history', 'ReportGenerator');
    return null;
  }
}

/**
 * Analyzes league trends
 * @param {string} seasonID - Season to analyze
 * @return {Object} League trends analysis
 */
function analyzeLeagueTrends(seasonID) {
  try {
    const matches = generateMatchHistory(seasonID);
    const trends = {
      averageScores: calculateAverageScores(matches),
      competitiveness: analyzeCompetitiveness(matches),
      participation: analyzeParticipation(seasonID),
      improvements: analyzePlayerImprovements(seasonID)
    };
    
    return trends;
  } catch (e) {
    handleError(e, 'Error analyzing league trends', 'ReportGenerator');
    return null;
  }
}

/**
 * Saves report to sheet
 * @param {Object} report - Report data
 * @param {string} seasonID - Season context
 * @return {boolean} Success of operation
 */
function saveReportToSheet(report, seasonID) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEETS.TEAM_STATS);
    const reportData = formatReportForSheet(report);
    
    // Clear existing data
    sheet.clear();
    
    // Write headers
    sheet.getRange(1, 1, 1, reportData[0].length).setValues([reportData[0]]);
    
    // Write data
    if (reportData.length > 1) {
      sheet.getRange(2, 1, reportData.length - 1, reportData[0].length)
           .setValues(reportData.slice(1));
    }
    
    return true;
  } catch (e) {
    handleError(e, 'Error saving report to sheet', 'ReportGenerator');
    return false;
  }
}

/**
 * Formats report data for sheet output
 * @param {Object} report - Report data to format
 * @return {Array} Formatted data for sheet
 */
function formatReportForSheet(report) {
  // Convert report object to 2D array for sheet
  const headers = ['Season', 'Team', 'Wins', 'Losses', 'WinPercentage', 'TotalPoints', 
                  'AverageScore', 'HighScore', 'LowScore', 'Trend'];
  const data = [headers];
  
  report.teamStats.forEach(team => {
    data.push([
      report.seasonInfo.seasonID,
      team.teamName,
      team.performance.wins,
      team.performance.losses,
      team.performance.winPercentage,
      team.performance.totalPoints,
      team.performance.averageScore,
      team.performance.highestScore,
      team.performance.lowestScore,
      team.trends.scoresTrend
    ]);
  });
  
  return data;
}