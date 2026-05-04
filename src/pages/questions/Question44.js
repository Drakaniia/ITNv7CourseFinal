export function initQ43(ctx) {
  const { state, CORRECT, updateScoreStrip, updateDots } = ctx;
  const questionIndex = 43;
  const optsEl = document.getElementById(`opts-${questionIndex}`);
  const expEl = document.getElementById(`exp-${questionIndex}`);
  const verdictEl = document.getElementById(`verdict-${questionIndex}`);
  const card = document.getElementById(`card-${questionIndex}`);
  const btns = optsEl.querySelectorAll(".option-btn");

  btns.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (state.submitted[questionIndex]) return;

      const idx = parseInt(btn.dataset.idx);
      const currentAnswers = state.answers[questionIndex] || [];
      
      if (currentAnswers.includes(idx)) {
        const newAnswers = currentAnswers.filter((a) => a !== idx);
        state.answers[questionIndex] = newAnswers;
        btn.classList.remove("selected");
        btn.querySelector(".opt-indicator").innerHTML = "";
      } else {
        state.answers[questionIndex] = [...currentAnswers, idx];
        btn.classList.add("selected");
        btn.querySelector(".opt-indicator").innerHTML = `<svg viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3"/></svg>`;
      }

      if (state.answers[questionIndex].length === 2) {
        revealAnswer(questionIndex);
      }
    });
  });

  function revealAnswer(questionIndex) {
    state.submitted[questionIndex] = true;
    const chosen = state.answers[questionIndex];
    const correctSet = CORRECT[questionIndex];
    const isCorrect =
      chosen.length === correctSet.length &&
      chosen.every((c) => correctSet.includes(c));
    state.correct[questionIndex] = isCorrect;

    btns.forEach((btn) => {
      const idx = parseInt(btn.dataset.idx);
      btn.disabled = true;
      btn.classList.add("revealed");
      btn.classList.remove("selected");

      const isAnswer = correctSet.includes(idx);
      const wasPicked = chosen.includes(idx);

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
