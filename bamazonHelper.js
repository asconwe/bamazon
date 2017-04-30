// Dependencies
var inquirer = require('inquirer');
// MySql connection credentials stored in .credentials.js - ignored by git
var connection = require('./credentials.js');

var bh = {
    validateInt: function validateInt(input) {
        return !isNaN(parseInt(input));
    },

    selectProducts: function selectProducts(modifier, callback) {
        var queryString = 'SELECT * FROM products';
        if (modifier !== null) {
            queryString += modifier;
        }
        connection.query(queryString, function (err, data) {
            if (err) throw err;
            callback(res);
        });
    },

    logProducts: function logProducts(res) {
        res.forEach(function (value) {
            console.log(value.item_id, '-', value.product_name, '-', '$' + value.price, '-', 'Stock:', value.stock);
        })
    },

    viewProducts: function viewProducts() {
        selectProducts(null, logProducts)
    },

    viewLowInventory: function viewLowInventory() {
        selectProducts('WHERE stock < 6', logProducts);
    },

    addToInventory: function addToInventory() { 
        selectProducts(null, function (res) { 
            var allProductsFormatted = [];
            res.forEach(function (vaue) { 
                allProductsFormatted.push({ name: value.item_id + ' - ' + value.product_name + ' - ' + '$' + value.price + ' - ' + 'Stock: ' + value.stock, value: value.item_id });
            });
            inquirer.prompt([{
                name: 'item',
                message: 'What would you like to restock?',
                type: 'list',
                choices: allProductsFormatted
            }, {
                name: 'quantity',
                message: 'How many?',
                validate: validateInt
            }]).then(function (answers) {
                // Get current stock of desired item
                selectProducts('WHERE item_id = ' + answers.item[0], function (err, data) { 
                    if (err) throw err;
                    var quantity = parseInt(answers.quantity);
                    var newStock = data[0].stock + quantity;
                    connection.query('UPDATE products SET stock = ? WHERE item_id = ?', [newStock, answers.item[0]] , function (err, data) { 
                        if (err) throw err;
                        console.log('Stock added:', answers.item[1] + ', Quantity:', quantity);
                        // Close connection to mysql Bamazon server
                        connection.end();
                    });
                });
            });
        });      
    },

    addNewProduct: function addNewProduct() { 
        connection.query('SELECT DISTINCT department_name FROM products', function (err, data) { 
            if (err) throw err;
            var departments = [];
            data.forEach(function (value) { 
                departments.push(value.department_name);
            });
            departments.push('New department');
            inquirer.prompt([{
                name: 'name',
                message: 'What is the name of the product to add?',
            }, {
                name: 'price',
                message: 'How much does each unit cost (USD)?',
                validate: bh.validateInt
            }, {
                name: 'department',
                message: 'What department?',
                type: 'list',
                choices: departments
            }, {
                when: function (answers) { 
                    console.log(answers.department);
                    return (answers.department === 'New department')    
                },
                name: 'department',
                message: 'What is the new department name?'
            }, {
                name: 'stock',
                message: 'How many will you stock?'
            }]).then(function (answers) { 
                inquirer.prompt([{
                    name: 'confirm',
                    type: 'confirm',
                    message: 'Add the following product now? \n' + answers,
                }]).then(function (confirm) { 
                    if (confirm.confirm) { 
                        connection.query('INSERT INTO products (product_name, price, department_name, stock')
                    } else {
                        console.log('Process canceled');
                    }
                });
            });
        });
    }
}

module.exports = bh;