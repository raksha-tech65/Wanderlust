const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing= require("./models/listing.js");
const path= require("path");
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
const methodOverride = require("method-override");
const listing = require("./models/listing.js");
const ejsMate= require("ejs-mate");


main()
.then(() => {
    console.log("connected to database");
})
.catch((err) => {
    console.log(err);
});
async function main(){
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
    res.send("hi i am root");
});

//index route
app.get("/listings", async(req, res) => {
   const allListings=await Listing.find({});
   console.log(allListings);
    // res.send(allListings);
    res.render("listings/index", {allListings});
   });


   //new route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});

//show route
app.get("/listings/:id", async (req, res) => {
    let {id}= req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
});


//create route
app.post("/listings", async(req, res) => {
    // let {title, description, image, price, country, location} = req.body;
    // let listing= req.body.listing;
    const newListing = new Listing(req.body.listing);
     await newListing.save();
    res.redirect("/listings");
});


//edit route
app.get("/listings/:id/edit", async(req, res) => {
    let {id}= req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
});


//update route
app.put("/listings/:id", async (req, res) => {
    let {id}= req.params;
    await listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
});

//delete route
app.delete("/listings/:id", async (req, res) => {
    let {id} = req.params;
    let deletedlisting = await listing.findByIdAndDelete(id);
    console.log(deletedlisting);
    res.redirect("/listings");
});

// app.get("/testListing", async(req, res) => {
// let samplelisting= new Listing({
    // title : "my new villa",
    // description : "by the beach",
    // price : 1200,
    // location : "calungatt, goa",
    // country :  "india",
// });

// await samplelisting.save();
//  console.log("sample was saved");
//  res.send("succesful testing");
// });
app.listen(8080, () => {
    console.log("server is listening to the port 8080");
});

