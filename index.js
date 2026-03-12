const express = require('express');
const app = express();

/*
GET PETICION GET DE UNA PAGINA WEB
POST GUARDAR O PUBLICAR ALGO
PATCH ACTUALIZAR PARCIALMENTE UN RECURSO
PUT ACTUALIZAR UN RECURSO COMPLETAMENTE
DELETE ELIMINAR UN RECURSO
Todos son soportados por express, pero no se pueden usar en el navegador, 
para eso se necesita una herramienta como postman o insomnia
*/
app.get("/", (req, res, next) => {
    res.status(200);
    res.send("Welcome to my API");
});

app.listen(3000, () => {
    console.log('Server is running...');
});