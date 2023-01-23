#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = require("commander");
var lodash = require("lodash");
require("source-map-support/register");
var exportCollection = require("./exportCollection");
var firebase_init_1 = require("./firebase_init");
var importCollection = require("./importCollection");
var program = new commander_1.Command();
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
    .action(function (fileName, collections, options) {
    var app = (0, firebase_init_1.initFirebaseApp)();
    return importCollection.execute(app, fileName, collections, options);
});
program.command('export <file> [collections...]')
    .alias('e')
    .description('Export Firestore collection(s) to a JSON/XLSX/CSV file')
    .option('-n, --no-subcolls', 'Do not export sub-collections.')
    .option('-p, --coll-prefix [prefix]', 'Collection prefix', 'collection')
    .option('-i, --id-field [id]', 'Field name to use for document IDs', 'doc_id')
    .option('-v, --verbose', 'Output traversed document paths')
    .action(function (file, collections, options) {
    var app = (0, firebase_init_1.initFirebaseApp)();
    return exportCollection.execute(app, file, collections, options);
});
program.parseAsync();
// Some option helper functions
function parseChunk(value, previous) {
    return lodash.clamp(previous, 1, 500);
}
//# sourceMappingURL=index.js.map