"use strict";
const readline = require('readline');
const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const DB_URL = 'mongodb://localhost:27017/chess';



// 'collection' is the puzzles collection to insert to
let readFileAndInsert = (collection, callback) => {
    let line_count = 0;
    let inserted_count = 0;
    readline.createInterface({
        input: fs.createReadStream('./puzzles.json')
    }).on('line', (line) => {

        line_count++;

        // Extract 'sub' object from scraped json object string
        let formatted = line.split(',"pref":')[0] + "}";
        let obj = JSON.parse(formatted);
        let puzzle = obj.puzzle;

        collection.insertOne({
            "lichess_id": puzzle.id,
            "lichess_url": puzzle.url,
            "rating": puzzle.rating,
            "fen": puzzle.fen,
            "color": puzzle.color,
            "initMove": puzzle.initialMove,
            "lines": puzzle.lines
        }, (err, result) => {
            assert.equal(null, err);
            // Output to see insertion progress
            console.log("Inserted: ", ++inserted_count);
            // Check to make sure all have been inserted before closing the database
            if (inserted_count == line_count) {
                callback();
            }
        });
    });
};

MongoClient.connect(DB_URL, (err, db) => {
    assert.equal(null, err);
    console.log("Connected correctly to server.");
    // Create puzzles connection if it doesn't exist
    db.createCollection('puzzles', (err, collection) => {
        assert.equal(null, err);
        // Delete all existing puzzles
        collection.deleteMany({}, (err) => {
            assert.equal(null, err);
            readFileAndInsert(collection, () => {
                // callback function
                console.log("Done Inserting to database");
                db.close(false, (err) => {
                    assert.equal(null, err);
                    // If we've made it this far, exit with no error
                    process.exit(0);  
                });
            });
        });
    });
});