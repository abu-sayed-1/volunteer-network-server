const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
  const admin = require('firebase-admin');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId
  require('dotenv').config()
const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uj2jz.mongodb.net/volunteer?retryWrites=true&w=majority`;


const app = express()
app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));

const serviceAccount = require("./configs/burj-al-arab-18ff7-firebase-adminsdk-2bmp4-67c8309aab.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIRE_DB
});


// connect data----------
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const register = client.db("volunteer").collection("network");
  app.post("/addRegister", (req, res) => {
    console.log(req, "successfully")
    const newBooking = req.body;
    register.insertOne(newBooking)
      .then(result => {
        console.log(result);
        res.send(result.insertedCount > 0);
      })

    });

    app.get("/register", (req, res) => {
      const bearer = req.headers.authorization;
      if (bearer && bearer.startsWith('Bearer ')) {

        const idToken = bearer.split(' ')[1];
        admin.auth().verifyIdToken(idToken)
          .then(function (decodedToken) {
            const tokenEmail = decodedToken.email;
            const queryEmail = req.query.email;
            if (tokenEmail == queryEmail) {
              register.find({ email: queryEmail })
                .toArray((err, documents) => {
                  res.status(200).send(documents);
                  // console.log(documents);
                })
            }
            else {
              res.status(401).send('un-authorized access')
            }
          }).catch(function (error) {
            res.status(401).send('un-authorized access')
          });

      }
      else {
        res.status(401).send('un-authorized access')
      }

    })

// delete method here ---------------------
// delete method here ---------------------
app.delete('/delete/:id', (req, res) => {
  register.deleteOne({_id: ObjectId(req.params.id)})
  .then (result => {
    console.log(result)
    res.send('everything is fine')
    // res.send(result.deletedCount > 0);

  })
});

})




app.get('/', (req, res) => {
  res.send('Hello Wold !')
})

 

app.listen(3200)