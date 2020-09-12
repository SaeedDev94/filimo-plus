const axios = require('axios').default;
const fs = require('fs');
const path = require('path');
const MovieController = require('./MovieController');
const DownloadController = require('./DownloadController');

const PlayController = {
  proxy: async (req, res) => {
    const encoding = req.query.encoding || 'bin';
    const url = decodeURIComponent(req.query.url);
    const fileName = new URL(url).pathname.split('/').pop();
    await PlayController.sendResponse({
      res,
      encoding,
      url,
      fileName
    });
  },
  sendResponse: async (input) => {
    let data;
    let contentType;
    if (input.url) {
      const responseType = (input.encoding === 'bin') ? 'arraybuffer' : 'text';
      const response = await axios.get(input.url, {responseType});
      data = response.data;
      contentType = response.headers['content-type'];
    } else {
      data = input.data;
      contentType = input.contentType;
    }
    input.res.set({
      'Content-Type': contentType,
      'Content-Disposition': `inline; filename=${input.fileName}`
    });
    if (input.encoding === 'bin') {
      input.res.write(Buffer.from(data, 'binary'));
    } else {
      input.res.write(data);
    }
    input.res.end();
  },
  getProxyLink: (url, encoding) => {
    const baseUrl = sails.config.custom.baseUrl;
    return `${baseUrl}/play/proxy` +
      `?url=${encodeURIComponent(url)}` +
      `&encoding=${encoding || 'bin'}`;
  },
  getPlaylist: async (req, res) => {
    const url = decodeURIComponent(req.query.url);
    const urlParts = url.split('/');
    urlParts.pop();
    const baseUrl = urlParts.join('/');
    const fileName = new URL(url).pathname.split('/').pop();
    const response = await axios.get(url, {responseType: 'text'});
    let playlist = response.data;
    //
    const replaceWithProxyLink = (uri) => {
      playlist = playlist.replace(uri, PlayController.getProxyLink(`${baseUrl}/${uri}`, 'bin'));
    };
    [...playlist.matchAll(/#EXT-X-KEY(.*)URI="(.*)"/g)].map(i => i[2]).forEach(replaceWithProxyLink);
    [...playlist.matchAll(/#EXTINF(.*)\n(.*)/g)].map(i => i[2]).forEach(replaceWithProxyLink);
    //
    await PlayController.sendResponse({
      res,
      encoding: 'txt',
      data: playlist,
      contentType: 'application/x-mpegURL',
      fileName
    });
  },
  hls: async (req, res) => {
    const baseUrl = sails.config.custom.baseUrl;
    const id = req.body.id;
    const timestamp = req.query.timestamp || new Date().valueOf();
    let download;
    if (req.body.download) {
      download = req.body.download;
    } else {
      download = await MovieController.getDownload(id, req.headers);
    }
    //
    DownloadController.createMovieSymlink();
    //
    let playlist = download.playlist;
    const replaceWithPlaylistLink = (url) => {
      const link = `${baseUrl}/play/playlist` +
        `?url=${encodeURIComponent(url)}` +
        `&timestamp=${timestamp}`;
      playlist = playlist.replace(url, link);
    };
    download.tracks.forEach(replaceWithPlaylistLink);
    download.variants.map(i => i.link).forEach(replaceWithPlaylistLink);
    //
    fs.writeFileSync(`${DownloadController.movieDir}${path.sep}playlist.m3u8`, playlist);
    //
    let subtitle = '';
    if (download.subtitle) {
      subtitle = PlayController.getProxyLink(download.subtitle, 'txt');
    }
    //
    return res.json({
      status: 200,
      success: true,
      message: 'OK',
      data: {
        src: `${baseUrl}/movie/playlist.m3u8?timestamp=${timestamp}`,
        type: 'application/x-mpegURL',
        subtitle
      }
    });
  },
  file: (req, res) => {
    const baseUrl = sails.config.custom.baseUrl;
    const id = req.body.id;
    const movieDir = `${process.cwd()}/movie/${id}`;
    const infoFile = `${movieDir}/info.json`;
    if (!fs.existsSync(infoFile)) {
      return res.json({
        status: 406,
        success: false,
        message: 'Info file not found',
        data: null
      });
    }
    //
    DownloadController.createMovieSymlink();
    //
    let info;
    try {
      info = JSON.parse(fs.readFileSync(infoFile).toString());
    } catch (unused) {
      return res.json({
        status: 406,
        success: false,
        message: 'Info file doesn\'t contain valid JSON',
        data: null
      });
    }
    const movieFileName = `${id}_${info.quality || ''}.mp4`;
    const movieFile = `${movieDir}/${movieFileName}`;
    if (!fs.existsSync(movieFile)) {
      return res.json({
        status: 406,
        success: false,
        message: 'Movie file not found',
        data: null
      });
    }
    //
    let subtitle = '';
    if (info.subtitle) {
      subtitle = PlayController.getProxyLink(info.subtitle, 'txt');
    }
    //
    return res.json({
      status: 200,
      success: true,
      message: 'OK',
      data: {
        src: `${baseUrl}/movie/${id}/${movieFileName}`,
        type: 'video/mp4',
        subtitle
      }
    });
  }
};

module.exports = PlayController;
