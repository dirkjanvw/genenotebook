#!/usr/bin/env node
'use strict';

const program = require('commander');
const fs = require('fs');
const asteroid = require('asteroid');
const path = require('path');
const WebSocket = require('ws');

let fileName;

program
  .description('Add fasta formatted reference genome to a running GeneNoteBook server')
  .usage('[options] <genome fasta file>')
  .option('-u, --username <username>', 'GeneNoteBook admin username')
  .option('-p, --password <password>', 'GeneNoteBook admin password')
  .option('-n, --name [name]','Reference genome name. Default: fasta file name')
  .option('--port [port]', 'Port on which GeneNoteBook is running. Default: 3000')
  .action(file => {
      if ( typeof file !== 'string' ) program.help();
    fileName = path.resolve(file);
  })
  .parse(process.argv);

const { username, password, name, port = 3000 } = program;

if (!( fileName && username && password  )){
  program.help()
};

const genomeName = name || fileName.split('/').pop();

const endpoint = `ws://localhost:${port}/websocket`;
const SocketConstructor = WebSocket;

const Connection = asteroid.createClass();

const geneNoteBook = new Connection({ endpoint, SocketConstructor });

geneNoteBook.loginWithPassword({ username, password })
  .then(loginResult => {
    return geneNoteBook.call('addGenome', { fileName, genomeName })
  })
  .then(addGenomeResult => {
    const { ok, writeErrors, writeConcernErrors, nInserted } = addGenomeResult;
    console.log(`Succesfully added ${genomeName} genome in ${nInserted} chunks`)
    geneNoteBook.disconnect()
  })
  .catch(error => {
    console.log(error)
    geneNoteBook.disconnect()
  });