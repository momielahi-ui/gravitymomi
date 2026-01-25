
import sys
import os
import torch
import numpy as np
from kokoro import KPipeline
import soundfile as sf
import io

# Initialize pipeline once
try:
    # 'a' for American English
    pipeline = KPipeline(lang_code='a') 
except Exception as e:
    print(f"Error initializing Kokoro pipeline: {e}", file=sys.stderr)
    sys.exit(1)

def generate_speech(text, voice='af_bella', speed=1.05):
    try:
        # Generate audio chunks
        generator = pipeline(
            text, voice=voice,
            speed=speed, split_pattern=r'\n+'
        )
        
        # Collect all audio chunks as the model generates them
        for gs, ps, audio in generator:
            if audio is not None and len(audio) > 0:
                # Convert torch tensor to numpy array
                if hasattr(audio, 'numpy'):
                    audio_np = audio.numpy()
                else:
                    audio_np = np.array(audio)
                
                # Write raw bytes to stdout
                sys.stdout.buffer.write(audio_np.tobytes())
                sys.stdout.buffer.flush()
                
    except Exception as e:
        print(f"Error during speech generation: {e}", file=sys.stderr)

if __name__ == "__main__":
    # Read entire text from stdin
    text = sys.stdin.read().strip()
    if text:
        generate_speech(text)
    else:
        print("No text received on stdin", file=sys.stderr)
