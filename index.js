const bodyParser = require('body-parser');
const morgan = require('morgan');
const express = require('express');
const app = express();
const pokemon = require('./routes/pokemon');

app.use(morgan("dev"));
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

/*
GET PETICION GET DE UNA PAGINA WEB
POST GUARDAR O PUBLICAR ALGO
PATCH ACTUALIZAR PARCIALMENTE UN RECURSO
PUT ACTUALIZAR  UN RECURSO COMPLETAMENTE
DELETE ELIMINAR UN RECURSO
Todos son soportados por express, pero no se pueden usar en el navegador, 
para eso se necesita una herramienta como postman o insomnia
Los doble puntos indican un variable dentro de la ruta, es decir, 
el valor que se le ponga a name se va a guardar en req.params.name
*/

app.get("/", (req, res, next) => {
    return res.status(200).send("Welcome to my Pokedex!");
});

app.use("/pokemon", pokemon);

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running on port 3000");
}); 