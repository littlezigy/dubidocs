import { SkynetClient, genKeyPairFromSeed } from "skynet-js";
import dbKeys from './skydbKeys.json';
const db = dbKeys;

var randomstring = require("randomstring");

export const createDocument = function(userSeed) {
    const portal = window.localStorage.getItem('portal');
    const client = new SkynetClient(portal);
    const { privateKey, publicKey } = genKeyPairFromSeed(userSeed);

    // Add new doc to user's documents;
    return client.db.getJSON(publicKey, dbKeys.userDocs)
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
            privateKey: docPrivateKey, publicKey: docPublicKey
        }

        return client.db.setJSON(privateKey, db.diff, {
            state: ''
        })
        .then(() =>  newDocRef )
    });
}
