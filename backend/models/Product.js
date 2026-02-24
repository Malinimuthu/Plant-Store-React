const mongoose = require('mongoose');

// Schema define pannuvom
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    description: String
});

// Model-ah export pannuvom
module.exports = mongoose.model('Product', productSchema);
