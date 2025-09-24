//index.js
import "dotenv/config";
import { connectDB } from "./config/db.js";
import app from "./app.js";

const PORT = process.env.PORT || 5000;

await connectDB();
app.listen(PORT, () => console.log(`🚀 API on http://localhost:${PORT}`));