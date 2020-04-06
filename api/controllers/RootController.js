const RootController = {
  index: (req, res) => {
    return res.view('pages/root-index');
  }
};

module.exports = RootController;
