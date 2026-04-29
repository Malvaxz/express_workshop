const express = require('express');
const jwt = require('jsonwebtoken');
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

user.post("/login", async (req, res, next) => {
    const { user_email, user_password } = req.body;
    const query = `SELECT * FROM user WHERE user_email = '${user_email}' AND user_password = '${user_password}'`;
    const rows = await db.query(query);
    console.log(rows);
    if (user_email && user_password) {
        if (rows.length == 1) {
            const token = jwt.sign({ 
                user_id: rows[0].user_id,
                user_email: rows[0].user_email
            }, "debugkey");
            return res.status(200).json({ code: 200, message: token });
        }
        else {
            return res.status(401).json({ code: 401, message: "Invalid email or password" });
        }
    }
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