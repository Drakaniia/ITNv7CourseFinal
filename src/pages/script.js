// ── State ────────────────────────────────────────────────────────────
const state = {
  answers: [null, []], // Q0: single idx | Q1: array of idxs
  submitted: [false, false],
  correct: [false, false],
  currentQuestion: 0,
};
const CORRECT = [[2], [0, 1]]; // correct indices per question
const questions = document.querySelectorAll(".question-card");
const totalQuestions = questions.length;

// ── Theme Management ─────────────────────────────────────────────────
(function initTheme() {
  const themeToggle = document.getElementById("themeToggle");
  const html = document.documentElement;
  
  // Load saved theme or default to dark
  const savedTheme = localStorage.getItem("theme") || "dark";
  html.setAttribute("data-theme", savedTheme);
  
  themeToggle.addEventListener("click", () => {
    const currentTheme = html.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    
    html.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  });
})();

// Shuffle options for each question
function shuffleOptions(questionIndex) {
  const optsEl = document.getElementById(`opts-${questionIndex}`);
  const btns = optsEl.querySelectorAll(".option-btn");
  const btnsArray = Array.from(btns);

  // Fisher-Yates shuffle algorithm
  for (let i = btnsArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [btnsArray[i], btnsArray[j]] = [btnsArray[j], btnsArray[i]];
  }

  // Re-append shuffled buttons to the DOM
  btnsArray.forEach((btn) => {
    optsEl.appendChild(btn);
  });
}

// ── Helpers ──────────────────────────────────────────────────────────
function updateScoreStrip() {
  const done = state.submitted.filter(Boolean).length;
  const right = state.correct.filter(Boolean).length;
  const wrong = done - right;
  document.getElementById("scoreCorrect").textContent = right;
  document.getElementById("scoreWrong").textContent = wrong;
  document.getElementById("scoreRemain").textContent = 2 - done;
  document.getElementById("scorePct").textContent = done
    ? Math.round((right / done) * 100) + " %"
    : "— %";
  document.getElementById("headerProgress").textContent =
    `${done} / 2 answered`;
  document.getElementById("progressBar").style.width = (done / 2) * 100 + "%";
}

function updateDots() {
  document.querySelectorAll(".dot").forEach((dot, i) => {
    dot.classList.remove("active", "done-ok", "done-bad");
    if (state.submitted[i]) {
      dot.classList.add(state.correct[i] ? "done-ok" : "done-bad");
    }
  });
}

// ── Q1: Single choice ────────────────────────────────────────────────
(function initQ0() {
  const optsEl = document.getElementById("opts-0");
  const submitEl = document.getElementById("submit-0");
  const expEl = document.getElementById("exp-0");
  const verdictEl = document.getElementById("verdict-0");
  const card = document.getElementById("card-0");
  const btns = optsEl.querySelectorAll(".option-btn");

  btns.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (state.submitted[0]) return;

      // Select the clicked option
      btns.forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
      const indicator = btn.querySelector(".opt-indicator");
      btns.forEach((b) => {
        b.querySelector(".opt-indicator").innerHTML = "";
      });
      indicator.innerHTML = `<svg viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3"/></svg>`;
      state.answers[0] = parseInt(btn.dataset.idx);

      // Immediately reveal answer (direct reveal)
      revealAnswer(0, btn);
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

// ── Q2: Multi choice ─────────────────────────────────────────────────
(function initQ1() {
  const optsEl = document.getElementById("opts-1");
  const submitEl = document.getElementById("submit-1");
  const expEl = document.getElementById("exp-1");
  const verdictEl = document.getElementById("verdict-1");
  const countEl = document.getElementById("pendingCount-1");
  const card = document.getElementById("card-1");
  const btns = optsEl.querySelectorAll(".option-btn");
  const CHOOSE = 2;

  btns.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (state.submitted[1]) return;
      const idx = parseInt(btn.dataset.idx);
      const arr = state.answers[1];

      if (btn.classList.contains("selected")) {
        btn.classList.remove("selected");
        btn.querySelector(".opt-indicator").innerHTML = "";
        state.answers[1] = arr.filter((i) => i !== idx);
      } else {
        if (arr.length >= CHOOSE) return; // cap at 2
        btn.classList.add("selected");
        btn.querySelector(".opt-indicator").innerHTML =
          `<svg viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3"/></svg>`;
        state.answers[1] = [...arr, idx];
      }

      const sel = state.answers[1].length;
      countEl.textContent = `${sel} / ${CHOOSE} selected`;
      submitEl.disabled = sel < CHOOSE;
      submitEl.style.opacity = sel < CHOOSE ? "" : "1";

      // If we have exactly 2 selections, reveal answer immediately
      if (sel === CHOOSE) {
        revealAnswer(1);
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
})();

// ── Footer dots navigation ──────────────────────────────────────────
document.querySelectorAll(".dot[data-target]").forEach((dot, i) => {
  dot.addEventListener("click", () => {
    showQuestion(i);
  });
});

// ── Pagination Navigation ──────────────────────────────────────────
function showQuestion(index) {
  if (index < 0 || index >= totalQuestions) return;
  console.log(`Showing question ${index + 1}`);

  // Hide all questions
  questions.forEach((q, i) => {
    q.style.display = "none";
  });

  // Show selected question
  questions[index].style.display = "block";
  state.currentQuestion = index;

  // Update active dot
  document.querySelectorAll(".dot").forEach((d, i) => {
    d.classList.remove("active");
    if (i === index && !state.submitted[i]) {
      d.classList.add("active");
    }
  });

  // Update button states based on current question
  const prevBtn = document.getElementById(`prev-${index}`);
  const nextBtn = document.getElementById(`next-${index}`);

  if (prevBtn) prevBtn.disabled = index === 0;
  if (nextBtn) {
    nextBtn.disabled = index === totalQuestions - 1;
    nextBtn.textContent = index === totalQuestions - 1 ? "Finish" : "Next";
  }
}

function goToPrevQuestion() {
  showQuestion(state.currentQuestion - 1);
}

function goToNextQuestion() {
  showQuestion(state.currentQuestion + 1);
}

// Initialize pagination button event listeners
document
  .getElementById("prev-0")
  .addEventListener("click", () => goToPrevQuestion());
document
  .getElementById("next-0")
  .addEventListener("click", () => goToNextQuestion());
document
  .getElementById("prev-1")
  .addEventListener("click", () => goToPrevQuestion());
document
  .getElementById("next-1")
  .addEventListener("click", () => goToNextQuestion());

// Disable appropriate buttons
document.getElementById("prev-0").disabled = true;
document.getElementById("next-1").textContent = "Finish";

// Hide all questions initially
questions.forEach((q, i) => {
  if (i > 0) q.style.display = "none";
});

// Initialize - show first question
showQuestion(0);
console.log("Initial question displayed");

// Shuffle options for all questions
for (let i = 0; i < totalQuestions; i++) {
  shuffleOptions(i);
}
