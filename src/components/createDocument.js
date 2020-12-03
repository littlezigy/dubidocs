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
                resolve({});
            }
           else resolve(response);
        });
    });
}

export const createDocument = function(skyid, fileContents = '', title = 'Untitled Document') {
    const portal = window.localStorage.getItem('portal');
    const client = new SkynetClient(portal);

    let storedDocs = window.localStorage.getItem('docList');
    storedDocs = JSON.parse(storedDocs);

    console.log('STORED DOCS', storedDocs);

    // Add new doc to user's documents;
    return skyidFetch(skyid, db.userDocs)
    .then(res => {
        let docs = res || {};

        // Migrate old docs
        // If even one key is the same in localStorage docList as in  stoed docs on skyid, no need to migrate

        let similarKeys = [];

        let oldDocKeys = Object.keys(storedDocs);
        let docKeys = Object.keys(docs);
        console.log({ oldDocKeys, docKeys });

        for(let i = 0; i < oldDocKeys.length; i++) {
            console.log('I', i);
            if(oldDocKeys[i] == docKeys[i]) {
                console.log('Comparing keys and they are same');
                similarKeys.push(oldDocKeys[i]);
            }
        }

        if(similarKeys.length < 1 ) {
            console.log('Migrating documents...');
            docs = { ...docs, ...storedDocs };
        } else
            console.log('No need for migration')

        // End migration

        console.log('DOCS obj', docs);

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

            // Save the first entry in the doc's diff db
            return client.db.setJSON(docPrivateKey, db.diff, {
                state: fileContents,
                title
            })
        })
        .then(() => {
            return { id: newDocRef, doc: docs[newDocRef] }
        })
    });
}
