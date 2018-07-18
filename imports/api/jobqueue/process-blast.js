import { Meteor } from 'meteor/meteor';
import jobQueue from './jobqueue.js';
import  spawn  from 'spawn-promise';//child-process-promise';

import xml2js from 'xml2js-es6-promise';

import { genomeCollection } from '/imports/api/genomes/genomeCollection.js';


/**
 * Keep track of what blast commands should use which databases
 * @type {Object}
 */
const DB_TYPES = {  
  'blastn':'nucl',
  'tblastn':'nucl',
  'tblastx':'nucl',
  'blastp':'prot',
  'blastx':'prot'
}

jobQueue.processJobs(
  'blast',
  {
    concurrency: 1,
    payload: 1
  },
  (job, callback) => {
    console.log(job.data)

    const {
      blastType,
      input,
      genomeIds,
      user
    } =  job.data

    const dbType = DB_TYPES[blastType]

    /*
    const dbs = Tracks.find({
      name: {
        $in: trackNames
      } 
    },{
      fields: {
        blastdbs: 1
      }
    }).map(track => { 
      return track.blastdbs[dbType]
    }).join(' ')
    */
   
    const dbs = genomeCollection.find({
      _id: {
        $in: genomeIds
      }
    }).map(genome => {
      return genome.annotationTrack.blastDb[dbType]
    }).join(' ')

    const options = ['-db',dbs,'-outfmt','5','-num_alignments','20']

    console.log(`${blastType} ${options.join(' ')} ${input.substring(0,3)}...${input.substring(input.length - 3, input.length)}`)

    spawn(blastType, options, input)
      .then( result => {
        console.log('blast finished')
        return xml2js(result.toString())
      })
      .then( resultJson => {
        job.done(resultJson)
        callback()
      })
      .catch( error => {
        console.log(error)
        job.fail({ error })
        callback()
      })
    //job.done(blastResult)
    //callback()
  }
)