const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Item = new Schema({
    item_id: {
        type: String
    },
    item_type: {
        type: String
    },
    item_condition: {
        type: String
    },
    item_name: {
        type: String
    },
    item_amount: {
        type: Number
    },
    item_warranty: {
        type: String
    },
    item_purchaseDate: {
        type: String
    }
});

module.exports = mongoose.model('Item', Item);