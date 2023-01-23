"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = void 0;
var dot = require("dot-object");
var fs = require("fs-extra");
var lodash = require("lodash");
var XLSX = require("xlsx");
var shared_1 = require("./shared");
var db;
var batch;
var batchCount = 0;
var totalSetCount = 0;
var totalDelCount = 0;
var args;
var delPaths = [];
var execute = function (app, file, collections, options) { return __awaiter(void 0, void 0, void 0, function () {
    var data, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                db = app.firestore();
                batch = db.batch();
                args = options;
                if (args.dryRun)
                    args.verbose = true;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 11, , 12]);
                if (collections.length === 0) {
                    // root if no paths
                    collections = ['/'];
                }
                else {
                    // clean all collection paths
                    collections.map(shared_1.cleanCollectionPath);
                    // root overrides all other selections
                    if (collections.includes('/')) {
                        collections = ['/'];
                    }
                }
                data = {};
                if (!file.endsWith(".json")) return [3 /*break*/, 3];
                return [4 /*yield*/, readJSON(file, collections)];
            case 2:
                data = _a.sent();
                return [3 /*break*/, 8];
            case 3:
                if (!file.endsWith('.xlsx')) return [3 /*break*/, 5];
                return [4 /*yield*/, readXLSXBook(file, collections)];
            case 4:
                data = _a.sent();
                return [3 /*break*/, 8];
            case 5:
                if (!file.endsWith(".csv")) return [3 /*break*/, 7];
                return [4 /*yield*/, readCSV(file, collections)];
            case 6:
                data = _a.sent();
                return [3 /*break*/, 8];
            case 7: throw "Unknown file extension. Supports .json, .csv or .xlsx!";
            case 8: return [4 /*yield*/, writeCollections(data)];
            case 9:
                _a.sent();
                // Final Batch commit and completion message.
                return [4 /*yield*/, batchCommit(false)];
            case 10:
                // Final Batch commit and completion message.
                _a.sent();
                console.log(args.dryRun
                    ? 'Dry-Run complete, Firestore was not updated.'
                    : 'Import success, Firestore updated!');
                args.truncate && console.log("Total documents deleted: ".concat(totalDelCount));
                console.log("Total documents written: ".concat(totalSetCount));
                return [3 /*break*/, 12];
            case 11:
                error_1 = _a.sent();
                console.log("Import failed: ", error_1);
                return [3 /*break*/, 12];
            case 12: return [2 /*return*/];
        }
    });
}); };
exports.execute = execute;
// Firestore Write/Batch Handlers
function batchDel(ref) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Log if requested
                    args.verbose && console.log("Deleting: ".concat(ref.path));
                    // Mark for batch delete
                    ++totalDelCount;
                    batch.delete(ref);
                    if (!(++batchCount % args.chunk === 0)) return [3 /*break*/, 2];
                    return [4 /*yield*/, batchCommit()];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
function batchSet(ref, item, options) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Log if requested
                    args.verbose && console.log("Writing: ".concat(ref.path));
                    // Set the Document Data
                    ++totalSetCount;
                    batch.set(ref, item, options);
                    if (!(++batchCount % args.chunk === 0)) return [3 /*break*/, 2];
                    return [4 /*yield*/, batchCommit()];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
