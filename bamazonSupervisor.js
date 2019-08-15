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
        choices: ['View Product Sales by Department', 'Create New Department'],
        message: 'What would you like to do?'
    }]).then((data) => {

        bamazonDB.connect();

        switch(data.op) {
            case 'View Product Sales by Department':
                viewSales();
                break;
            case 'Create New Department':
                createDepartment();
                break;
            default:
                console.log('Something broke or you wouldn\'t be seeing this.');
                break;
        }
    })

}


function viewSales() {
    
    bamazonDB.query('SELECT SUM(product_sales), departments.department_name FROM products, departments WHERE department_name = departments.department_name;')
}