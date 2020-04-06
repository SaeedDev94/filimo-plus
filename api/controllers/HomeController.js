const HomeController = {
  index: async (req, res) => {
    try {
      const result = await sails.helpers.filimo.with({
        method: 'get',
        path: '/',
        requestHeaders: req.headers,
        responseType: 'text'
      });
      const html = result.data || '';
      const matches = [...html.matchAll(/user\.username.*= '(.*)'/g)];
      if (typeof matches[0] === 'undefined' || typeof matches[0][1] === 'undefined' || !matches[0][1]) {
        return res.json({
          status: 401,
          success: false,
          message: 'Unauthorized',
          data: {}
        });
      }
      //
      const user = {
        id: [...html.matchAll(/user\.userId.*= (.*);/g)][0][1],
        name: [...html.matchAll(/user\.name.*= '(.*)'/g)][0][1],
        mobile: [...html.matchAll(/user\.mobile.*= '(.*)'/g)][0][1]
      };
      //
      const search = [...html.matchAll(/SEARCH_URL = "(.*)"/g)][0][1];
      //
      const domData = await sails.helpers.dom.with({
        html,
        content: 'home'
      });
      return res.json({
        status: result.status || 0,
        success: true,
        message: result.statusText || '',
        data: {
          user,
          search,
          special: domData.special,
          items: domData.items,
          next: domData.next
        }
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
  next: async (req, res) => {
    const next = req.body.next || '';
    try {
      const result = await sails.helpers.filimo.with({
        method: 'get',
        path: (new URL(next)).pathname,
        requestHeaders: req.headers,
        responseType: 'text'
      });
      const html = result.data || '';
      const domData = await sails.helpers.dom.with({
        html,
        content: 'items'
      });
      return res.json({
        status: result.status || 0,
        success: true,
        message: result.statusText || '',
        data: {
          items: domData.items,
          next: domData.next
        }
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

module.exports = HomeController;
