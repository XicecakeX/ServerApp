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

/**Allowing Access*/
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/**Home Endpoint*/
app.get('/', (req, res) => {
  //Sending response
  res.send("This is the home page");
});

/**Assets ID Endpoint*/
app.get('/assets?', (req, res) => {
  //Declaring fields
  let query = req.query;
  let queryProperties = Object.getOwnPropertyNames(query);
  let option = queryProperties[0];
  let value = query[option];

  //Getting database
  return knex.select().from('Assets').where({[option]: value}).then(
    //Getting rows
    (rows) => {
      if(rows.length === 0){
        //Sending error response
        res.status(404).send("error");
      }else if(rows.length === 1){
        //Declaring fields
        let r = rows[0];

        //Creating data
        let data = [
          "Single",
          {
            id: r.ID,
            subID: r.PAQSubID,
            firstName: r.FirstName,
            lastName: r.LastName,
            login: r.Login,
            password: r.Password,
            dealer: r.Dealer,
            reseller: r.Reseller,
            email: r.Email,
            address: r.Address
          }
        ];

        //Sending response
        res.send(data);
      }else{
        //Declaring fields
        let data = ["Multiple", []];

        //Iterating through rows
        for(let i = 0; i < rows.length; i++){
          //Getting row
          let r = rows[i];

          //Adding to array
          data[1].push({
            id: r.ID,
            subID: r.PAQSubID,
            firstName: r.FirstName,
            lastName: r.LastName,
            login: r.Login,
            password: r.Password,
            dealer: r.Dealer,
            reseller: r.Reseller,
            email: r.Email,
            address: r.Address
          });
        }

        //Sending response
        res.send(data);
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
