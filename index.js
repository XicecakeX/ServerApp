/**Declaring Fields*/
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var jp = bodyParser.json();
var knex = require('knex')({
  client: 'mysql',
  connection: {
    host : 'mywayxchange.c6a9uahoc7um.us-east-1.rds.amazonaws.com',
    user : 'kyle',
    password : 'kyletest',
    database : 'MyWayRTK_NTRIP_Dev'
  },
  pool: {min: 0, max: 7}
});

/**Using bodyParser*/
app.use(jp);

/**Home Endpoint*/
app.get('/', (req, res) => {
  //Sending response
  res.send("This is the home page");
});

/**Assets Endpoint*/
app.get('/assets/:index', (req, res) => {
  //Declaring fields
  let index = req.params.index;

  //Checking index
  return checkIndex(index).then(
    //Getting result
    (result) => {
      //Checking result
      if(result === false){
        //Sending response
        res.send("Invalid index");
      }else{
        //Getting database
        return knex.select().from('Assets').then(
          //Getting rows
          (rows) => {
            //Declaring fields
            let r = rows[index];

            //Creating data
            let data = "ID: " + r.ID +
                        "\nFirst Name: " + r.FirstName +
                        "\nLast Name: " + r.LastName +
                        "\nLogin: " + r.Login +
                        "\nPassword: " + r.Password +
                        "\nDealer: " + r.Dealer +
                        "\nReseller: " + r.Reseller;

            //Sending response
            res.send(data);
          }
        );
      }
    }
  );
});

/**DNE Endpoint*/
app.get('/*', (req, res) => {
  //Sending response
  res.send("Page does not exist");
});

/**Listening on Port 3000*/
app.listen(3000, () => console.log("Listening on port 3000!"));

/**checkIndex Function*/
checkIndex = (index) => {
  //Getting database
  return knex.select().from('Assets').then(
    (rows) => {
      //Checking index
      if(index > rows.length || index < 0){
        //Returning false
        return false;
      }else{
        //Returning true
        return true;
      }
    }
  );
}
