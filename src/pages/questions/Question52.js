// Initialize Question52
export function initQ51({ state, CORRECT, updateScoreStrip, updateDots }) {
  const optsEl = document.getElementById("opts-51");
  const submitEl = document.getElementById("submit-51");
  const expEl = document.getElementById("exp-51");
  const verdictEl = document.getElementById("verdict-51");
  const card = document.getElementById("card-51");
  const btns = optsEl.querySelectorAll(".option-btn");

  btns.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (state.submitted[51]) return;

      btns.forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
      const indicator = btn.querySelector(".opt-indicator");
      btns.forEach((b) => {
        b.querySelector(".opt-indicator").innerHTML = "";
      });
      indicator.innerHTML = `<svg viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3"/></svg>`;
      state.answers[51] = parseInt(btn.dataset.idx);

      revealAnswer(51, btn);
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
