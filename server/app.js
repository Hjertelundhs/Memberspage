const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
app.get('/', (req, res) =>{
  res.send('Hello world!');
});

app.get('/members', (req, res) =>{
  res.send([1,2,3]);
});

app.get('/members/:id', (req, res) =>{
  res.send(req.params.id);
});

app.listen(port, () =>{
  console.log(`Listening on port: ${port}`);
});
