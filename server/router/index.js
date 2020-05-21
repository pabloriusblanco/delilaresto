module.exports = function (app) {
    // app.use('/orden', require('./rutas/orden'));
    // app.use('/platos', require('./rutas/platos'));
    app.use('/usuarios', require('./rutas/usuarios'));
};