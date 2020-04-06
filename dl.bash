#!/bin/bash

ffmpeg -i "$1" -c:v copy -c:a copy -bsf:a aac_adtstoasc -y "$2" </dev/null >/dev/null 2> "$3" &
pid=$!
echo $pid > movie/dl.lock
wait "$pid"
rm -f movie/dl.lock
