require("./database/dbConfig");
const express = require("express");
const path = require("path");
const Companies = require("./database/models/companyModel");
const bodyparser = require("body-parser");
const expressHBS = require("express-handlebars");
const ifEquality = require("./views/helpers/ifEquality");
const fetch = require("node-fetch");

const app = express();

const hbs = expressHBS.create({
  extname: ".hbs",
  layoutsDir: path.join(__dirname, "./views/layouts"),
  partialsDir: path.join(__dirname, "./views/partials"),
  helpers: {
    ifEquality
  }
});

app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "./views"));

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

//For rendering the search screen
app.get("/", (request, response) => {
  response.status(200).render("search.hbs", {
    layout: "main.hbs",
    title: "Search Companies"
  });
});

//Getting the list of all Saved companies
app.get("/companies", async (request, response) => {
  try {
    const company = await Companies.find({}).sort({ companyName: "asc" });
    const data = company.map((element, index) => {
      return {
        id: index + 1,
        companyName: element.companyName,
        CIN: element.CIN
      };
    });
    response.status(200).render("Lists.hbs", {
      layout: "main.hbs",
      title: "Company list",
      data: data
    });
  } catch (e) {
    console.log(e);
    response.status(500).send("Error while fetching data!");
  }
});

//Save the list of companies ( single and multiple)
//I searched and found that CIN number for a company can be changed so have updated the CIN number if company is already saved
//if the company is not already saved then it is inserted in the database
app.post("/saveCompanies", (request, response) => {
  const { data } = request.body;
  let result;
  data.forEach(async (element) => {
    try {
      const exists = await Companies.find({
        companyName: element.companyName
      });
      if (exists.length === 0) {
        const newEvent = new Companies(element);
        result = await newEvent.save();
      } else {
        result = await Companies.findOneAndUpdate(
          {
            companyName: element.companyName
          },
          { CIN: element.CIN },
          null,
          function (err, docs) {
            if (err) {
              console.log(err);
            } else {
              console.log("Data Updated successfully");
            }
          }
        );
      }
      response.status(200).json({
        message: "Data updated successfully",
        data: result
      });
    } catch (e) {
      console.log(e);
      response.status(500).send("Error while Saving the data!");
    }
  });
});

//Getting the list of the companies
//I was getting CORS error while fetching data from the front end
//So I fetched the same Zaubacopr api from the backend and displayed the details in the frontend
app.post("/:company", (request, response) => {
  const { company } = request.params;
  fetch(`https://www.zaubacorp.com/custom-search`, {
    method: "post",
    body: JSON.stringify({ search: company, filter: "company" }),
    headers: { "Content-Type": "application/json" }
  })
    .then((res) => res.text())
    .then((json) => {
      const data = json.split("\n");
      const result = data.map((element) => {
        return element.endsWith("</div>") ? element : "";
      });
      response.status(200).send(result.join(" "));
    })
    .catch((e) => {
      console.log(e);
      response.status(500).send("Error while fetching data!");
    });
});

//404 page
app.get("*", (request, response) => {
  response.status(404).send("404 Page not found");
});

app.listen(process.env.PORT || 8080, () => {
  console.log("App is running!!");
});
