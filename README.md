# BPMashup

### Features

- Browse the Beatport catalog by genre, artist or record label
- Play full-length tracks via YouTube
- Download full mp3 versions via Zippyshare (for evaluation only...support your favorite artists and purchase via Beatport)
- Create and save playlists

### Installation

- clone repo
- add Beatport and YouTube Search API keys to environment variables file ".env" *see below*
- (cd client && npm install) && (cd server && npm install)
- concurrently "cd client && PORT=3000 npm start" "cd server && PORT=3001 npm start"

### Environment Variables

- BP_CONSUMER_KEY
- BP_SECRET
- BP_ACCESS_TOKEN
- BP_ACCESS_TOKEN_SECRET
- YOUTUBE_API_KEY
- API_BASE_URL=/api
- BP_BASE_URL=https://oauth-api.beatport.com/catalog/3/

Beatport API - https://oauth-api.beatport.com/
YouTube Search API - https://developers.google.com/youtube/v3/docs/search
