    // 03. GET + POST + DELETE

    const notes = require('express').Router();
    const { v4: uuidv4 } = require('uuid');
    const {
        readFromFile,
        readAndAppend,
        writeToFile,
    } = require('../helper/write-read');
    
    // GET: Route to retrieve DB JSON
    notes.get('/', (req, res) => {
        readFromFile('./db/notes.json').then((data) => res.json(JSON.parse(data)));
    });
    
    // GET: Route for a specific note
    notes.get('/:note_id', (req, res) => {
        const noteId = req.params.note_id;
        readFromFile('./db/notes.json')
            .then((data) => JSON.parse(data))
            .then((json) => {
                const result = json.filter((note) => note.note_id === noteId);
                return result.length > 0
                    ? res.json(result)
                    : res.json('No note with that ID');
            });
    });
    
    // DELETE: Route a note with the ID (INSOMNIA)
    notes.delete('/:note_id', (req, res) => {
        const noteId = req.params.note_id;
        readFromFile('./db/notes.json')
            .then((data) => JSON.parse(data))
            .then((json) => {
                // Make a new array of all notes except the one with the ID provided in the URL
                const result = json.filter((note) => note.note_id !== noteId);
    
                // Save that array to the filesystem
                writeToFile('./db/notes.json', result);
    
                // Respond to the DELETE request
                res.json(`Note ${noteId} has been deleted 🗑️`);
            });
    });
    
    // POST: Route a new note
    notes.post('/', (req, res) => {
        console.log(req.body);
    
        const { username, topic, note } = req.body;
    
        if (req.body) {
            const new_note = {
                username,
                note,
                topic,
                note_id: uuidv4(),
            };
    
            readAndAppend(new_note, './db/notes.json');
            res.json(`Note added successfully 🚀`);
        } else {
            res.error('Error in adding note');
        }
    });
    
    module.exports = notes;