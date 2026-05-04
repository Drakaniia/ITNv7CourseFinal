#!/usr/bin/env python3
"""
Script to fix ALL multi-select questions including those with data-type="multi"
but missing data-choose attribute.
"""

import os
import re
from pathlib import Path

def get_all_multiselect_questions():
    """Find all multi-select questions by parsing .astro files."""
    questions_dir = Path("src/questions")
    multiselect = []
    
    for astro_file in sorted(questions_dir.glob("Question*.astro")):
        with open(astro_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if it's a multi-select question
        if 'data-type="multi"' not in content:
            continue
            
        # Extract question number from filename
        q_num = int(re.search(r'Question(\d+)', astro_file.name).group(1))
        
        # Extract the question index (0-based) from data-qid
        qid_match = re.search(r'data-qid="(\d+)"', content)
        if not qid_match:
            print(f"Warning: Could not find data-qid in {astro_file.name}")
            continue
        
        qid = int(qid_match.group(1))
        
        # Try to get choose count from data-choose or from the tag text
        choose_match = re.search(r'data-choose="(\d+)"', content)
        if choose_match:
            choose_count = int(choose_match.group(1))
        else:
            # Try to extract from "Choose 2" or "Choose 3" text
            tag_match = re.search(r'Choose (\d+)', content)
            if tag_match:
                choose_count = int(tag_match.group(1))
            else:
                print(f"Warning: Could not determine choose count for {astro_file.name}, defaulting to 2")
                choose_count = 2
        
        multiselect.append({
            'number': q_num,
            'qid': qid,
            'choose': choose_count,
            'astro_file': astro_file,
            'js_file': astro_file.with_suffix('.js')
        })
    
    return multiselect

def update_astro_file(astro_file, qid, choose_count):
    """Update the .astro file to include data-choose and pendingCount if missing."""
    with open(astro_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    modified = False
    
    # Add data-choose if missing
    if 'data-choose=' not in content:
        content = re.sub(
            r'(data-type="multi")',
            f'\\1 data-choose="{choose_count}"',
            content
        )
        modified = True
    
    # Check if pendingCount element exists
    if f'id="pendingCount-{qid}"' not in content:
        # Add pendingCount span after the submit button
        submit_pattern = f'<button class="submit-btn[^"]*" id="submit-{qid}"[^>]*>Submit Answer</button>'
        replacement = f'<button class="submit-btn multi-pending" id="submit-{qid}" disabled>Submit Answer</button>\n      <span class="pending-count" id="pendingCount-{qid}">0 / {choose_count} selected</span>'
        content = re.sub(submit_pattern, replacement, content)
        modified = True
    
    # Ensure option buttons have multi class
    if 'option-btn multi' not in content:
        content = re.sub(
            r'<button class="option-btn"',
            '<button class="option-btn multi"',
            content
        )
        modified = True
    
    if modified:
        with open(astro_file, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def generate_multiselect_js(qid, choose_count):
    """Generate the correct JavaScript code for a multi-select question."""
    return f'''// Initialize Question{qid + 1}
export function initQ{qid}(ctx) {{
  const {{ state, CORRECT, updateScoreStrip, updateDots }} = ctx;
  const optsEl = document.getElementById("opts-{qid}");
  const submitEl = document.getElementById("submit-{qid}");
  const expEl = document.getElementById("exp-{qid}");
  const verdictEl = document.getElementById("verdict-{qid}");
  const card = document.getElementById("card-{qid}");
  const btns = optsEl.querySelectorAll(".option-btn");
  const pendingCountEl = document.getElementById("pendingCount-{qid}");

  // Show submit button for multi-select
  const submitWrap = submitEl.parentElement;
  if (submitWrap) {{
    submitWrap.style.display = "flex";
  }}

  btns.forEach((btn) => {{
    btn.addEventListener("click", () => {{
      if (state.submitted[{qid}]) return;

      // Toggle selection
      btn.classList.toggle("selected");
      const indicator = btn.querySelector(".opt-indicator");
      const idx = parseInt(btn.dataset.idx);
      const isSelected = btn.classList.contains("selected");

      if (isSelected) {{
        indicator.innerHTML = `<svg viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3"/></svg>`;
        if (!state.answers[{qid}].includes(idx)) {{
          state.answers[{qid}].push(idx);
        }}
      }} else {{
        indicator.innerHTML = "";
        state.answers[{qid}] = state.answers[{qid}].filter((i) => i !== idx);
      }}

      // Update pending count
      const pendingCount = state.answers[{qid}].length;
      pendingCountEl.textContent = `${{pendingCount}} / {choose_count} selected`;

      // Enable/disable submit button based on selection count
      submitEl.disabled = pendingCount < {choose_count};
      
      // Update button class
      if (pendingCount < {choose_count}) {{
        submitEl.classList.add("multi-pending");
      }} else {{
        submitEl.classList.remove("multi-pending");
      }}
    }});
  }});

  submitEl.addEventListener("click", () => {{
    revealAnswer({qid});
  }});

  function revealAnswer(questionIndex) {{
    state.submitted[questionIndex] = true;
    const chosen = state.answers[questionIndex];
    const isCorrect =
      CORRECT[questionIndex].length === chosen.length &&
      CORRECT[questionIndex].every((val) => chosen.includes(val));
    state.correct[questionIndex] = isCorrect;

    btns.forEach((btn) => {{
      const idx = parseInt(btn.dataset.idx);
      btn.disabled = true;
      btn.classList.add("revealed");
      btn.classList.remove("selected");

      const isAnswer = CORRECT[questionIndex].includes(idx);
      const wasPicked = chosen.includes(idx);

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

    // Hide submit button after submission
    const submitWrap = submitEl.parentElement;
    if (submitWrap) {{
      submitWrap.style.display = "none";
    }}

    card.classList.add(isCorrect ? "answered-correct" : "answered-wrong");
    verdictEl.textContent = isCorrect ? "✓ Correct" : "✗ Incorrect";
    verdictEl.className = "exp-verdict " + (isCorrect ? "correct" : "wrong");
    expEl.classList.add("show", isCorrect ? "correct-exp" : "wrong-exp");

    updateScoreStrip();
    updateDots();
  }}
}}
'''

def main():
    multiselect_questions = get_all_multiselect_questions()
    
    print(f"Found {len(multiselect_questions)} multi-select questions:")
    for q in multiselect_questions:
        print(f"  Q{q['number']} (qid={q['qid']}, choose {q['choose']})")
    
    print("\nUpdating .astro files...")
    for q in multiselect_questions:
        # Update src/questions
        if update_astro_file(q['astro_file'], q['qid'], q['choose']):
            print(f"  ✓ Updated {q['astro_file']}")
        
        # Update public/questions
        public_astro = Path("public/questions") / q['astro_file'].name
        if update_astro_file(public_astro, q['qid'], q['choose']):
            print(f"  ✓ Updated {public_astro}")
    
    print("\nFixing JavaScript files...")
    for q in multiselect_questions:
        js_content = generate_multiselect_js(q['qid'], q['choose'])
        
        # Write to src/questions
        src_js = q['js_file']
        with open(src_js, 'w', encoding='utf-8') as f:
            f.write(js_content)
        print(f"  ✓ Fixed {src_js}")
        
        # Also write to public/questions
        public_js = Path("public/questions") / src_js.name
        with open(public_js, 'w', encoding='utf-8') as f:
            f.write(js_content)
        print(f"  ✓ Fixed {public_js}")
    
    print(f"\n✅ Successfully fixed {len(multiselect_questions)} multi-select questions!")
    print("\nThese questions will now:")
    print("  - Allow multiple selections")
    print("  - Show selection count (e.g., '2 / 3 selected')")
    print("  - Only enable Submit button when required number of answers are selected")
    print("  - Reveal answers only after clicking Submit")

if __name__ == "__main__":
    main()
