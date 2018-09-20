#!/usr/bin/env node
'use strict';

const program = require('commander');
const fs = require('fs');
const asteroid = require('asteroid');
const path = require('path');
const WebSocket = require('ws');

let fileName;

program
    .description('Add Orthogroup phylogenetic trees to a running GeneNoteBook server')
    .usage('[options] <kallisto .tsv file>')
    .option('-u, --username <username>', 'GeneNoteBook admin username')
    .option('-p, --password <password>', 'GeneNoteBook admin password')
    .option('--port [port]', 'Port on which GeneNoteBook is running. Default: 3000')
    .option('-s, --sample-name <sample name>', 'Unique sample name')
    .option('-r, --replica-group <replica group>', 'Identifier to group samples that belong to the same experiment')
    .option('-d, --sample-description <description>','Description of the experiment')
    .action(file => {
      fileName = path.resolve(file);
    })
    .parse(process.argv);

const { username, password, port = 3000 } = program;
const sampleName = program.sampleName || fileName;
const replicaGroup = program.replicaGroup || fileName;
const description = program.sampleDescription || 'description';

if (!( fileName && username && password  )){
  program.help()
}

const endpoint = `ws://localhost:${port}/websocket`
const SocketConstructor = WebSocket;

const Connection = asteroid.createClass()

const geneNoteBook = new Connection({ endpoint, SocketConstructor })

geneNoteBook.loginWithPassword({ username, password })
.then(loginResult => {
  return geneNoteBook.call('addTranscriptome', { fileName, sampleName, replicaGroup, description })
})
.then(addTranscriptomeResult => {
  //const { ok, writeErrors, writeConcernErrors, nInserted } = addOrthogroupResult;
  //console.log(`Succesfully added ${nInserted} orthogroup phylogenetic trees from ${folderName}`)
  console.log(addTranscriptomeResult);
  geneNoteBook.disconnect();
})
.catch(error => {
  console.log(error);
  geneNoteBook.disconnect();
})

//{ fileName, sampleName, replicaGroup, description }