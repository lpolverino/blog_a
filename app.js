const dotenv = require("dotenv");
const prisma = require("./db/prisma");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(cors());

app.get("/", (req,res)=> res.send("Hello World"));


const PORT = process.env.PORT || 3000;

app.listen(PORT, (error) =>{
    if(error){
        throw error;
    }
    console.log(`Express listen to port: ${PORT}`)
});