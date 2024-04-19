import { createConnection } from 'mysql2'

const connection = createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
})
connection.connect(function (err) {
  if(err){
    console.log("error occurred while connecting");
    console.log(err);
  }
  else{
    // console.log(process.env.MYSQL_HOST);
    console.log("connection created with Mysql successfully");
  }
})