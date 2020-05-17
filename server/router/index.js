module.exports = function (app) {
    app.use('/usuarios', require('./rutas/usuarios'));
};