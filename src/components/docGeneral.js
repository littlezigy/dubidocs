import { SkynetClient } from "skynet-js";
import axios from 'axios';
const portal = 'https://siasky.net';

import updateDoc from './docUpdate';
import saveDoc from './saveDocument';

import db from './skydbKeys';

let privateKey, publicKey, docID;

let oldDoc = '';
let patches = [];
let newPatches = [];
let currentPatch = null;

let syncCounter = 0;

const MAX_REFRESHES = 5;

const fetchPatches = function( payload ) {
    if(payload.state || payload.state == '') {
        oldDoc = payload.state;
        return patches;
    }

    if(payload.diff) {
        // Latest patch is fetched first.
        if( currentPatch && (payload.prevDiff === currentPatch.prevDiff) ) {
            return newPatches;
        } else {
            // If current patch is the first diff, it won't have property prevDiff
            // if(currentPatch && currentPatch.prevDiff)
            patches.push(payload);
            newPatches.push(payload);

            if(payload.prevDiff) {
                return axios.get(payload.prevDiff)
                .then(res => {
                    return fetchPatches(res.data);
                });
            } else {
                return newPatches;
            }
        }
    }
}

const initialize = function(docKeys, id) {
    privateKey = docKeys.privateKey;
    publicKey = docKeys.publicKey;

    docID = id;

    oldDoc = '';
    patches = [];
    newPatches = []

    return refreshDoc();
}

const fetchUpdates = function() {
    const client = new SkynetClient(portal);

    return client.db.getJSON(publicKey, db.doc)
    .then(res => {

        if(!res || res == null)
            throw new Error('Error fetching data');
        else
            return res.data;
    });
}

const applyPatches = function(data) {
    console.log('DATA TO APPLY PATCH', data);
    let diffs = [];
    let state = '';

    console.log('STATE', data.state);

    // If there is a state, then there can't be a diff. and vice versa
    if( data.diff || data.diff != undefined) {
        diffs = data.diff;
    }
    if(data.state || data.state != undefined)
        state = data.state;

    if(!data.diff && ( !data.state && data.state != '' ) )
        throw new Error('Diff and state missing');

    let updated  = updateDoc(diffs, state);
    console.log('UDPATED', updated);
    return updated;
}

let refreshLoading = false;

const refreshDoc = function(newDoc) {
    return fetchUpdates()
    .then(res => {
        syncCounter = 0;

        if(res === null)
            throw new Error('Failed to fetch updates');

        console.log('PATHCES resss', res);
        let docUpdateRes = applyPatches(res);

        oldDoc = docUpdateRes.newDoc;

        console.log('DOC UPDATES', docUpdateRes);

        refreshLoading = false;

        return oldDoc;
    })
    .catch(err => {
        console.log('SYNC EROR', err);

        syncCounter++;

        console.log('SYNC COUNTER', syncCounter);
        if(syncCounter < MAX_REFRESHES) {
            return refreshDoc();
        }

        syncCounter = 0;
        throw new Error('Error Syncing Document');
    });
}

const saveDocument = function(newDoc) {
    newPatches = [];

    return saveDoc(oldDoc, newDoc, publicKey, privateKey)
    .then(res => {
        if(res) {
            if(res && typeof res === 'object') {
                patches.unshift( res );
            }

            oldDoc = newDoc;
        }

        refreshLoading = false;
        return oldDoc;
    });
}

export { refreshDoc, saveDocument, initialize }
