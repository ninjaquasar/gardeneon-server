const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5100;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
	res.send("Gardeneon Server is running groovily!");
});

app.listen(port, () => {
	console.log(`Gardeneon Server is running on Port ${port}`);
});
