require("../dbConfig");
const Companies = require("../models/companyModel");

//Data for TYesting Purposes Only
const data = [
  {
    filter: "company",
    companyName: "Tester",
    CIN: "Hellothere"
  },
  {
    filter: "company",
    companyName: "Tester1",
    CIN: "Hellothere1"
  },
  {
    filter: "company",
    companyName: "Tester2",
    CIN: "Hellothere2"
  },
  {
    filter: "company",
    companyName: "Tester3",
    CIN: "Hellothere3"
  }
];

const saveEvent = async () => {
  data.forEach(async (element) => {
    try {
      const newEvent = new Companies(element);
      const result = await newEvent.save();
      console.log(result);
    } catch (e) {
      console.log(e);
    }
  });
};

saveEvent();
