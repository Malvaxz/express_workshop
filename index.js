//dependencias:
const morgan = require('morgan'); //dependencia de desarrollo para mostrar las peticiones en consola, no se recomienda cuando se lance el proyecto a producción
//ya que puede mostrar información sensible, pero es muy útil para el desarrollo
const express = require('express');
const app = express();
//routes:
const pokemon = require('./routes/pokemon');
const user = require('./routes/user');
//middleware:
const auth = require('./middleware/auth');
const notFound = require('./middleware/notFound');
const index = require ('./middleware/index')

app.use(morgan("dev")); //middleware para mostrar las peticiones en consola, se puede configurar con diferentes formatos, 
// "dev" es el formato de desarrollo, muestra el metodo, la url, el status y el tiempo de respuesta
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //middleware para parsear el cuerpo de las peticiones,

app.get("/", index)
app.use("/user", user);
app.use(auth); //middleware de autenticación, se ejecuta antes de llegar a las rutas de pokemon, para protegerlas,

app.use("/pokemon", pokemon);

app.use(notFound); //middleware para manejar rutas no encontradas, se ejecuta cuando ninguna de las rutas anteriores coincide con la petición, 
// se recomienda colocar este middleware al final de todas las rutas, para evitar que se ejecute antes de llegar a las rutas definidas

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running on port 3000");
}); 
