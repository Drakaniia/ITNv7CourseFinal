// Initialize Question15
export function initQ14(ctx) {
  const { state, CORRECT, updateScoreStrip, updateDots } = ctx;
  const optsEl = document.getElementById("opts-14");
  const submitEl = document.getElementById("submit-14");
  const expEl = document.getElementById("exp-14");
  const verdictEl = document.getElementById("verdict-14");
  const card = document.getElementById("card-14");
  const btns = optsEl.querySelectorAll(".option-btn");

  // Hide submit button - we use immediate feedback
  const submitWrap = submitEl?.parentElement;
  if (submitWrap) {
    submitWrap.style.display = "none";
  }

  let wrongAttempts = 0;
  const MAX_WRONG_ATTEMPTS = 2;

  btns.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (state.submitted[14]) return;

      const idx = parseInt(btn.dataset.idx);
      const isCorrectAnswer = CORRECT[14].includes(idx);
      const isAlreadySelected = btn.classList.contains("selected");
      const isWrongPick = btn.classList.contains("wrong-pick");

      // Don't allow interaction with wrong answers
      if (isWrongPick) return;

      // If already selected (and correct), allow deselection
      if (isAlreadySelected && isCorrectAnswer) {
        btn.classList.remove("selected");
        const indicator = btn.querySelector(".opt-indicator");
        indicator.innerHTML = "";
        state.answers[14] = state.answers[14].filter((i) => i !== idx);
        return;
      }

      // Check if this is a wrong answer
      if (!isCorrectAnswer) {
        // Mark as wrong immediately and disable
        btn.classList.add("wrong-pick");
        btn.disabled = true;
        const indicator = btn.querySelector(".opt-indicator");
        indicator.innerHTML = `<svg viewBox="0 0 12 12"><line x1="3" y1="3" x2="9" y2="9"/><line x1="9" y1="3" x2="3" y2="9"/></svg>`;
        
        wrongAttempts++;
        
        // If 2 wrong attempts, reveal all correct answers
        if (wrongAttempts >= MAX_WRONG_ATTEMPTS) {
          revealAllCorrectAnswers();
        }
        return;
      }

      // Correct answer - select it
      btn.classList.add("selected");
      const indicator = btn.querySelector(".opt-indicator");
      indicator.innerHTML = `<svg viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3"/></svg>`;
      
      if (!state.answers[14].includes(idx)) {
        state.answers[14].push(idx);
      }

      // Check if all correct answers are selected
      const allCorrectSelected = CORRECT[14].every(correctIdx => 
        state.answers[14].includes(correctIdx)
      );

      if (allCorrectSelected && state.answers[14].length === CORRECT[14].length) {
        // All correct answers found!
        revealAnswer(14, true);
      }
    });
  });

  function revealAllCorrectAnswers() {
    // Auto-reveal after 2 wrong attempts
    btns.forEach((btn) => {
      const idx = parseInt(btn.dataset.idx);
      if (CORRECT[14].includes(idx)) {
        btn.classList.add("selected", "correct");
        const indicator = btn.querySelector(".opt-indicator");
        indicator.innerHTML = `<svg viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3"/></svg>`;
        if (!state.answers[14].includes(idx)) {
          state.answers[14].push(idx);
        }
      }
      btn.disabled = true;
    });
    
    revealAnswer(14, false);
  }

  function revealAnswer(questionIndex, isCorrect) {
    state.submitted[questionIndex] = true;
    state.correct[questionIndex] = isCorrect;

    btns.forEach((btn) => {
      const idx = parseInt(btn.dataset.idx);
      btn.disabled = true;
      btn.classList.add("revealed");

      const isAnswer = CORRECT[questionIndex].includes(idx);

      if (isAnswer && !btn.classList.contains("correct")) {
        btn.classList.add("correct");
      }

      // Update indicator
      const ind = btn.querySelector(".opt-indicator");
      if (isAnswer && !ind.innerHTML) {
        ind.innerHTML = `<svg viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3"/></svg>`;
      }
    });

    card.classList.add(isCorrect ? "answered-correct" : "answered-wrong");
    verdictEl.textContent = isCorrect ? "✓ Correct" : "✗ Incorrect";
    verdictEl.className = "exp-verdict " + (isCorrect ? "correct" : "wrong");
    expEl.classList.add("show", isCorrect ? "correct-exp" : "wrong-exp");

    updateScoreStrip();
    updateDots();
  }
}
