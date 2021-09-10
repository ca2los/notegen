    // 01. SERVER: GET

    // IMPORT
    const express   = require('express');
    const path      = require('path');
    const api       = require('./routes/index.js');
    const {clog}    = require('./middle/clog');
    const app       = express();
    const PORT      = process.env.PORT || 3001;

    // MIDDLEWARE
    app.use(clog);

    // PARSING DATA
    app.use(express.urlencoded({extended: true}));
    app.use(express.json());
    app.use('/api', api);

    // PUBLIC Access to the folder and files
    app.use(express.static('public'));

    // GET Methods
    app.get('/', (req,res) => res.sendFile(path.join(__dirname,'./public/index.html')));
    app.get('*', (req,res) => res.sendFile(path.join(__dirname,'./public/error.html')));

    // PORT
    app.listen(PORT, () => console.log(`App listening at http://localhost:${PORT} 🚀`));