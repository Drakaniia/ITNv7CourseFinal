// Initialize Question11
export function initQ10({ state, CORRECT, updateScoreStrip, updateDots }) {
  const optsEl = document.getElementById("opts-10");
  const submitEl = document.getElementById("submit-10");
  const expEl = document.getElementById("exp-10");
  const verdictEl = document.getElementById("verdict-10");
  const countEl = document.getElementById("pendingCount-10");
  const card = document.getElementById("card-10");
  const btns = optsEl.querySelectorAll(".option-btn");
  const CHOOSE = 2;

  btns.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (state.submitted[10]) return;
      const idx = parseInt(btn.dataset.idx);
      const arr = state.answers[10];

      if (btn.classList.contains("selected")) {
        btn.classList.remove("selected");
        btn.querySelector(".opt-indicator").innerHTML = "";
        state.answers[10] = arr.filter((i) => i !== idx);
      } else {
        if (arr.length >= CHOOSE) return; // cap at 2
        btn.classList.add("selected");
        btn.querySelector(".opt-indicator").innerHTML =
          `<svg viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3"/></svg>`;
        state.answers[10] = [...arr, idx];
      }

      const sel = state.answers[10].length;
      countEl.textContent = `${sel} / ${CHOOSE} selected`;
      submitEl.disabled = sel < CHOOSE;
      submitEl.style.opacity = sel < CHOOSE ? "" : "1";

      // If we have exactly 2 selections, reveal answer immediately
      if (sel === CHOOSE) {
        revealAnswer(10);
      }
    });
  });

  // Remove submit button since we're using direct reveal
  submitEl.style.display = "none";

  function revealAnswer(questionIndex) {
    state.submitted[questionIndex] = true;
    const chosen = state.answers[questionIndex];
    const isCorrect =
      CORRECT[questionIndex].every((c) => chosen.includes(c)) &&
      chosen.length === CORRECT[questionIndex].length;
    state.correct[questionIndex] = isCorrect;

    btns.forEach((btn) => {
      const idx = parseInt(btn.dataset.idx);
      btn.disabled = true;
      btn.classList.add("revealed");
      btn.classList.remove("selected");

      const isAnswer = CORRECT[questionIndex].includes(idx);
      const wasPicked = chosen.includes(idx);
      const ind = btn.querySelector(".opt-indicator");

      if (isAnswer && wasPicked) {
        btn.classList.add("correct");
        ind.innerHTML = `<svg viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3"/></svg>`;
      } else if (isAnswer && !wasPicked) {
        btn.classList.add("missed");
        ind.innerHTML = `<svg viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3"/></svg>`;
      } else if (!isAnswer && wasPicked) {
        btn.classList.add("wrong-pick");
        ind.innerHTML = `<svg viewBox="0 0 12 12"><line x1="3" y1="3" x2="9" y2="9"/><line x1="9" y1="3" x2="3" y2="9"/></svg>`;
      } else {
        ind.innerHTML = "";
      }
    });

    card.classList.add(isCorrect ? "answered-correct" : "answered-wrong");
    verdictEl.textContent = isCorrect ? "✓ Correct" : "✗ Incorrect";
    verdictEl.className = "exp-verdict " + (isCorrect ? "correct" : "wrong");
    expEl.classList.add("show", isCorrect ? "correct-exp" : "wrong-exp");
    countEl.textContent = "";

    updateScoreStrip();
    updateDots();
  }
}
