const inquirer = require('inquirer');
const mysql = require('mysql');
const fs = require('fs');

function Config(host, user, pass, database) {
    this.host = host;
    this.user = user;
    this.password = pass;
    this.database = database;
}


fs.readFile('test.txt', 'utf8', (err, data) => {
    if (err) throw err;
    
    const password = data;
    
    const dbcon = new Config('localhost', 'root', password, 'bamazon');

    app(dbcon);
})



function app(obj){
    let bamazonDB = mysql.createConnection(obj);
    bamazonDB.connect();

    bamazonDB.query('SELECT * FROM products', (err, res, fields) => {
        if (err) throw err;

        res.forEach((e) => {
           const {item_id, product_name, department_name, price, stock_quantity} = e;
           console.table({ID: item_id, Product: product_name, Dept: department_name, Price: price, Quantity: stock_quantity});
        })

        bamazonDB.end();
    })
}