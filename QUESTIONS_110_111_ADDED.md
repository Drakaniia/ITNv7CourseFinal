# Questions 110 and 111 Added

## Summary
Two missing questions from the source text have been added to the quiz as Questions 110 and 111.

## Question 110 - Wireless Network Design
**Type:** Multiple Choice (Choose 3)  
**Question:** A network administrator is designing the layout of a new wireless network. Which three areas of concern should be accounted for when building a wireless network?

**Correct Answers:**
- B. security
- C. interference  
- D. coverage area

**Explanation:** The three areas of concern for wireless networks focus on the size of the coverage area, any nearby interference, and providing network security.

---

## Question 111 - Cable Termination
**Type:** Single Choice  
**Question:** Refer to the exhibit. What is wrong with the displayed termination?

**Correct Answer:**
- A. The untwisted length of each wire is too long.

**Explanation:** When a cable to an RJ-45 connector is terminated, it is important to ensure that the untwisted wires are not too long and that the flexible plastic sheath surrounding the wires is crimped down and not the bare wires.

---

## Files Created/Modified

### New Files Created:
1. `src/questions/Question110.astro` - Wireless network question component
2. `src/questions/Question111.astro` - Cable termination question component
3. `src/pages/questions/Question110.js` - JavaScript initialization for Q110
4. `src/pages/questions/Question111.js` - JavaScript initialization for Q111

### Files Modified:
1. `src/pages/script.js`:
   - Added imports for initQ109 and initQ110
   - Added state.answers[109] = [] (multi-choice)
   - Added state.answers[110] = null (single choice)
   - Added 2 entries to submitted array
   - Added 2 entries to correct array
   - Added correct answers: [1, 2, 3] for Q110, [0] for Q111
   - Added initialization calls: initQ109(ctx) and initQ110(ctx)
   - Updated updateScoreStrip() to use 111 instead of 109

2. `src/pages/index.astro`:
   - Added imports for Question110 and Question111
   - Added <Question110 client:load /> component
   - Added <Question111 client:load /> component
   - Added navigation dots for questions 110 and 111
   - Updated header progress: "0 / 111 answered"
   - Updated score strip remaining: 111

3. `src/questions/Question109.astro`:
   - Updated pagination: "109 / 111" and changed "Finish" to "Next"

## Total Questions
The quiz now has **111 questions** (previously 109).

## Testing
The dev server is running at `http://localhost:4323/`  
Navigate to the end of the quiz to test Questions 110 and 111.

## Notes
- Question 110 requires selecting exactly 3 answers
- Question 111 is a standard single-choice question
- Both questions follow the same interaction pattern as other questions in the quiz
- The questions were added at the end to avoid renumbering all existing questions
