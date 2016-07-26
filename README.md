# Chess Analytics

## Step 1: Scraping problems and inserting to Mongo
In the repo you'll find three scripts
- getPuzzles.sh
- scrape.sh
- puzzlesToDb.js

`getPuzzles.sh` will run the latter two together for convenience

`scrape.sh` scrapes lichess.com for chess puzzles

`puzzlesToDb.js` inserts them all to a Mongo database with URL `mongodb://localhost:27017/chess`

All scripts are thoroughly commented and should be very readable.

#### Running them yourself
Requirements
- bash prompt (OSX and GNU Linux prompts by default)
- node (v0.12 or Later, Current version is 6.3.1 fyi so you're probably good here)
- mongodb node module installed
    ```bash
    # In the project directory...
    npm install mongodb
    ```
- Don't forget to chmod the two shell scripts to be executable!
    ```bash
    sudo chmod +x ./scrape.sh
    sudo chmod +x ./getPuzzles.sh
    ```

Running It
```bash
# Assuming all requirements are met
./getPuzzles.sh
```

#### Example output
```bash
Getting puzzles
Scraping 5 problems...
1 / 5
2 / 5
3 / 5
4 / 5
5 / 5
Done
Connected correctly to server.
Inserted:  1
Inserted:  2
Inserted:  3
Inserted:  4
Inserted:  5
Done Inserting to database
```