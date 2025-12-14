import "dotenv/config";
import cors from "cors";
import express from "express";
import { auth } from "@gymApp/auth"; // this thing is come from the  better auth 
import { toNodeHandler } from "better-auth/node";

const app = express();

app.use(
	cors({
		origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : [],
		methods: ["GET", "POST", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
		credentials: true,
	}),
);

import profileRouter from "./routes/profile";

import dashboardRouter from "./routes/dashboard";
import exercisesRouter from "./routes/exercises";
import programsRouter from "./routes/programs";
import workoutSessionRouter from "./routes/workout-session";
import progressRouter from "./routes/progress";
import nutritionRouter from "./routes/nutrition";

app.all("/api/auth{/*path}", toNodeHandler(auth));
app.use("/api/profile", profileRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/exercises", exercisesRouter);
app.use("/api/programs", programsRouter);
app.use("/api/workout-session", workoutSessionRouter);
app.use("/api/progress", progressRouter);
app.use("/api/nutrition", nutritionRouter);

app.use(express.json());

app.get("/", (_req, res) => {
	res.status(200).send("OK");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
