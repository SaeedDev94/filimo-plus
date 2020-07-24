echo lock > movie\dl.lock
ffmpeg -i %1 -c:v copy -c:a copy -bsf:a aac_adtstoasc -y %2
if exist "movie\dl.lock" (
  del "movie\dl.lock"
)
