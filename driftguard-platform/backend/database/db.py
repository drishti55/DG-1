import json
from pathlib import Path

class Database:
    def __init__(self, db_path: Path):
        self.db_path = db_path
        if not self.db_path.exists():
            with open(self.db_path, "w") as f:
                json.dump({}, f)
                
    def get_all(self, collection: str):
        with open(self.db_path, "r") as f:
            data = json.load(f)
            return data.get(collection, [])
            
    def save(self, collection: str, item: dict):
        with open(self.db_path, "r") as f:
            data = json.load(f)
            
        if collection not in data:
            data[collection] = []
            
        data[collection].append(item)
        
        with open(self.db_path, "w") as f:
            json.dump(data, f, indent=2)
