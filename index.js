const express = require("express")
const mongoose = require("mongoose")
const app = express()
const PORT  = 3000;
app.use(express.json())
mongoose.connect("mongodb://localhost:27017/newREst",{useNewUrlParser:true,useUnifiedTopology:true},).then(()=>{
    console.log("Success connectiong to mongodb")
}).catch((err)=>{
    console.log("error in fetching data",err)
})

//Creating schema
const schema = {
    name:String,
    email:String,
    id:Number
}
const monmodel = mongoose.model("smalltable",schema)
//get
app.get('/get', async (req, res) => {
    try {
        const data = await monmodel.find(); // Fetch all records from the database
        res.json(data); // Return the data in JSON format
    } catch (err) {
        res.status(500).json({ message: "Error retrieving data", error: err.message });
    }
});

//post
app.post('/post',async(req,res)=>{
    console.log("Inside post function")

    const data =new monmodel({
        name:req.body.name,
        email:req.body.email,
        id:req.body.id
    })
    const val =await data.save()    
    res.json("Posted successfully!")
})

//put or update
// PUT or update
app.put("/update/:id", async (req, res) => {
    let upid = req.params.id; // Get 'id' from the URL params
    let upname = req.body.name; // Get 'name' from the request body
    let upemail = req.body.email; // Get 'email' from the request body

    try {
        const updatedData = await monmodel.findOneAndUpdate(
            { id: upid }, // Find by 'id' field in the database
            { $set: { name: upname, email: upemail } }, // Update fields
            { new: true } // Return the updated document
        );

        if (!updatedData) {
            return res.status(404).json({ message: "No record found with this id" });
        }

        res.json(updatedData); // Send the updated document
    } catch (err) {
        res.status(500).json({ error: "Error updating document", message: err.message });
    }
});

//fetch data
app.get("/fetch/:id", async (req, res) => {
    const fetchid = req.params.id; // Capture the ID from URL params

    try {
        const val = await monmodel.findOne({ id: fetchid }); // Use async/await
        if (!val) {
            return res.status(404).json({ message: "No record found with this id" }); // Handle if no data is found
        }
        res.json(val); // Return the found data as JSON
    } catch (err) {
        res.status(500).json({ message: "Error fetching data", error: err.message }); // Handle errors properly
    }
});

//Delete

app.delete("/delete/:id", async (req, res) => {
    const delid = req.params.id; // Get the ID from the request parameters

    try {
        const deletedDoc = await monmodel.findOneAndDelete({ id: delid }); // Use async/await to delete the document
        if (!deletedDoc) {
            return res.status(404).json({ message: "No record found with this id" }); // Handle case where no document was found
        }
        res.json({ message: "Record deleted successfully", deletedDoc }); // Return success message and deleted document
    } catch (err) {
        res.status(500).json({ message: "Error deleting data", error: err.message }); // Handle any errors
    }
});



app.listen(PORT,()=>{
    console.log(`Port started at ${PORT}`)
})