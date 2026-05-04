// Initialize Question72
export function initQ71(ctx) {
  const { state, CORRECT, updateScoreStrip, updateDots } = ctx;
  const optsEl = document.getElementById("opts-71");
  const submitEl = document.getElementById("submit-71");
  const expEl = document.getElementById("exp-71");
  const verdictEl = document.getElementById("verdict-71");
  const card = document.getElementById("card-71");
  const btns = optsEl.querySelectorAll(".option-btn");
  const pendingCountEl = document.getElementById("pendingCount-71");

  // Show submit button for multi-select
  const submitWrap = submitEl.parentElement;
  if (submitWrap) {
    submitWrap.style.display = "flex";
  }

  btns.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (state.submitted[71]) return;

      // Toggle selection
      btn.classList.toggle("selected");
      const indicator = btn.querySelector(".opt-indicator");
      const idx = parseInt(btn.dataset.idx);
      const isSelected = btn.classList.contains("selected");

      if (isSelected) {
        indicator.innerHTML = `<svg viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3"/></svg>`;
        if (!state.answers[71].includes(idx)) {
          state.answers[71].push(idx);
        }
      } else {
        indicator.innerHTML = "";
        state.answers[71] = state.answers[71].filter((i) => i !== idx);
      }

      // Update pending count
      const pendingCount = state.answers[71].length;
      pendingCountEl.textContent = `${pendingCount} / 3 selected`;

      // Enable/disable submit button based on selection count
      submitEl.disabled = pendingCount < 3;
      
      // Update button class
      if (pendingCount < 3) {
        submitEl.classList.add("multi-pending");
      } else {
        submitEl.classList.remove("multi-pending");
      }
    });
  });

  submitEl.addEventListener("click", () => {
    revealAnswer(71);
  });

  function revealAnswer(questionIndex) {
    state.submitted[questionIndex] = true;
    const chosen = state.answers[questionIndex];
    const isCorrect =
      CORRECT[questionIndex].length === chosen.length &&
      CORRECT[questionIndex].every((val) => chosen.includes(val));
    state.correct[questionIndex] = isCorrect;

    btns.forEach((btn) => {
      const idx = parseInt(btn.dataset.idx);
      btn.disabled = true;
      btn.classList.add("revealed");
      btn.classList.remove("selected");

      const isAnswer = CORRECT[questionIndex].includes(idx);
      const wasPicked = chosen.includes(idx);

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

    // Hide submit button after submission
    const submitWrap = submitEl.parentElement;
    if (submitWrap) {
      submitWrap.style.display = "none";
    }

    card.classList.add(isCorrect ? "answered-correct" : "answered-wrong");
    verdictEl.textContent = isCorrect ? "✓ Correct" : "✗ Incorrect";
    verdictEl.className = "exp-verdict " + (isCorrect ? "correct" : "wrong");
    expEl.classList.add("show", isCorrect ? "correct-exp" : "wrong-exp");

    updateScoreStrip();
    updateDots();
  }
}
