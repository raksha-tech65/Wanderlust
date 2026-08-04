const mongoose = require("mongoose");
const initdata = require("./data.js");
const listing= require("../models/listing.js");

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

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

const initdb =async() => {
  await  listing.deleteMany({});
//   initdata.data = initdata.data.map((obj) => ({...obj, image: obj.image.url || obj.image}));
await listing.insertMany(initdata.data);
console.log("data was initialised");
};

initdb();