import dotenv from "dotenv"
import connectDB from "./db/db.js"
import { app } from "./app.js";
dotenv.config({path: "./.env"});
import userRoutes from "./routes/user.route.js";
import adminRoutes from "./routes/admin.route.js";
import quizRoutes from "./routes/quiz.route.js";  
import leaderboardRoutes from './routes/leaderboard.route.js'


app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

app.use("/api/quizzes", quizRoutes);  
app.use("/api/leaderboard", leaderboardRoutes);  



connectDB()
.then(()=>{
    app.listen(process.env.PORT||3000,()=>{
        console.log(`server running on PORT ${process.env.PORT||3000}`)
    })
})
.catch((err)=>{
    console.log(`mongodb connection failed`, err)
})