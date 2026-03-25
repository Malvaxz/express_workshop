const express = require('express');
const app = express();
const { pokemon } = require('./pokedex.json');

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

app.post("/pokemon/id/:id", (req, res, next) => {
    return res.status(200).send(req.params.id);
});
  
app.get('/pokemon', (req, res, next) => {
    return res.status(200).send(pokemon);
});
//manejo de rutas con regex, en este caso solo se aceptan numeros del 1 al 999
//la version de regex del video ya no es compatible con express 5.0
//se manejan dos tipos de rutas diferentes par evitar que el codigo 
//un bucle sin fin

app.get('/pokemon/id/:id', (req, res, next) => {
    //se obtiene el id
    const rawId = req.params.id;
    //se valida con redex dentro de un if
    //verifica que sean solo números y máximos de 2 digitos
    const valido = /^[0-9]{1,3}$/.test(rawId);
    if (valido) {
        const id = parseInt(rawId);
        if (id >= 0 & id <= pokemon.length) {
            return res.status(200).send(pokemon[id - 1]);
        }
    }
    return res.status(404).send("Pokemon not found, try with a valid id (1-151) or valid name");
});

//manejor de rutas por nombre
app.get('/pokemon/name/:name', (req, res, next) => {
    const name = req.params.name.toLowerCase();
    //en este regex nos permite utilizar espacios
    const valido = /^[A-Za-z\s]+$/.test(name);
    if (valido) {
        //.find() porque solo queremos UN pokemon, no una lista (filter)
        const pk = pokemon.filter((p) => {
            // Comparamos el nombre del objeto contra el nombre buscado
            return (p.name.toLowerCase() == name.toLowerCase()) && p;
        });
        //condicion ? valor si verdadero : valor si falso
            //se utiliza sin un if se retornara algo
            //también permite mejora a reducir lineas de codigo
        (pk.length > 0) ? res.status(200).send(pk) : res.status(404).send("Pokemon not found, try with a valid name");
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running on port 3000");
});