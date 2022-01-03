const mongoose  = require('mongoose');

const slotsSchema = new mongoose.Schema({
    name:{type:String },
    companyid:{type:String}
});

const slots = mongoose.model('slots',slotsSchema);


module.exports = slots;