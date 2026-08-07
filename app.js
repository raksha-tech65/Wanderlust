const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing= require("./models/listing.js");
const path= require("path");
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
const methodOverride = require("method-override");
const listing = require("./models/listing.js");
const ejsMate= require("ejs-mate");
const wrapAsync= require("./utils/wrapAsync.js");
const ExpressError= require("./utils/ExpressError.js");
const {listingSchema}= require("./schema.js");
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

app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
    res.send("hi i am root");
});

const validateListing = (req, res, next) => {
     let {error} = listingSchema.validate(req.body);
       if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
       } else {
        next();
       }
}

//index route
app.get("/listings", wrapAsync(async(req, res) => {
   const allListings=await Listing.find({});
   console.log(allListings);
    // res.send(allListings);
    res.render("listings/index", {allListings});
   }));



   //new route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});

//show route
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let {id}= req.params;
    const listing = await Listing.findById(id);
    console.log(listing);
    res.render("listings/show.ejs", { listing });
}));


// Create Route
app.post(
    "/listings",
     validateListing,
    wrapAsync(async (req, res, next) => {
       let result = listingSchema.validate(req.body);
       console.log(result);
       if(result.error) {
        throw new ExpressError(400, result.error)
       }
  console.log("Request Body:", req.body.listing);
//    if(!req.body.listing) {
//      throw new ExpressError(400, "send valid data for listing");
//      }
    const newListing = new Listing(req.body.listing);
    // if(!newListing.title) {
    //     throw new ExpressError(400, "title is missing!");
    // }
    // if(!newListing.description) {
    //     throw new ExpressError(400, "Description is missing!");
    // }

    console.log("New Listing:", newListing);

    // if(!newListing.location) {
    //     throw new ExpressError(400, "location is missing!");
    // }

    await newListing.save();

    res.redirect("/listings");
    })
);



//edit route
app.get("/listings/:id/edit", wrapAsync(async(req, res) => {
    let {id}= req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
}));


//update route
app.put("/listings/:id",
    validateListing,
    wrapAsync(async (req, res) => {
    let {id}= req.params;
    await listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

//delete route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    let deletedlisting = await listing.findByIdAndDelete(id);
    console.log(deletedlisting);
    res.redirect("/listings");
}));

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

app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
    let {statusCode=500, message="something went wrong"}= err;
    res.status(statusCode).render("error.ejs", {message});
});


app.listen(8080, () => {
    console.log("server is listening to the port 8080");
});