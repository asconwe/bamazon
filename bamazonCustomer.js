// Dependencies
// var mysql = require('mysql');
var inquirer = require('inquirer');

// MySql connection credentials stored in .credentials.js - ignored by git
var connection = require('./credentials.js');

connection.connect(function (err) {
    if (err) throw err;
    console.log("** Welcom to Bamazon! You are shopper No. " + connection.threadId);

    connection.query('SELECT * FROM products', function (err, res) {
        function validateInt(answer) {
            // console.log(!!parseInt(answer));
            return (parseInt(answer));
        }
        console.log(res);
        var allProducts = res;
        var allProductsFormatted = []
        res.forEach(function (value) {
            // Separate each item in the stuff db and then add it to an array for bid choices in upcoming prompt
            allProductsFormatted.push(value.product_name + ', $' + value.price);
        })
        inquirer.prompt([{
            name: 'item',
            message: 'What would you like to buy?',
            type: 'list',
            choices: allProductsFormatted
        }, {
            name: 'quantity',
            message: 'How many?',
            validate: validateInt
        }]).then(function (answers) {
            console.log(answer.item)
        });
    });
});