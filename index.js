const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(cors())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.x6ipdw6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // await client.connect();

    const craftCollection = client.db("PastelCityscapes").collection("Arts and Craft");

    const gallery = client.db("PastelCityscapes").collection("Gallary")

    const category = client.db("PastelCityscapes").collection("Catagory")

    const customerReview = client.db("PastelCityscapes").collection("Customer Review")
    app.get("/craftItems", async (req, res) => {
      const cursor = craftCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get("/craftItems/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await craftCollection.findOne(query);
      res.send(result)
    })

    app.get("/updateItem/:id", async (req, res) => {
      const result = await craftCollection.findOne({ _id: new ObjectId(req.params.id) })
      res.send(result)
    })

    app.get("/gallery", async (req, res) => {
      const cursor = gallery.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get("/category", async (req, res) => {
      const cursor = category.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get("/customerReview", async (req, res) => {
      const cursor = customerReview.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get("/myAddCraft/:email/customization/:customization", async (req, res) => {
      const email = req.params.email;
      const customization = req.params.customization;
      const query = { "email": email, "customization": customization };

      try {
        const result = await craftCollection.find(query).toArray();
        res.send(result);
      } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
      }
    });


    app.put("/add-craft-item/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true }
      const updatedItem = req.body;
      const item = {
        $set: {
          item_name: updatedItem.item_name,
          category_name: updatedItem.category_name,
          short_description: updatedItem.short_description,
          price: updatedItem.price,
          rating: updatedItem.rating,
          customization: updatedItem.customization,
          processing_time: updatedItem.processing_time,
          stock_status: updatedItem.stock_status,
          image: updatedItem.image
        }
      }

      const result = await craftCollection.updateOne(filter, item, options)

      res.send(result)
    })

    app.post('/add-craft-item', async (req, res) => {
      const result = await craftCollection.insertOne(req.body)
      res.send(result)
    })


    // My art and craft list

    app.get("/myAddCraft/:email", async (req, res) => {
      console.log(req.params.email)
      const email = req.params.email;

      const result = await craftCollection.find({ email }).toArray();
      console.log(result)
      res.send(result)
    })



    app.delete('/add-craft-item/:id', async (req, res) => {
      const id = req.params.id;

      const query = { _id: new ObjectId(id) }
      const result = await craftCollection.deleteOne(query)
      res.send(result)
    })


    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})