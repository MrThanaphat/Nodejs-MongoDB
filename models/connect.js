// use mongoose
const mongoose = require('mongoose')

// connect MongoDB
const dbUrl = 'mongodb://127.0.0.1:27017/sneakerDB'
mongoose.connect(dbUrl,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).catch(err=>console.log(err))

// Create Member Schema
let memberSchema = mongoose.Schema({
    username:String,
    email:String,
    password:String,
    first_name:String,
    last_name:String,
    sex:String,
    status:String
})

let productSchema = mongoose.Schema({
    imageProduct:String,
    idProduct:String,
    brandProduct:String,
    nameProduct:String,
    sizeProduct:String,
    priceProduct:Number,
    sex:String,
    quantityProduct:Number
})

let brandSchema = mongoose.Schema({
    idBrand:String,
    nameBrand:String,
})

// Create Model
let Member = mongoose.model("members",memberSchema)
let Product = mongoose.model("products",productSchema)
let Brand = mongoose.model("brands",brandSchema)

// Export Model
module.exports  =    {  Member,
                        Product,
                        Brand,
                        saveData: function(data){
                            return data.save() }
                    }
