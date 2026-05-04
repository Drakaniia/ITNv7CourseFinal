#!/usr/bin/env python3
"""
Script to check which questions are multi-select based on state initialization
and compare with questions that have data-choose attribute.
"""

import re
from pathlib import Path

# Read script.js to find array indices
script_path = Path("public/script.js")
with open(script_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Extract the answers array
match = re.search(r'answers:\s*\[(.*?)\]', content, re.DOTALL)
if match:
    answers_str = match.group(1)
    answers = [line.strip().rstrip(',') for line in answers_str.split('\n') if line.strip()]
    
    array_indices = []
    for i, ans in enumerate(answers):
        if ans == '[]':
            array_indices.append(i)
    
    print(f"Found {len(array_indices)} array indices in state.answers:")
    print(f"Indices: {array_indices}")
    print()

# Check which questions have data-choose attribute
questions_dir = Path("src/questions")
questions_with_choose = []

for astro_file in sorted(questions_dir.glob("Question*.astro")):
    with open(astro_file, 'r', encoding='utf-8') as f:
        astro_content = f.read()
    
    choose_match = re.search(r'data-choose="(\d+)"', astro_content)
    qid_match = re.search(r'data-qid="(\d+)"', astro_content)
    
    if choose_match and qid_match:
        qid = int(qid_match.group(1))
        choose = int(choose_match.group(1))
        q_num = int(re.search(r'Question(\d+)', astro_file.name).group(1))
        questions_with_choose.append({
            'number': q_num,
            'qid': qid,
            'choose': choose
        })

print(f"Found {len(questions_with_choose)} questions with data-choose attribute:")
for q in questions_with_choose:
    print(f"  Q{q['number']} (qid={q['qid']}, choose {q['choose']})")
print()

# Find questions that have array in state but no data-choose
qids_with_choose = {q['qid'] for q in questions_with_choose}
missing_choose = [idx for idx in array_indices if idx not in qids_with_choose]

if missing_choose:
    print(f"⚠️  WARNING: {len(missing_choose)} questions have array in state but no data-choose:")
    print(f"Indices: {missing_choose}")
    print("\nThese questions need to be checked:")
    for idx in missing_choose:
        q_num = idx + 1
        astro_file = questions_dir / f"Question{q_num}.astro"
        if astro_file.exists():
            print(f"  - Question{q_num}.astro (qid={idx})")
else:
    print("✅ All questions with array state have data-choose attribute!")
