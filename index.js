const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 8000;

// Common Middleware 
app.use(express.json());
app.use(cors());

app.get('/', (req,res) => {
	res.send("Welcome to Server")
})

app.listen(port, () => console.log('Server listening on ther port ', port)); 