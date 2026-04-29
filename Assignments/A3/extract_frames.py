import cv2, os

os.makedirs('frames', exist_ok=True)
cap = cv2.VideoCapture('9165ab1fa7fcad9f8ffaddd329b18511 (1).mp4')
fps = cap.get(cv2.CAP_PROP_FPS)
total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
print(f'FPS: {fps}, Total: {total}, Duration: {total/fps:.1f}s')

interval = int(fps * 2)
i = 0
saved = 0

while True:
    ret, frame = cap.read()
    if not ret:
        break
    if i % interval == 0:
        cv2.imwrite(f"frames/frame_{saved:03d}.jpg", frame)
        saved += 1
    i += 1

cap.release()
print(f'Saved {saved} frames')
