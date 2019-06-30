
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// this will be our data base's data structure
//The permitted SchemaTypes are:
//String, Number, Date, Boolean, ObjectId, Array…
const DataSchema = new Schema(
  {
    id: Number,
    brands: String,
    manufacturing_places: String,
    product_name: String,
    last_editor: String,
  },
  { timestamps: true }
);

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("Data", DataSchema);
