const express = require("express");
const userRoutes = require("./routes/userRoutes");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({extended: true}))
// app.use(multer().array())

app.use("/user", userRoutes);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
