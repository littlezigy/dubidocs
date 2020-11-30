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
export const fetchAllDocuments = function(skyid) {
    let docs;
    let promiseWrapper = function(skyid) {
        return new Promise((resolve, reject) => {
            skyid.getJSON(db.userDocs, function(response) {
                console.log('FETCHING DOCS', response);
                if(response == false) {
                    console.log('Failed to fetch documents');
                    docs = [];
                } else {
                    docs = response;
                    console.log({ docs });
                }

                console.log('GOTTEN DOCS', docs);
                return resolve(docs);
            });
        });
    }

    return promiseWrapper(skyid);
}

export const fetchDocument = function() {
    return fetchDocKeys()
}
