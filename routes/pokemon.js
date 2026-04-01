const express = require('express');
const pokemon = express.Router();
const db = require('../config/database');//conexion a mi bd

pokemon.post("/", async (req, res, next) => {
    const { pok_name, pok_height, pok_weight, pok_base_experience } = req.body; //permite hacer una concatenación menos propens a errores y ahorrar codigo
    if (pok_name && pok_height && pok_weight && pok_base_experience) {
        let query = "INSERT INTO `pokemon`( `pok_name`, `pok_height`, `pok_weight`, `pok_base_experience`)";
        query += ` VALUES('${pok_name}', ${pok_height}, ${pok_weight}, ${pok_base_experience})`; //aqui se aplica el const del inicio
        const rows = await db.query(query);

        if (rows.affectedRows == 1) {
            return res.status(201).json({ code: 201, message: "Pokemon inserted successfully" });
        }
        return res.status(500).json({ code: 500, message: "Error inserting pokemon" });
    }
    return res.status(500).json({ code: 500, message: "Missing data" });
});
   
pokemon.get('/', async(req, res, next) => {
    const pkmn = await db.query("SELECT * FROM pokemon");
    return res.status(200).json({code: 200, message: pkmn});
});
//manejo de rutas con regex, en este caso solo se aceptan numeros del 1 al 999
//la version de regex del video ya no es compatible con express 5.0
//se manejan dos tipos de rutas diferentes par evitar que el codigo 
//un bucle sin fin

// La regex [0-9]{1,3} limita a máximo 3 dígitos
pokemon.get('/id/:id', async (req, res) => {
    const rawId = req.params.id; //el regex necesita verificar que el id es un numero, pero no lo convierte a numero, por eso se hace el parseInt
    const id = parseInt(rawId);
// Validamos el rango numérico (1-722)
    if (id >= 1 && id <= 722) {
        const pkmn = await db.query("SELECT * FROM pokemon WHERE pok_id = ?", [id]);
        if (pkmn.length > 0) {
            return res.status(200).json({ code: 200, message: pkmn });
        }
    }
    return res.status(404).json({ code: 404, message: "Pokemon not found" });
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
            return res.status(200).json({code: 200, message: pkmn});
        }
    }
    return res.status(404).json({code: 404, message: "Pokemon not found, try with a valid name"});
});

module.exports = pokemon;