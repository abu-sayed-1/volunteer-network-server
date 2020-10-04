  const express = require('express');
  const bodyParser = require('body-parser');
  const cors = require('cors');
//   const admin = require('firebase-admin');
  const MongoClient = require('mongodb').MongoClient;
//   require('dotenv').config()
  const uri = "mongodb+srv://arabia:arabia123@cluster0.uj2jz.mongodb.net/volunteer?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  

const app = express()
app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}));

app.get('/', (req, res) => {
  res.send('Hello Wob Rakib!')
})


client.connect(err => {
    const register = client.db("volunteer").collection("network");
    app.post("/addRegister", (req, res) => {
        console.log(req,"successfully")
        const newBooking = req.body;
        register.insertOne(newBooking)
          .then(result => {
            console.log(result);
            res.send(result.insertedCount > 0);
          })
        //index.html^^^theke ze request asteche mane data asteche oi ta body hishabe niye nichi abong server e pathai dicho
        // console.log(newBooking);
      });

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
//     });
  
//     //-------register -------------------------------- 
//     app.get('/register', (req, res) => {
//       // console.log(req.headers.authorization);
//       const bearer = req.headers.authorization;
//       if (bearer && bearer.startsWith('Bearer ')) {
//         //ei ^^ code diye tumi condition set kortecho ze idToken asteche oi idToken true kina shudu true hole hobe na
//         //ze idToken asche oi idToken Bearer e por space ache kina ta check kora  
//         const idToken = bearer.split(' ')[1];
//         admin.auth().verifyIdToken(idToken)
//           .then(function (decodedToken) {
//             const tokenEmail = decodedToken.email;
//             const queryEmail = req.query.email;
//             // console.log(tokenEmail,queryEmail);
//             if (tokenEmail == queryEmail) {
//               register.find({ email: queryEmail })
//                 //ei code diye( ^^index.html er register) component theke zekhane 
//                 //fetch korchi oi khan theke current user email padai dichi- backend e-
//                 .toArray((err, documents) => {
//                   res.status(200).send(documents);
//                   // console.log(documents);
//                 })
//             }
//             else {
//               res.status(401).send('un-authorized access')
//             }
//           }).catch(function (error) {
//             res.status(401).send('un-authorized access')
//           });
  
//       }
//       else {
//         res.status(401).send('un-authorized access')
//       }
//   // deploy ^ korar somoy ei code gula^ li khte hobe
  
//     })
  
//   });
//   app.get('/', (req, res) => {
//     res.send('Hello World!')
//   })
//   app.listen(process.env.PORT || port)

  app.listen(3200)