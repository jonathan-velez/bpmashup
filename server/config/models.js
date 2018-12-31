const track = [
  'id',
  'type',
  'name',
  'title',
  'mixName',
  'slug',
  'releaseDate',
  'length',
  'bpm',
  'key',
  'artists',
  'genres',
  'subGenres',
  'label',
  'images',
  'dynamicImages',
  'sampleSecureUrl',
  'position',
  'preview',
  'lengthMs'
];

const label = [
  'id',
  'type',
  'name',
  'slug',
  'lastPublishDate',
  'biography',
  'genres',
  'subGenres',
  'images',
  'dynamicImages'
]

const release = [
  'id',
  'name',
  'slug',
  'releaseDate',
  'publishDate',
  'catalogNumber',
  'description',
  'price',
  'label',
  'artists',
  'genres',
  'images',
]

exports.track = track;
exports.label = label;
exports.release = release;
