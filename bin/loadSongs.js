const _ = require('lodash')
const fs = require('fs');
const showdown = require('showdown')
const nano = require('nano')('http://localhost:5984')
const slugify = require('slugify')

const converter = new showdown.Converter();

const now = new Date()
let songsJson = JSON.parse(fs.readFileSync('/Users/kevinlin/code/songbook-scraper/output/songs.json', 'utf8'));

songsJson.forEach((song) => transformSong(song))
// songsJson = _.uniqBy(songsJson, (s) => s.slug)
checkSlugsUnique(songsJson)

const password = fs.readFileSync('.password', 'utf8')
const songsDb = nano.use('songs');
insertSongs()

function transformSong(song) {
  song.mainContentHtml = converter.makeHtml(song.mainContentMarkdown)
  song.createdAt = now
  song.updatedAt = now
  song.slug = slug(song)
  delete song.mainContentMarkdown
}

function slug(song) {
  const slug = slugify(`${song.title}`, {
    lower: true,
    strict: true,
  })

  return slug
}

function checkSlugsUnique(songs) {
  const slugs = songs.map((s) => s.slug)
  const uniqueSlugs = _.uniq(slugs)

  if (slugs.length !== uniqueSlugs.length) {
    // stolen from https://codehandbook.org/javascript-find-duplicate-values-array/
    let duplicates = slugs.reduce((acc,currentValue,index, array) => {
      if(array.indexOf(currentValue)!=index && !acc.includes(currentValue)) acc.push(currentValue);
      return acc;
    }, []);

    console.log(slugs.length, uniqueSlugs.length)
    console.log(duplicates)
    throw new Error('slugs not unique')
  }
}

async function insertSongs() {
  await nano.auth('admin', password)
  nano.session().then((doc) => console.log(doc))

  songsJson.forEach(async (song) => {
    const result = await songsDb.insert(song, song.slug)
    console.log(result)
  })
}