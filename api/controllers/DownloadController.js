const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const DownloadController = {
  request: async (req, res) => {
    const link = req.body.link;
    const info = {
      id: req.body.id || '',
      title: req.body.title || '',
      quality: req.body.quality || '',
      resolution: req.body.resolution || '',
      subtitle: req.body.subtitle || '',
      image: req.body.image || ''
    };
    //
    let movieDir = `${process.cwd()}${path.sep}movie`;
    if (!fs.existsSync(movieDir)) {
      fs.mkdirSync(movieDir);
    }
    //
    if (fs.existsSync(`${movieDir}${path.sep}dl.lock`)) {
      return res.json({
        status: 406,
        success: false,
        message: 'You have another download process in background',
        data: {}
      });
    }
    //
    movieDir = `${movieDir}${path.sep}${info.id}`;
    if (!fs.existsSync(movieDir)) {
      fs.mkdirSync(movieDir);
    }
    const infoFile = `${movieDir}${path.sep}info.json`;
    const logFile = `${movieDir}${path.sep}log.txt`;
    const videoFile = `${movieDir}${path.sep}${info.id}_${info.quality}.mp4`;
    const subtitleFile = `${movieDir}${path.sep}${info.id}.srt`;
    //
    fs.writeFile(infoFile, JSON.stringify(info), (error) => {
      if (error) {
        console.log(`infoFile write error: ${error}`);
      }
    });
    //
    if (info.subtitle) {
      try {
        let subtitleText = await sails.helpers.filimo.with({
          method: 'get',
          path: (new URL(info.subtitle)).pathname,
          requestHeaders: req.headers,
          responseType: 'text'
        });
        subtitleText = subtitleText.data.replace('WEBVTT', '').trim() + '\n';
        fs.writeFile(subtitleFile, subtitleText, (error) => {
          if (error) {
            console.log(`subtitleFile write error: ${error}`);
          }
        });
      } catch (error) {
        console.log(error);
        return res.json({
          status: 500,
          success: false,
          message: 'Getting subtitle failed',
          data: error
        });
      }
    }
    //
    if (process.platform === 'win32') {
      exec(`start /B ${process.cwd()}\\dl.bat "${link}" "${videoFile}" <nul >nul 2> "${logFile}"`, (error) => {
        if (error) {
          console.log(`Windows bat run error: ${error}`);
        }
      });
    } else {
      exec(`bash ${process.cwd()}/dl.bash "${link}" "${videoFile}" "${logFile}"`, (error) => {
        if (error) {
          console.log(`Linux bash run error: ${error}`);
        }
      });
    }
    //
    return res.json({
      status: 200,
      success: true,
      message: 'Start downloading',
      data: {}
    });
  },
  list: (req, res) => {
    const movieDir = `${process.cwd()}${path.sep}movie`;
    if (!fs.existsSync(movieDir)) {
      return res.json({
        status: 200,
        success: false,
        message: 'Movie dir not found',
        data: []
      });
    }
    //
    const movieSymlink = `${process.cwd()}${path.sep}.tmp${path.sep}public${path.sep}movie`;
    if (!fs.existsSync(movieSymlink)) {
      fs.symlinkSync(movieDir, movieSymlink);
    }
    //
    const directories = fs.readdirSync(movieDir, {withFileTypes: true})
      .filter(item => item.isDirectory());
    return res.json({
      status: 200,
      success: true,
      message: 'OK',
      data: DownloadController.dataList(movieDir, directories)
    });
  },
  cancel: (req, res) => {
    const id = req.body.id || 'Not_Exists';
    const dlLock = `${process.cwd()}${path.sep}movie${path.sep}dl.lock`;
    const movieDir = `${process.cwd()}${path.sep}movie${path.sep}${id}`;
    //
    if (fs.existsSync(dlLock)) {
      if (process.platform === 'win32') {
        exec(`TaskKill /IM ffmpeg.exe /F`, (error) => {
          if (error) {
            console.log(`Windows TaskKill error: ${error}`);
          }
        });
      } else {
        const strPid = fs.readFileSync(dlLock).toString().trim();
        const pid = Number(strPid) || 0;
        if (pid) {
          exec(`kill "${pid}"`, (error) => {
            if (error) {
              console.log(`Linux kill pid error: ${error}`);
            }
          });
        }
      }
    }
    //
    if (fs.existsSync(movieDir)) {
      fs.rmdirSync(movieDir, {
        recursive: true
      });
    }
    //
    return res.json({
      status: 200,
      success: true,
      message: 'Download canceled',
      data: {}
    });
  },
  dataList: (movieDir, directories) => {
    const list = [];
    directories.forEach(dir => {
      const infoFile = `${movieDir}${path.sep}${dir.name}${path.sep}info.json`;
      const logFile = `${movieDir}${path.sep}${dir.name}${path.sep}log.txt`;
      if (fs.existsSync(infoFile) && fs.existsSync(logFile)) {
        const data = {};
        const infoText = fs.readFileSync(infoFile).toString();
        const logText = fs.readFileSync(logFile).toString();
        try {
          const info = JSON.parse(infoText) || {};
          const movieFile = `/movie/${dir.name}/${dir.name}_${info.quality || ''}.mp4`;
          const subtitleFile = `/movie/${dir.name}/${dir.name}.srt`;
          data.id = info.id || '';
          data.image = info.image || '';
          data.title = info.title || '';
          data.quality = info.quality || '';
          data.resolution = info.resolution || '';
          data.movie = movieFile;
          if (info.subtitle) {
            data.subtitle = subtitleFile;
          } else {
            data.subtitle = '';
          }
          //
          let totalDuration = 0;
          const totalDurationMatches = [...logText.matchAll(/Duration: (.*), start:/g)];
          if (totalDurationMatches[0] && totalDurationMatches  [0][1]) {
            totalDuration = DownloadController.strTimeToSeconds(totalDurationMatches[0][1]);
          }
          //
          let currentTime = 0;
          const currentTimeMatches = [...logText.matchAll(/time=(.*) bitrate/g)].pop();
          if (currentTimeMatches && currentTimeMatches[1]) {
            currentTime = DownloadController.strTimeToSeconds(currentTimeMatches[1]);
          }
          //
          const floatProgress = (currentTime / (totalDuration ? totalDuration : 1)) * 100;
          const intProgress = parseInt(String(floatProgress));
          data.progress = intProgress > 100 ? 100 : intProgress;
          list.push(data);
        } catch (error) {
          console.log('DownloadController#list', error);
        }
      }
    });
    return list;
  },
  strTimeToSeconds: (time) => {
    let seconds = 0;
    const timeParts = time.split(':');
    const secondText = timeParts.pop();
    seconds += secondText ? (Number(secondText) || 0) : 0;
    const minuteText = timeParts.pop();
    seconds += minuteText ? ((Number(minuteText) || 0) * 60) : 0;
    const hourText = timeParts.pop();
    seconds += hourText ? ((Number(hourText) || 0) * 60 * 60) : 0;
    return seconds;
  }
};

module.exports = DownloadController;
