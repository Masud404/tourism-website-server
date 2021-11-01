const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const cors = require('cors');


const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = ` mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.adan0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



// database function
async function run() {
    try {
        await client.connect();
        const database = client.db('sea_beach');
        const servicesCollection = database.collection('services');
        const orderCollection = database.collection('orders')


        // GET Services API
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })


        // Add Orders API
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.json(result)
        })


        app.get('/orders', async (req, res) => {
            const cursor = orderCollection.find({})
            const result = await cursor.toArray();
            res.send(result);
        })


        // GET Single Service

        app.get('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { Name: id }
            const result = await orderCollection.find(query).toArray();
            res.send(result);

        })

        // DELETE API
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { Name: id }
            const result = await orderCollection.deleteOne(query)
            res.json(result);

        })


    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('This is Masud')
});

app.listen(port, () => {
    console.log('Hitting App')
})


