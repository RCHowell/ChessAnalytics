#!/bin/bash

# I noticed that LiChess stores the puzzle data at the bottom of the page in a javascript object
# This is a regular expression to find the line with the javascript object
pattern='{"puzzle":*'

# COUNTER set to 1 because puzzles start at 1 as opposed to 0
COUNTER=1
# Number of problems to scrape
# LiChess has ~60,000 problems
# I executed this script for all 60,000
# TOTAL is set to 5 so that it runs quickly if you try it out
TOTAL=5

echo "Scraping $TOTAL problems..."

# Remove and create puzzles.json to ensure it exists and is empty
rm ./puzzles.json
touch ./puzzles.json

# Loop while counter is less than or equal to total
while [ $COUNTER -le $TOTAL ]; do
    # Get the page and store it in a temporary out file
	curl -s https://en.lichess.org/training/$COUNTER > out	
    # Read the file line by line
	while read line; do
		if [[ $line =~ $pattern ]]; then
            # Append line to puzzles.json file
			echo "$line" >> ./puzzles.json
            # Console output to show progress
			echo "$COUNTER / $TOTAL"
		fi
	done < out
	let COUNTER=COUNTER+1
done

echo "Done"