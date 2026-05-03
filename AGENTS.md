# AGENTS.md

This document outlines the process for adding new questions to the quiz and updating the necessary files to ensure the quiz remains fully functional.

## Adding a New Question

### Step 1: Create the Question File
1. Navigate to the `src/questions` directory.
2. Create a new file named `QuestionX.astro`, where `X` is the next sequential number.
3. Use the following template for the new question file:

```astro
<!--
  --- Question X ---
  This component represents the Xth question in the quiz.
-->

<div class="question-card" id="card-Y" data-qid="Y" data-type="TYPE">
  <div class="card-header">
    <span class="q-number">Q XX</span>
    <span class="q-tag TYPE">Single Choice or Choose Z</span>
  </div>
  <div class="card-body">
    <p class="question-text">
      [Question Text Here]
    </p>
    <div class="options" id="opts-Y">
      <button class="option-btn" data-idx="0">
        <span class="opt-indicator"></span>
        <span class="opt-letter">A</span>
        <span class="opt-text">[Option A Text]</span>
      </button>
      <button class="option-btn" data-idx="1">
        <span class="opt-indicator"></span>
        <span class="opt-letter">B</span>
        <span class="opt-text">[Option B Text]</span>
      </button>
      <!-- Add more options as needed -->
    </div>

    <div class="submit-wrap" style="display: none;">
      <button class="submit-btn" id="submit-Y" disabled>Submit Answer</button>
    </div>

    <div class="explanation" id="exp-Y">
      <div class="exp-header">
        <span class="exp-verdict" id="verdict-Y"></span>
      </div>
      <div class="exp-body">
        [Explanation Text Here]
      </div>
    </div>
    <div class="pagination-controls">
      <button class="nav-btn" id="prev-Y">Previous</button>
      <span class="page-indicator">XX / XX</span>
      <button class="nav-btn" id="next-Y">Next or Finish</button>
    </div>
  </div>
</div>
```

Replace the following placeholders:
- `X`: The question number.
- `Y`: The zero-based index for the question (e.g., for Question 3, use `2`).
- `XX`: The question number in the format `XX` (e.g., `03` for Question 3).
- `TYPE`: The type of question (`single` for single choice or `multi` for multiple choice).
- `[Question Text Here]`: The text of the question.
- `[Option A Text]`, `[Option B Text]`, etc.: The text for each option.
- `[Explanation Text Here]`: The explanation for the correct answer.

### Step 2: Update `index.astro`
1. Open the `src/pages/index.astro` file.
2. Add an import statement for the new question file:

```astro
import QuestionX from '../questions/QuestionX.astro';
```

3. Add the question component to the main section:

```astro
<!-- ── Question X ── -->
<QuestionX client:load />
```

4. Add a navigation dot to the footer:

```astro
<div class="dot" data-target="Y" title="QX"></div>
```

5. Update the header progress text to reflect the new total number of questions:

```astro
<span class="header-sub" id="headerProgress">0 / X answered</span>
```

6. Update the score strip to reflect the new total number of questions:

```astro
<span class="score-val" id="scoreRemain">X</span>
```

### Step 3: Update `script.js`
1. Open the `src/pages/script.js` file.
2. Update the `state` object to include the new question:

```javascript
const state = {
  answers: [null, [], null, [], ..., null], // Add null or [] for the new question
  submitted: [false, false, ..., false], // Add false for the new question
  correct: [false, false, ..., false], // Add false for the new question
  currentQuestion: 0,
};
```

3. Add the correct answer for the new question in the `CORRECT` array:

```javascript
const CORRECT = [[2], [0, 1], [0, 1], ..., [Z]]; // Add the correct answer index or indices
```

4. Add event listeners for the new question's pagination buttons:

```javascript
document
  .getElementById("prev-Y")
  .addEventListener("click", () => goToPrevQuestion());
document
  .getElementById("next-Y")
  .addEventListener("click", () => goToNextQuestion());
```

5. Update the `updateScoreStrip` function to reflect the new total number of questions:

```javascript
function updateScoreStrip() {
  const done = state.submitted.filter(Boolean).length;
  const right = state.correct.filter(Boolean).length;
  const wrong = done - right;
  document.getElementById("scoreCorrect").textContent = right;
  document.getElementById("scoreWrong").textContent = wrong;
  document.getElementById("scoreRemain").textContent = X - done;
  document.getElementById("scorePct").textContent = done
    ? Math.round((right / done) * 100) + " %"
    : "— %";
  document.getElementById("headerProgress").textContent =
    `${done} / X answered`;
  document.getElementById("progressBar").style.width = (done / X) * 100 + "%";
}
```

