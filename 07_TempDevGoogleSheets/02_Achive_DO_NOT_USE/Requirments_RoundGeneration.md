### ✅ **Requirements Your Code Currently Meets**
#### 1. **Team Setup & Initialization**
- Exactly **22 teams** generated dynamically: Team 1 through Team 22.
- shuffle() utility ensures randomized team order each week.

#### 2. **Fixed Week 1 Matches**
- Week 1 has **3 fixed rounds** (33 total matches), explicitly defined and injected before any random generation.
- These matches are immediately added to playedMatches to prevent duplication in future rounds.

#### 3. **Round Generation for Weeks 2–7**
- Each week contains **3 rounds**, and **each round is expected to have 11 matches** (to match 22 teams into pairs).
- **Retry logic is implemented**:
  - If fewer than 11 matches are generated, up to **5 shuffle-and-match retries** are attempted before failing that round.
  - Previously matched pairs are excluded during retries.

#### 4. **Match Uniqueness Logic**
- Matches are prevented from duplicating by checking playedMatches before confirming a pairing.
- Each match is stored as TeamA-TeamB, and its reverse is checked too.

#### 5. **Validation Columns**
- Several columns are formula-driven validations:
  - ❌ Duplicate detection
  - 👥 One match per round per team
  - 🔁 Total matches per round
  - 🎯 Opponent history
  - 📊 Weekly team match count

#### 6. **Sheet Output Structure**
- All schedule data is output to Google Sheets using .setValues() for performance.
- Formulas are added **after** schedule generation and use **dynamic ranges** based on content.

---

### 🛠️ **Code Requirements for Proper Execution**
#### 1. **Spreadsheet Environment**
- Sheet must have permission for SpreadsheetApp.getActiveSpreadsheet().getActiveSheet() to work.
- Assumes **the active sheet is the target** — otherwise, you'll need getSheetByName() for more control.

#### 2. **Team Data Table (Optional)**
- Formulas for columns 8 and 9 reference teamDataTbl[Team Name] and teamDataTbl[Team Number], but your script currently leaves those as empty ="". You’ll need an actual **named table or range** for those to resolve correctly — or you can remove those references if not needed.

#### 3. **Match Retry Limit**
- The retry mechanism limits the number of match attempts to 5 rounds per match — you can increase this if 5 isn't reliably producing complete 11-match rounds.

#### 4. **Duplication Detection**
- If you see ❌ Duplicates in the spreadsheet, it could mean a rare edge case where the playedMatches wasn't updated properly in a retry (or the match slipped past due to logic order). We could strengthen this by delaying playedMatches.add() until after the round is fully validated.