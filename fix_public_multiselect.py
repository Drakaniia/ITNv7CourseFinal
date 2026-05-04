#!/usr/bin/env python3
"""
Fix multi-select question logic in the public folder.
"""

import os
import re

def fix_multiselect_js(file_path, question_index):
    """Fix the JavaScript logic for a multi-select question."""
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if this is already a multi-select question (has array initialization)
    if f'state.answers[{question_index}].filter' not in content:
        return False  # Not a multi-select question
    
    # Create the fixed JavaScript content
    fixed_content = f'''// Initialize Question{question_index + 1}
export function initQ{question_index}(ctx) {{
  const {{ state, CORRECT, updateScoreStrip, updateDots }} = ctx;
  const optsEl = document.getElementById("opts-{question_index}");
  const submitEl = document.getElementById("submit-{question_index}");
  const expEl = document.getElementById("exp-{question_index}");
  const verdictEl = document.getElementById("verdict-{question_index}");
  const card = document.getElementById("card-{question_index}");
  const btns = optsEl.querySelectorAll(".option-btn");

  // Hide submit button - we use immediate feedback
  const submitWrap = submitEl?.parentElement;
  if (submitWrap) {{
    submitWrap.style.display = "none";
  }}

  let wrongAttempts = 0;
  const MAX_WRONG_ATTEMPTS = 2;

  btns.forEach((btn) => {{
    btn.addEventListener("click", () => {{
      if (state.submitted[{question_index}]) return;

      const idx = parseInt(btn.dataset.idx);
      const isCorrectAnswer = CORRECT[{question_index}].includes(idx);
      const isAlreadySelected = btn.classList.contains("selected");
      const isWrongPick = btn.classList.contains("wrong-pick");

      // Don't allow interaction with wrong answers
      if (isWrongPick) return;

      // If already selected (and correct), allow deselection
      if (isAlreadySelected && isCorrectAnswer) {{
        btn.classList.remove("selected");
        const indicator = btn.querySelector(".opt-indicator");
        indicator.innerHTML = "";
        state.answers[{question_index}] = state.answers[{question_index}].filter((i) => i !== idx);
        return;
      }}

      // Check if this is a wrong answer
      if (!isCorrectAnswer) {{
        // Mark as wrong immediately and disable
        btn.classList.add("wrong-pick");
        btn.disabled = true;
        const indicator = btn.querySelector(".opt-indicator");
        indicator.innerHTML = `<svg viewBox="0 0 12 12"><line x1="3" y1="3" x2="9" y2="9"/><line x1="9" y1="3" x2="3" y2="9"/></svg>`;
        
        wrongAttempts++;
        
        // If 2 wrong attempts, reveal all correct answers
        if (wrongAttempts >= MAX_WRONG_ATTEMPTS) {{
          revealAllCorrectAnswers();
        }}
        return;
      }}

      // Correct answer - select it
      btn.classList.add("selected");
      const indicator = btn.querySelector(".opt-indicator");
      indicator.innerHTML = `<svg viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3"/></svg>`;
      
      if (!state.answers[{question_index}].includes(idx)) {{
        state.answers[{question_index}].push(idx);
      }}

      // Check if all correct answers are selected
      const allCorrectSelected = CORRECT[{question_index}].every(correctIdx => 
        state.answers[{question_index}].includes(correctIdx)
      );

      if (allCorrectSelected && state.answers[{question_index}].length === CORRECT[{question_index}].length) {{
        // All correct answers found!
        revealAnswer({question_index}, true);
      }}
    }});
  }});

  function revealAllCorrectAnswers() {{
    // Auto-reveal after 2 wrong attempts
    btns.forEach((btn) => {{
      const idx = parseInt(btn.dataset.idx);
      if (CORRECT[{question_index}].includes(idx)) {{
        btn.classList.add("selected", "correct");
        const indicator = btn.querySelector(".opt-indicator");
        indicator.innerHTML = `<svg viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3"/></svg>`;
        if (!state.answers[{question_index}].includes(idx)) {{
          state.answers[{question_index}].push(idx);
        }}
      }}
      btn.disabled = true;
    }});
    
    revealAnswer({question_index}, false);
  }}

  function revealAnswer(questionIndex, isCorrect) {{
    state.submitted[questionIndex] = true;
    state.correct[questionIndex] = isCorrect;

    btns.forEach((btn) => {{
      const idx = parseInt(btn.dataset.idx);
      btn.disabled = true;
      btn.classList.add("revealed");

      const isAnswer = CORRECT[questionIndex].includes(idx);

      if (isAnswer && !btn.classList.contains("correct")) {{
        btn.classList.add("correct");
      }}

      // Update indicator
      const ind = btn.querySelector(".opt-indicator");
      if (isAnswer && !ind.innerHTML) {{
        ind.innerHTML = `<svg viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3"/></svg>`;
      }}
    }});

    card.classList.add(isCorrect ? "answered-correct" : "answered-wrong");
    verdictEl.textContent = isCorrect ? "✓ Correct" : "✗ Incorrect";
    verdictEl.className = "exp-verdict " + (isCorrect ? "correct" : "wrong");
    expEl.classList.add("show", isCorrect ? "correct-exp" : "wrong-exp");

    updateScoreStrip();
    updateDots();
  }}
}}
'''
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(fixed_content)
    
    return True

def main():
    questions_dir = 'public/questions'
    
    if not os.path.exists(questions_dir):
        print(f"Error: {questions_dir} directory not found!")
        return
    
    fixed_count = 0
    
    # Process all question files
    for i in range(1, 112):  # Questions 1-111
        js_file = os.path.join(questions_dir, f'Question{i}.js')
        
        if os.path.exists(js_file):
            if fix_multiselect_js(js_file, i - 1):  # question_index is 0-based
                fixed_count += 1
                print(f"✓ Fixed Question{i}.js")
    
    print(f"\n{'='*60}")
    print(f"Fixed {fixed_count} multi-select question files in public folder")
    print(f"{'='*60}")

if __name__ == '__main__':
    main()
