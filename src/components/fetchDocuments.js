import { SkynetClient, genKeyPairFromSeed } from "skynet-js";
import db from './skydbKeys.json';

// let docKeys;


/*
const checkPermissions = function() {
}
*/

const fetchDocKeys = function() {
    // Get doc id in url
    console.log('doc id i url', this.$store.state.docID);
}

// Fetches all documents
export const fetchAllDocuments = function(user) {
    let portal = window.localStorage.portal;
    const client = new SkynetClient(portal);
    const { publicKey } = genKeyPairFromSeed(user);

    const key = db.userDocs;
    return client.db.getJSON(publicKey, key)
    .then(res => {
        console.log('GOTTEN USER DOCUMENTS', res);
        if(!res)
            return null;
        else return res.data;
    });
}

export const fetchDocument = function() {
    return fetchDocKeys()
}
