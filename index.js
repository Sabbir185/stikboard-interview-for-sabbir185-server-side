const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.b8lgl.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    const collectionSignUp = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_SIGNUP}`);

    // insert data
    app.post('/signUpInfo', (req, res) => {
        const info = req.body;
        console.log(info)
        collectionSignUp.insertOne(info)
            .then(result => {
                res.send(result.insertedCount > 0);
                console.log(result)
            })
    })

    // fetch data
    app.get('/login', (req, res) => {
        console.log(req.query.email)
        collectionSignUp.find({ email: req.query.email })
            .toArray((err, document) => {
                res.send(document)
                console.log(document)
            })
    })

});

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port)