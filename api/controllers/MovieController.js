const MovieController = {
  index: async (req, res) => {
    try {
      const id = (req.body.id || '').trim();
      if (!id) {
        return res.json({
          status: 406,
          success: false,
          message: 'Empty id',
          data: {}
        });
      }
      //
      const movieHtml = await sails.helpers.filimo.with({
        method: 'get',
        path: `/m/${id}`,
        requestHeaders: req.headers,
        responseType: 'text'
      });
      const domData = await sails.helpers.dom.with({
        html: movieHtml.data,
        content: 'movie'
      });
      const data = domData.movie;
      //
      data.download = null;
      if (data.id && data.id !== 'w') {
        if (data.id !== id) {
          data.originalId = id;
        }
        data.download = await MovieController.getDownload(data.id, req.headers);
      }
      //
      return res.json({
        status: movieHtml.status || 0,
        success: true,
        message: movieHtml.statusText || '',
        data
      });
    } catch (error) {
      return res.json({
        status: error.status || 0,
        success: false,
        message: error.message || '',
        data: error
      });
    }
  },
  getDownload: async (id, requestHeaders) => {
    const watchHtml = await sails.helpers.filimo.with({
      method: 'get',
      path: `/w/${id}`,
      requestHeaders,
      responseType: 'text'
    });
    //
    const matches = [...watchHtml.data.matchAll(/var player_data = (.*);/g)];
    if (typeof matches[0] === 'undefined' || typeof matches[0][1] === 'undefined' || !matches[0][1]) {
      return null;
    }
    let playerData;
    try {
      playerData = JSON.parse(matches[0][1]);
    } catch (unused) {
      playerData = {};
    }
    //
    let stream = '';
    const multiSRC = playerData.multiSRC || [];
    multiSRC.forEach((item) => {
      item.forEach((source) => {
        if (!stream && source.type === 'application/vnd.apple.mpegurl') {
          stream = source.src;
        }
      });
    });
    if (!stream || stream.indexOf('http') !== 0) {
      return null;
    }
    //
    const streamFile = await sails.helpers.filimo.with({
      method: 'get',
      path: (new URL(stream)).pathname,
      requestHeaders,
      responseType: 'text'
    });
    const variants = [...streamFile.data.matchAll(/#([0-9]+(.*?))\n(.*)RESOLUTION=(.*)\n(.*)/g)].map((variant) => {
      return {
        quality: variant[1] || '',
        resolution: variant[4] ? variant[4].split(',')[0] : '',
        link: variant[5] || ''
      };
    });
    const tracks = [...streamFile.data.matchAll(/GROUP-ID="audio"(.*)URI="(.*)"/g)].slice(0, 2).map(i => i[2]);
    //
    let subtitle = '';
    (playerData.tracks || []).forEach((track) => {
      if (!subtitle && track.srclang === 'fa') {
        subtitle = track.src;
      }
    });
    return {
      subtitle,
      variants,
      tracks: (playerData.multiAudio && tracks.length === 2) ? tracks : []
    };
  }
};

module.exports = MovieController;
