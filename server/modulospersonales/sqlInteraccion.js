const constSQL = {
    readUsersAll: function () {
        sequelize.query("select * FROM canciones where nombre = :nombre",
            { type: sequelize.QueryTypes.SELECT }
        ).then(function (result) {
            return result
        });
    }
}

exports.constSQL = constSQL;