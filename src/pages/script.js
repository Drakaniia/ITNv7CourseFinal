// Import individual question initialization functions
import { initQ0 } from "./questions/Question1.js";
import { initQ1 } from "./questions/Question2.js";
import { initQ2 } from "./questions/Question3.js";
import { initQ3 } from "./questions/Question4.js";
import { initQ4 } from "./questions/Question5.js";
import { initQ5 } from "./questions/Question6.js";
import { initQ6 } from "./questions/Question7.js";
import { initQ7 } from "./questions/Question8.js";
import { initQ8 } from "./questions/Question9.js";
import { initQ9 } from "./questions/Question10.js";
import { initQ10 } from "./questions/Question11.js";
import { initQ11 } from "./questions/Question12.js";
import { initQ12 } from "./questions/Question13.js";
import { initQ13 } from "./questions/Question14.js";
import { initQ14 } from "./questions/Question15.js";
import { initQ15 } from "./questions/Question16.js";
import { initQ16 } from "./questions/Question17.js";
import { initQ17 } from "./questions/Question18.js";
import { initQ18 } from "./questions/Question19.js";
import { initQ19 } from "./questions/Question20.js";
import { initQ20 } from "./questions/Question21.js";
import { initQ21 } from "./questions/Question22.js";
import { initQ22 } from "./questions/Question23.js";
import { initQ23 } from "./questions/Question24.js";
import { initQ24 } from "./questions/Question25.js";
import { initQ25 } from "./questions/Question26.js";
import { initQ26 } from "./questions/Question27.js";
import { initQ27 } from "./questions/Question28.js";
import { initQ28 } from "./questions/Question29.js";
import { initQ29 } from "./questions/Question30.js";
import { initQ30 } from "./questions/Question31.js";
import { initQ31 } from "./questions/Question32.js";
import { initQ32 } from "./questions/Question33.js";
import { initQ33 } from "./questions/Question34.js";
import { initQ34 } from "./questions/Question35.js";
import { initQ35 } from "./questions/Question36.js";
import { initQ36 } from "./questions/Question37.js";
import { initQ37 } from "./questions/Question38.js";
import { initQ38 } from "./questions/Question39.js";
import { initQ39 } from "./questions/Question40.js";

// ── State ────────────────────────────────────────────────────────────
const state = {
  answers: [
    null,
    [],
    null,
    [],
    null,
    null,
    null,
    null,
    null,
    null,
    [],
    [],
    null,
    [],
    null,
    null,
    null,
    null,
    null,
    null,
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
  ],
  submitted: [
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ],
  correct: [
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ],
  currentQuestion: 0,
};
const CORRECT = [
  [2],
  [0, 1],
  [0, 1],
  [0, 1],
  [2],
  [2],
  [2],
  [3],
  [0],
  [3],
  [0, 3],
  [1, 3, 4],
  [2],
  [0, 1],
  [2],
  [2],
  [2],
  [3],
  [3],
  [0],
  [3],
  [1, 4],
  [0],
  [0, 1],
  [2, 3, 5],
  [3],
  [1, 3, 4],
  [3],
  [1, 3],
  [0],
  [1],
  [0, 2, 3],
  [4],
  [0, 1, 2, 3, 4, 5, 6],
  [2],
  [3],
  [3],
  [3],
  [3],
  [3],
  [0],
];
const questions = document.querySelectorAll(".question-card");
const totalQuestions = questions.length;

