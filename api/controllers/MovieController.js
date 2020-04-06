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
      const watchHtml = await sails.helpers.filimo.with({
        method: 'get',
        path: `/w/${data.id}`,
        requestHeaders: req.headers,
        responseType: 'text'
      });
      //
      const matches = [...watchHtml.data.matchAll(/var player_data = (.*);/g)];
      if (typeof matches[0] === 'undefined' || typeof matches[0][1] === 'undefined' || !matches[0][1]) {
        return res.json({
          status: 406,
          success: false,
          message: 'Details not found',
          data: {}
        });
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
        return res.json({
          status: 406,
          success: false,
          message: 'Stream not found',
          data: {}
        });
      }
      //
      const streamFile = await sails.helpers.filimo.with({
        method: 'get',
        path: (new URL(stream)).pathname,
        requestHeaders: req.headers,
        responseType: 'text'
      });
      const variants = [];
      const variantMatches = [...streamFile.data.matchAll(/#([0-9]+(.*?))\n(.*)RESOLUTION=(.*)\n(.*)/g)];
      variantMatches.forEach((variant) => {
        variants.push({
          quality: variant[1] || '',
          resolution: variant[4] ? variant[4].split(',')[0] : '',
          link: variant[5] || ''
        });
      });
      //
      let subtitle = '';
      const tracks = playerData.tracks || [];
      tracks.forEach((track) => {
        if (!subtitle && track.srclang === 'fa') {
          subtitle = track.src;
        }
      });
      //
      if (data.id !== id) {
        data.originalId = id;
      }
      data.download = {
        subtitle,
        variants
      };
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
  }
};

module.exports = MovieController;
