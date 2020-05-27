# Delilaresto
https://github.com/pabloriusblanco/delilaresto.git
Este tercer proyecto plantea la creación de un sistema de pedidos online para un restaurante poniendo en funcionamiento las partes necesarias para montar una REST API que permita realizar operaciones CRUD sobre una estructura de datos que podría consumir un cliente. Parte del desafío está enfocado en lograr que el desarrollo del proyecto sea puesto en producción utilizando web services.

## Dependencias

Las dependencias necesarias (de todas formas todo esta en el archivo *package.json*) son:
 **- body-parser 1.19.0**
 **- express 4.17.1**
 **- jsonwebtoken 8.5.1**
 **- mysql2 2.1.0**
 **- sequelize5.21.9**
 

## SQL

Para crear la base de datos con sus tablas y datos pueden encontrar el archivo **SQL** en la carpeta ***scripts***:
> **-/scripts/delilahrestoQueries.sql**

## Datos instancia Sequelize

Para cambiar los datos de la instancia del **Sequelize** pueden modificar las constantes definidas dentro del archivo ***depenGenerales.js***

    const  database = "mysql";
    const  username = "root"; //default
    const  password = ""; /// sin password por default
    const  host = "localhost"; //default
    const  port = 3306; ///default
    const  databasename = "delilahresto"  //default
    
Se encuentra en la carpeta ***server***:
> **-/server/depenGenerales.js**
 
## Puerto del server

Para cambiar el puerto por el cual el server escucha las consultas pueden modificar la constante definidas dentro del archivo ***app.js***

    const  puerto= "3000"; ///default
    
Se encuentra en la carpeta ***server***:
> **-/server/app.js**

## Iniciar el servidor

Para inicar el servidor deben ejecutar con **Node** el archivo ***app.js***. Se encuentra en la carpeta ***server***:
> **-/server/app.js**

## Documentación API

Para obtener los métodos y rutas disponibles pueden acceder al archivo ***delilahResto-PabloRiusBlanco-1.0.0-swagger.yaml*** en la carpeta ***scripts***:
> **-/scripts/delilahResto-PabloRiusBlanco-1.0.0-swagger.yaml**

## Extra: Postman
Hay una coleccion de request para **Postman** que son con los que yo estuve trabajando. El archivo ***DelilahResto.postman_collection.json*** en la carpeta ***scripts***:
> **-/scripts/DelilahResto.postman_collection.json**