function batchCommit(recycle) {
    if (recycle === void 0) { recycle = true; }
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Nothing to commit
                    if (!batchCount)
                        return [2 /*return*/];
                    // Don't commit on Dry Run
                    if (args.dryRun)
                        return [2 /*return*/];
                    // Log if requested
                    args.verbose && console.log('Committing write batch...');
                    // Commit batch
                    return [4 /*yield*/, batch.commit()];
                case 1:
                    // Commit batch
                    _a.sent();
                    // Get a new batch
                    if (recycle) {
                        batch = db.batch();
                        batchCount = 0;
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function writeCollections(data) {
    var promises = [];
    lodash.forEach(data, function (documents, collection) {
        promises.push(writeCollection(documents, collection));
    });
    return Promise.all(promises);
}
function writeCollection(data, path) {
    var _this = this;
    return new Promise(function (resolve, _) { return __awaiter(_this, void 0, void 0, function () {
        var colRef, mode, _i, _a, _b, id, item, subColKeys, _c, subColKeys_1, key, subPath, docRef;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    colRef = db.collection(path);
                    if (!args.truncate) return [3 /*break*/, 2];
                    return [4 /*yield*/, truncateCollection(colRef)];
                case 1:
                    _d.sent();
                    _d.label = 2;
                case 2:
                    mode = (data instanceof Array) ? 'array' : 'object';
                    _i = 0, _a = Object.entries(data);
                    _d.label = 3;
                case 3:
                    if (!(_i < _a.length)) return [3 /*break*/, 10];
                    _b = _a[_i], id = _b[0], item = _b[1];
                    // doc-id preference: object key, invoked --id field, auto-id
                    if (mode === 'array') {
                        id = args.autoId;
                    }
                    if (lodash.hasIn(item, args.id)) {
                        id = item[args.id].toString();
                        delete (item[args.id]);
                    }
                    if (!id || (id.toLowerCase() === args.autoId.toLowerCase())) {
                        id = colRef.doc().id;
                    }
                    subColKeys = Object.keys(item).filter(function (k) { return k.startsWith(args.collPrefix + ':'); });
                    _c = 0, subColKeys_1 = subColKeys;
                    _d.label = 4;
                case 4:
                    if (!(_c < subColKeys_1.length)) return [3 /*break*/, 7];
                    key = subColKeys_1[_c];
                    subPath = [path, id, key.slice(args.collPrefix.length + 1)].join('/');
                    return [4 /*yield*/, writeCollection(item[key], subPath)];
                case 5:
                    _d.sent();
                    delete item[key];
                    _d.label = 6;
                case 6:
                    _c++;
                    return [3 /*break*/, 4];
                case 7:
                    (0, shared_1.encodeDoc)(item);
                    docRef = colRef.doc(id);
                    return [4 /*yield*/, batchSet(docRef, item, { merge: !!(args.merge) })];
                case 8:
                    _d.sent();
                    _d.label = 9;
                case 9:
                    _i++;
                    return [3 /*break*/, 3];
                case 10:
                    resolve(null);
                    return [2 /*return*/];
            }
        });
    }); });
}
function truncateCollection(colRef) {
    return __awaiter(this, void 0, void 0, function () {
        var path;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    path = colRef.path;
                    if (delPaths.includes(path)) {
                        // Collection Path already processed
                        return [2 /*return*/];
                    }
                    delPaths.push(path);
                    return [4 /*yield*/, colRef.get().then(function (snap) { return __awaiter(_this, void 0, void 0, function () {
                            var _i, _a, doc, subCollPaths, _b, subCollPaths_1, subColRef;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        _i = 0, _a = snap.docs;
                                        _c.label = 1;
                                    case 1:
                                        if (!(_i < _a.length)) return [3 /*break*/, 9];
                                        doc = _a[_i];
                                        return [4 /*yield*/, doc.ref.listCollections()];
                                    case 2:
                                        subCollPaths = _c.sent();
                                        _b = 0, subCollPaths_1 = subCollPaths;
                                        _c.label = 3;
                                    case 3:
                                        if (!(_b < subCollPaths_1.length)) return [3 /*break*/, 6];
                                        subColRef = subCollPaths_1[_b];
                                        return [4 /*yield*/, truncateCollection(subColRef)];
                                    case 4:
                                        _c.sent();
                                        _c.label = 5;
                                    case 5:
                                        _b++;
                                        return [3 /*break*/, 3];
                                    case 6: 
                                    // mark doc for deletion
                                    return [4 /*yield*/, batchDel(doc.ref)];
                                    case 7:
                                        // mark doc for deletion
                                        _c.sent();
                                        _c.label = 8;
                                    case 8:
                                        _i++;
                                        return [3 /*break*/, 1];
                                    case 9: return [2 /*return*/];
                                }
                            });
                        }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// File Handling Helpers
function dataFromJSON(json) {
    lodash.forEach(json, function (row) {
        dot.object(row);
    });
    return json;
}
function dataFromSheet(sheet) {
    var json = XLSX.utils.sheet_to_json(sheet);
    return dataFromJSON(json);
}
function JSONfromCSV(file) {
    var book = XLSX.readFile(file);
    var sheet = book.Sheets['Sheet1'];
    return XLSX.utils.sheet_to_json(sheet);
}
function datafromCSV(file) {
    var json = JSONfromCSV(file);
    return dataFromJSON(json);
}
// File Handlers
function readJSON(path, collections) {
    var _this = this;
    return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
        var json, data, mode, coll, rootJsonCollections, coll;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs.readJSON(path)];
                case 1:
                    json = _a.sent();
                    data = {};
                    mode = (json instanceof Array) ? 'array' : 'object';
                    // Array of Docs, Single Anonymous Collection;
                    if (mode === 'array') {
                        coll = collections[0];
                        if (coll === '/' || collections.length > 1 || (0, shared_1.isDocumentPath)(coll)) {
                            reject('Specify single target collection path for import of JSON array of documents.');
                            return [2 /*return*/];
                        }
                        data[coll] = json;
                        resolve(data);
                        return [2 /*return*/];
                    }
                    rootJsonCollections = Object.keys(json).filter(function (k) { return k.startsWith(args.collPrefix + ':'); });
                    // Docs of Keyed Objects, Single Anonymous Collection;
                    if (rootJsonCollections.length === 0) {
                        coll = collections[0];
                        if (coll === '/' || collections.length > 1 || (0, shared_1.isDocumentPath)(coll)) {
                            reject('Specify single target collection path for import of JSON keyed object documents.');
                            return [2 /*return*/];
                        }
                        data[collections[0]] = json;
                        resolve(data);
                        return [2 /*return*/];
                    }
                    // Selected Collections;
                    if (collections[0] !== '/') {
                        collections.forEach(function (collection) {
                            if ((0, shared_1.isDocumentPath)(collection)) {
                                console.log('ISDOC');
                                reject("Invalid collection path: ".concat(collection));
                                return;
                            }
                            var labelledPath = collection.split('/').map(function (segment, index) {
                                return (index % 2 === 0) ? args.collPrefix + ':' + segment : segment;
                            }).join('.');
                            var coll = dot.pick(labelledPath, json);
                            if (!coll) {
                                reject("Source JSON file contains no collection named: ".concat(collection));
                                return;
                            }
                            data[collection] = coll;
                        });
                        resolve(data);
                        return [2 /*return*/];
                    }
                    // All Collections from JSON file
                    if (collections[0] === '/') {
                        rootJsonCollections.forEach(function (coll) {
                            var path = coll.substring(args.collPrefix.length + 1);
                            data[path] = json[coll];
                        });
                        resolve(data);
                        return [2 /*return*/];
                    }
                    // Import options exhausted
                    reject("Invalid import options");
                    return [2 /*return*/];
            }
        });
    }); });
}
function readCSV(file, collections) {
    return new Promise(function (resolve, reject) {
        var data = {};
        // Single Mode CSV, single collection
        if (!file.endsWith('INDEX.csv')) {
            args.verbose && console.log("Mode: Single CSV Collection");
            if (collections.length > 1) {
                reject('Multiple collection import from CSV requires an *.INDEX.csv file.');
                return;
            }
            var collection = collections[0];
            if (collection === '/') {
                reject('Specify a collection for single mode CSV import.');
                return;
            }
            data[collection] = datafromCSV(file);
            resolve(data);
            return;
        }
        var index = JSONfromCSV(file);
        // Indexed Mode CSV, selected collections and sub-cols
        if (collections[0] !== '/') {
            args.verbose && console.log("Mode: Selected collections from Indexed CSV");
            collections.forEach(function (collection) {
                var colls = index.filter(function (coll) { return (coll['Collection'] + '/').startsWith(collection + '/'); });
                if (colls.length) {
                    colls.forEach(function (coll) {
                        var colPath = coll['Collection'];
                        var sheetName = coll['Sheet Name'];
                        var fileParts = file.split('.');
                        fileParts.splice(-2, 1, sheetName);
                        var fileName = fileParts.join('.');
                        data[colPath] = datafromCSV(fileName);
                    });
                }
                else {
                    reject("INDEX contains no paths matching: ".concat(collection));
                    return;
                }
            });
            resolve(data);
            return;
        }
        // Indexed Mode CSV, all collections
        if (collections[0] === '/') {
            args.verbose && console.log("Mode: All collections from Indexed CSV");
            lodash.forEach(index, function (coll) {
                var colPath = coll['Collection'];
                var sheetName = coll['Sheet Name'];
                var fileParts = file.split('.');
                fileParts.splice(-2, 1, sheetName);
                var fileName = fileParts.join('.');
                data[colPath] = datafromCSV(fileName);
            });
            resolve(data);
            return;
        }
        // Import options exhausted
        reject("Invalid collections or CSV");
    });
}
function readXLSXBook(path, collections) {
    return new Promise(function (resolve, reject) {
        var book = XLSX.readFile(path);
        var sheetCount = book.SheetNames.length;
        var indexSheet = book.Sheets['INDEX'];
        var data = {};
        var sheetNum = args.sheet;
        if ((sheetCount === 1) && (sheetNum == undefined)) {
            sheetNum = 1;
        }
        // Single Sheet as Collection, typically from Non-Indexed Workbook
        if (sheetNum !== undefined) {
            args.verbose && console.log("Mode: Single XLSX Sheet #".concat(sheetNum));
            var collection = collections[0];
            if ((0, shared_1.isDocumentPath)(collection)) {
                reject("Invalid collection path for single collection: ".concat(collection));
                return;
            }
            var sheetName = book.SheetNames[+sheetNum - 1];
            var sheet = book.Sheets[sheetName];
            if (!sheet) {
                reject("Sheet #".concat(sheetNum, " not found in workbook"));
                return;
            }
            data[collection] = dataFromSheet(sheet);
            resolve(data);
            return;
        }
        var index = XLSX.utils.sheet_to_json(indexSheet);
        // Selected Collections and Sub Colls from Indexed Workbook
        if (collections[0] !== '/') {
            args.verbose && console.log('Mode: Selected Sheets from indexed XLSX Workbook');
            collections.forEach(function (collection) {
                var colls = index.filter(function (coll) { return (coll['Collection'] + '/').startsWith(collection + '/'); });
                if (colls.length) {
                    colls.forEach(function (coll) {
                        var colPath = coll['Collection'];
                        var sheetName = coll['Sheet Name'];
                        var sheet = book.Sheets[sheetName];
                        data[colPath] = dataFromSheet(sheet);
                    });
                }
                else {
                    reject("INDEX contains no paths matching: ".concat(collection));
                    return;
                }
            });
            resolve(data);
            return;
        }
        // All Collections from Indexed Workbook
        if (collections[0] === '/') {
            args.verbose && console.log('Mode: All Sheets from indexed XLSX Workbook');
            var collection_1 = collections[0];
            lodash.forEach(index, function (coll) {
                var sheetName = coll['Sheet Name'];
                var path = (0, shared_1.cleanCollectionPath)([collection_1, coll['Collection']]);
                var sheet = book.Sheets[sheetName];
                data[path] = dataFromSheet(sheet);
            });
            resolve(data);
            return;
        }
        // Import options exhausted
        reject("Invalid collections");
    });
}
//# sourceMappingURL=importCollection.js.map