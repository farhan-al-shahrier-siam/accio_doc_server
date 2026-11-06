const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

dotenv.config();

const PORT = process.env.PORT;

const app = express();

app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

async function run() {
    try {
        await client.connect();

        const db = client.db("accio-doc");
        const doctorsCollection = db.collection("doctors");
        const appointsCollection = db.collection("appointments");

        app.post("/appointments", async (req, res)=>{
            const bookingData = req.body
            const result = await appointsCollection.insertOne(bookingData)
            res.json(result);
        })


        app.get("/appointments/:userID", async (req, res)=>{
            const {userID} = req.params
            const result = await appointsCollection.find({userID}).toArray()
            res.json(result)
        })
        app.patch("/appointments/:id", async (req, res)=>{
            const {id} = req.params
            const updatedData = req.body
            const result = await appointsCollection.updateOne(
                {_id: new ObjectId(id)},
                {
                    $set: updatedData
                }
            )
            res.json(result)
        })


        app.get("/doctors", async (req, res) => {
            const result = await doctorsCollection.find().toArray();
            res.json(result);
        });

        app.get("/doctors/search", async (req, res) => {
            const name = req.query.name;

            const result = await doctorsCollection
                .find({
                    name: { $regex: name, $options: "i" },
                })
                .toArray();

            res.send(result);
        });

        app.get("/doctors/:id", async (req, res) => {
            const { id } = req.params;
            const doctor = await doctorsCollection.findOne({ _id: new ObjectId(id) });
            res.json(doctor);
        });
    } finally {

    }
}

run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("server is running");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
