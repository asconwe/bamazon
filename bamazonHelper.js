// Dependencies
var inquirer = require('inquirer');
// MySql connection credentials stored in .credentials.js - ignored by git
var connection = require('./credentials.js');

// Bamazon helper
var bh = {
    validateInt: function validateInt(input) {
        return !isNaN(parseInt(input));
    },

    selectProducts: function selectProducts(modifier, callback) {
        var queryString = 'SELECT * FROM products ';
        if (modifier !== null) {
            queryString += modifier;
        }
        connection.query(queryString, function (err, res) {
            if (err) throw err;
            callback(res);
        });
    },

    logProducts: function logProducts(res, callback) {
        if (res.length < 1) {
            console.log('No Items match your search');
        } else {
            res.forEach(function (value) {
                console.log(value.item_id + ' - ' + value.product_name + ' - ' + '$' + value.price + ' - ' + 'Stock: ' + value.stock);
            })
        }
        callback();
    },

    viewProducts: function viewProducts(callback) {
        bh.selectProducts(null, function (res) { 
            bh.logProducts(res, callback);
        });
    },

    viewLowInventory: function viewLowInventory(callback) {
        bh.selectProducts('WHERE stock < 6', function (res) { 
            bh.logProducts(res, callback);
        });
    },

    addToInventory: function addToInventory(callback) { 
        bh.selectProducts(null, function (res) { 
            var allProductsFormatted = [];
            res.forEach(function (value) { 
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
                validate: bh.validateInt
            }]).then(function (answers) {
                // Get current stock of desired item
                bh.selectProducts('WHERE item_id = ' + answers.item, function (res) { 
                    var quantity = parseInt(answers.quantity);
                    var newStock = res[0].stock + quantity;
                    connection.query('UPDATE products SET stock = ? WHERE item_id = ?', [newStock, answers.item] , function (err, data) { 
                        if (err) throw err;
                        console.log('Stock added:', res[0].product_name + ', Quantity:', quantity);
                        callback();
                    });
                });
            });
        });      
    },

    addNewProduct: function addNewProduct(callback) { 
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
                    message: 'Add the following product now? \n' + answers.name + ' $' + answers.price + ', stock: ' + answers.stock + ': ' + answers.department,
                }]).then(function (confirm) { 
                    if (confirm.confirm) { 
                        connection.query('INSERT INTO products SET ?',
                            {
                                product_name: answers.name,
                                price: answers.price,
                                department_name: answers.department,
                                stock: answers.stock
                            }, function (err, data) { 
                                if (err) throw err;
                                console.log('Product added');
                                callback();
                            });
                    } else {
                        console.log('Process canceled');
                        callback();
                    }
                });
            });
        });
    }
}

module.exports = bh;