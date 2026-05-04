#!/usr/bin/env python3
"""
Properly fix multi-select questions by:
1. Identifying which questions are truly multi-select (>1 correct answer)
2. Restoring single-choice questions
3. Only updating actual multi-select questions
"""

import os
import re

# Read the CORRECT array from script.js to determine which questions are multi-select
def get_multiselect_questions():
    with open("public/script.js", 'r', encoding='utf-8') as f:
        content = f.read()
        match = re.search(r'const CORRECT = \[(.*?)\];', content, re.DOTALL)
        if match:
            correct_str = match.group(1)
            arrays = re.findall(r'\[([^\]]*)\]', correct_str)
            
            multi_select = []
            for i, arr in enumerate(arrays):
                nums = [x.strip() for x in arr.split(',') if x.strip()]
                if len(nums) > 1:  # Multi-select has more than 1 correct answer
                    multi_select.append(i + 1)  # Question numbers are 1-indexed
            
            return multi_select
    return []

def create_single_choice_js(question_num, question_index):
    """Generate JavaScript for single-choice questions (original behavior)"""
    
    return f'''// Initialize Question{question_num}
export function initQ{question_index}({{ state, CORRECT, updateScoreStrip, updateDots }}) {{
  const optsEl = document.getElementById("opts-{question_index}");
  const submitEl = document.getElementById("submit-{question_index}");
  const expEl = document.getElementById("exp-{question_index}");
  const verdictEl = document.getElementById("verdict-{question_index}");
  const card = document.getElementById("card-{question_index}");
  const btns = optsEl.querySelectorAll(".option-btn");

  btns.forEach((btn) => {{
    btn.addEventListener("click", () => {{
      if (state.submitted[{question_index}]) return;

      // Select the clicked option
      btns.forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
      const indicator = btn.querySelector(".opt-indicator");
      btns.forEach((b) => {{
        b.querySelector(".opt-indicator").innerHTML = "";
      }});
      indicator.innerHTML = `<svg viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3"/></svg>`;
      state.answers[{question_index}] = parseInt(btn.dataset.idx);

      // Immediately reveal answer (direct reveal)
      revealAnswer({question_index}, btn);
    }});
  }});

  // Remove submit button since we're using direct reveal
  submitEl.style.display = "none";

  function revealAnswer(questionIndex, clickedBtn) {{
    state.submitted[questionIndex] = true;
    const chosen = state.answers[questionIndex];
    const isCorrect = CORRECT[questionIndex].includes(chosen);
    state.correct[questionIndex] = isCorrect;

    btns.forEach((btn) => {{
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
      if (isAnswer) {{
        ind.innerHTML = `<svg viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3"/></svg>`;
      }} else if (wasPicked) {{
        ind.innerHTML = `<svg viewBox="0 0 12 12"><line x1="3" y1="3" x2="9" y2="9"/><line x1="9" y1="3" x2="3" y2="9"/></svg>`;
      }} else {{
        ind.innerHTML = "";
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

def create_multiselect_js(question_num, question_index):
    """Generate JavaScript for multi-select questions with immediate feedback"""
    
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
    
    # Get list of multi-select questions
    multi_select_questions = get_multiselect_questions()
    
    print(f"Found {len(multi_select_questions)} multi-select questions:")
    print(f"Questions: {multi_select_questions}\n")
    
    # Process all 111 questions
    single_count = 0
    multi_count = 0
    
    for q_num in range(1, 112):
        q_index = q_num - 1
        js_file = os.path.join(base_dir, f"Question{q_num}.js")
        astro_file = os.path.join(base_dir, f"Question{q_num}.astro")
        
        if not os.path.exists(js_file):
            continue
        
        if q_num in multi_select_questions:
            # Multi-select question
            new_content = create_multiselect_js(q_num, q_index)
            with open(js_file, 'w', encoding='utf-8') as f:
                f.write(new_content)
            
            if os.path.exists(astro_file):
                update_multiselect_astro(astro_file)
            
            print(f"✓ Multi-select: Question {q_num}")
            multi_count += 1
        else:
            # Single-choice question - restore original behavior
            new_content = create_single_choice_js(q_num, q_index)
            with open(js_file, 'w', encoding='utf-8') as f:
                f.write(new_content)
            
            print(f"✓ Single-choice: Question {q_num}")
            single_count += 1
    
    print(f"\n✅ Fixed all questions:")
    print(f"  - {single_count} single-choice questions restored")
    print(f"  - {multi_count} multi-select questions updated")
    print(f"\nMulti-select changes:")
    print(f"  - Removed submit button and counter")
    print(f"  - Wrong answers turn red immediately")
    print(f"  - After 2 wrong attempts, auto-reveal correct answers")

if __name__ == "__main__":
    main()
