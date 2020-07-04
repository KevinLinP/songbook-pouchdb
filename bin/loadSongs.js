const fs = require('fs');
const showdown = require('showdown')
const nano = require('nano')('http://localhost:5984')

const converter = new showdown.Converter();

var songsJson = JSON.parse(fs.readFileSync('/Users/kevinlin/code/songbook-scraper/output/songs.json', 'utf8'));
const password = fs.readFileSync('.password', 'utf8')
const songsDb = nano.use('songs');
const now = new Date()

async function run() {
  await nano.auth('admin', password)
  nano.session().then((doc) => console.log(doc))

  songsJson.forEach((song) => insertSong(song))
}

run()

async function insertSong(song) {
  song.mainContentHtml = converter.makeHtml(song.mainContentMarkdown)
  song.createdAt = now
  song.updatedAt = now
  delete song.mainContentMarkdown

  const result = await songsDb.insert(song, song.url)
  console.log(result)
}