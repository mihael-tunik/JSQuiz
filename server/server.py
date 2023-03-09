from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import uvicorn
import json

def load_json(filename):   
    data = {}        
    with open(filename, encoding='utf-8') as f:
        data = json.load(f)
    return data
    
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]    
)

@app.get("/")
async def root():
    return {"help": "This is API for QuizApp"}
        
@app.get("/alphabet/ge")
async def root():   
    return load_json('./ge.json')
     
if __name__ == '__main__':
    uvicorn.run(app, host="127.0.0.1", port=8001)
    
