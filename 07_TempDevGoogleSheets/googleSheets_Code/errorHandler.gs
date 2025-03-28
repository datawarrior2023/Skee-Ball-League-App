/**
 * errorHandler.gs
 * Error Handling and Logging System for Skeeball League Management System
 * Version: 1.0.0
 * Last Updated: 2024-03-XX
 * 
 * This file provides centralized error handling and logging functionality.
 * It ensures consistent error management across the application and
 * maintains a detailed system log for debugging and auditing.
 * 
 * Dependencies:
 * - config.gs (for SHEETS constant and logging configuration)
 */

// Test suite for error handling functions
function testErrorHandler() {
  const tests = {
    testLogError: function() {
      // Test basic error logging
      const testError = new Error('Test error message');
      const logResult = logError(testError, 'TestComponent');
      if (!logResult.success) {
        throw new Error('Failed to log error');
      }
      
      // Verify log entry
      const logEntry = getLastLogEntry();
      if (!logEntry || logEntry.EventType !== 'Error' || 
          !logEntry.Message.includes('Test error message')) {
        throw new Error('Log entry not created correctly');
      }
    },
    
    testLogWarning: function() {
      // Test warning logging
      const logResult = logWarning('Test warning', 'TestComponent');
      if (!logResult.success) {
        throw new Error('Failed to log warning');
      }
      
      // Verify log entry
      const logEntry = getLastLogEntry();
      if (!logEntry || logEntry.EventType !== 'Warning' || 
          !logEntry.Message.includes('Test warning')) {
        throw new Error('Warning entry not created correctly');
      }
    },
    
    testLogInfo: function() {
      // Test info logging
      const logResult = logInfo('Test info message', 'TestComponent');
      if (!logResult.success) {
        throw new Error('Failed to log info');
      }
      
      // Verify log entry
      const logEntry = getLastLogEntry();
      if (!logEntry || logEntry.EventType !== 'Info' || 
          !logEntry.Message.includes('Test info message')) {
        throw new Error('Info entry not created correctly');
      }
    },
    
    testHandleError: function() {
      // Test error handling with custom message
      try {
        handleError(new Error('Test error'), 'Custom message', 'TestComponent');
      } catch (e) {
        if (!e.message.includes('Custom message')) {
          throw new Error('Error handling failed to include custom message');
        }
      }
      
      // Verify error was logged
      const logEntry = getLastLogEntry();
      if (!logEntry || logEntry.EventType !== 'Error') {
        throw new Error('Error not logged during handling');
      }
    },
    
    testGetErrorReport: function() {
      // Create some test errors
      logError(new Error('Test error 1'), 'Component1');
      logError(new Error('Test error 2'), 'Component2');
      
      // Test report generation
      const report = getErrorReport(new Date(Date.now() - 86400000), new Date());
      if (!report || !report.errors || report.errors.length < 2) {
        throw new Error('Error report generation failed');
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
 * Logs an error to the SystemLog sheet
 * @param {Error} error - The error object to log
 * @param {string} component - The component where the error occurred
 * @return {Object} Result of the logging operation
 */
function logError(error, component) {
  try {
    const logSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEETS.SYSTEM_LOG);
    const logID = generateUniqueID('LOG_');
    
    const logEntry = [
      logID,
      new Date(),
      'Error',
      component,
      error.message,
      Session.getActiveUser().getEmail(),
      error.stack || ''
    ];
    
    logSheet.appendRow(logEntry);
    return { success: true, logID: logID };
  } catch (e) {
    // If we can't log to sheet, log to Apps Script logger
    Logger.log(`Failed to log error: ${e.message}`);
    return { success: false, error: e.message };
  }
}

/**
 * Logs a warning to the SystemLog sheet
 * @param {string} message - The warning message
 * @param {string} component - The component generating the warning
 * @return {Object} Result of the logging operation
 */
function logWarning(message, component) {
  try {
    const logSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEETS.SYSTEM_LOG);
    const logID = generateUniqueID('LOG_');
    
    const logEntry = [
      logID,
      new Date(),
      'Warning',
      component,
      message,
      Session.getActiveUser().getEmail(),
      ''  // No stack trace for warnings
    ];
    
    logSheet.appendRow(logEntry);
    return { success: true, logID: logID };
  } catch (e) {
    Logger.log(`Failed to log warning: ${e.message}`);
    return { success: false, error: e.message };
  }
}

/**
 * Logs an info message to the SystemLog sheet
 * @param {string} message - The info message
 * @param {string} component - The component generating the message
 * @return {Object} Result of the logging operation
 */
function logInfo(message, component) {
  try {
    const logSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEETS.SYSTEM_LOG);
    const logID = generateUniqueID('LOG_');
    
    const logEntry = [
      logID,
      new Date(),
      'Info',
      component,
      message,
      Session.getActiveUser().getEmail(),
      ''  // No stack trace for info
    ];
    
    logSheet.appendRow(logEntry);
    return { success: true, logID: logID };
  } catch (e) {
    Logger.log(`Failed to log info: ${e.message}`);
    return { success: false, error: e.message };
  }
}

/**
 * Handles an error by logging it and optionally throwing a custom error
 * @param {Error} error - The original error
 * @param {string} customMessage - Optional custom error message
 * @param {string} component - The component where the error occurred
 * @param {boolean} throwError - Whether to throw the error (default: true)
 * @throws {Error} If throwError is true
 */
function handleError(error, customMessage, component, throwError = true) {
  // Log the error
  logError(error, component);
  
  // Construct error message
  const errorMessage = customMessage ? 
    `${customMessage}: ${error.message}` : 
    error.message;
  
  if (throwError) {
    throw new Error(errorMessage);
  }
  
  return {
    success: false,
    error: errorMessage,
    component: component,
    timestamp: new Date()
  };
}

/**
 * Gets the last log entry from the SystemLog sheet
 * @return {Object|null} The last log entry or null if none exists
 */
function getLastLogEntry() {
  try {
    const logSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEETS.SYSTEM_LOG);
    const lastRow = logSheet.getLastRow();
    
    if (lastRow <= 1) {
      return null;  // Only header row exists
    }
    
    const lastEntry = logSheet.getRange(lastRow, 1, 1, 7).getValues()[0];
    return {
      LogID: lastEntry[0],
      Timestamp: lastEntry[1],
      EventType: lastEntry[2],
      Component: lastEntry[3],
      Message: lastEntry[4],
      UserEmail: lastEntry[5],
      StackTrace: lastEntry[6]
    };
  } catch (e) {
    Logger.log(`Failed to get last log entry: ${e.message}`);
    return null;
  }
}

/**
 * Generates an error report for a specified time period
 * @param {Date} startDate - Start date for the report
 * @param {Date} endDate - End date for the report
 * @return {Object} Report containing error statistics and details
 */
function getErrorReport(startDate, endDate) {
  try {
    const logSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEETS.SYSTEM_LOG);
    const logData = logSheet.getDataRange().getValues();
    
    // Skip header row
    const logs = logData.slice(1).filter(row => {
      const logDate = new Date(row[1]);
      return logDate >= startDate && logDate <= endDate;
    });
    
    // Compile statistics
    const stats = {
      total: logs.length,
      errors: logs.filter(row => row[2] === 'Error').length,
      warnings: logs.filter(row => row[2] === 'Warning').length,
      info: logs.filter(row => row[2] === 'Info').length
    };
    
    // Get error details
    const errors = logs
      .filter(row => row[2] === 'Error')
      .map(row => ({
        logID: row[0],
        timestamp: row[1],
        component: row[3],
        message: row[4],
        user: row[5],
        stackTrace: row[6]
      }));
    
    return {
      startDate: startDate,
      endDate: endDate,
      statistics: stats,
      errors: errors
    };
  } catch (e) {
    Logger.log(`Failed to generate error report: ${e.message}`);
    return null;
  }
}