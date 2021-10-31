const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// middleware
app.use(express.static('./develop/public'));

// API route to GET 

app.get('/api/notes', function(req, res){
    readFileAsync('./develop/db/db.json').then(function(data){
        notes = [].concat(JSON.parse(data))
        res.json(notes);
    })
});

// API route 

app.post('/api/notes', function(req, res){
    const notes = req.body;
    readFileAsync('./develop/db/db.json').then(function(data){
        const note = [].concat(JSON.parse(data));
        notes.id = note.length +1 
        note.push(notes);
        return note 
    })
    .then(function(note){
        writeFileAsync('./develop/db/db.json', JSON.stringify(note))
        res.json(notes)
    })
});
// delete 
app.delete('/api/notes/:id', function (req, res){
    const deleteId = parseInt(req.params.id);
    readFileAsync('./develop/db/db.json').then(function(data){
        const note = [].concat(JSON.parse(data));
        const newData = []
        for (let i = 0; i < note.length; i ++) {
            if (deleteId !== note[i].id) {
                newData.push(note[i])
            }
        }
    })
})
// html routes 
app.get('/notes', function(req, res){
    res.sendFile(path.join(__dirname, './develop/public/notes.html'));
});
app.get('/', function(req, res){
      res.sendFile(path.join(__dirname, './develop/public/index.html'));
});
app.get('*', function(req, res){
    res.sendFile(path.join(__dirname, './develop/public/index.html'));
});

// listening 
app.listen(PORT, function() {
    console.log('listen to port' + PORT);
});
