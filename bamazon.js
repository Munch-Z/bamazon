const inquirer = require('inquirer');
const mysql = require('mysql');
const fs = require('fs');

function Config(host, user, pass, database) {
    this.host = host;
    this.user = user;
    this.password = pass;
    this.database = database;
}

let bamazonDB;

fs.readFile('test.txt', 'utf8', (err, data) => {
    if (err) throw err;
    
    const password = data;
    
    const dbcon = new Config('localhost', 'root', password, 'bamazon');

    bamazonDB = mysql.createConnection(dbcon);

    getItems();
})




function getItems(){

    bamazonDB.connect();

    bamazonDB.query('SELECT * FROM products', (err, res, fields) => {
        if (err) return console.log(err);

        res.forEach((e) => {
           const {item_id, product_name, department_name, price, stock_quantity} = e;
           console.table({ID: item_id, Product: product_name, Dept: department_name, Price: price.toFixed(2), Quantity: stock_quantity});
        })

        buyPrompt();

    })
}

function buyPrompt() {
    inquirer.prompt([{
        name: 'id',
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
        name:'quantity',
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
        buyQuery(data);
    })
}

function buyQuery(queryParams) {

    bamazonDB.query('SELECT * FROM products WHERE item_id = ? AND stock_quantity >= ?', [queryParams.id, queryParams.quantity], (err, res, fields) => {
        if (err) return console.log(err);

        if (res.length === 0) {
            return console.log('Insufficient quantity!');
        } else {

            console.log('Your total is: $'+ parseFloat(queryParams.quantity * res[0].price).toFixed(2));

            updateQuery(queryParams.id, queryParams.quantity, res[0].stock_quantity);
        }


    })
}

function updateQuery(id, order, qty) {

    let newTotal = qty - order;

    bamazonDB.query('UPDATE products SET stock_quantity = ? WHERE item_id = ?', [parseInt(newTotal), id], (err, res, fields) => {
        if (err) return console.log(err);
        bamazonDB.end();

    })
}