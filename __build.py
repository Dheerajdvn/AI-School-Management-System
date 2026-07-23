import os  
import base64  
content = base64.b64decode("REPLACE_ME").decode("utf-8")  
path = os.path.join("frontend","src","pages","school","TeachersPage.jsx")  
os.makedirs(os.path.dirname(path), exist_ok=True)  
with open(path, "w", encoding="utf-8") as f:  
    f.write(content)  
print("Done") 
