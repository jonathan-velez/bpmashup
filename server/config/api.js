const bpAPIModels = require('../config/models');

const apiConfig = {
  'artists': {
    model: null,
    params: [
      {
        name: 'id',
        dataType: 'int',
        required: false
      },
      {
        name: 'ids',
        dataType: 'string',
        required: false
      },
      {
        name: 'facets',
        dataType: 'string',
        required: false
      },
      {
        name: 'returnFacets',
        dataType: 'string',
        required: false
      },
      {
        name: 'sortBy',
        dataType: 'string',
        required: false,
        allowedValues: ['publishDate ASC', 'publishDate DESC']
      }
    ]
  },
  'artists/detail': {
    model: null,
    params: [
      {
        name: 'id',
        dataType: 'int',
        required: true
      }
    ]
  },
  'autocomplete': {
    model: null,
    params: [
      {
        name: 'query',
        dataType: 'string',
        required: true
      },
      {
        name: 'perPage',
        dataType: 'int',
        required: false
      }
    ]
  },
  'genres': {
    model: null,
    params: [
      {
        name: 'id',
        dataType: 'int',
        required: false
      },
      {
        name: 'page',
        dataType: 'int',
        required: false
      },
      {
        name: 'perPage',
        dataType: 'int',
        required: false
      },
      {
        name: 'slug',
        dataType: 'string',
        required: false
      },
      {
        name: 'subGenres',
        dataType: 'boolean',
        required: false
      }
    ]
  },
  'most-popular': {
    model: bpAPIModels.track,
    params: [
      {
        name: 'page',
        dataType: 'int',
        required: false
      },
      {
        name: 'perPage',
        dataType: 'int',
        required: false
      },
      {
        name: 'facets',
        dataType: 'string',
        required: false
      },
      {
        name: 'countryId',
        dataType: 'int',
        required: false
      },
      {
        name: 'type',
        dataType: 'int',
        required: false
      },
      {
        name: 'genreId',
        dataType: 'int',
        required: false
      },
      {
        name: 'labelId',
        dataType: 'int',
        required: false
      },
      {
        name: 'artistId',
        dataType: 'int',
        required: false
      }
    ]
  },
  'most-popular/artist': {
    model: bpAPIModels.track,
    params: [
      {
        name: 'page',
        dataType: 'int',
        required: false
      },
      {
        name: 'perPage',
        dataType: 'int',
        required: false
      },
      {
        name: 'facets',
        dataType: 'string',
        required: false
      },
      {
        name: 'countryId',
        dataType: 'int',
        required: false
      },
      {
        name: 'type',
        dataType: 'int',
        required: false
      },
      {
        name: 'id',
        dataType: 'int',
        required: false
      }
    ]
  },
  'most-popular/genre': {
    model: bpAPIModels.track,
    params: [
      {
        name: 'page',
        dataType: 'int',
        required: false
      },
      {
        name: 'perPage',
        dataType: 'int',
        required: false
      },
      {
        name: 'facets',
        dataType: 'string',
        required: false
      },
      {
        name: 'countryId',
        dataType: 'int',
        required: false
      },
      {
        name: 'type',
        dataType: 'int',
        required: false
      },
      {
        name: 'id',
        dataType: 'int',
        required: false
      }
    ]
  },
  'most-popular/label': {
    model: bpAPIModels.track,
    params: [
      {
        name: 'page',
        dataType: 'int',
        required: false
      },
      {
        name: 'perPage',
        dataType: 'int',
        required: false
      },
      {
        name: 'facets',
        dataType: 'string',
        required: false
      },
      {
        name: 'countryId',
        dataType: 'int',
        required: false
      },
      {
        name: 'type',
        dataType: 'int',
        required: false
      },
      {
        name: 'id',
        dataType: 'int',
        required: false
      }
    ]
  },
  'most-popular-releases/label': {
    model: bpAPIModels.track,
    params: [
      {
        name: 'page',
        dataType: 'int',
        required: false
      },
      {
        name: 'perPage',
        dataType: 'int',
        required: false
      },
      {
        name: 'facets',
        dataType: 'string',
        required: false
      },
      {
        name: 'countryId',
        dataType: 'int',
        required: false
      },
      {
        name: 'type',
        dataType: 'int',
        required: false
      },
      {
        name: 'id',
        dataType: 'int',
        required: false
      }
    ]
  },
  'search': {
    model: bpAPIModels.track,
    params: [
      {
        name: 'query',
        dataType: 'string',
        required: true
      },
      {
        name: 'facets',
        dataType: 'string',
        required: false
      },
      {
        name: 'returnFacets',
        dataType: 'string',
        required: false
      },
      {
        name: 'page',
        dataType: 'int',
        required: false
      },
      {
        name: 'perPage',
        dataType: 'int',
        required: false
      },
      {
        name: 'sortBy',
        dataType: 'string',
        required: false,
        allowedValues: ['publishDate ASC', 'publishDate DESC', 'releaseDate ASC', 'releaseDate DESC']
      }
    ]
  },
  'tracks/similar': {
    model: bpAPIModels.track,
    params: [
      {
        name: 'id',
        dataType: 'int',
        required: true
      },
      {
        name: 'ids',
        dataType: 'string',
        required: false
      },
      {
        name: 'facets',
        dataType: 'string',
        required: false
      },
      {
        name: 'returnFacets',
        dataType: 'string',
        required: false
      },
      {
        name: 'page',
        dataType: 'int',
        required: false
      },
      {
        name: 'perPage',
        dataType: 'int',
        required: false
      }
    ]
  },
  'tracks': {
    model: bpAPIModels.track,
    params: [
      {
        name: 'id',
        dataType: 'int',
        required: true
      },
      {
        name: 'ids',
        dataType: 'string',
        required: false
      },
      {
        name: 'facets',
        dataType: 'string',
        required: false
      },
      {
        name: 'returnFacets',
        dataType: 'string',
        required: false
      },
      {
        name: 'page',
        dataType: 'int',
        required: false
      },
      {
        name: 'perPage',
        dataType: 'int',
        required: false
      },
      {
        name: 'chartId',
        dataType: 'int',
        required: false
      },
      {
        name: 'releaseId',
        dataType: 'int',
        required: false
      },
      {
        name: 'sortBy',
        dataType: 'string',
        required: false,
        allowedValues: ['genreName ASC', 'genreName DESC', 'labelName ASC', 'labelName DESC', 'publishDate ASC', 'publishDate DESC', 'releaseDate ASC', 'releaseDate DESC', 'releaseId ASC', 'releaseId DESC', 'trackId ASC', 'trackId DESC', 'trackName ASC', 'trackName DESC']
      }
    ]
  },
  'labels': {
    model: bpAPIModels.label,
    params: [
      {
        name: 'id',
        dataType: 'int',
        required: false
      },
      {
        name: 'ids',
        dataType: 'string',
        required: false
      },
      {
        name: 'facets',
        dataType: 'string',
        required: false
      },
      {
        name: 'returnFacets',
        dataType: 'string',
        required: false
      },
      {
        name: 'page',
        dataType: 'int',
        required: false
      },
      {
        name: 'perPage',
        dataType: 'int',
        required: false
      },
      {
        name: 'sortBy',
        dataType: 'string',
        required: false,
        allowedValues: ['publishDate ASC', 'publishDate DESC']
      }
    ]
  },
  'releases': {
    model: bpAPIModels.release,
    params: [
      {
        name: 'id',
        dataType: 'int',
        required: false
      },
      {
        name: 'ids',
        dataType: 'string',
        required: false
      },
      {
        name: 'facets',
        dataType: 'string',
        required: false
      },
      {
        name: 'returnFacets',
        dataType: 'string',
        required: false
      },
      {
        name: 'page',
        dataType: 'int',
        required: false
      },
      {
        name: 'perPage',
        dataType: 'int',
        required: false
      },
      {
        name: 'sortBy',
        dataType: 'string',
        required: false,
        allowedValues: ['publishDate ASC', 'publishDate DESC']
      }
    ]
  }
}

module.exports = apiConfig;
