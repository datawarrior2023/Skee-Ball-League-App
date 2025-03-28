// =========================
// File Name: main.gs
// Purpose: This is the entry point and central orchestration function for generating the season schedule, delegating tasks to helper modules.
// Scope: This script controls the core sequence and structure of the schedule generation process.
// Version: 1.0.0
// =========================

// =========================
// Function Name: generateSeasonSchedule()
// Purpose: Primary function responsible for controlling the entire schedule generation workflow.
// =========================

// Step 1: Clear previous contents of the schedule sheet
// - Uses CONFIG.SHEET_NAMES.MAIN_SCHEDULE to target the correct sheet.
// - Ensures clean slate before generating a new schedule.

// Step 2: Initialize team list
// - Builds an array of team names from CONFIG.MATCH_RULES.TOTAL_TEAMS.
// - Format typically "Team 1" to "Team N".
// - This array is reused across week and round generation.

// Step 3: Initialize headers for the schedule output table
// - Includes key validation columns and metadata columns.
// - Pulled from CONFIG.OUTPUT.START_CELL for top-left anchor cell.

// Step 4: Initialize playedMatches Set
// - Used to track unique team matchups globally across all weeks/rounds.
// - Prevents duplicate pairings unless fallback is explicitly allowed (CONFIG.FLAGS.ALLOW_REMATCH_FALLBACK).

// Step 5: Insert pre-defined matches (Week 1 and optionally Week 2)
// - Hardcoded arrays used for consistent kickoff schedule.
// - Appends to the schedule and updates playedMatches.
// - This avoids re-generating these rounds dynamically.

// Step 6: Dynamically generate remaining weeks and rounds
// - Calls generateDynamicWeeks(schedule, teams, playedMatches) from dynamicWeekGenerator.gs
// - Handles randomized round generation, duplicate avoidance, fallback rematches, and progressive logging.

// Step 7: Insert entire schedule into sheet
// - Writes final compiled array to CONFIG.SHEET_NAMES.MAIN_SCHEDULE.
// - Uses CONFIG.OUTPUT.START_CELL as anchor position.

// Step 8: Post-processing validation formulas
// - Adds formulas for duplicate detection, match count verification, and team activity tracking.
// - Relies on columns specified in config.gs and consistent formatting.

// Step 9: Optional user notification
// - Shows a popup alert (if CONFIG.UI.SHOW_ALERTS = true) to indicate success.

// External Functions/Modules Called:
// - shuffle(array) — from utilities.gs (random team order each week)
// - generateDynamicWeeks(schedule, teams, playedMatches) — from dynamicWeekGenerator.gs
// - logToSheet() — from logHandler.gs (optional logging)
// - handleError() — from errorHandler.gs (if exceptions are thrown)

// Key Variables:
// - schedule (array of rows)
// - teams (array of team names)
// - playedMatches (Set of teamA-teamB strings)
// - week, roundCounter (track week/round state during generation)

// Configuration Dependencies (config.gs):
// - CONFIG.SHEET_NAMES.MAIN_SCHEDULE
// - CONFIG.MATCH_RULES.TOTAL_TEAMS
// - CONFIG.MATCH_RULES.MATCHES_PER_ROUND
// - CONFIG.MATCH_RULES.ROUNDS_PER_WEEK
// - CONFIG.MATCH_RULES.WEEKS.START and WEEKS.END
// - CONFIG.FLAGS.ALLOW_REMATCH_FALLBACK
// - CONFIG.OUTPUT.START_CELL
// - CONFIG.UI.SHOW_ALERTS

// TODO:
// - Parameterize initial matches through CONFIG instead of hardcoding in main.gs.
// - Move header definition into CONFIG.OUTPUT.SCHEDULE_HEADERS.I need to focus hey Google summarize my emails for unread and let me know if there's anything that is important
// - Add optional schedule export immediately after schedule generation (call exportScheduleAsCSV()).
