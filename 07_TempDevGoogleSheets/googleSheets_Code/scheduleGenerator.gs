 /**
 * scheduleGenerator.gs
 * Schedule Generation System for Skeeball League Management System
 * Version: 1.0.0
 * Last Updated: 2024-03-XX
 * 
 * This file handles all schedule generation including:
 * - Season schedule creation
 * - Round robin scheduling
 * - Lane assignments
 * - Schedule validation
 */

/**
 * Generates a complete season schedule
 * @param {string} seasonID - Season to generate schedule for
 * @return {Object} Result of schedule generation
 */
function generateSeasonSchedule(seasonID) {
  try {
    const season = getSeasonDetails(seasonID);
    const teams = getActiveTeams(seasonID);
    
    if (!season || !teams.length) {
      return { success: false, error: 'Invalid season or no active teams' };
    }

    const schedule = [];
    const playedMatches = new Set();
    
    // Generate schedule for each week
    for (let week = 1; week <= season.numberOfWeeks; week++) {
      const weekSchedule = generateWeekSchedule(teams, week, playedMatches);
      schedule.push(...weekSchedule);
    }

    // Save schedule to sheet
    return saveScheduleToSheet(schedule, seasonID);
    
  } catch (e) {
    handleError(e, 'Error generating season schedule', 'ScheduleGenerator');
    return { success: false, error: 'Internal error generating schedule' };
  }
}

/**
 * Generates schedule for a single week
 * @param {Array} teams - List of teams
 * @param {number} weekNumber - Week number
 * @param {Set} playedMatches - Set of already played matches
 * @return {Array} Week's schedule
 */
function generateWeekSchedule(teams, weekNumber, playedMatches) {
  const weekSchedule = [];
  const roundsPerNight = parseInt(getConfig('DefaultRoundsPerNight'));
  
  for (let round = 1; round <= roundsPerNight; round++) {
    const roundSchedule = generateRoundSchedule(teams, weekNumber, round, playedMatches);
    weekSchedule.push(...roundSchedule);
  }
  
  return weekSchedule;
}

/**
 * Generates schedule for a single round
 * @param {Array} teams - List of teams
 * @param {number} weekNumber - Week number
 * @param {number} roundNumber - Round number
 * @param {Set} playedMatches - Set of already played matches
 * @return {Array} Round's schedule
 */
function generateRoundSchedule(teams, weekNumber, roundNumber, playedMatches) {
  const roundSchedule = [];
  const availableTeams = [...teams];
  
  // Shuffle teams for random matchups
  shuffleArray(availableTeams);
  
  while (availableTeams.length >= 2) {
    const team1 = availableTeams.pop();
    const team2 = findBestOpponent(team1, availableTeams, playedMatches);
    
    if (team2) {
      availableTeams.splice(availableTeams.indexOf(team2), 1);
      
      roundSchedule.push({
        weekNumber: weekNumber,
        roundNumber: roundNumber,
        team1ID: team1.teamID,
        team2ID: team2.teamID,
        laneNumber: determineLaneAssignment(roundSchedule)
      });
      
      playedMatches.add(`${team1.teamID}-${team2.teamID}`);
    }
  }
  
  return roundSchedule;
}

/**
 * Finds the best opponent for a team
 * @param {Object} team - Team needing opponent
 * @param {Array} availableTeams - List of available teams
 * @param {Set} playedMatches - Set of already played matches
 * @return {Object|null} Best opponent or null if none found
 */
function findBestOpponent(team, availableTeams, playedMatches) {
  // First try to find unplayed opponent
  for (const opponent of availableTeams) {
    const matchup = `${team.teamID}-${opponent.teamID}`;
    if (!playedMatches.has(matchup)) {
      return opponent;
    }
  }
  
  // If all teams played, return random opponent
  return availableTeams.length > 0 ? availableTeams[0] : null;
}

/**
 * Determines lane assignment for a match
 * @param {Array} existingSchedule - Existing schedule for the round
 * @return {number} Lane number (1 or 2)
 */
function determineLaneAssignment(existingSchedule) {
  const lane1Count = existingSchedule.filter(match => match.laneNumber === 1).length;
  const lane2Count = existingSchedule.filter(match => match.laneNumber === 2).length;
  
  return lane1Count <= lane2Count ? 1 : 2;
}