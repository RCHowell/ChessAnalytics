#!/bin/bash
# This script just runs the two scripts back to back for convenience

echo "Getting puzzles"

./scrape.sh
node ./puzzlesToDb.js