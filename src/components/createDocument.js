import { SkynetClient, genKeyPairFromSeed } from "skynet-js";
import dbKeys from './skydbKeys.json';
const db = dbKeys;

var randomstring = require("randomstring");

const skyidSave = function(skyid, dbKey, data) {
    return new Promise((resolve, reject) => {
        skyid.setJSON(dbKey, data, function(response) {
            if(response != true) {
                console.error('Failed to save data to SkyID');
                reject();
            } else resolve(response);
        })
    });
}

const skyidFetch = function(skyid, dbKey) {
    return new Promise((resolve, reject) => {
        skyid.getJSON(dbKey, function(response) {
            if(response == false) {
                console.log('Failed to fetch data from skyid');
            }
           else resolve(response);
        });
    });
}

export const createDocument = function(skyid, fileContents = '', title = 'Untitled Document') {
    const portal = window.localStorage.getItem('portal');
    const client = new SkynetClient(portal);
    const { privateKey, publicKey } = genKeyPairFromSeed(userSeed);

    // Add new doc to user's documents;
    return skyidFetch(skyid, db.userDocs)
    .then(res => {
        console.log('USER DOCS', res);

        let docs = {};

        if(res && res.data)
            docs = res.data;

        let newDocSeed = randomstring.generate();
        let newDocRef = 'a' + randomstring.generate(5);

        const docPrivateKey = genKeyPairFromSeed(newDocSeed).privateKey;
        const docPublicKey = genKeyPairFromSeed(newDocSeed).publicKey;

        docs[newDocRef] = {
            privateKey: docPrivateKey, publicKey: docPublicKey,
            created: new Date()
        }

        console.log('DOCS', docs);

        // Save the document['s keys] to user's documents
        return skyidSave(skyid, db.userDocs, docs)
        .then(saveRes => {
            console.log('SAVED DOCUMENT TO USERS DOCUMENTS', res);
            return client.db.setJSON(docPrivateKey, db.diff, {
                state: ''
            })
        })
        .then(() => {
            return { id: newDocRef, doc: docs[newDocRef] }
        })
    });
}
