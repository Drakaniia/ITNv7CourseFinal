#!/usr/bin/env python3
"""
Analyze the modified_text_with_answers.txt file to extract all questions
and compare with implemented questions.
"""

import re
import os

def extract_questions_from_source():
    """Extract all questions from the source file."""
    with open('modified_text_with_answers.txt', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Split by "Explanation & Hint:" to separate questions
    sections = content.split('Explanation & Hint:')
    
    questions = []
    for i, section in enumerate(sections[:-1]):  # Exclude the last split (after last explanation)
        # Get the question text (everything before the explanation)
        question_part = section.strip()
        
        # Find the last question in this section (before the explanation)
        lines = question_part.split('\n')
        
        # Find where the question starts (usually after blank lines from previous explanation)
        question_lines = []
        found_question = False
        for line in reversed(lines):
            if line.strip():
                question_lines.insert(0, line)
                if not found_question and '?' in line:
                    found_question = True
            elif found_question:
                break
        
        if question_lines:
            question_text = ' '.join(question_lines).strip()
            # Clean up the question text
            question_text = re.sub(r'\s+', ' ', question_text)
            questions.append({
                'index': i + 1,
                'text': question_text[:200]  # First 200 chars
            })
    
    return questions

def check_astro_files():
    """Check which astro files exist and extract their question text."""
    astro_questions = {}
    questions_dir = 'src/questions'
    
    for i in range(1, 110):
        filename = f'Question{i}.astro'
        filepath = os.path.join(questions_dir, filename)
        
        if os.path.exists(filepath):
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Extract question text
            match = re.search(r'<p class="question-text">(.*?)</p>', content, re.DOTALL)
            if match:
                question_text = match.group(1).strip()
                # Remove HTML tags
                question_text = re.sub(r'<[^>]+>', '', question_text)
                question_text = re.sub(r'\s+', ' ', question_text)
                astro_questions[i] = question_text[:200]
            else:
                astro_questions[i] = "NO QUESTION TEXT FOUND"
        else:
            astro_questions[i] = "FILE NOT FOUND"
    
    return astro_questions

if __name__ == '__main__':
    print("Analyzing source file...")
    source_questions = extract_questions_from_source()
    print(f"Found {len(source_questions)} questions in source file\n")
    
    print("Checking astro files...")
    astro_questions = check_astro_files()
    print(f"Found {len(astro_questions)} astro files\n")
    
    # Find duplicates in astro files
    print("=" * 80)
    print("CHECKING FOR DUPLICATE QUESTIONS IN ASTRO FILES")
    print("=" * 80)
    
    seen = {}
    duplicates = []
    for i, text in astro_questions.items():
        if text in seen and text != "NO QUESTION TEXT FOUND" and text != "FILE NOT FOUND":
            duplicates.append((i, seen[text], text))
        else:
            seen[text] = i
    
    if duplicates:
        print(f"\nFound {len(duplicates)} duplicate questions:")
        for curr_q, orig_q, text in duplicates:
            print(f"\nQuestion {curr_q} is duplicate of Question {orig_q}")
            print(f"Text: {text[:100]}...")
    else:
        print("\nNo duplicates found!")
    
    print("\n" + "=" * 80)
    print("FIRST 10 QUESTIONS FROM SOURCE FILE")
    print("=" * 80)
    for q in source_questions[:10]:
        print(f"\nQ{q['index']}: {q['text']}")
