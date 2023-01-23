import * as admin from 'firebase-admin';

export function initFirebaseApp(): admin.app.App {
    return admin.initializeApp(
        {
            credential: admin.credential.cert(getServiceAccount())
        },
        
    )
}

function getServiceAccount() {
    return './credentials.json';
}