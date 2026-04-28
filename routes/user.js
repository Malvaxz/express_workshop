const express = require('express');
const user = express.Router();
const db = require('../config/database');//conexion a mi bd

user.post("/", async (req, res, next) => {
    const { user_name, user_email, user_password } = req.body;
    if (user_name && user_email && user_password) {
        let query = "INSERT INTO user(`user_name`, `user_email`, `user_password`) ";
        query += `VALUES('${user_name}', '${user_email}', '${user_password}')`;
        const rows = await db.query(query);

        if (rows.affectedRows == 1) {
            return res.status(201).json({ code: 201, message: "User inserted successfully" });
        }
        return res.status(500).json({ code: 500, message: "Error inserting user", error });
    }
    return res.status(500).json({ code: 500, message: "Error inserting data", error });
});

user.get("/", async (req, res, next) => {
    try {
        const query = "SELECT * FROM user";
        const rows = await db.query(query);
        if (rows.length > 0) {
            return res.status(200).json({ code: 200, message: "Users retrieved successfully", data: rows });
        }       
        return res.status(404).json({ code: 404, message: "No users found" });
    }
    catch (error) {
        return res.status(500).json({ code: 500, message: "Error retrieving users", error });
    }
});
module.exports = user;