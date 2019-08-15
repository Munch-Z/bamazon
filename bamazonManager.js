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

    managePrompt();
});


function managePrompt() {

    inquirer.prompt([{
        name: 'op',
        type: 'list',
        choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product'],
        message: 'What would you like to do?'
    }]).then((data) => {

        bamazonDB.connect();

        switch(data.op) {
            case 'View Products for Sale':
                getItems();
                break;
            case 'View Low Inventory':
                lowItems();
                break;
            case 'Add to Inventory':
                orderItems();
                break;
            case 'Add New Product':
                addItem();
                break;
            default:
                console.log('Something broke or you wouldn\'t be seeing this.');
                break;
        }
    })

}


function getItems(){

    bamazonDB.query('SELECT * FROM products', (err, res, fields) => {
        if (err) return console.log(err);

        res.forEach((e) => {
           const {item_id, product_name, department_name, price, stock_quantity} = e;
           console.table({ID: item_id, Product: product_name, Dept: department_name, Price: price.toFixed(2), Quantity: stock_quantity});
        })

        bamazonDB.end();

    })
}


function lowItems() {
    
    bamazonDB.query('SELECT * FROM products WHERE stock_quantity < 5', (err, res, fields) => {
        if (err) return console.log(err);

        res.forEach((e) => {
           const {item_id, product_name, department_name, price, stock_quantity} = e;
           console.table({ID: item_id, Product: product_name, Dept: department_name, Price: price.toFixed(2), Quantity: stock_quantity});
        })

        bamazonDB.end();

    })
}


function orderItems() {
    inquirer.prompt([{
        name: 'id',
        type: 'input',
        message: 'What is the ID of the item that you would like to order?',
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
        message: 'How many would you like to order?',
        validate: function(value) {
            let num = parseInt(value);

            if(isNaN(num)) {
                console.log('\n That is not a valid number. Please try again.');
                return false;
            }

            return true;
        }
    }]).then((data) => {

        bamazonDB.query('SELECT stock_quantity FROM products WHERE item_id = ?', data.id, (err, res, fields) => {
            
            if (err) throw err;

            const curQty = parseInt(res[0].stock_quantity);
            const buyQty = parseInt(data.quantity);

            bamazonDB.query('UPDATE products SET stock_quantity = ? WHERE item_id = ?', [curQty + buyQty, data.id], (err, res, fields) => {
                if (err) return console.log(err);
    
                bamazonDB.end();
        
            })
        })



    })
}