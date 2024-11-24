import { app } from "./app.js";
import { connectToDB } from "./db/database.js";


const port = process.env.PORT || 4000;



connectToDB();

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});