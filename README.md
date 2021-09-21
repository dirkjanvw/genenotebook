[![Anaconda-Server Badge](https://anaconda.org/bioconda/genenotebook/badges/version.svg)](https://anaconda.org/bioconda/genenotebook)[![Anaconda-Server Badge](https://anaconda.org/bioconda/genenotebook/badges/latest_release_date.svg)](https://anaconda.org/bioconda/genenotebook)[![Anaconda-Server Badge](https://anaconda.org/bioconda/genenotebook/badges/platforms.svg)](https://anaconda.org/bioconda/genenotebook)

![Automated](https://img.shields.io/docker/cloud/automated/genenotebook/genenotebook.svg?style=flat-square&logo=docker)![Build status](https://img.shields.io/docker/cloud/build/genenotebook/genenotebook.svg?style=flat-square&logo=docker)

![CircleCI](https://img.shields.io/circleci/build/github/genenotebook/genenotebook/master?label=Circle%20CI&logo=circleci&style=flat-square)

# GeneNoteBook

**Note**: This is a fork of https://github.com/genenotebook/genenotebook

### A collaborative notebook for comparative genomics

> Full documentation is at http://genenotebook.github.io/

### Install using Conda

```
conda install -c bioconda genenotebook
```

### Start GeneNoteBook

```
genenotebook run
```

Navigate to http://localhost:3000

> :warning: The default admin account is `username: admin` `password: admin`, please change this immediately! :warning:

Add data (for example from testdata.tgz found in this repository)

```
genenotebook add genome -u admin -p admin --port 3000 -n test testdata.fasta
genenotebook add annotation -u admin -p admin --port 3000 -n test testdata.gff3
```
