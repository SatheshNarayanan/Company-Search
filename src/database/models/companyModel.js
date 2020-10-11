const mongoose = require("mongoose");

const { Schema, model } = mongoose;

//COmpany model Schema in Mongoose ODM
const companySchema = new Schema({
  filter: {
    type: String,
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  CIN: {
    type: String,
    reauired: true
  }
});

const Company = model("companyData", companySchema);

module.exports = Company;
