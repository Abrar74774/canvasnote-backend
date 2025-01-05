import mongoose from "mongoose";

//main().catch(err => console.log(err));

export default async function main() {
  mongoose.connect(process.env.MONGO_URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: true, 
    }
  );
}

