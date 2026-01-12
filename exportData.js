const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const db = new sqlite3.Database('identifier.sqlite');

// Join all the tables to get complete word data
const query = `
SELECT 
    w.word_id,
    w.word,
    w.notes,
    t.translation,
    d.definition
FROM words w
LEFT JOIN translations t ON w.word_id = t.word_id
LEFT JOIN definitions d ON w.word_id = d.word_id
ORDER BY w.word
`;

db.all(query, [], (err, rows) => {
    if (err) {
        console.error('Error:', err);
        db.close();
        return;
    }
    
    console.log(`✅ Found ${rows.length} words with translations and definitions`);
    console.log('Sample rows:', rows.slice(0, 3));
    
    // Create data folder
    if (!fs.existsSync('data')) {
        fs.mkdirSync('data');
    }
    
    // Save to JSON
    fs.writeFileSync('data/words.json', JSON.stringify(rows, null, 2));
    console.log(`💾 Exported to data/words.json`);
    
    db.close();
});