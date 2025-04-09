// how to auto incrment two columns
// how to make the autoincrement to start from 2
// some of the tabeles decreising
const mysql = require("mysql2");
const express = require("express");
const app = express();
const cors = require("cors");

const option = {
  origin: "http://localhost:3000/add-product",
  methods:["get","post"]
};
app.use(cors(option));

// app.use(express.json);
app.use(express.urlencoded({ extended: true }));
// app.listen(port, () => console.log("listening to : 3000"));
const connection = mysql.createConnection({
  host: "localhost",
  user: "myDBuser",
  password: "1234",
  database: "mydb2",
});
connection.connect((err) => {
  if (err) {
    console.log("error connecting:", err.message);
  }
  console.log("connected to the database");
});

// creating the tables
app.get("/install", (req, res) => {
const productTable = `CREATE TABLE IF NOT EXISTS product_table(
product_id INT AUTO_INCREMENT PRIMARY KEY,
product_url varchar(255) NOT NULL,
product_name varchar(20) NOT NULL )`;

const productDescription = `CREATE TABLE IF NOT EXISTS productDescription(
description_id INT AUTO_INCREMENT PRIMARY KEY,
product_id INT ,
product_brief_description varchar(255) NOT null,
product_description varchar(255) NOT NULL,
product_img  varchar(255) NOT NULL,
product_link varchar(255) NOT NULL,

FOREIGN KEY (product_id) REFERENCES product_table(product_id)
)`;
const productPriceTable = `CREATE TABLE IF NOT EXISTS productPriceTable(
price_id INT AUTO_INCREMENT PRIMARY KEY,
product_id INT ,
starting_price varchar(255) NOT NULL,
price_range varchar(255) NOT NULL,

FOREIGN KEY (product_id) REFERENCES product_table(product_id)
)`;
const userTable = `CREATE TABLE IF NOT EXISTS userTable(
user_id INT AUTO_INCREMENT PRIMARY KEY,
product_id INT ,
user_name varchar(255) NOT NULL,
user_password varchar(100) NOT NULL,


FOREIGN KEY (product_id) REFERENCES product_table(product_id)

)`;
const ordersTable = `CREATE TABLE IF NOT EXISTS OrdersTable(
order_id INT AUTO_INCREMENT PRIMARY KEY,
product_id INT ,
user_id INT,

FOREIGN KEY (product_id) REFERENCES product_table(product_id),
FOREIGN KEY (user_id) REFERENCES userTable(user_id)

)`;
//   const product = `CREATE TABLE IF NOT EXISTS product(
// product INT AUTO_INCREMENT PRIMARY KEY,
// name varchar(255) NOT NULL,
// description varchar(255) NOT NULL,
// price varchar(255) NOT NULL,
// monthly_plan varchar(255) NOT NULL,
// url varchar(255) NOT NULL,
// img varchar(255) NOT NULL
// )`;

connection.query(productTable, (err) => {
  if (err) console.log(err.message);
  console.log("table created");
});
connection.query(productDescription, (err) => {
  if (err) console.log(err.message);
  console.log("table created");
});
connection.query(productPriceTable, (err) => {
  if (err) console.log(err.message);
  console.log("table created");
});
connection.query(ordersTable, (err) => {
  if (err) console.log(err.message);
  console.log("table created");
});
connection.query(userTable, (err) => {
  if (err) console.log(err.message);
  console.log("table created");
});
res.send("tebel created");
});
app.listen(3000, (err) => {
  if (err) console.log(err.message);
  console.log("server is running on port 3000");
});

// insert
app.post("/add-product", (req, res) => {
  const {
    product_name,
    product_url,
    product_brief_description,
    price_range,
    starting_price,
    product_link,
    product_img,
    product_description,
  } = req.body;
// try{
  const insertProductTable = `INSERT INTO product_table (product_name, product_url) VALUES (?, ?)`;
  const insertProductDescription = `INSERT INTO productDescription (product_id, product_brief_description, product_description, product_img, product_link) VALUES (?, ?, ?, ?, ?)`;
  const insertProductPriceTable = `INSERT INTO productPriceTable (product_id, price_range, starting_price) VALUES (?, ?, ?)`;

  connection.query(
    insertProductTable,
    [product_name, product_url],
    (err, results) => {
      if (err) {
        console.log("Error inserting into product_table:", err.message);
        return res.status(500).send("Error inserting into product_table");
      }

      const product_id = results.insertId; // Get the inserted product_id

      // Insert into productDescription table
      connection.query(
        insertProductDescription,
        [
          product_id,
          product_brief_description,
          product_description,
          product_img,
          product_link,
        ],
        (err) => {
          if (err) {
            console.log(
              "Error inserting into productDescription:",
              err.message
            );
            return res
              .status(500)
              .send("Error inserting into productDescription");
          }

          // Insert into productPriceTable
          connection.query(
            insertProductPriceTable,
            [product_id, price_range, starting_price],
            (err) => {
              if (err) {
                console.log(
                  "Error inserting into productPriceTable:",
                  err.message
                );
                return res
                  .status(500)
                  .send("Error inserting into productPriceTable");
              }

              res.send("Data inserted successfully");
              console.log("Data inserted successfully");
            }
          );
        }
      );
    }
  );
});

