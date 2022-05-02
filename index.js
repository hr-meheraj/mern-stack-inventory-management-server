const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 8000;
// Mongodb Basic needed
const { MongoClient,ObjectId, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://hrmeheraj:hrmeheraj2007@cluster0.cv5my.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
  try {
    await client.connect();
    const inventory = client.db("inventory");
    const  products = inventory.collection("products");
		const blogs = inventory.collection('blogs');
		
		// Get Documetns  finilize (Done!);
		app.get('/products', async (req,res) => {
			const query = {};
			const page = parseInt(req.query.page);
			const size = parseInt(req.query.size);
			const result = await 
            products.find(query).skip(size * page).limit(size).toArray();
			res.send(result);
		});

		app.get('/inventory/:id', async (req,res) => {
			
			const id = req.params.id;
    const filter = { _id : new ObjectId(id) };
			const result = await products.findOne(filter);
				res.send(result);
		})
		
		// Products Count finilize (Done!)
	app.get('/ProductsCount', async(req,res) => {
			const count =await products.estimatedDocumentCount();
			res.send({count});
		});

		// Blogs API
		app.post('/blogs', async (req,res) => {
			const data = {
				...req.body
			};
			const result = await blogs.insertOne(req.body);
			res.send(result);
		});

		// All blogs get 
		app.get('/blogs', async (req,res) => {
			const query = {};
			const result = await blogs.find(query).toArray();
			res.send(result);
		});

		app.get('/blogs/:id', async (req,res) => {
			const id = req.params.id;
			const filter = {_id : new ObjectId(id)};
			const result = await blogs.findOne(filter);
			res.send(result);
		});
		
    // create a document to insert - finilize work (Done!)
		app.post('/inventory', async (req,res) => {
			const body = req.body;
			console.log(body);
			const result = await products.insertOne(body);
			res.send({message : "Successfully Added"});
		});

		// Find by Email: 
		app.get('/productsByEmail', async (req,res) => {
			const query = { email : req.query.email};
			const result = await 
            products.find(query).toArray();
			res.send(result);
		});
		// update a document 
		app.put('/inventory/:id', async (req,res) => {
			const id = req.params.id;
    const filter = { _id : new ObjectId(id) };
    const options = { upsert: true };
    const updateDoc = {
      $set: {
        ...req.body
      },
    };
    const result = await products.updateOne(filter, updateDoc, options);	
		res.send(result);
		});

		app.get('/', (req,res) => {
			res.send(
				`
			<h2> Products  <a href='/products'>Products</a></h2>
			<h2> Products  Count : <a href='/productsCount'>Count</a></h2>
			<h2> Update /Inventory/:id </h2>
			<h2> Products by Email /productsByEmail?email=hr@h.com </h2>
			<h2> Products Delete : /product/:id </h2> 
			<h2> insert one : /inventory - post method </h2>
			<h2> Blogs : /blogs </h2>
				`
			)
		})
		
		// Delete a Products Article - finilize work (Done!)
		app.delete('/product/:id', async (req,res) => {
       const id = req.params.id;
			const result = await products.deleteOne({ _id : new ObjectId(id)});
			res.send({message : "Deleted one"});
		});
    
  } finally {
   // await client.close();
  }
}
run().catch(console.dir);
// Common Middleware 
app.use(express.json());
app.use(cors());



app.listen(port, () => console.log('Server listening on ther port ', port)); 