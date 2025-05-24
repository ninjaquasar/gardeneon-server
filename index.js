const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const dotenv = require("dotenv").config;
const app = express();
const port = process.env.PORT || 5100;
dotenv();

// Middlewares
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@professorcluster.rlegbqz.mongodb.net/?retryWrites=true&w=majority&appName=ProfessorCluster`;

// MongoClient with MongoClientOptions object
const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});

// MongoDB run script
async function run() {
	try {
		// Client connection with the server (turn off in deployment)
		await client.connect();
		// Database
		const database = client.db("gardeneon");
		// Collections
		const gardenersCollection = database.collection("gardeners");
		const testimonialsCollection = database.collection("testimonials");
		const tipsCollection = database.collection("tips");
		// Get gardeners
		app.get("/gardeners", async (req, res) => {
			const cursor = await gardenersCollection.find().toArray();
			res.send(cursor);
		});
		// Get active gardeners
		app.get("/gardeners/active", async (req, res) => {
			const cursor = await gardenersCollection.find({ status: "Active" }).toArray();
			res.send(cursor);
		});
		// Get all testimonials
		app.get("/testimonials", async (req, res) => {
			const cursor = await testimonialsCollection.find().toArray();
			res.send(cursor);
		});
		// Get all tips
		app.get("/tips", async (req, res) => {
			const cursor = await tipsCollection.find().toArray();
			res.send(cursor);
		});
		// Get top 6 tips
		app.get("/tips/top-6", async (req, res) => {
			const cursor = await tipsCollection.find().limit(6).toArray();
			res.send(cursor);
		});
		// Create new tip
		app.post("/tips/create", async (req, res) => {
			const result = await tipsCollection.insertOne(req.body);
			res.send(result);
		});
		// Delete tip
		app.delete("/tips/delete/:id", async (req, res) => {
			const id = req.params.id;
			const query = { _id: new ObjectId(id) };
			const result = await tipsCollection.deleteOne(query);
			res.send(result);
		});
		// Ping for successful connection confirmation
		await client.db("admin").command({ ping: 1 });
		console.log("Pinged. Successfully connected to MongoDB.");
	} finally {
		// await client.close();
	}
}
run().catch(console.dir);

app.get("/", (req, res) => {
	res.send("Gardeneon Server is running groovily!");
});

// Confirm that server is running on which port
app.listen(port, () => {
	console.log(`Gardeneon Server is running on Port ${port}`);
});