6. Update the button disabling logic to reflect the new total number of questions:

```javascript
document.getElementById("prev-0").disabled = true;
document.getElementById("next-X").textContent = "Finish";
```

7. Add initialization logic for the new question:

```javascript
// Initialize QuestionX
(function initQY() {
  const optsEl = document.getElementById("opts-Y");
  const submitEl = document.getElementById("submit-Y");
  const expEl = document.getElementById("exp-Y");
  const verdictEl = document.getElementById("verdict-Y");
  const card = document.getElementById("card-Y");
  const btns = optsEl.querySelectorAll(".option-btn");

  btns.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (state.submitted[Y]) return;

      // Select the clicked option
      btns.forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
      const indicator = btn.querySelector(".opt-indicator");
      btns.forEach((b) => {
        b.querySelector(".opt-indicator").innerHTML = "";
      });
      indicator.innerHTML = `<svg viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3"/></svg>`;
      state.answers[Y] = parseInt(btn.dataset.idx);

      // Immediately reveal answer (direct reveal)
      revealAnswer(Y, btn);
    });
  });

  // Remove submit button since we're using direct reveal
  submitEl.style.display = "none";

  function revealAnswer(questionIndex, clickedBtn) {
    state.submitted[questionIndex] = true;
    const chosen = state.answers[questionIndex];
    const isCorrect = CORRECT[questionIndex].includes(chosen);
    state.correct[questionIndex] = isCorrect;

    btns.forEach((btn) => {
      const idx = parseInt(btn.dataset.idx);
      btn.disabled = true;
      btn.classList.add("revealed");
      btn.classList.remove("selected");

      const isAnswer = CORRECT[questionIndex].includes(idx);
      const wasPicked = idx === chosen;

      if (isAnswer) btn.classList.add("correct");
      else if (wasPicked) btn.classList.add("wrong-pick");

      // update indicator
      const ind = btn.querySelector(".opt-indicator");
      if (isAnswer) {
        ind.innerHTML = `<svg viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3"/></svg>`;
      } else if (wasPicked) {
        ind.innerHTML = `<svg viewBox="0 0 12 12"><line x1="3" y1="3" x2="9" y2="9"/><line x1="9" y1="3" x2="3" y2="9"/></svg>`;
      } else {
        ind.innerHTML = "";
      }
    });

    card.classList.add(isCorrect ? "answered-correct" : "answered-wrong");
    verdictEl.textContent = isCorrect ? "✓ Correct" : "✗ Incorrect";
    verdictEl.className = "exp-verdict " + (isCorrect ? "correct" : "wrong");
    expEl.classList.add("show", isCorrect ? "correct-exp" : "wrong-exp");

    updateScoreStrip();
    updateDots();
  }
})();
```

Replace the following placeholders:
- `X`: The question number.
- `Y`: The zero-based index for the question (e.g., for Question 3, use `2`).
- `Z`: The correct answer index or indices.

## Notes
- Ensure that the question number and zero-based index are consistent across all files.
- Test the quiz thoroughly after adding a new question to ensure all functionality works as expected.
- If the new question is a multiple-choice question, update the initialization logic to handle multiple selections.

## Source Text Fidelity Rule
> **CRITICAL: When copying questions, answer options, or explanation text from `modified_text_with_answers.txt`, the content MUST be reproduced exactly as written in the source file.**

- **Do NOT paraphrase**, reword, summarize, or alter any question text, answer option text, or explanation text in any way.
- **Do NOT fix grammar**, punctuation, capitalization, or spelling — copy the text verbatim, even if it appears to contain errors.
- **Do NOT merge, split, or reorder** answer options relative to how they appear in the source file.
- The only permitted changes are adding HTML tags for formatting (e.g., `<strong>`, `<ul>`, `<li>`) around the exact text, and stripping trailing markers like `(answer)` from option text since correct answers are tracked in `script.js` via the `CORRECT` array instead.
- If the source text includes special characters (e.g., `​` zero-width spaces, `​` Unicode variants), preserve them as-is or use the nearest standard HTML equivalent.
- **Any deviation from the source text is a bug** and must be corrected by re-reading `modified_text_with_answers.txt` and restoring the original wording.
