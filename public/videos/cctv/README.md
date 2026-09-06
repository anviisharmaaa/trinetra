# CCTV video assets

Drop the 29 per-camera recordings here as `cam-{code}.mp4`, e.g. `cam-bw12.mp4`,
`cam-002-01.mp4`. The filename for a given camera is always
`camera.id.toLowerCase() + '.mp4'` — see `src/config/cctvVideoAssets.ts`
(the single source of truth for this path; nothing else in the app
hand-builds a `/videos/...` string).

There is exactly ONE video file per physical camera, never one per event or
per face detection — events and detections only pick a timestamp offset
*within* their camera's single clip (see `cctvEventVideo` /
`cctvDetectionVideo` in the same file).

Until a given camera's MP4 exists here, the app automatically falls back to
that camera's existing CCTV still frame under `public/images/cctv/`, and
finally to an in-app "VIDEO SOURCE UNAVAILABLE" panel if neither exists.
Dropping in a real MP4 requires no code changes — it is picked up the next
time that camera is opened.

Required filenames (29):
cam-002-01.mp4  cam-002-02.mp4  cam-002-03.mp4  cam-002-04.mp4  cam-002-06.mp4
cam-003-01.mp4  cam-003-02.mp4  cam-003-03.mp4  cam-003-04.mp4  cam-003-05.mp4
cam-003-06.mp4  cam-003-07.mp4  cam-004-01.mp4  cam-004-02.mp4  cam-004-03.mp4
cam-005-01.mp4  cam-005-02.mp4  cam-005-03.mp4  cam-005-04.mp4  cam-005-06.mp4
cam-aw09.mp4    cam-bw02.mp4    cam-bw12.mp4    cam-ch03.mp4    cam-dr02.mp4
cam-kr06.mp4    cam-lw07.mp4    cam-oe11.mp4    cam-pw08.mp4
