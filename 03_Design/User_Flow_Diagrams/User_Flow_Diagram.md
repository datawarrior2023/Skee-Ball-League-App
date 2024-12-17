# User Flow Diagram Outline

## Purpose
The User Flow Diagram visually represents the paths users take when navigating through the Skee-Ball League Management Application. It helps identify key touchpoints, optimize user experience, and ensure a smooth flow across screens.

---

## 1. User Roles
The user flow will be designed for the following roles:
1. **League Owner/Admin**: Full access to all features, including score input, team management, and scheduling.
2. **Team Captain**: Limited access to input scores, manage teams, and view schedules.
3. **Player**: Access to view player stats, team standings, and schedules.
4. **Spectator**: View-only access to leaderboards.

---

## 2. Key User Flows

### **1. Login and Role-Based Access**
| **Step**                        | **Description**                        | **Screen**            |
|---------------------------------|----------------------------------------|-----------------------|
| 1. User opens the app           | Landing page with login option.        | Login Screen          |
| 2. User enters credentials      | Enter username/password.               | Login Screen          |
| 3. System validates credentials | Check user role and grant access.      | Backend Process       |
| 4. User redirected to dashboard | Redirect based on user role:           | Dashboard (Role-Specific) |
   - Admin: Admin Dashboard       |                                        |                       |
   - Captain: Team Dashboard      |                                        |                       |
   - Player: Player Dashboard     |                                        |                       |

### **2. Admin: Score Input Workflow**
| **Step**                           | **Description**                            | **Screen**              |
|------------------------------------|--------------------------------------------|-------------------------|
| 1. Admin logs in                   | Access Admin Dashboard.                    | Admin Dashboard         |
| 2. Select "Input Scores"           | Navigate to Score Input Page.              | Score Input Page        |
| 3. Select teams and enter scores   | Input scores via dropdown and input fields.| Score Input Page        |
| 4. Submit scores                   | Save scores; system updates standings.     | Backend Process         |
| 5. View updated leaderboard        | Navigate to Leaderboard to confirm updates.| Leaderboard Page        |

### **3. Captain: Manage Teams Workflow**
| **Step**                           | **Description**                            | **Screen**              |
|------------------------------------|--------------------------------------------|-------------------------|
| 1. Captain logs in                 | Access Team Dashboard.                     | Team Dashboard          |
| 2. Select "Manage Teams"           | Navigate to Team Management Page.          | Team Management Page    |
| 3. Update team roster              | Add/edit/delete players in the team list.  | Team Management Page    |
| 4. Save changes                    | Confirm updates to team roster.            | Backend Process         |
| 5. Return to dashboard             | Navigate back to the dashboard.            | Team Dashboard          |

### **4. Player: View Stats Workflow**
| **Step**                           | **Description**                            | **Screen**              |
|------------------------------------|--------------------------------------------|-------------------------|
| 1. Player logs in                  | Access Player Dashboard.                   | Player Dashboard        |
| 2. Select "View Stats"             | Navigate to Player Stats Page.             | Player Stats Page       |
| 3. View personal stats             | View performance metrics (charts/tables).  | Player Stats Page       |
| 4. Return to dashboard             | Navigate back to the dashboard.            | Player Dashboard        |

### **5. Spectator: View Leaderboard Workflow**
| **Step**                           | **Description**                            | **Screen**              |
|------------------------------------|--------------------------------------------|-------------------------|
| 1. Spectator opens app             | No login required; access public leaderboard. | Public Leaderboard Page |
| 2. View leaderboard standings      | See real-time team and player rankings.    | Public Leaderboard Page |
| 3. Apply filters (optional)        | Sort by wins, scores, or team names.       | Public Leaderboard Page |

---

## 3. Diagram Structure
Each user flow will be visualized in a diagram format with the following components:
1. **Start**: Represents the entry point for the user.
2. **Actions**: Each step the user takes (e.g., login, input scores, view stats).
3. **Screens**: The actual screens involved in the workflow.
4. **Decisions**: Conditional actions (e.g., role validation).
5. **End**: The user completes their task or exits the app.

---

## 4. Tools for Diagram Creation
The following tools can be used to create user flow diagrams:
- **Lucidchart**: Simple and effective for flowcharts.
- **Figma**: Allows creating user flows alongside wireframes.
- **Miro**: Useful for collaboration and flow mapping.
- **Draw.io** (free): Lightweight tool for quick diagramming.

---

## 5. Deliverables
1. **Login Workflow**: Visual flow for login and role-based access.
2. **Admin Workflows**: Score input and leaderboard updates.
3. **Captain Workflows**: Managing teams and updating rosters.
4. **Player Workflows**: Viewing personal stats.
5. **Spectator Workflow**: Public leaderboard navigation.

---

## AI Agent Prompt for Next Steps
**Prompt**:
"I have created a User Flow Diagram Outline for the Skee-Ball League Management Application. It includes user flows for login, score input, team management, stats viewing, and public leaderboard access. Below is the full content:

<Insert User Flow Diagram Outline Here>

Using this document, please:
1. Provide feedback on the outlined user flows and identify any missing paths.
2. Recommend the best tool to create these diagrams, considering my beginner-level experience.
3. Outline clear next steps for translating these user flows into visual diagrams, assuming I am learning and need actionable guidance."

---

