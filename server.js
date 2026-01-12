const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname)));

const db = new sqlite3.Database(path.join(__dirname, 'identifier.sqlite'), (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Connected to identifier.sqlite database');
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/words', (req, res) => {
    // Join words with translations and definitions tables
    // Only show words that have at least one definition
    const query = `
        SELECT 
            w.word_id,
            w.word,
            w.language,
            w.notes,
            (SELECT GROUP_CONCAT(translation, ' | ') 
             FROM (SELECT DISTINCT translation FROM translations WHERE word_id = w.word_id)) as translation,
            (SELECT GROUP_CONCAT(definition, ' | ') 
             FROM (SELECT DISTINCT definition FROM definitions WHERE word_id = w.word_id)) as definition
        FROM words w
        INNER JOIN definitions d ON w.word_id = d.word_id
        WHERE w.language = 'English' AND d.definition IS NOT NULL
        GROUP BY w.word_id
        ORDER BY w.word
    `;
    
    db.all(query, [], (err, rows) => {
        if (err) { 
            console.error('Database error:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        console.log(`Fetched ${rows.length} words`);
        res.json(rows);
    });
});

app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
    console.log('Open http://localhost:3000 in your browser');
});