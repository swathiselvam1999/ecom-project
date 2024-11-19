import mongoose from "mongoose";

const connectDB = async () => {

    try {

        const connect = await mongoose.connect("mongodb+srv://swathideveloper1991:swathideveloper1991@ecom.nrlnk.mongodb.net/ecom");
        console.log(`MongoDB Connected successfully`);

    } catch (err) {

        console.log(`Error Message : ${err.message}`);
        process.exit(1);

    }
};

export default connectDB;
