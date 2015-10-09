module.exports = function(app, routes) {
  app.use('/', routes.index);
  app.use('/users', routes.users);
  app.use('/boards', routes.boards);
};
