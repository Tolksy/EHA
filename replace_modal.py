#!/usr/bin/env python3

# Simple script to replace the boring task modal with the game-style version

import re

def replace_modal():
    # Read the main HTML file
    with open('index.html', 'r', encoding='utf-8') as f:
        html_content = f.read()
    
    # Read the new game-style modal
    with open('update-task-modal.html', 'r', encoding='utf-8') as f:
        new_modal_content = f.read()
    
    # Find the task modal section - look for the exact pattern
    start_marker = '    <!-- Add Task Modal -->'
    start_index = html_content.find(start_marker)
    
    if start_index == -1:
        print('ERROR: Could not find task modal start marker')
        return False
    
    # Find the end of the modal by counting div tags
    current_pos = start_index
    div_count = 0
    end_index = -1
    
    while current_pos < len(html_content):
        if html_content[current_pos:current_pos+5] == '<div ':
            div_count += 1
        elif html_content[current_pos:current_pos+6] == '</div>':
            div_count -= 1
            if div_count == 0:
                end_index = current_pos + 6
                break
        current_pos += 1
    
    if end_index == -1:
        print('ERROR: Could not find matching end div')
        return False
    
    # Replace the modal content
    before_modal = html_content[:start_index]
    after_modal = html_content[end_index:]
    
    new_html = before_modal + new_modal_content.strip() + '\n' + after_modal
    
    # Write back to file
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(new_html)
    
    print('SUCCESS: Task modal replaced with game-style version!')
    return True

if __name__ == '__main__':
    replace_modal()