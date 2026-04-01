const morgan = require('morgan'); //dependencia de desarrollo para mostrar las peticiones en consola, no se recomienda cuando se lance el proyecto a producción
//ya que puede mostrar información sensible, pero es muy útil para el desarrollo
const express = require('express');
const app = express();
const pokemon = require('./routes/pokemon');

app.use(morgan("dev")); //middleware para mostrar las peticiones en consola, se puede configurar con diferentes formatos, 
// "dev" es el formato de desarrollo, muestra el metodo, la url, el status y el tiempo de respuesta
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //middleware para parsear el cuerpo de las peticiones,

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
Un middlewsare es una función que se ejecuta antes de llegar a la ruta, se puede usar para validar datos, autenticar usuarios, etc.
*/

app.get("/", (req, res, next) => {
    return res.status(200).json({code: 1, message: "Welcome to the Pokemon API"});
});

app.use("/pokemon", pokemon);

app.use((req, res, next) => {
    return res.status(404).json({code: 404, message: "URL Not Found"});
});//middleware para manejar rutas no encontradas, se ejecuta cuando ninguna de las rutas anteriores coincide con la petición, 
// se recomienda colocar este middleware al final de todas las rutas, para evitar que se ejecute antes de llegar a las rutas definidas

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running on port 3000");
}); 