const inquirer = require("inquirer");
const express = require("express");
const mysql = require("mysql2");
const table = require("console.table");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const db = mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        password: "root",
        database: ""
    },
    console.log("Established connection to database.")
)