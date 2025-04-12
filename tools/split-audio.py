from pydub import AudioSegment
from pydub.silence import split_on_silence
import os

# Load audio
audio = AudioSegment.from_file("input.wav", format="wav")

# Split audio where silence is > 300ms and quieter than -40dBFS
chunks = split_on_silence(
    audio,
    min_silence_len=300,
    silence_thresh=audio.dBFS - 14,
    keep_silence=100  # Keep a bit of silence on either side
)

# Save chunks
os.makedirs("output_chunks", exist_ok=True)

for i, chunk in enumerate(chunks):
    out_file = f"output_chunks/chunk{i+1:03d}.wav"
    chunk.export(out_file, format="wav")
    print(f"Exported {out_file}")
