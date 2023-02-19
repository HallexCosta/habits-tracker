#!/usr/bin/env node
const http = require('https')
const path = require('path')
const fs = require('fs')

const [,, ...args] = process.argv

const urlDownloadFlags = [
  '--url',
  '-u'
]
const saveDirFlags = [
  '--save-dir',
  '-s'
]

if (!args.find(arg => urlDownloadFlags.includes(arg))|| !args.find(arg => saveDirFlags.includes(arg))) {
  return console.log(`
Please informe required flags:
-s or --save-dir  | output directory
-u or --url       | url to download
`)
}

function download({ url, filename }) {
  const file = fs.createWriteStream(filename);
  const request = http.get(url, function(response) {
     response.pipe(file);

     // after download completed close filestream
     file.on("finish", () => {
         file.close();
         console.log("Download Completed");
     });
  });
}

const urlIndex = (args.findIndex(arg => urlDownloadFlags.includes(arg))) + 1
const saveDirIndex = (args.findIndex(arg => saveDirFlags.includes(arg))) + 1

const url = args[urlIndex]
const saveDir = args[saveDirIndex]
const filename = path.resolve(process.cwd(), saveDir, 'habits-tracker-credentials.json')
//console.log(url)
//console.log(saveDir)
console.log(filename)

download({ url, filename })

