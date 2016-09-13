# Chess Analytics

## Part 1: Scraping problems and inserting to Mongo
In the repo you'll find three scripts
- getPuzzles.sh
- scrape.sh
- puzzlesToDb.js

`getPuzzles.sh` Runs the latter two together for convenience

`scrape.sh` Scrapes puzzles from lichess.com

`puzzlesToDb.js` Inserts all scraped puzzles to a Mongo database with URL `mongodb://localhost:27017/chess`

All scripts are thoroughly commented and should be very readable.

#### Running them yourself
Requirements
- bash
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

Run It
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

## Part 2: Backend and Chrome Extension
Files for this step can be found in the api and ext directory

#### Backend
The backend is an [Eve](http://python-eve.org/) server. It allows the extension to connect to my scraped puzzle database.
There are two files in the api directory
- `settings.py` Eve server settings which contain the puzzle schema and which fields puzzles can be queried by
- `run.py` Short script to include and run the server (settings.py)

#### Extension
The extension adds more information about the current puzzle
##### Without extension
![Before](images/without.png "Without Extension")
##### With Extension
![After](images/with.png "With Extension")

## Part 3: Puzzle Similarity
Files for this can be found in the position_analysis directory

#### Puzzles are textually encoded to later be tested for similarity.

`genGLJ.py` generates a GLJ feature vector of the puzzle. GLJ = Ganguly, Leveling, and Jones

My encoding of the puzzles is based off of the paper "Retrievel of Similar Chess Positions" by Ganguly, Leveling, and Jones. [link](https://drive.google.com/file/d/0BxMT6ybDt4RoX2JsbDdRaUx4T1k/view?usp=sharing)

#### Description of the Encoding:
1st: Piece Locations In Algebraic Notation
```
# White Knight at c3 and a Black Bishop at g7
Nc3 bg7
```

2nd: Possible Moves and [Chebyshev Distance](https://en.wikipedia.org/wiki/Chebyshev_distance) with weighting

Distance weighting is equation (2) in the above paper.
```
# Black Queen Can Move to a6 with a Distance Weight of 0.89
qa6|0.89
```

3rd: Attacking and Defending Squares
```
# Black Bishop Attacking the White Knight on c3
b>Nc3
# White Pawn Defending the White Knight on c3
p<Nc3
```

#### Determining Similarity
1st: I split the GLJ fields into parts containing three characters.