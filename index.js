const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
  const admin = require('firebase-admin');
const MongoClient = require('mongodb').MongoClient;
  require('dotenv').config()
const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uj2jz.mongodb.net/volunteer?retryWrites=true&w=majority`;


const app = express()
app.use(cors());
app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: false }));

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
app.delete('/delete/:id', (req, res) => {
  register.deleteOne({_id: ObjectId(req.params.id)})
  .then (result => {
    res.send(result.deletedCount > 0);

  })
});

})




app.get('/', (req, res) => {
  res.send('Hello Wob Rakib!')
})



//  copy------------------------------
//   const app = express()
//   app.use(cors());
//   app.use(bodyParser.json());

//   const serviceAccount = require("./configs/burj-al-arab-18ff7-firebase-adminsdk-2bmp4-67c8309aab.json");

//   admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: process.env.FIRE_DB
//   });
//   //---------------------------
//   const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
//   client.connect(err => {
//     const register = client.db("burjAlArab").collection("booking");
//     // add Booking here-----------------  
//     app.post('/addBooking', (req, res) => {
//       const newBooking = req.body;
//       register.insertOne(newBooking)
//         .then(result => {
//           console.log(result);
//           res.send(result.insertedCount > 0);
//         })
//       //index.html^^^theke ze request asteche mane data asteche oi ta body hishabe niye nichi abong server e pathai dicho
//       // console.log(newBooking);
// });

//-------register -------------------------------- 
// app.get('/register', (req, res) => {
//   // --------------------------
//   const bearer = req.headers.authorization;
//   if (bearer && bearer.startsWith('Bearer ')) {

//     const idToken = bearer.split(' ')[1];
//     admin.auth().verifyIdToken(idToken)
//       .then(function (decodedToken) {
//         const tokenEmail = decodedToken.email;
//         const queryEmail = req.query.email;
//         if (tokenEmail == queryEmail) {
//           register.find({ email: queryEmail })
//             .toArray((err, documents) => {
//               res.status(200).send(documents);
//               // console.log(documents);
//             })
//         }
//         else {
//           res.status(401).send('un-authorized access')
//         }
//       }).catch(function (error) {
//         res.status(401).send('un-authorized access')
//       });

//   }
//   else {
//     res.status(401).send('un-authorized access')
//   }

// })

// });
// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })
// app.listen(process.env.PORT || port)

app.listen(3200)