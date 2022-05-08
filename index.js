const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


const app = express();
const port = process.env.PORT || 5000;


//use middleware
app.use(cors());
app.use(express.json());

// UserName: carspot
//password: PlJVaixSsopj5DjX



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.pwbpg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        const productCollection = client.db('carspot').collection('product');
        const orderCollection = client.db('carspot').collection('order');

        //get all product
        app.get('/product', async (req, res) =>{
            const query = {};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
            console.log(products)
        });

        //get dynamic single product 
        app.get('/product/:id', async (req, res) =>{
            const id = req.params.id;
            const query ={_id: ObjectId(id)};
            const product = await productCollection.findOne(query);
            res.send(product);
        });

        //POST
        app.post('/product',async(req, res) => {
            const newProduct = req.body;
            const result = await productCollection.insertOne(newProduct);
            res.send(result);
        })

        //PUT
        app.put('/product/:id', async (req, res) => {
            const id = req.params.id;
            const updatedItem = req.body;
            const filter = {_id: ObjectId(id)};
            const options = { upsert: true};
            const updatedDoc = {
                $set: {
                    ...updatedItem,
                }
            };
            const result = await productCollection.updateOne(filter,updatedDoc,options);
            res.send(result);
        })

        //Delete
        app.delete('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await productCollection.deleteOne(query);
            res.send(result);
        });
        //Order Collection API
        app.get('/order', async (req, res) => {
            const email = req.query.email;
            const query = {email: email};
            const cursor = orderCollection.find(query);
            const orders = await cursor.toArray();
            res.send(orders);
        })
        app.post('/order', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.send(result);
        })

    }
    finally{

    }

}
run().catch(console.dir);



app.get('/', (req, res) =>{
    res.send('My carspot server is running');
});

app.listen(port, () => {
    console.log('Carspot server is running');
})