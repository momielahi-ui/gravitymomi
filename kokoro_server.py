
import os
import sys
import torch
import numpy as np
from kokoro import KPipeline
import io
import uvicorn
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.responses import Response

app = FastAPI()

# Initialize pipeline once on startup
print("Loading Kokoro model into memory...")
try:
    pipeline = KPipeline(lang_code='a')
    print("Kokoro model loaded successfully.")
except Exception as e:
    print(f"Error initializing Kokoro pipeline: {e}")
    sys.exit(1)

class TTSRequest(BaseModel):
    text: str
    voice: str = 'af_bella'
    speed: float = 1.05

@app.post("/generate")
async def generate(request: TTSRequest):
    try:
        if not request.text:
            raise HTTPException(status_code=400, detail="No text provided")

        print(f"Generating speech for: {request.text[:30]}...")
        
        # Generate audio
        generator = pipeline(
            request.text, voice=request.voice,
            speed=request.speed, split_pattern=r'\n+'
        )
        
        audio_chunks = []
        for gs, ps, audio in generator:
            if audio is not None and len(audio) > 0:
                if hasattr(audio, 'numpy'):
                    audio_np = audio.numpy()
                else:
                    audio_np = np.array(audio)
                audio_chunks.append(audio_np)
        
        if not audio_chunks:
             raise HTTPException(status_code=500, detail="No audio generated")

        # Concatenate all chunks
        full_audio = np.concatenate(audio_chunks)
        
        # Return raw pcm bytes
        return Response(content=full_audio.tobytes(), media_type="audio/pcm")

    except Exception as e:
        print(f"Error during generation: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health():
    return {"status": "ok"}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
