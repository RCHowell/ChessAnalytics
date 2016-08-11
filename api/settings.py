MONGO_HOST = 'localhost'
MONGO_PORT = 27017
MONGO_DBNAME = 'chess'
MONGO_QUERY_BLACKLIST = ['$where']
X_DOMAINS = 'https://*.lichess.org/training/*'


schema = {
  'lichess_id': {
    'type': 'integer'
  },
  'lichess_url': {
    'type': 'string'
  },
  'rating': {
    'type': 'integer'
  },
  'fen': {
    'type': 'string'
  },
  'color': {
    'type': 'string'
  },
  'lines': {
    'type': 'dict'
  }
}

puzzles = {
  'additional_lookup': {
      'url': 'regex("[\w]+")',
      'field': 'lichess_id'
    },

  'resource_methods': ['GET'],

  'schema' : schema
}

DOMAIN = {'puzzles': puzzles}
