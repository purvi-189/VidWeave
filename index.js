const { Database } = require("@tableland/sdk");
const { Wallet, getDefaultProvider } = require("ethers");
const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");

dotenv.config();
const app = express();
const port = 3002;
app.use(bodyParser.json());

const privateKey = process.env.PRIVATE_KEY;
const wallet = new Wallet(privateKey);


const provider = getDefaultProvider("https://rpc-mumbai.maticvigil.com"); // Update with your desired provider URL
const signer = wallet.connect(provider);

// Connect to the database
const db = new Database({ signer });

const prefix = "d_loom_content" ;
const insertprefix = "d_loom_content_80001_6768";

app.get("/create", async (req, res) => {
  console.log("i am here");
  try {
    const { meta: create } = await db
      .prepare(
        `CREATE TABLE ${prefix} (id integer primary key, address text, contentCid text );`
      )
      .run();
    console.log("i am");
    res.json({ tableName: create.txn.name });
  } catch (error) {
    console.error("Error creating table:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/insert", async (req, res) => {
  console.log(req.body);
    try {
      const { meta: insert } = await db
        .prepare(`INSERT INTO ${insertprefix} (id, address, contentCid) VALUES (?, ?, ?)`)
        .bind(req.body.id, req.body.address, req.body.contentCid )
        .run();
        console.log("test");
      await insert.txn.wait();
      res.json({ success: true });

    } catch (error) {
      console.error("Error inserting row:", error);
      res.status(500).json({ error: "Internal server error" });
    }

  });

 

 
 


app.listen(port, () => {
  console.log(`API server listening at http://localhost:${port}`);
});
