import "dotenv/config";
import cors from "cors";
import express from "express";
import { auth } from "@gymApp/auth"; // this thing is come from the  better auth 
import { toNodeHandler } from "better-auth/node";

const app = express();

// Global Request Logger
app.use((req, res, next) => {
    console.log(`[SERVER] ${req.method} ${req.url}`);
    if (req.headers.authorization) console.log(`[SERVER] Auth Header present`);
    if (req.headers.cookie) console.log(`[SERVER] Cookie present`);
    next();
});

app.use(
	cors({
		origin: true, // Reflect request origin
		methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
		allowedHeaders: ["Content-Type", "Authorization", "x-session-token", "x-better-auth-session-token", "Cookie"],
		credentials: true,
	}),
);

app.use(express.json());

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



app.get("/", (_req, res) => {
	res.status(200).send("OK");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
