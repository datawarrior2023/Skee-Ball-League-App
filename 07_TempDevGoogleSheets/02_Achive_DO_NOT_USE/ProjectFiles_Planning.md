### ✅ File Index and Description

| File Name (Prefix)         | Description / Purpose |
|---------------------------|------------------------|
| **main.gs**                | 🔧 **Main entry point for scheduling execution.** This file contains the `generateSeasonSchedule()` function which coordinates all major logic, including fixed matches, dynamic scheduling, invoking utilities, and final schedule output to the spreadsheet. It's the orchestrator of the entire system. |
| **generatedDynamicWeeks.gs** | 🔁 **Handles dynamic generation of weeks 2–7.** Includes the logic for shuffling teams, detecting unmatched teams, validating match uniqueness, fallback matching with rematch allowance, and round progression. Refactored for reuse and separation of concerns. |
| **scheduleHelpers.gs**     | 🧩 **Utility functions for matching logic.** Includes helpers like `shuffle()`, `hasMatchBeenPlayed()`, and other modular helpers used by the scheduling engine. Designed for reusable, focused logic snippets. |
| **formulasInjector.gs**    | 🧮 **Injects formulas into the spreadsheet.** Automates validation formulas, duplicate detection, per-team weekly match counts, and game per round verification. Helps keep logic cleanly separated from the main generation flow. |
| **errorHandler.gs**        | 🚨 **Central error management system.** Provides `handleError()` for structured error logging, UI notification, and fallback control. Works in tandem with `logHandler.gs` to keep your system resilient. |
| **logHandler.gs**          | 📋 **Logs events, errors, and system metadata.** Includes `logToSheet()` for writing entries into a hidden `SystemLog` sheet with column breakdown. Ensures transparent traceability of system operations. |
| **systemInfoSidebar.html** | 🖥️ **User-facing sidebar for diagnostics.** HTML-based UI collecting browser/system info, copy-to-clipboard fallback, and submission to logger. Also includes export/email log actions and dynamic developer contact display. |
| **reportingFunctions.gs**  | 📤 **Export/report tools for admins.** Contains functions like `exportLogSheetAsCSV()` and `emailLogSheetToDeveloper()` to share logs and stats easily. Designed for post-run reporting. |
| **config.gs**              | ⚙️ **Single source of truth (central config object).** Contains all constants like sheet names, ranges, output formats, match rules, flags, developer info, UI behaviors, and API keys. Any updates go here instead of hunting in multiple files. |

---

### 📌 Why This Architecture Rocks:
- **Modular** – Easy to update, test, or replace individual parts.
- **Maintainable** – Central config avoids code duplication.
- **Readable** – Verbose documentation aids new developers.
- **Future-Proof** – Ready to scale (add new weeks, import formats, integrations).
- **User-Friendly** – Built-in sidebar, alerts, and copy/email features show thoughtful UX.

---

Would you like me to generate a visual **architecture diagram** of these file relationships and flows next? Or perhaps create a **README.md-style doc** summarizing all this for documentation or onboarding?