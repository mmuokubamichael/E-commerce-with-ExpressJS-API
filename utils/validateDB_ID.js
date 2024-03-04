const mongoose = require("mongoose")

const validateMongodbid = (id)=>{
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if(!isValid) throw new Error("this is not a valid id")
}
module.exports={validateMongodbid}