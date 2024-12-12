import mysql from 'mysql2'
import dotenv from 'dotenv'
dotenv.config()

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()

export async function getTasks() {
    const [rows] = await pool.query("SELECT * FROM tasks")
    return rows
}

export async function getTask(id) {
    const [rows] = await pool.query(`
        SELECT id, title, details
        FROM tasks
        WHERE id = ?
        `, [id])
    return rows[0]
}

export async function addTask(title, details) {
    const [result] = await pool.query(`
        INSERT INTO tasks(title, details)
        VALUES (?, ?)
        `, [title, details])
    const id = result.insertId
    return getTask(id)
}

export async function updateTask(id, title, details) {
    const [result] = await pool.query(`
        UPDATE tasks
        SET
            title = ?,
            details = ?
        WHERE id = ?
        `, [title, details, id])
    return result
}

export async function deleteTask(id) {
    const [result] = await pool.query(`
        DELETE FROM tasks
        WHERE id = ?
        `, [id])
    return result
}