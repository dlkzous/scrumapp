// Function that returns all the api information
module.exports = function(req, res) {
  res.json({
    title: 'ScrumAPI',
    version: '0.0.1'
  });
};
