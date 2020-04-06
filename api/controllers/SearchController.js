const SearchController = {
  index: async (req, res) => {
    const path = req.body.path || '';
    try {
      const result = await sails.helpers.filimo.with({
        method: 'get',
        path,
        requestHeaders: req.headers,
        responseType: 'json'
      });
      const data = result.data || {};
      const included = data.included || [];
      return res.json({
        status: 200,
        success: true,
        message: 'OK',
        data: included.map((item) => {
          const attributes = item.attributes || {};
          const pic = attributes.pic || {};
          return {
            id: attributes.link_key || '',
            image: pic.movie_img_m || '',
            title: attributes.movie_title || '',
            description: attributes.descr || ''
          };
        })
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

module.exports = SearchController;
