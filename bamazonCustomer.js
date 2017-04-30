// Dependencies
var inquirer = require('inquirer');
// MySql connection credentials stored in .credentials.js - ignored by git
var connection = require('./credentials.js');

var bh = require('./bamazonHelper.js')

connection.connect(function (err) {
    if (err) throw err;
    console.log("** Welcom to Bamazon! You are shopper No. " + connection.threadId);

    bh.selectProducts(null, function (res) {
        var allProducts = res;
        var allProductsFormatted = []
        res.forEach(function (value) {
            // Separate each item in the stuff db and then add it to an array for bid choices in upcoming prompt
            allProductsFormatted.push({ name: value.product_name + ', $' + value.price, value: [value.item_id, value.product_name] });
        })
        inquirer.prompt([{
            name: 'item',
            message: 'What would you like to buy?',
            type: 'list',
            choices: allProductsFormatted
        }, {
            name: 'quantity',
            message: 'How many?',
            validate: bh.validateInt
        }]).then(function (answers) {
            // Get current stock of desired item
            bh.selectProducts('WHERE item_id = ' + answers.item[0], function (res) { 
                var quantity = parseInt(answers.quantity);
                // If there is enough stock, process the order
                if (res[0].stock > quantity) {
                    var newStock = res[0].stock - quantity;
                    connection.query('UPDATE products SET stock = ? WHERE item_id = ?', [newStock, answers.item[0]] , function (err, data) { 
                        if (err) throw err;
                        console.log('Order processed:', answers.item[1] + ', Quantity:', quantity);
                    });
                // If there is not enough stock
                } else {
                    console.log('Sorry - insufficient stock');
                }
                // Close connection to mysql Bamazon server
                connection.end();
            });
        });
    });
});