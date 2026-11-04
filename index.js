const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const PORT = process.env.PORT;


const app = express();

app.use(cors());
app.use(express.json());

async function run(){
    try {
        
    } finally {
        
    }
}

app.get("/", (req, res) => {
    res.send("server is running");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});