console.log("Hello World");
var mysql = require("mysql");

var con = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "",
});

con.connect(function (err: any) {
  if (err) throw err;
  console.log("Connected!");
});
