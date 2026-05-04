#!/usr/bin/env python3
"""
Verify that all multi-select questions have been properly fixed.
"""

import os
import re

def verify_multiselect_js(file_path):
    """Verify the JavaScript logic for a multi-select question."""
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if this is a multi-select question
    if '.filter((i) => i !== idx)' not in content:
        return None  # Not a multi-select question
    
    # Check for the key fixes
    checks = {
        'has_wrong_pick_check': 'const isWrongPick = btn.classList.contains("wrong-pick")' in content,
        'prevents_wrong_interaction': 'if (isWrongPick) return;' in content,
        'disables_wrong_button': 'btn.disabled = true;' in content and 'btn.classList.add("wrong-pick");' in content,
        'checks_correct_for_deselect': 'if (isAlreadySelected && isCorrectAnswer)' in content,
        'has_reveal_function': 'function revealAllCorrectAnswers()' in content,
        'auto_reveals_on_correct': 'revealAnswer(' in content and 'true);' in content,
    }
    
    return checks

def main():
    folders = ['src/questions', 'public/questions']
    
    for folder in folders:
        if not os.path.exists(folder):
            print(f"Warning: {folder} directory not found!")
            continue
        
        print(f"\n{'='*60}")
        print(f"Verifying {folder}")
        print(f"{'='*60}\n")
        
        multiselect_count = 0
        fixed_count = 0
        issues = []
        
        # Process all question files
        for i in range(1, 112):  # Questions 1-111
            js_file = os.path.join(folder, f'Question{i}.js')
            
            if os.path.exists(js_file):
                checks = verify_multiselect_js(js_file)
                
                if checks is not None:  # It's a multi-select question
                    multiselect_count += 1
                    all_passed = all(checks.values())
                    
                    if all_passed:
                        fixed_count += 1
                        print(f"✓ Question{i}.js - All checks passed")
                    else:
                        failed_checks = [k for k, v in checks.items() if not v]
                        issues.append((i, failed_checks))
                        print(f"✗ Question{i}.js - Failed: {', '.join(failed_checks)}")
        
        print(f"\n{'='*60}")
        print(f"Summary for {folder}:")
        print(f"  Multi-select questions found: {multiselect_count}")
        print(f"  Properly fixed: {fixed_count}")
        print(f"  Issues found: {len(issues)}")
        print(f"{'='*60}")
        
        if issues:
            print("\nQuestions with issues:")
            for q_num, failed in issues:
                print(f"  Question{q_num}: {', '.join(failed)}")

if __name__ == '__main__':
    main()
