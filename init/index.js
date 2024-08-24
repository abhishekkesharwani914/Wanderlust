const mongoose = require("mongoose");
const initData = require("./data.js");
const listing = require("../Models/listing.js");

const mongoURL = "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(mongoURL);
};

const initDB = async () => {
    await listing.deleteMany({});
    initData.data.map(obj => ({...obj, owner: "66ac819f3a76ae3ea327dd15"}))
    await listing.insertMany(initData.data);
    console.log("Data was initialized");
};

initDB();