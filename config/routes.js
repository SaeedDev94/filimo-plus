module.exports.routes = {
  'GET /': 'RootController.index',
  'POST /auth/step/one': 'LoginController.firstStep',
  'POST /auth/step/two': 'LoginController.secondStep',
  'POST /auth/logout': 'LoginController.logout',
  'POST /home/index': 'HomeController.index',
  'POST /home/next': 'HomeController.next',
  'POST /tag/index': 'TagController.index',
  'POST /tag/next': 'TagController.next',
  'POST /search/index': 'SearchController.index',
  'POST /movie/index': 'MovieController.index',
  'POST /download/request': 'DownloadController.request',
  'POST /download/list': 'DownloadController.list',
  'POST /download/cancel': 'DownloadController.cancel'
};
