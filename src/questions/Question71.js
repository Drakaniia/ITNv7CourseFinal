// Initialize Question71
export function initQ70(ctx) {
  const { state, CORRECT, updateScoreStrip, updateDots } = ctx;
  const optsEl = document.getElementById("opts-70");
  const submitEl = document.getElementById("submit-70");
  const expEl = document.getElementById("exp-70");
  const verdictEl = document.getElementById("verdict-70");
  const card = document.getElementById("card-70");
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
      if (state.submitted[70]) return;

      const idx = parseInt(btn.dataset.idx);
      const isCorrectAnswer = CORRECT[70].includes(idx);
      const isAlreadySelected = btn.classList.contains("selected");

      // If already selected, allow deselection
      if (isAlreadySelected) {
        btn.classList.remove("selected");
        const indicator = btn.querySelector(".opt-indicator");
        indicator.innerHTML = "";
        state.answers[70] = state.answers[70].filter((i) => i !== idx);
        return;
      }

      // Check if this is a wrong answer
      if (!isCorrectAnswer) {
        // Mark as wrong immediately
        btn.classList.add("wrong-pick");
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
      
      if (!state.answers[70].includes(idx)) {
        state.answers[70].push(idx);
      }

      // Check if all correct answers are selected
      const allCorrectSelected = CORRECT[70].every(correctIdx => 
        state.answers[70].includes(correctIdx)
      );

      if (allCorrectSelected && state.answers[70].length === CORRECT[70].length) {
        // All correct answers found!
        revealAnswer(70, true);
      }
    });
  });

  function revealAllCorrectAnswers() {
    // Auto-reveal after 2 wrong attempts
    btns.forEach((btn) => {
      const idx = parseInt(btn.dataset.idx);
      if (CORRECT[70].includes(idx)) {
        btn.classList.add("selected", "correct");
        const indicator = btn.querySelector(".opt-indicator");
        indicator.innerHTML = `<svg viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3"/></svg>`;
        if (!state.answers[70].includes(idx)) {
          state.answers[70].push(idx);
        }
      }
      btn.disabled = true;
    });
    
    revealAnswer(70, false);
  }

  function revealAnswer(questionIndex, isCorrect) {
    state.submitted[questionIndex] = true;
    state.correct[questionIndex] = isCorrect;

    btns.forEach((btn) => {
      const idx = parseInt(btn.dataset.idx);
      btn.disabled = true;
      btn.classList.add("revealed");

      const isAnswer = CORRECT[questionIndex].includes(idx);
      const wasPicked = state.answers[questionIndex].includes(idx);

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
