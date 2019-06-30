const mongoose = require("mongoose");
const express = require("express");
var cors = require("cors");
const bodyParser = require("body-parser");
const logger = require("morgan");
const Data = require("./data");
const ObjectId = require('mongodb').ObjectID;


const API_PORT = 27017;
const app = express();
app.use(cors());
const router = express.Router();

//TODO change this to shapes db
const dbRoute = "mongodb://127.0.0.1:27017/nitrate";
// connects our back end code with the database

mongoose.connect(
  dbRoute,
  { useNewUrlParser: true }
);

let db = mongoose.connection;
let dbdata;

db.on('error', console.error.bind(console, 'connection error:'));

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));

// TODO get the mongo DB spitting out the data.
db.once('open', function () {
    db.db.collection("well", function(err, collection){
        collection.find().toArray(function(err, data){
            console.log("data length: ", data.length); // it will print your collection data
        })
    });
});
//{"_id": "5d02bb20fbd275dc2a79c0de"}

// 5d02bb20fbd275dc2a79c08c
router.get("/getWellData", (req, res) => {
  console.log("Request from get here", req)
  const id = new ObjectId(req.query.id);
  db.db.collection('well',function(err, data){
    if(err){throw err;}
    else {
      data.find().toArray(function(error, documents) {
          if (err) throw error;
          console.log("Get request for Well: ", documents.length)
          res.send(documents);
      });
    }
  })
});
router.get("/getTractsData", (req, res) => {
  console.log("Request from get here", req)
  const id = new ObjectId(req.query.id);
  db.db.collection('cancertracts',function(err, data){
    if(err){throw err;}
    else {
      data.find().toArray(function(error, documents) {
          if (err) throw error;
          console.log("Get request for:", documents.length)
          res.send(documents);
      });
    }
  })
});
router.get("/getCountyData", (req, res) => {
  console.log("Request from get here", req)
  const id = new ObjectId(req.query.id);
  db.db.collection('cancercounty',function(err, data){
    if(err){throw err;}
    else {
      data.find().toArray(function(error, documents) {
          if (err) throw error;
          console.log("Get request for:", documents.length)
          res.send(documents);
      });
    }
  })
});

// append /api for our http requests
app.use("/api", router);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
