const express = require('express');
const pokemon = express.Router();
const db = require('../config/database');//conexion a mi bd

pokemon.post("/", async (req, res, next) => {
    const { pok_name, pok_height, pok_weight, pok_base_experience } = req.body; //permite hacer una concatenación menos propens a errores y ahorrar codigo
    if (pok_name && pok_height && pok_weight && pok_base_experience) {
        let query = "INSERT INTO `pokemon`( `pok_name`, `pok_height`, `pok_weight`, `pok_base_experience`) VALUES(?, ?, ?, ?)";
        const rows = await db.query(query, [pok_name, pok_height, pok_weight, pok_base_experience]);

        if (rows.affectedRows == 1) {
            return res.status(201).json({ code: 201, message: "Pokemon inserted successfully" });
        }
        return res.status(500).json({ code: 500, message: "Error inserting pokemon" });
    }
    return res.status(500).json({ code: 500, message: "Missing data" });
});

pokemon.delete('/id/:id', async (req, res, next) => {
    const id = req.params.id;
    // 1. Validamos el ID usando Regex dentro del controlador
    const valido = /^[0-9]{1,3}$/.test(id);
    // Patrón "Early Return": Si es inválido, cortamos aquí la ejecución
    if (!valido) {
        return res.status(400).json({ code: 400, message: "ID inválido (debe ser numérico de 1 a 3 dígitos)" });
    }
    try {
        // 2. Consulta preparada (Seguridad ante todo)
        const query = "DELETE FROM pokemon WHERE pok_id = ?";
        // 3. Desestructuramos el arreglo que devuelve la DB
        const result = await db.query(query, [id]);
        // 4. Evaluamos las filas afectadas
        if (result.affectedRows === 1) {
            return res.status(200).json({ code: 200, message: "Pokemon deleted successfully" });
        }
        return res.status(404).json({ code: 404, message: "Pokemon not found" });
    } catch (error) {
        console.error("Error en DB:", error);
        return res.status(500).json({ code: 500, message: "Error interno del servidor" });
    }
});

// Ojo: Estoy usando /:id para seguir el estándar REST que vimos
pokemon.put('/id/:id', async (req, res) => {
    const id = req.params.id;
    const valido = /^[0-9]{1,3}$/.test(id);
    // 1. Validar el ID
    if (!valido) {
        return res.status(400).json({ code: 400, message: "ID inválido (debe ser numérico de 1 a 3 dígitos)" });
    }
    // 2. Extraer los datos del body (¡Muy importante!)
    // Asumimos que en Postman estás mandando un JSON con estos nombres exactos
    const { pok_name, pok_height, pok_weight, pok_base_experience } = req.body;
    // (Opcional pero recomendado) Validar que sí te mandaron los datos
    if (!pok_name || !pok_height || !pok_weight || !pok_base_experience) {
        return res.status(400).json({ code: 400, message: "Faltan campos obligatorios en el body" });
    }
    try {
        // 3. Consulta preparada en una sola línea
        const query = "UPDATE pokemon SET pok_name = ?, pok_height = ?, pok_weight = ?, pok_base_experience = ? WHERE pok_id = ?";
        // 4. Ejecutamos pasando las variables en un arreglo, EN EL MISMO ORDEN que los '?'
        const result = await db.query(query, [pok_name, pok_height, pok_weight, pok_base_experience, id]);
        // 5. Verificamos si la actualización tuvo éxito
        if (result.affectedRows === 1) {
            return res.status(200).json({ code: 200, message: "Pokemon updated successfully" });
        }
        // 6. Si affectedRows es 0, el Pokémon no existía. ¡No dejes al cliente colgado!
        return res.status(404).json({ code: 404, message: "Pokemon not found" });
    } catch (error) {
        console.error("Error en DB:", error);
        return res.status(500).json({ code: 500, message: "Error interno del servidor" });
    }
});

pokemon.patch('/id/:id', async (req, res) => {
    const id = req.params.id;
    const valido = /^[0-9]{1,3}$/.test(id);
    // 1. Validación de ID
    if (!valido) {
        return res.status(400).json({ code: 400, message: "ID inválido (debe ser numérico de 1 a 3 dígitos)" });
    }
    // 2. Extraemos el body completo
    const updates = req.body;
    // 3. Validamos que nos hayan mandado al menos un campo para actualizar
    if (Object.keys(updates).length === 0) {
        return res.status(400).json({ code: 400, message: "No se enviaron datos para actualizar" });
    }
    try {
        // 4. Lógica de Query Dinámico
        // Creamos arreglos vacíos para guardar los fragmentos del SQL y los valores
        const camposSQL = [];
        const valores = [];
        // Definimos una "Lista Blanca" por seguridad. 
        // Así evitamos que el cliente intente actualizar columnas que no debe (ej. id, contraseñas, etc.)
        const camposPermitidos = ['pok_name', 'pok_height', 'pok_weight', 'pok_base_experience'];
        // Recorremos las llaves del objeto que nos mandó el cliente
        for (const llave in updates) {
            if (camposPermitidos.includes(llave)) {
                camposSQL.push(`${llave} = ?`); // Agregamos "pok_name = ?" al arreglo
                valores.push(updates[llave]);    // Guardamos el valor correspondiente
            }
        }
        // Si mandaron basura que no está en la lista blanca, evitamos hacer la consulta
        if (camposSQL.length === 0) {
            return res.status(400).json({ code: 400, message: "Ningún campo válido para actualizar" });
        }
        // 5. Ensamblamos el Query Final usando .join()
        // Ejemplo de salida: "UPDATE pokemon SET pok_name = ?, pok_height = ? WHERE pok_id = ?"
        const query = `UPDATE pokemon SET ${camposSQL.join(', ')} WHERE pok_id = ?`;
        // Agregamos el ID al final de los valores porque es el último '?' en el query
        valores.push(id);
        // 6. Ejecutamos la consulta
        const result = await db.query(query, valores);
        // 7. Verificamos si se encontró y actualizó
        if (result.affectedRows === 1) {
            // El 'changedRows' nos dice si realmente hubo un cambio (si no mandaron exactamente el mismo dato que ya estaba)
            if (result.changedRows === 0) {
                 return res.status(200).json({ code: 200, message: "Pokemon encontrado, pero los datos eran los mismos. No se hicieron cambios." });
            }
            return res.status(200).json({ code: 200, message: "Pokemon patched successfully" });
        }
        return res.status(404).json({ code: 404, message: "Pokemon not found" });
    } catch (error) {
        console.error("Error en DB:", error);
        return res.status(500).json({ code: 500, message: "Error interno del servidor" });
    }
});

pokemon.get('/', async (req, res, next) => {
    const pkmn = await db.query("SELECT * FROM pokemon");
    return res.status(200).json({ code: 200, message: pkmn });
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
            return res.status(200).json({ code: 200, message: pkmn });
        }
    }
    return res.status(404).json({ code: 404, message: "Pokemon not found, try with a valid name" });
});

module.exports = pokemon;