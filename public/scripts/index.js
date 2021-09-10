    // 07. CREATE HTML ON LOAD

    const note_form = document.getElementById('note_form');
    const note_container = document.getElementById('note_container');

    // CREATE CARDS: Shows the 'rendered' and 'created' cards.
    const createCard = (note) => {

        // DIV: CARD (CREATE)
        const cardEl = document.createElement('div');
        cardEl.classList.add('card');
        cardEl.setAttribute('key', note.note_id);

        // DIV: CARD -> H4 (CREATE)
        const cardHeaderEl = document.createElement('h4');
        cardHeaderEl.classList.add('card-header');
        cardHeaderEl.innerHTML = `${note.username} </br>`;

        // DIV: CARD -> BODY P
        const cardBodyEl = document.createElement('div');
        cardBodyEl.classList.add('card-body');
        cardBodyEl.innerHTML = `<p>${note.note}</p>`;

        // DIV: CARD -> DELETE BTN
        const cardButton = document.createElement('button');
        cardButton.classList.add('card-button');
        cardButton.setAttribute('type','button');
        cardButton.innerHTML = '❌';
        cardButton.addEventListener('click', function() {
            cardEl.style.display = 'none';
        })

        // DIVS: APPEND -> INSIDE HTML
        cardEl.appendChild(cardHeaderEl);
        cardEl.appendChild(cardBodyEl);
        cardEl.appendChild(cardButton);

        // APPEND: CARD INSIDE DOM
        note_container.appendChild(cardEl);
    };

    // GET: Obtaining the data from the API as JSON
    const get_notes = () =>
        fetch('/api/notes', {
            method: 'GET', // or 'PUT'
            headers: {
                'Content-Type': 'application/json',
            },
            // body: JSON.stringify(data),
        })
            .then((response) => response.json())
            .then((data) => data)
            .catch((error) => {
                console.error('Error:', error);
            });

    // POST: Adding a new note inside the API as JSON
    const post_note = (note) =>
        fetch('/api/notes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(note),
        })
            .then((response) => response.json())
            .then((data) => {
                alert(data);
                createCard(note);
            })
            .catch((error) => {
                console.error('Error:', error);
            });

    // ON LOAD: Webpage shows data on load
    get_notes().then((data) => data.forEach((note) => createCard(note)));

    // VALIDATION: For created notes
    const validatenote = (newnote) => {
        const { username, topic, note } = newnote;

        // ERROR: Hold messages until they are ready
        const errorState = {
            username: '',
            note: '',
            topic: '',
        };

        // ERROR: User length < 4
        const utest = username.length >= 4;
        if (!utest) {
            errorState.username = 'Invalid username!';
        }

        // ERROR: Content length < 15
        const noteContentCheck = note.length > 15;
        if (!noteContentCheck) {
            errorState.note = 'note must be at least 15 characters';
        }

        // ERROR: Topic is not UX or UI
        const topicCheck = topic.includes('UX' || 'UI');
        if (!topicCheck) {
            errorState.topic = 'Topic not relevant to UX or UI';
        }

        const result = {
            isValid: !!(utest && noteContentCheck && topicCheck),
            errors: errorState,
        };

        return result;
    };

    // HELPER: Errors from the result
    const showErrors = (errorObj) => {
        const errors = Object.values(errorObj);
        errors.forEach((error) => {
            if (error.length > 0) {
                alert(error);
            }
        });
    };

    // HELPER: Post request to validate data
    const submitDiagnostics = (submissionObj) => {
        fetch('/api/validation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(submissionObj),
        })
            .then((response) => response.json())
            .then(() => showErrors(submissionObj.errors))
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    // WHEN the form is submitted
    const handleFormSubmit = (e) => {
        e.preventDefault();
        console.log('Form submit invoked');

        // GET the value of the note and save it to a variable
        const noteContent = document.getElementById('note_text').value;

        // GET the value of the username and save it to a variable
        const note_user = document.getElementById('note_user').value.trim();

        // CREATE an object with the note and username
        const newnote = {
            username: note_user,
            topic: 'UX',
            note: noteContent,
        };

        // Run the note object through our validator function
        const submission = validatenote(newnote);

        // VALID: Post the note || INVALID: Send error
        return submission.isValid ? post_note(newnote) : submitDiagnostics(submission);
    };

    note_form.addEventListener('submit', handleFormSubmit);