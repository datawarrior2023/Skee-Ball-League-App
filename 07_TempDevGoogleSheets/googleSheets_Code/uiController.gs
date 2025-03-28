 /**
 * uiController.gs
 * User Interface Control System for Skeeball League Management System
 * Version: 1.0.0
 * Last Updated: 2024-03-XX
 * 
 * This file handles all UI-related operations including:
 * - Menu creation and management
 * - Sidebar and dialog displays
 * - Form handling
 * - UI state management
 */

/**
 * Creates the custom menu when the spreadsheet opens
 */
function onOpen() {
  try {
    const ui = SpreadsheetApp.getUi();
    ui.createMenu('Skeeball League')
      .addSubMenu(ui.createMenu('League Management')
        .addItem('Manage Teams', 'showTeamManagement')
        .addItem('Manage Players', 'showPlayerManagement')
        .addItem('Manage Substitutes', 'showSubstituteManagement')
        .addItem('View Standings', 'showStandings'))
      .addSubMenu(ui.createMenu('Match Management')
        .addItem('Enter Scores', 'showScoreEntry')
        .addItem('View Schedule', 'showSchedule')
        .addItem('Assign Substitutes', 'showSubstituteAssignment'))
      .addSubMenu(ui.createMenu('Reports')
        .addItem('Team Statistics', 'showTeamStats')
        .addItem('Player Statistics', 'showPlayerStats')
        .addItem('League Report', 'showLeagueReport'))
      .addSubMenu(ui.createMenu('Settings')
        .addItem('League Settings', 'showSettings')
        .addItem('System Log', 'showSystemLog'))
      .addToUi();
  } catch (e) {
    handleError(e, 'Error creating menu', 'UIController');
  }
}

/**
 * Shows the team management sidebar
 */
function showTeamManagement() {
  try {
    const html = HtmlService.createHtmlOutputFromFile('sidebar')
      .setTitle('Team Management')
      .setWidth(400);
    SpreadsheetApp.getUi().showSidebar(html);
  } catch (e) {
    handleError(e, 'Error showing team management', 'UIController');
    showErrorDialog('Error loading team management interface');
  }
}

/**
 * Shows the score entry dialog
 */
function showScoreEntry() {
  try {
    const html = HtmlService.createHtmlOutputFromFile('scoreEntry')
      .setWidth(600)
      .setHeight(400);
    SpreadsheetApp.getUi().showModalDialog(html, 'Enter Match Scores');
  } catch (e) {
    handleError(e, 'Error showing score entry', 'UIController');
    showErrorDialog('Error loading score entry interface');
  }
}

/**
 * Shows an error dialog to the user
 * @param {string} message - Error message to display
 */
function showErrorDialog(message) {
  const ui = SpreadsheetApp.getUi();
  ui.alert('Error', message, ui.ButtonSet.OK);
}

/**
 * Gets data for UI components
 * @param {string} dataType - Type of data to retrieve
 * @return {Object} Requested data
 */
function getUIData(dataType) {
  try {
    switch(dataType) {
      case 'teams':
        return getActiveTeams();
      case 'players':
        return getActivePlayers();
      case 'substitutes':
        return getActiveSubstitutes();
      case 'schedule':
        return getCurrentSchedule();
      case 'standings':
        return getCurrentStandings();
      default:
        throw new Error('Invalid data type requested');
    }
  } catch (e) {
    handleError(e, 'Error getting UI data', 'UIController');
    return null;
  }
}

/**
 * Handles form submissions from UI
 * @param {Object} formData - Form data submitted
 * @param {string} formType - Type of form submitted
 * @return {Object} Result of form processing
 */
function handleFormSubmission(formData, formType) {
  try {
    switch(formType) {
      case 'scoreEntry':
        return processScoreEntry(formData);
      case 'teamRegistration':
        return processTeamRegistration(formData);
      case 'playerRegistration':
        return processPlayerRegistration(formData);
      case 'substituteRegistration':
        return processSubstituteRegistration(formData);
      default:
        throw new Error('Invalid form type');
    }
  } catch (e) {
    handleError(e, 'Error processing form submission', 'UIController');
    return { success: false, error: 'Error processing form submission' };
  }
}

/**
 * Processes score entry form submission
 * @param {Object} formData - Score entry form data
 * @return {Object} Result of score processing
 */
function processScoreEntry(formData) {
  try {
    const scores = [
      parseInt(formData.player1Score),
      parseInt(formData.player2Score),
      parseInt(formData.player3Score),
      parseInt(formData.player4Score)
    ];
    
    return enterMatchScores(formData.matchID, scores);
  } catch (e) {
    handleError(e, 'Error processing score entry', 'UIController');
    return { success: false, error: 'Error processing scores' };
  }
}

/**
 * Updates UI elements based on state changes
 * @param {string} elementID - ID of element to update
 * @param {Object} data - New data for element
 */
function updateUIElement(elementID, data) {
  try {
    const template = HtmlService.createTemplateFromFile(elementID);
    template.data = data;
    return template.evaluate().getContent();
  } catch (e) {
    handleError(e, 'Error updating UI element', 'UIController');
    return null;
  }
}