"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initFirebaseApp = void 0;
var admin = require("firebase-admin");
function initFirebaseApp() {
    return admin.initializeApp({
        credential: admin.credential.cert(getServiceAccount())
    });
}
exports.initFirebaseApp = initFirebaseApp;
function getServiceAccount() {
    return './credentials.json';
}
//# sourceMappingURL=firebase_init.js.map