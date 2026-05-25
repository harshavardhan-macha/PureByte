import express from "express";
const app = express();
app.use(express.json());
app.get('/', (req, res) => {
  res.send('Pure');
})

app.get('/user/:id', (req, res) => {
  const userId = req.params.id;
  res.send(`User ID is ${userId}`);
});

// const app = require('./app');
const PORT = process.env.PORT || 3000;  
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});