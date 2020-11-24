import { SkynetClient } from "skynet-js";
import axios from 'axios';
const portal = 'https://siasky.net';

import updateDoc from './docUpdate';
import saveDoc from './saveDocument';

let privateKey, publicKey, docID;

let oldDoc = '';
let patches = [];
let newPatches = [];
let currentPatch = null;

import db from './skydbKeys';

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

    return syncDoc('');
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
    } else if(data.state || data.state != undefined)
        state = data.state;
    else throw new Error('Diff and state missing');

    let updated  = updateDoc(diffs, state);
    console.log('UDPATED', updated);
    return updated;
}

let refreshLoading = false;

const refresh = function() {

    if(refreshLoading == true)
        throw new Error('Loading');

    refreshLoading = true;


    return fetchUpdates()
    .then(res => {
        // console.log('OLD DOC TOBE UPDATED', oldDoc);
        if(res) {
            let docUpdateRes = updateDoc(res, oldDoc);
            console.log('OLDDOC', docUpdateRes);
            if(docUpdateRes.newDoc == undefined ) 
                return oldDoc;
            else
                oldDoc = docUpdateRes.newDoc;
            console.log('CONTINUING', oldDoc);
            if( docUpdateRes.currentPatch )
                currentPatch = docUpdateRes.currentPatch;
        }

        refreshLoading = false;
        return oldDoc;
    });
}

let syncCounter = 0;

const syncDoc = function(newDoc) {
    newPatches = [];
    return fetchUpdates()
    .then(res => {
        if(res === null)
            throw new Error('Failed to fetch updates');

        console.log('OLD DOC', oldDoc);
        console.log('NEW DOC', newDoc);
        let noChange = oldDoc == newDoc;
        let change = !noChange;
        console.log('CHANGEE', change);

        let docUpdateRes = applyPatches(res);

        oldDoc = docUpdateRes.newDoc;

        console.log('DOC UPDATES', docUpdateRes);

        refreshLoading = false;
        console.log('OLD DOC', oldDoc);
        console.log('CHANGEs', change);

        if(change === true) {
            console.log('Moving on to save...');
            return saveDoc(oldDoc, newDoc, publicKey, privateKey)
            .then(res => {
                if(res) {
                    if(res && typeof res === 'object') {
                        console.log('ISAN OBJE');
                        patches.unshift( res );
                    }

                    oldDoc = newDoc;
                }

                refreshLoading = false;
                return oldDoc;
            })
        } else return new Promise(resolve => resolve(oldDoc));
    })
    .catch(err => {
        console.log('SYNC EROR', err);

        if(err.message == 'Failed to fetch updates')
            console.log('SIMPLE  UPDATE FETCH FAIL');
        /*
        syncCounter++;

        if(syncCounter < 5) {
            return syncDoc(newDoc);
        }

        syncCounter = 0;

        */
        throw new Error('Error Syncing Document');
    });
}

export { refresh, saveDoc, syncDoc, initialize }
