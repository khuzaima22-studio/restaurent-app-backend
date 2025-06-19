import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import user from "./routes/user/route";
import branch from "./routes/branch/route";
import auth from "./routes/auth/route";
import { IsToken } from "./middlewares/is-token";
dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTENDSERVER,
    credentials: true,
  })
);
app.use(express.json());

const port = process.env.PORT || 3001;
const apiVersion = "/v1";
app.use(apiVersion, auth);
app.use(apiVersion, user);
app.use(apiVersion, branch);

app.get("/hello-server", (req: Request, res: Response) => {
  res.status(200).json({ message: "Hi from server" });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
