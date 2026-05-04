#!/usr/bin/env python3
"""
Remove submit button and counter from multi-select questions.
Implement immediate feedback with 2-wrong-attempt auto-reveal.
"""

import os
import re

# Questions that are multi-select (based on CORRECT array having multiple answers)
MULTI_SELECT_QUESTIONS = [
    1, 2, 3, 10, 11, 12, 13, 14, 18, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
    31, 32, 33, 40, 44, 46, 49, 55, 56, 59, 60, 63, 64, 69, 70, 71, 73, 74, 84,
    86, 88, 90, 101, 103, 109
]

def create_new_multiselect_js(question_num, question_index, num_correct):
    """Generate new JavaScript for multi-select with immediate feedback"""
    
    return f'''// Initialize Question{question_num}
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

      // If already selected, allow deselection
      if (isAlreadySelected) {{
        btn.classList.remove("selected");
        const indicator = btn.querySelector(".opt-indicator");
        indicator.innerHTML = "";
        state.answers[{question_index}] = state.answers[{question_index}].filter((i) => i !== idx);
        return;
      }}

      // Check if this is a wrong answer
      if (!isCorrectAnswer) {{
        // Mark as wrong immediately
        btn.classList.add("wrong-pick");
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
      const wasPicked = state.answers[questionIndex].includes(idx);

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

def update_multiselect_astro(file_path):
    """Remove the pending count span from Astro file"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove the pending count span
    content = re.sub(
        r'<span class="pending-count" id="pendingCount-\d+">.*?</span>',
        '',
        content
    )
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

def main():
    base_dir = "src/questions"
    
    # Get CORRECT array to determine number of correct answers
    correct_answers = {}
    with open("public/script.js", 'r', encoding='utf-8') as f:
        content = f.read()
        match = re.search(r'const CORRECT = \[(.*?)\];', content, re.DOTALL)
        if match:
            correct_str = match.group(1)
            arrays = re.findall(r'\[([^\]]*)\]', correct_str)
            for i, arr in enumerate(arrays):
                nums = [int(x.strip()) for x in arr.split(',') if x.strip()]
                correct_answers[i] = len(nums)
    
    for q_num in MULTI_SELECT_QUESTIONS:
        q_index = q_num - 1
        js_file = os.path.join(base_dir, f"Question{q_num}.js")
        astro_file = os.path.join(base_dir, f"Question{q_num}.astro")
        
        if os.path.exists(js_file):
            num_correct = correct_answers.get(q_index, 2)
            new_content = create_new_multiselect_js(q_num, q_index, num_correct)
            
            with open(js_file, 'w', encoding='utf-8') as f:
                f.write(new_content)
            
            print(f"✓ Updated {js_file}")
        
        if os.path.exists(astro_file):
            update_multiselect_astro(astro_file)
            print(f"✓ Updated {astro_file}")
    
    print(f"\n✅ Updated {len(MULTI_SELECT_QUESTIONS)} multi-select questions")
    print("Changes:")
    print("  - Removed submit button and counter")
    print("  - Wrong answers turn red immediately")
    print("  - After 2 wrong attempts, auto-reveal correct answers")
    print("  - User can keep selecting until all correct answers found")

if __name__ == "__main__":
    main()
