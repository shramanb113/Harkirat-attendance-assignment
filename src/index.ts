import  dotenv  from "dotenv";
import express from "express";
import authRouter from './router/auth.routes.ts' 
dotenv.config()

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/auth',authRouter)


app.get("/", (req, res) => {
  res.json({ message: "Server running!" });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server started on http://localhost:${PORT}`);
});
