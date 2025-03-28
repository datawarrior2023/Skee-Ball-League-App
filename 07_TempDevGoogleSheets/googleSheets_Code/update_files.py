# update_files.py
from file_manager import FileManager

def update_files():
    manager = FileManager()
    
    message = """
    ````html:sidebar.html
    <!DOCTYPE html>
    <html>
    <head>
        <title>Test</title>
    </head>
    <body>
        <h1>Hello World</h1>
    </body>
    </html>
    ````
    """
    
    manager.process_message(message)

if __name__ == "__main__":
    update_files()