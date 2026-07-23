import os, base64, sys
path = os.path.join("frontend","src","pages","school","TeachersPage.jsx")
os.makedirs(os.path.dirname(path), exist_ok=True)

# Read base64 chunks from stdin
import sys
data = sys.stdin.read().strip()
content = base64.b64decode(data).decode("utf-8")
with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Written", len(content), "bytes")