// ── Theme Management ─────────────────────────────────────────────────
(function initTheme() {
  const themeToggle = document.getElementById("themeToggle");
  const html = document.documentElement;
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
  for (let i = btnsArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [btnsArray[i], btnsArray[j]] = [btnsArray[j], btnsArray[i]];
  }
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
  document.getElementById("scoreRemain").textContent = 40 - done;
  document.getElementById("scorePct").textContent = done
    ? Math.round((right / done) * 100) + " %"
    : "— %";
  document.getElementById("headerProgress").textContent =
    `${done} / 40 answered`;
  document.getElementById("progressBar").style.width = (done / 40) * 100 + "%";
}

function updateDots() {
  document.querySelectorAll(".dot").forEach((dot, i) => {
    dot.classList.remove("active", "done-ok", "done-bad");
    if (state.submitted[i]) {
      dot.classList.add(state.correct[i] ? "done-ok" : "done-bad");
    }
  });
}

// Initialize all questions
const ctx = { state, CORRECT, updateScoreStrip, updateDots };
initQ0(ctx);
initQ1(ctx);
initQ2(ctx);
initQ3(ctx);
initQ4(ctx);
initQ5(ctx);
initQ6(ctx);
initQ7(ctx);
initQ8(ctx);
initQ9(ctx);
initQ10(ctx);
initQ11(ctx);
initQ12(ctx);
initQ13(ctx);
initQ14(ctx);
initQ15(ctx);
initQ16(ctx);
initQ17(ctx);
initQ18(ctx);
initQ19(ctx);
initQ20(ctx);
initQ21(ctx);
initQ22(ctx);
initQ23(ctx);
initQ24(ctx);
initQ25(ctx);
initQ26(ctx);
initQ27(ctx);
initQ28(ctx);
initQ29(ctx);
initQ30(ctx);
initQ31(ctx);
initQ32(ctx);
initQ33(ctx);
initQ34(ctx);
initQ35(ctx);
initQ36(ctx);
initQ37(ctx);
initQ38(ctx);
initQ39(ctx);

// ── Footer dots navigation ──────────────────────────────────────────
document.querySelectorAll(".dot[data-target]").forEach((dot, i) => {
  dot.addEventListener("click", () => {
    showQuestion(i);
  });
});

// ── Pagination Navigation ──────────────────────────────────────────
function showQuestion(index) {
  if (index < 0 || index >= totalQuestions) return;
  questions.forEach((q, i) => {
    q.style.display = "none";
  });
  questions[index].style.display = "block";
  state.currentQuestion = index;
  document.querySelectorAll(".dot").forEach((d, i) => {
    d.classList.remove("active");
    if (i === index && !state.submitted[i]) {
      d.classList.add("active");
    }
  });
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
document
  .getElementById("prev-2")
  .addEventListener("click", () => goToPrevQuestion());
document
  .getElementById("next-2")
  .addEventListener("click", () => goToNextQuestion());
document
  .getElementById("prev-3")
  .addEventListener("click", () => goToPrevQuestion());
document
  .getElementById("next-3")
  .addEventListener("click", () => goToNextQuestion());
document
  .getElementById("prev-4")
  .addEventListener("click", () => goToPrevQuestion());
document
  .getElementById("next-4")
  .addEventListener("click", () => goToNextQuestion());
document
  .getElementById("prev-5")
  .addEventListener("click", () => goToPrevQuestion());
document
  .getElementById("next-5")
  .addEventListener("click", () => goToNextQuestion());
document
  .getElementById("prev-6")
  .addEventListener("click", () => goToPrevQuestion());
document
  .getElementById("next-6")
  .addEventListener("click", () => goToNextQuestion());
document
  .getElementById("prev-7")
  .addEventListener("click", () => goToPrevQuestion());
document
  .getElementById("next-7")
  .addEventListener("click", () => goToNextQuestion());
document
  .getElementById("prev-8")
  .addEventListener("click", () => goToPrevQuestion());
document
  .getElementById("next-8")
  .addEventListener("click", () => goToNextQuestion());
document
  .getElementById("prev-9")
  .addEventListener("click", () => goToPrevQuestion());
document
  .getElementById("next-9")
  .addEventListener("click", () => goToNextQuestion());
document
  .getElementById("prev-10")
  .addEventListener("click", () => goToPrevQuestion());
document
  .getElementById("next-10")
  .addEventListener("click", () => goToNextQuestion());
document
  .getElementById("prev-11")
  .addEventListener("click", () => goToPrevQuestion());
document
  .getElementById("next-11")
  .addEventListener("click", () => goToNextQuestion());
document
  .getElementById("prev-12")
  .addEventListener("click", () => goToPrevQuestion());
document
  .getElementById("next-12")
  .addEventListener("click", () => goToNextQuestion());
document
  .getElementById("prev-13")
  .addEventListener("click", () => goToPrevQuestion());
document
  .getElementById("next-13")
  .addEventListener("click", () => goToNextQuestion());
document
  .getElementById("prev-14")
  .addEventListener("click", () => goToPrevQuestion());
document
  .getElementById("next-14")
  .addEventListener("click", () => goToNextQuestion());
document
  .getElementById("prev-15")
  .addEventListener("click", () => goToPrevQuestion());
document
  .getElementById("next-15")
  .addEventListener("click", () => goToNextQuestion());
document
  .getElementById("prev-16")
  .addEventListener("click", () => goToPrevQuestion());
document
  .getElementById("next-16")
  .addEventListener("click", () => goToNextQuestion());
document
  .getElementById("prev-17")
  .addEventListener("click", () => goToPrevQuestion());
document
  .getElementById("next-17")
  .addEventListener("click", () => goToNextQuestion());
document
  .getElementById("prev-18")
  .addEventListener("click", () => goToPrevQuestion());
document
  .getElementById("next-18")
  .addEventListener("click", () => goToNextQuestion());
document
  .getElementById("prev-19")
  .addEventListener("click", () => goToPrevQuestion());
document
  .getElementById("next-19")
  .addEventListener("click", () => goToNextQuestion());
document
  .getElementById("prev-20")
  .addEventListener("click", () => goToPrevQuestion());
document
  .getElementById("next-20")
  .addEventListener("click", () => goToNextQuestion());
document
  .getElementById("prev-21")
  .addEventListener("click", () => goToPrevQuestion());
document
  .getElementById("next-21")
  .addEventListener("click", () => goToNextQuestion());
document
  .getElementById("prev-22")
  .addEventListener("click", () => goToPrevQuestion());
document
  .getElementById("next-22")
  .addEventListener("click", () => goToNextQuestion());
document
  .getElementById("prev-23")
  .addEventListener("click", () => goToPrevQuestion());
document
  .getElementById("next-23")
  .addEventListener("click", () => goToNextQuestion());
document
  .getElementById("prev-24")
  .addEventListener("click", () => goToPrevQuestion());
document
  .getElementById("next-24")
  .addEventListener("click", () => goToNextQuestion());
document
  .getElementById("prev-25")
  .addEventListener("click", () => goToPrevQuestion());
document
  .getElementById("next-25")
  .addEventListener("click", () => goToNextQuestion());
document
  .getElementById("prev-26")
  .addEventListener("click", () => goToPrevQuestion());
document
  .getElementById("next-26")
  .addEventListener("click", () => goToNextQuestion());
document
  .getElementById("prev-27")
  .addEventListener("click", () => goToPrevQuestion());
document
  .getElementById("next-27")
  .addEventListener("click", () => goToNextQuestion());
document
  .getElementById("prev-28")
  .addEventListener("click", () => goToPrevQuestion());
document
  .getElementById("next-28")
  .addEventListener("click", () => goToNextQuestion());
document
  .getElementById("prev-29")
  .addEventListener("click", () => goToPrevQuestion());
document
  .getElementById("next-29")
  .addEventListener("click", () => goToNextQuestion());
document
  .getElementById("prev-30")
  .addEventListener("click", () => goToPrevQuestion());
document
  .getElementById("next-30")
  .addEventListener("click", () => goToNextQuestion());
document
  .getElementById("prev-31")
  .addEventListener("click", () => goToPrevQuestion());
document
  .getElementById("next-31")
  .addEventListener("click", () => goToNextQuestion());
document
  .getElementById("prev-32")
  .addEventListener("click", () => goToPrevQuestion());
document
  .getElementById("next-32")
  .addEventListener("click", () => goToNextQuestion());
document
  .getElementById("prev-33")
  .addEventListener("click", () => goToPrevQuestion());
document
  .getElementById("next-33")
  .addEventListener("click", () => goToNextQuestion());
document
  .getElementById("prev-34")
  .addEventListener("click", () => goToPrevQuestion());
document
  .getElementById("next-34")
  .addEventListener("click", () => goToNextQuestion());
document
  .getElementById("prev-35")
  .addEventListener("click", () => goToPrevQuestion());
document
  .getElementById("next-35")
  .addEventListener("click", () => goToNextQuestion());
document
  .getElementById("prev-36")
  .addEventListener("click", () => goToPrevQuestion());
document
  .getElementById("next-36")
  .addEventListener("click", () => goToNextQuestion());
document
  .getElementById("prev-37")
  .addEventListener("click", () => goToPrevQuestion());
document
  .getElementById("next-37")
  .addEventListener("click", () => goToNextQuestion());
document
  .getElementById("prev-38")
  .addEventListener("click", () => goToPrevQuestion());
document
  .getElementById("next-38")
  .addEventListener("click", () => goToNextQuestion());
document
  .getElementById("prev-39")
  .addEventListener("click", () => goToPrevQuestion());
document
  .getElementById("next-39")
  .addEventListener("click", () => goToNextQuestion());

// Disable appropriate buttons
document.getElementById("prev-0").disabled = true;
document.getElementById("next-39").textContent = "Finish";

// Hide all questions initially
questions.forEach((q, i) => {
  if (i > 0) q.style.display = "none";
});

// Initialize - show first question
showQuestion(0);

// Shuffle options for all questions
for (let i = 0; i < totalQuestions; i++) {
  shuffleOptions(i);
}
