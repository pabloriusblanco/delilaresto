module.exports = function (app) {

    /////USUARIOS////
    app.use('/usuarios', require('./rutas/usuarios'));
    app.use('/usuarios/login', require('./rutas/usuarios'));
    app.use('/usuarios/:id', require('./rutas/usuarios'));
    /////PLATOS/////
    app.use('/platos', require('./rutas/platos'));
    app.use('/platos/:id', require('./rutas/platos'));
    ////ORDENES/////
    app.use('/orden', require('./rutas/orden'));
    app.use('/orden/id/:orden_id', require('./rutas/orden'));
    app.use('/orden/confirmar', require('./rutas/orden'));
    app.use('/orden/carrito', require('./rutas/orden'));
    app.use('/orden/carrito/:plato_id', require('./rutas/orden'));
};