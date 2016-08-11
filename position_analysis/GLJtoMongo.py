#!./venv/bin/python

# Author: R. C. Howell
# Python 2.7.10

from pymongo import MongoClient
from genGLJ import generateGLJ
from bson.objectid import ObjectId

client = MongoClient("mongodb://localhost:27017")

processed = 0;

db = client.chess
cursor = db.puzzles.find()

for puzzle in cursor:
    # print(generateGLJ(puzzle["fen"]))
    db.puzzles.update_one({
        "lichess_id": puzzle["lichess_id"]
    }, {
        "$set" : {
            "glj" : generateGLJ(puzzle["fen"])
        }
    })
    processed = processed + 1
    print(str(processed) + " of " + str(60000))