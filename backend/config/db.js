import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://jayeshkotkar01:CfqSfJTxEeao1i4N@cluster0.x7ithtz.mongodb.net/AirBnb')
        .then(()=>{
            console.log("MongoDB connected");
        })
        .catch((err)=>{
            console.log(err);
        })
    } catch (error) {
        console.log(error);
    }
}

export default connectDB;   