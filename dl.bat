echo lock > movie\dl.lock
if NOT "%~3"=="" if NOT "%~4"=="" goto multipleInput
goto singleInput

:multipleInput
ffmpeg -i %1 -i %3 -i %4 -map 0:v -map 1:a -map 2:a -codec copy -shortest -y %2
goto done

:singleInput
ffmpeg -i %1 -c:v copy -c:a copy -bsf:a aac_adtstoasc -y %2
goto done

:done
if exist "movie\dl.lock" (
  del "movie\dl.lock"
)
