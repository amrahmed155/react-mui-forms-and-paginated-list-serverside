const express = require("express");
const app = express();
const cors = require("cors");

var bodyParser = require("body-parser");
app.use(bodyParser.json());

app.use(cors());
var mysql = require("mysql");
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "test",
});
connection.connect();

const sortQuery = (sort) => {
  if (sort.length > 0) {
    if (sort[0].field !== "action") {
      return `order by ${sort[0].field}  ${sort[0].sort} `;
    } else {
      return ``;
    }
  } else {
    return ``;
  }
};
const filterQuery = (filter) => {
  if (filter.items) {
    if (filter.items.length > 0) {
      if (filter.items[0].columnField !== "action") {
        switch (filter.items[0].operatorValue) {
          case "contains":
            return `where ${filter.items[0].columnField} like '%${filter.items[0].value}%'`;
          // break;

          case "equals":
            return `where ${filter.items[0].columnField} = '${filter.items[0].value}'`;

          // break;

          case "startsWith":
            return `where ${filter.items[0].columnField} like '${filter.items[0].value}%'`;

          // break;

          case "endsWith":
            return `where ${filter.items[0].columnField} like '%${filter.items[0].value}'`;

          // break;

          case "isEmpty":
            return `where ${filter.items[0].columnField}  is null`;
          // break;

          case "isNotEmpty":
            return `where ${filter.items[0].columnField}  is not null`;

          // break;

          case "isAnyOf":
            if (filter.items[0].value.length > 0) {
              let query = `where ${filter.items[0].columnField}  in(`;
              filter.items[0].value.forEach((element, index) => {
                if (index !== filter.items[0].value.length - 1) {
                  query = query + element + ",";
                } else {
                  query = query + element + ")";
                }
              });
              return query;
            }
            break;

          default:
            return ``;
          // break;
        }
      } else {
        return ``;
      }
    }
  } else return ``;
};

app.post("/", (req, res) => {
  try {
    let { page, limit, table } = req.query;
    if (!page) page = 1;
    if (!limit) limit = 10;
    page = parseInt(page);
    limit = parseInt(limit);

    //  console.log(`SELECT * from posts ${filterQuery(req.body.filter)} ${sortQuery(req.body.sort)} limit  ${limit} OFFSET ${(page-1)*limit}`)
    connection.query(
      `SELECT * from ${table} ${filterQuery(req.body.filter)} ${sortQuery(
        req.body.sort
      )} limit  ${limit} OFFSET ${(page - 1) * limit}`,
      function (error, results, fields) {
        if (error) throw error;
        // console.log('The solution is: ', results.length);
        connection.query(
          `SELECT count(*) as count from ${table}  ${filterQuery(
            req.body.filter
          )}`,
          function (error2, results2, fields2) {
            if (error2) throw error2;
            // console.log(results2[0].count)
            return res.json({
              data: results,
              total: results2[0].count,
            });
          }
        );
      }
    );
  } catch (error) {
    res.status(400).send(error);
  }
});

app.post("/deleteData", (req, res) => {
  try {
    let { table } = req.query;
    if (req.body.id) {
      connection.query(
        `delete from ${table} where id= ${req.body.id}`,
        function (error, results, fields) {
          if (error) throw error;
        }
      );
    } else {
      throw new Error("InvalidID");
    } //res.status(406).json({Message:'please contact admin to check for id value'});
  } catch (error) {
    res.status(400).send(error);
  }
});

app.post("/updateData", (req, res) => {
  try {
    let { table } = req.query;
    if (req.body.id) {
      connection.query(
        `update ${table} set ? where id= ${req.body.id}`,
        req.body,
        function (error, results, fields) {
          if (error) throw error;
          res.status(200).send({ changedRows: results.changedRows });
        }
      );
    } else {
      throw new Error("InvalidID");
    } //res.status(406).json({Message:'please contact admin to check for id value'});
  } catch (error) {
    res.status(400).send(error);
  }
});

app.post("/insertData", (req, res) => {
  try {
    let { table } = req.query;
    connection.query(
      `INSERT INTO  ${table} SET ?`,
      req.body,
      function (error, results, fields) {
        if (error) throw error;
        res.status(200).send({ changedRows: results.changedRows });
      }
    );
  } catch (error) {
    res.status(400).send(error);
  }
});

app.listen(4000, () => {
  console.log("App started on port 4000");
});
