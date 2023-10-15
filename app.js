// requiring expess
const express = require("express");
const app = express();
const port = 8080;

// requiring listing model
const Listing = require("./models/listing.js");

// requiring mongoose
const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>{
    console.log("connected to WANDERLUST DB");
})
.catch(err=> console.log(err));

async function main() {
    await mongoose.connect(MONGO_URL);
}

// requiring path
const path = require("path");

// setting up ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));

// requiring method-override
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

// requiring ejs-mate
const ejsMate = require('ejs-mate');
app.engine('ejs', ejsMate);

// to serve the static files
app.use(express.static(path.join(__dirname,"public")));

// to root route
app.get('/', function (req, res) {
    res.send("this is root route");
});

// to test the listing
// app.get("/testListing", async (req, res)=>{
//     let sampleListing = new Listing({
//         title: "My New Villa",
//         description: "By the beach",
//         price: 1200,
//         location: "Calangute, Goa",
//         country: "India",
//     });

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("saved successfully");
// });

// index route
app.get("/listings", async(req,res)=>{
    const allListings =  await Listing.find({});
    res.render("./listings/all.ejs", {allListings});
    
})

// new route (CREATE)
app.get("/listings/new", (req, res)=>{
    res.render("listings/new.ejs");
});

// show route (READ)
app.get("/listings/:id",async (req, res)=>{
    let id = req.params.id;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
});

// create route
app.post("/listings", async (req,res)=>{
    // let listing = req.body.listing;
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    console.log(newListing);
    res.redirect("/listings");
});

// edit route (to SERVE THE FORMS)
app.get("/listings/:id/edit", async(req, res)=>{
    let id = req.params.id;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
});

// update route (UPDATE)
app.put("/listings/:id", async(req, res)=>{
    let id = req.params.id;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
})

// delete route (DELETE)
app.delete("/listings/:id", async (req, res)=>{
    let id = req.params.id;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
});

// to get a feedback if the app is running or not
app.listen(port, ()=>{
    console.log(`app is listening on ${port}`);
})