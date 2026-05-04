#!/usr/bin/env python3
"""
Extract all questions from modified_text_with_answers.txt in order.
"""

import re

def extract_all_questions():
    """Extract all questions with their options and explanations."""
    with open('modified_text_with_answers.txt', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Split by "Explanation & Hint:" to get question blocks
    blocks = content.split('Explanation & Hint:')
    
    questions = []
    
    for i in range(len(blocks) - 1):
        # Get the question part (before explanation)
        question_block = blocks[i].strip()
        # Get the explanation part
        explanation_block = blocks[i + 1].strip()
        
        # Split explanation from next question
        if i < len(blocks) - 2:
            # Find where next question starts (multiple newlines usually)
            parts = explanation_block.split('\n\n\n')
            if len(parts) > 1:
                explanation = parts[0].strip()
            else:
                # Try different split
                lines = explanation_block.split('\n')
                explanation_lines = []
                for line in lines:
                    if line.strip() and not line.strip().startswith('Which ') and not line.strip().startswith('What ') and not line.strip().startswith('Refer ') and not line.strip().startswith('A ') and not line.strip().startswith('An ') and not line.strip().startswith('Users ') and not line.strip().startswith('Data ') and not line.strip().startswith('Three ') and not line.strip().startswith('Match '):
                        explanation_lines.append(line)
                    else:
                        if explanation_lines:
                            break
                explanation = '\n'.join(explanation_lines).strip()
        else:
            explanation = explanation_block.strip()
        
        # Extract question text and options from question_block
        lines = question_block.split('\n')
        
        # Find the question (usually starts after previous explanation)
        question_lines = []
        options = []
        in_question = False
        
        for j, line in enumerate(lines):
            line = line.strip()
            if not line:
                continue
            
            # Check if this looks like a question
            if ('?' in line or 'Choose' in line) and not in_question:
                in_question = True
                question_lines.append(line)
            elif in_question and not line.endswith('(answer)'):
                # Check if it's a continuation of question or an option
                if line and not any(line.startswith(x) for x in ['A ', 'B ', 'C ', 'D ', 'E ', 'F ', 'G ']):
                    question_lines.append(line)
                else:
                    # This is an option
                    options.append(line)
            elif line.endswith('(answer)'):
                options.append(line)
        
        if question_lines:
            question_text = ' '.join(question_lines).strip()
            # Clean up
            question_text = re.sub(r'\s+', ' ', question_text)
            
            questions.append({
                'number': i + 1,
                'text': question_text,
                'options': options,
                'explanation': explanation[:500] if explanation else "No explanation"
            })
    
    return questions

if __name__ == '__main__':
    questions = extract_all_questions()
    
    print(f"Total questions extracted: {len(questions)}\n")
    print("=" * 80)
    
    # Print first 30 questions
    for q in questions[:30]:
        print(f"\nQuestion {q['number']}:")
        print(f"Text: {q['text'][:150]}...")
        print(f"Options: {len(q['options'])} options")
        if '—>' in q['text']:
            print("  ** HAS CASE MARKER **")
    
    print("\n" + "=" * 80)
    print("\nQuestions with 'Case' markers:")
    for q in questions:
        if 'Case A' in q['text'] or 'Case B' in q['text'] or 'Case C' in q['text']:
            print(f"Q{q['number']}: {q['text'][:100]}...")
