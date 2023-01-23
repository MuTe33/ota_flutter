#!/usr/bin/env node

import { Command } from 'commander';
import * as lodash from 'lodash';
import 'source-map-support/register';
import * as exportCollection from './exportCollection';
import { initFirebaseApp } from './firebase_init';
import * as importCollection from './importCollection';

const program = new Command();
program.version('0.5.0');

program.command('import <file>')
    .alias('i')
    .arguments('[collections...]')
    .option('-i, --id [field]', 'Field to use for Document IDs.', 'doc_id')
    .option('-a, --auto-id [str]', 'Document ID token specifying auto generated Document ID.', 'Auto-ID')
    .option('-m, --merge', 'Merge Firestore documents. Default is Replace.')
    .option('-k, --chunk [size]', 'Split upload into batches. Max 500 by Firestore constraints.', parseChunk, 500)
    .option('-p, --coll-prefix [prefix]', '(Sub-)Collection prefix.', 'collection')
    .option('-s, --sheet [#]', 'Single mode XLSX Sheet # to import.')
    .option('-T, --truncate', 'Delete all documents from target collections before import.')
    .option('-d, --dry-run', 'Perform a dry run, without committing data. Implies --verbose.')
    .option('-v, --verbose', 'Output document insert paths')
    .action((fileName, collections, options) => {
        let app = initFirebaseApp()

        return importCollection.execute(app, fileName, collections, options);
    });

program.command('export <file> [collections...]')
    .alias('e')
    .description('Export Firestore collection(s) to a JSON/XLSX/CSV file')
    .option('-n, --no-subcolls', 'Do not export sub-collections.')
    .option('-p, --coll-prefix [prefix]', 'Collection prefix', 'collection')
    .option('-i, --id-field [id]', 'Field name to use for document IDs', 'doc_id')
    .option('-v, --verbose', 'Output traversed document paths')
    .action((file, collections, options) => {
        let app = initFirebaseApp()

        return exportCollection.execute(app, file, collections, options);
    });


program.parseAsync();

// Some option helper functions
function parseChunk(value: string, previous: number) {
    return lodash.clamp(previous, 1, 500);
}