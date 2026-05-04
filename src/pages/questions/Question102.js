export function initQ101() {
  const optsEl = document.getElementById("opts-101");
  const expEl = document.getElementById("exp-101");
  const verdictEl = document.getElementById("verdict-101");
  const card = document.getElementById("card-101");
  const btns = optsEl.querySelectorAll(".option-btn");
  const requiredCount = 2;

  btns.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (window.state.submitted[101]) return;

      const idx = parseInt(btn.dataset.idx);
      const currentAnswers = window.state.answers[101];
      const alreadySelected = currentAnswers.includes(idx);

      if (alreadySelected) {
        const newAnswers = currentAnswers.filter((a) => a !== idx);
        window.state.answers[101] = newAnswers;
        btn.classList.remove("selected");
        btn.querySelector(".opt-indicator").innerHTML = "";
      } else {
        if (currentAnswers.length < requiredCount) {
          window.state.answers[101] = [...currentAnswers, idx];
          btn.classList.add("selected");
          btn.querySelector(
            ".opt-indicator"
          ).innerHTML = `<svg viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3"/></svg>`;
        }
      }

      if (window.state.answers[101].length === requiredCount) {
        revealAnswer(101);
      }
    });
  });

  function revealAnswer(questionIndex) {
    window.state.submitted[questionIndex] = true;
    const chosen = window.state.answers[questionIndex];
    const correctAnswers = window.CORRECT[questionIndex];
    const isCorrect =
      chosen.length === correctAnswers.length &&
      chosen.every((a) => correctAnswers.includes(a));
    window.state.correct[questionIndex] = isCorrect;

    btns.forEach((btn) => {
      const idx = parseInt(btn.dataset.idx);
      btn.disabled = true;
      btn.classList.add("revealed");
      btn.classList.remove("selected");

      const isAnswer = correctAnswers.includes(idx);
      const wasPicked = chosen.includes(idx);

      if (isAnswer && wasPicked) {
        btn.classList.add("correct");
      } else if (isAnswer && !wasPicked) {
        btn.classList.add("correct", "missed");
      } else if (!isAnswer && wasPicked) {
        btn.classList.add("wrong-pick");
      }

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

    window.updateScoreStrip();
    window.updateDots();
  }
}
