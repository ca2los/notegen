    const express = require('express');

    const note_route = require('./notes');
    const validation_route = require('./validation');

    const app = express();

    app.use('/notes', note_route);
    app.use('/validation', validation_route);

    module.exports = app;