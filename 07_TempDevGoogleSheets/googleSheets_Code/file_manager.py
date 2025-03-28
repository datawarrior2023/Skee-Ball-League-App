# file_manager.py
import os
import re
from typing import Optional

class FileManager:
    def __init__(self, base_path: str = "07_TempDevGoogleSheets/googleSheets_Code"):
        self.base_path = base_path
        os.makedirs(self.base_path, exist_ok=True)

    def write_file(self, file_path: str, content: str) -> bool:
        try:
            full_path = os.path.join(self.base_path, file_path)
            os.makedirs(os.path.dirname(full_path), exist_ok=True)
            
            with open(full_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Successfully wrote to {file_path}")
            return True
        except Exception as e:
            print(f"Error writing to {file_path}: {str(e)}")
            return False

    def extract_code_blocks(self, message: str) -> list:
        pattern = r'````(?:(\w+):)?([^\n]+)?\n(.*?)````'
        matches = re.finditer(pattern, message, re.DOTALL)
        
        code_blocks = []
        for match in matches:
            language = match.group(1)
            file_path = match.group(2)
            content = match.group(3)
            
            if file_path and content:
                code_blocks.append((file_path, content))
            
        return code_blocks

    def process_message(self, message: str) -> None:
        code_blocks = self.extract_code_blocks(message)
        for file_path, content in code_blocks:
            self.write_file(file_path, content)