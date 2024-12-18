# Test Cases

## Purpose
This document outlines the test cases for the Skee-Ball League Management Application to validate functionality, performance, and usability across key features. Each test case includes clear steps, expected outcomes, and status tracking.

---

## 1. Test Case Structure
Each test case will include the following components:
- **Test Case ID**: Unique identifier for each test case.
- **Feature**: The feature being tested.
- **Test Scenario**: Description of what the test validates.
- **Test Steps**: Step-by-step instructions to execute the test.
- **Expected Result**: The anticipated outcome if the test passes.
- **Actual Result**: The observed outcome.
- **Status**: Pass, Fail, or Blocked.
- **Tester**: Responsible team member.
- **Comments**: Notes on issues or observations.

---

## 2. Test Cases

### **1. Login System**
| **Test Case ID** | **Feature**         | **Test Scenario**                      | **Test Steps**                                                                 | **Expected Result**               | **Actual Result** | **Status** | **Tester**       | **Comments**          |
|------------------|---------------------|---------------------------------------|------------------------------------------------------------------------------|----------------------------------|-------------------|------------|-----------------|-----------------------|
| TC-001           | Login System        | Verify login with valid credentials   | 1. Enter valid username and password.<br>2. Click "Login".                    | User is redirected to dashboard.  |                   | Not Started| Chloe Nguyen     |                       |
| TC-002           | Login System        | Verify login with invalid credentials | 1. Enter invalid username/password.<br>2. Click "Login".                      | Error message displayed: "Invalid credentials". |                   | Not Started| Chloe Nguyen     |                       |
| TC-003           | Login System        | Verify role-based redirection         | 1. Log in as Admin.<br>2. Log in as Captain.<br>3. Log in as Player.           | User is redirected to respective dashboard. |                   | Not Started| Chloe Nguyen     |                       |
| TC-004           | Login System        | Verify logout functionality           | 1. Log in successfully.<br>2. Click "Logout".                                | User is logged out and returned to Login page. |                   | Not Started| Chloe Nguyen     |                       |

### **2. Score Input System**
| **Test Case ID** | **Feature**         | **Test Scenario**                      | **Test Steps**                                                                 | **Expected Result**               | **Actual Result** | **Status** | **Tester**       | **Comments**          |
|------------------|---------------------|---------------------------------------|------------------------------------------------------------------------------|----------------------------------|-------------------|------------|-----------------|-----------------------|
| TC-005           | Score Input System  | Verify score input for teams          | 1. Log in as Admin.<br>2. Select teams.<br>3. Enter valid scores.<br>4. Submit.| Scores are saved successfully.    |                   | Not Started| Chloe Nguyen     |                       |
| TC-006           | Score Input System  | Validate invalid score format         | 1. Log in as Admin.<br>2. Enter non-numeric scores.<br>3. Submit.              | Validation error is displayed.   |                   | Not Started| Chloe Nguyen     |                       |
| TC-007           | Score Input System  | Verify leaderboard updates            | 1. Input valid scores.<br>2. Navigate to Leaderboard.                         | Leaderboard reflects new scores.  |                   | Not Started| Chloe Nguyen     |                       |

### **3. Leaderboard Display**
| **Test Case ID** | **Feature**         | **Test Scenario**                      | **Test Steps**                                                                 | **Expected Result**               | **Actual Result** | **Status** | **Tester**       | **Comments**          |
|------------------|---------------------|---------------------------------------|------------------------------------------------------------------------------|----------------------------------|-------------------|------------|-----------------|-----------------------|
| TC-008           | Leaderboard Display | Verify leaderboard accuracy           | 1. Input scores.<br>2. View leaderboard.                                      | Rankings match inputted scores.   |                   | Not Started| Chloe Nguyen     |                       |
| TC-009           | Leaderboard Display | Verify sorting functionality          | 1. Navigate to Leaderboard.<br>2. Sort by wins/losses.                        | Leaderboard sorts correctly.      |                   | Not Started| Chloe Nguyen     |                       |

### **4. Team Management**
| **Test Case ID** | **Feature**         | **Test Scenario**                      | **Test Steps**                                                                 | **Expected Result**               | **Actual Result** | **Status** | **Tester**       | **Comments**          |
|------------------|---------------------|---------------------------------------|------------------------------------------------------------------------------|----------------------------------|-------------------|------------|-----------------|-----------------------|
| TC-010           | Team Management     | Verify adding a new team              | 1. Log in as Admin.<br>2. Add team name and player list.<br>3. Submit.         | Team is added successfully.       |                   | Not Started| Chloe Nguyen     |                       |
| TC-011           | Team Management     | Verify editing team details           | 1. Log in as Admin.<br>2. Edit existing team details.<br>3. Submit changes.   | Team details are updated.         |                   | Not Started| Chloe Nguyen     |                       |

---

## 3. Test Status Legend
- **Not Started**: Test has not been executed.
- **Pass**: Test case executed successfully with expected results.
- **Fail**: Test case failed to produce expected results.
- **Blocked**: Test execution cannot proceed due to unresolved issues or dependencies.

---

## 4. Tools for Testing
- **Test Case Tracking**: Google Sheets, Notion, or Excel
- **Bug Tracking**: GitHub Issues or Trello
- **Execution**: Manual testing or automated testing frameworks

---

## 5. AI Agent Prompt for Next Steps
**Prompt**:
"I have created a Test Cases document for the Skee-Ball League Management Application. It includes test cases for login, score input, leaderboard display, and team management. Below is the full content:

<Insert Test Cases Here>

Using this document, please:
1. Review the test cases and identify any missing scenarios, including edge cases.
2. Suggest additional test cases to validate system functionality comprehensively.
3. Provide recommendations for executing these test cases efficiently, assuming I am learning and need clear, actionable steps."

---


