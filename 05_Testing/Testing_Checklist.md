# Testing Checklist

## Purpose
The Testing Checklist ensures that all features of the Skee-Ball League Management Application are thoroughly tested for functionality, usability, and performance. This document serves as a guide for tracking the testing process, identifying bugs, and validating fixes before deployment.

---

## 1. Testing Framework
Each test will include the following components:
1. **Feature Name**: The specific feature being tested.
2. **Test Case**: A description of the test scenario.
3. **Test Steps**: The actions required to execute the test.
4. **Expected Result**: The expected outcome of the test.
5. **Actual Result**: The actual outcome of the test.
6. **Status**: Pass, Fail, or Blocked.
7. **Tester**: The person responsible for running the test.
8. **Comments**: Notes about bugs, issues, or additional observations.

---

## 2. Testing Checklist

### **1. Login System**
| **Test Case**                         | **Test Steps**                                      | **Expected Result**                 | **Actual Result** | **Status** | **Tester**       | **Comments**               |
|--------------------------------------|----------------------------------------------------|------------------------------------|------------------|------------|-----------------|----------------------------|
| Verify login with valid credentials  | 1. Enter valid username and password.<br>2. Submit.| User is redirected to the dashboard.|                  | Not Started| Chloe Nguyen     |                            |
| Verify login with invalid credentials| 1. Enter incorrect credentials.<br>2. Submit.      | Error message: "Invalid credentials."|                  | Not Started| Chloe Nguyen     |                            |
| Verify role-based redirection        | 1. Login as Admin.<br>2. Login as Captain.<br>3. Login as Player.| Each role is redirected correctly. |                  | Not Started| Chloe Nguyen     |                            |
| Verify logout functionality          | 1. Click logout button.                            | User is logged out successfully.   |                  | Not Started| Chloe Nguyen     |                            |

### **2. Score Input System**
| **Test Case**                         | **Test Steps**                                      | **Expected Result**                 | **Actual Result** | **Status** | **Tester**       | **Comments**               |
|--------------------------------------|----------------------------------------------------|------------------------------------|------------------|------------|-----------------|----------------------------|
| Verify score input for teams         | 1. Select teams.<br>2. Enter valid scores.<br>3. Submit.| Scores are saved successfully.      |                  | Not Started| Chloe Nguyen     |                            |
| Validate invalid score formats       | 1. Enter letters instead of numbers in score fields.<br>2. Submit.| Validation error is displayed.      |                  | Not Started| Chloe Nguyen     |                            |
| Verify leaderboard updates           | 1. Input scores.<br>2. Check leaderboard page.     | Standings are updated automatically.|                  | Not Started| Chloe Nguyen     |                            |

### **3. Leaderboard Display**
| **Test Case**                         | **Test Steps**                                      | **Expected Result**                 | **Actual Result** | **Status** | **Tester**       | **Comments**               |
|--------------------------------------|----------------------------------------------------|------------------------------------|------------------|------------|-----------------|----------------------------|
| Verify leaderboard data accuracy     | 1. Compare displayed leaderboard data with scores. | Data matches input scores.          |                  | Not Started| Chloe Nguyen     |                            |
| Verify sorting functionality         | 1. Sort leaderboard by wins/losses.<br>2. Verify. | Leaderboard sorts correctly.        |                  | Not Started| Chloe Nguyen     |                            |

### **4. Team Management**
| **Test Case**                         | **Test Steps**                                      | **Expected Result**                 | **Actual Result** | **Status** | **Tester**       | **Comments**               |
|--------------------------------------|----------------------------------------------------|------------------------------------|------------------|------------|-----------------|----------------------------|
| Verify adding a new team             | 1. Input team name and players.<br>2. Submit.      | Team is added to the system.        |                  | Not Started| Chloe Nguyen     |                            |
| Verify editing team details          | 1. Update team information.<br>2. Save changes.   | Team data is updated successfully.  |                  | Not Started| Chloe Nguyen     |                            |

### **5. Match Scheduling**
| **Test Case**                         | **Test Steps**                                      | **Expected Result**                 | **Actual Result** | **Status** | **Tester**       | **Comments**               |
|--------------------------------------|----------------------------------------------------|------------------------------------|------------------|------------|-----------------|----------------------------|
| Verify creating a new schedule       | 1. Enter match details (teams, date, time).<br>2. Submit.| Schedule is created successfully.    |                  | Not Started| Chloe Nguyen     |                            |
| Verify editing a match schedule      | 1. Edit existing match details.<br>2. Save changes.| Schedule is updated successfully.   |                  | Not Started| Chloe Nguyen     |                            |

### **6. Player Stats Display**
| **Test Case**                         | **Test Steps**                                      | **Expected Result**                 | **Actual Result** | **Status** | **Tester**       | **Comments**               |
|--------------------------------------|----------------------------------------------------|------------------------------------|------------------|------------|-----------------|----------------------------|
| Verify player stats accuracy         | 1. View player stats.<br>2. Compare with inputs.   | Stats display correct values.       |                  | Not Started| Chloe Nguyen     |                            |
| Verify chart display for stats       | 1. Open stats page.<br>2. Verify charts render.    | Charts load and display correctly.  |                  | Not Started| Chloe Nguyen     |                            |

---

## 3. Test Status Tracking
The following statuses will be used to monitor test execution:
- **Not Started**: Test case has not been executed.
- **Pass**: Test case executed successfully with expected results.
- **Fail**: Test case did not produce the expected results.
- **Blocked**: Test case cannot proceed due to unresolved issues or dependencies.

### Tools for Test Tracking
- **Test Management**: Excel, Google Sheets, or Notion
- **Bug Tracking**: GitHub Issues, Jira, or Trello
- **Testing Updates**: Weekly status reports via Slack or email

---

## 4. AI Agent Prompt for Next Steps
**Prompt**:
"I have created a Testing Checklist for the Skee-Ball League Management Application. It includes detailed test cases for login, score input, leaderboard, team management, match scheduling, and player stats. Below is the full content:

<Insert Testing Checklist Here>

Using this document, please:
1. Validate the completeness of test cases based on the feature development checklist and user stories.
2. Identify any missing scenarios or edge cases that need to be tested.
3. Provide a step-by-step plan for executing the tests and tracking progress, assuming I am learning and need actionable, beginner-friendly guidance."

---

