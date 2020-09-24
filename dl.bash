#!/bin/bash

if [ -n "$4" ] && [ -n "$5" ]
then
  ffmpeg -i "$1" -i "$4" -i "$5" -map 0:v -map 1:a -map 2:a -codec copy -shortest -y "$2" </dev/null >/dev/null 2> "$3" &
else
  ffmpeg -i "$1" -c:v copy -c:a copy -bsf:a aac_adtstoasc -y "$2" </dev/null >/dev/null 2> "$3" &
fi
pid=$!
echo $pid > public/movie/dl.lock
wait "$pid"
rm -f public/movie/dl.lock
