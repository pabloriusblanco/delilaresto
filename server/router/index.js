module.exports = function (app) {

    /////USUARIOS////
    app.use('/usuarios', require('./rutas/usuarios'));
    app.use('/usuarios/login', require('./rutas/usuarios'));
    app.use('/usuarios/:id', require('./rutas/usuarios'));
    // app.use('/orden', require('./rutas/orden'));
    // app.use('/platos', require('./rutas/platos'));
};