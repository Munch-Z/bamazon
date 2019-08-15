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


let bamazonDB;

function app(obj){
    bamazonDB = mysql.createConnection(obj);
    bamazonDB.connect();

    bamazonDB.query('SELECT * FROM products', (err, res, fields) => {
        if (err) return console.log(err);

        res.forEach((e) => {
           const {item_id, product_name, department_name, price, stock_quantity} = e;
           console.table({ID: item_id, Product: product_name, Dept: department_name, Price: price, Quantity: stock_quantity});
        })

        buyPrompt();

        bamazonDB.end();
    })
}

function buyPrompt() {
    inquirer.prompt([{
        name: 'item_id',
        type: 'input',
        message: 'What is the ID of the item that you would like to buy?',
        validate: function(value) {
            let num = parseInt(value);

            if(isNaN(num)) {
                console.log('\n That is not a valid number. Please try again.');
                return false;
            }

            return true;
        }
    },
    {
        name:'stock_quantity',
        type: 'input',
        message: 'How many would you like to buy?',
        validate: function(value) {
            let num = parseInt(value);

            if(isNaN(num)) {
                console.log('\n That is not a valid number. Please try again.');
                return false;
            }

            return true;
        }
    }]).then((data) => {
        console.log(data);
        // buyQuery(obj);
    })
}

function buyQuery(queryParams) {
    //TODO
}