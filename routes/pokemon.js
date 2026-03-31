const express = require('express');
const pokemon = express.Router();
const db = require('../config/database');//conexion a mi bd

pokemon.post("/", (req, res, next) => {
    return res.status(200).send(req.body);
});
   
pokemon.get('/', async(req, res, next) => {
    const pkmn = await db.query("SELECT * FROM pokemon");
    return res.status(200).json(pkmn);
});
//manejo de rutas con regex, en este caso solo se aceptan numeros del 1 al 999
//la version de regex del video ya no es compatible con express 5.0
//se manejan dos tipos de rutas diferentes par evitar que el codigo 
//un bucle sin fin

// GET BY ID: Sustituyendo la búsqueda en Array por SQL
pokemon.get('/id/:id', async (req, res) => {
    const rawId = req.params.id;
    // SQL hace la búsqueda por nosotros
    const valido = /^[1-9][0-9]{1,3}$/.test(rawId); // Acepta números del 1 al 999
    if (valido) {
        try {
            const id = parseInt(rawId);
            const pkmn = await db.query("SELECT * FROM pokemon WHERE pok_id = ?", [id]);
            if (pkmn.length > 0) {
                return res.status(200).json(pkmn);
            }
        } catch (error) {
            console.error("Database error:", error);
            return res.status(500).send("Internal Server Error");
        }
    }
    return res.status(404).send("Invalid Pokemon ID");
});

//manejor de rutas por nombre
pokemon.get('/name/:name', async (req, res) => {
    const name = req.params.name.toLowerCase();
    //en este regex nos permite utilizar espacios
    const valido = /^[A-Za-z\s]+$/.test(name);
    if (valido) { //se manejan consultas en sql una vez que se utilicen las bd
        const query = "SELECT * FROM pokemon WHERE LOWER(pok_name) = ?";
        const pkmn = await db.query(query, [name.toLowerCase()]);
        if (pkmn.length > 0) {
            return res.status(200).json(pkmn);
        }
    }
    return res.status(404).send("Pokemon not found, try with a valid name");
});

module.exports = pokemon;