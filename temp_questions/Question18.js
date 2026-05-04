// Initialize Question18
export function initQ17(ctx) {
  const { state, CORRECT, updateScoreStrip, updateDots } = ctx;
  const optsEl = document.getElementById("opts-17");
  const submitEl = document.getElementById("submit-17");
  const expEl = document.getElementById("exp-17");
  const verdictEl = document.getElementById("verdict-17");
  const card = document.getElementById("card-17");
  const btns = optsEl.querySelectorAll(".option-btn");

  btns.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (state.submitted[17]) return;

      btns.forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
      const indicator = btn.querySelector(".opt-indicator");
      btns.forEach((b) => {
        b.querySelector(".opt-indicator").innerHTML = "";
      });
      indicator.innerHTML = `<svg viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3"/></svg>`;
      state.answers[17] = parseInt(btn.dataset.idx);

      revealAnswer(17, btn);
    });
  });

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
}
