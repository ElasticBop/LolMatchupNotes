const express = require("express");
const dotenv = require("dotenv").config();
const {errorHandler} = require("./middleware/errorMiddleware")
const connectDB = require('./config/db');
const cors = require("cors")
const path = require("path")

const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(cors())
app.use(express.json({extended: false}));
app.use(express.urlencoded({extended: false}));

app.use("/api/schedules", require("./routes/scheduleRoutes") );
app.use("/api/matchups", require("./routes/matchupRoutes") );
app.use("/api/users", require("./routes/userRoutes") );

if( process.env.NODE_ENV === "production"){
	app.use(express.static(path.join(__dirname, "../build")))
	app.get("*", (req,res) => res.sendFile(path.resolve(__dirname, "../build", "index.html")))
}

app.use(errorHandler);

app.listen(port, () => console.log(`Server running on port ${port}`));