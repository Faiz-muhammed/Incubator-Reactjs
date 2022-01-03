const mongoose  = require('mongoose');


const applicationSchema = new mongoose.Schema({
    Name:{type:String,required:true },
  address:{type:String,required:true },
  city:{type:String,required:true },
  state:{type:String,required:true },
  email:{type:String,required:true },
  phone:{type:String,required:true },
  companyname:{type:String,required:true },
//   comapanylogo:,
  background:{type:String,required:true },
  products:{type:String,required:true },
  problem:{type:String,required:true },
  solution:{type:String,required:true },
  proposition:{type:String,required:true },
  competitor:{type:String,required:true },
  revenue:{type:String,required:true },
  marketsize:{type:String,required:true },
  marketing:{type:String,required:true },
  // incubationtype:{type:String,required:true },
  proposel:{type:String,required:true },
  status:{type:String,required:true },
})


const application = mongoose.model('applications',applicationSchema)

module.exports = application;