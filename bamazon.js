const inquirer = require('inquirer');
const mysql = require('mysql');



const bamazonDB = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: password,
    database: 'bamazon'
});