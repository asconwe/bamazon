// Dependencies
var inquirer = require('inquirer');
// MySql connection credentials stored in .credentials.js - ignored by git
var connection = require('./credentials.js');
// Bamazon Helper functions
var bh = require('./bamazonHelper.js');

connection.connect(function (err) { 
    if (err) throw err;
    console.log('Connected to Bamazon Manager');

    // Manager options
    var menu = [{ name: 'View Products for Sale', value: bh.viewProducts },
        { name: 'View Low Inventory', value: bh.viewLowInventory },
        { name: 'Add to Inventory', value: bh.addToInventory },
        { name: 'Add New Product', value: bh.addNewProduct }];
    inquirer.prompt([{
        name: 'managerAction',
        type: 'list',
        message: 'What would you like to do?',
        choices: menu
    }]).then(function (answer) {
        // Bind this to the open connection, so the end method can be passed as a callback
        connectionEnd = connection.end;
        boundConnectionEnd = connectionEnd.bind(connection)
        answer.managerAction(boundConnectionEnd);
    });
});