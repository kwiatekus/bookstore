const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
//const tracing = require('./tracing.js');
const app = express();
const port = 3000;

const queryDB = require('./hana.js');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get('/v1/books', async (req, res) => {
    try{
        var books = await queryDB("SELECT * FROM BOOKS");
        res.send(books);
    } catch (e) {
        res.status(500).send(e);
    }    
})

app.post('/v1/books/register', (req, res) => {
  let title = getTitle(req.body);
  let author = getAuthor(req.body);

  if (title === undefined || author === undefined) {
    console.log('No author or title received!');
    res.sendStatus(400);
  } else {
    var uid = uuidv4();
    console.log(`Book ${title} by ${author} registered with ID:${uid}`);
    res.sendStatus(200);
  }

  /*
        TODO:
         - propagate tracing headers to email service: tracing.propagateTracingHeaders(req.headers, req)
         - send email to event.customer.uid
    */
});

var server = app.listen(port, () =>
  console.log('Example app listening on port ' + port + '!')
);

app.stop = function() {
  server.close();
};

module.exports = app;

function getTitle(body) {
  if (body.title === undefined ) {
    return undefined;
  }
  return body.title;
}

function getAuthor(body) {
  if (body.author === undefined ) {
    return undefined;
  }
  return body.author;
}