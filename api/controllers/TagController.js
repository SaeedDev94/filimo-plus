const TagController = {
  index: async (req, res) => {
    const tag = req.body.tag || 'Not_Exists';
    try {
      const result = await sails.helpers.filimo.with({
        method: 'get',
        path: `/tag/${tag}`,
        requestHeaders: req.headers,
        responseType: 'text'
      });
      const html = result.data || '';
      //
      const domData = await sails.helpers.dom.with({
        html,
        content: 'items'
      });
      const target = domData.items[0] || {};
      return res.json({
        status: result.status || 0,
        success: true,
        message: result.statusText || '',
        data: {
          title: target.title || '',
          tag: tag,
          list: target.list || [],
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
        content: 'tagNext'
      });
      const target = domData.items[0] || {};
      return res.json({
        status: result.status || 0,
        success: true,
        message: result.statusText || '',
        data: {
          list: target.list || [],
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

module.exports = TagController;
