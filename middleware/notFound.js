module.exports = (req, res, next) => {
    return res.status(404).json({ code: 404, message: "URL Not Found" });
};//middleware para manejar rutas no encontradas, se ejecuta cuando ninguna de las rutas anteriores coincide con la petición, 
// se recomienda colocar este middleware al final de todas las rutas, para evitar que se ejecute antes de llegar a las rutas definidas
