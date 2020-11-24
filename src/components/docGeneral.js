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
        console.log('FOUND ONE WIHTH A STATE', payload.state);
        oldDoc = payload.state;
        console.log('PATCHES', patches);
        return patches;
    }

    if(payload.diff) {
        // Latest patch is fetched first.
        console.log('CURRENT PATCH', currentPatch);
        console.log('PREVIOUS PATCH', payload);
        if( currentPatch && (payload.prevDiff === currentPatch.prevDiff) ) {
            console.log('NO NEED TO fetch');
            return newPatches;
        } else {
            // If current patch is the first diff, it won't have property prevDiff
            // if(currentPatch && currentPatch.prevDiff)
            console.log('WHY AR YPU PUSING\nCurrent patch:', currentPatch, '\nfetched patch:', payload);
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

    console.log('DO ID', docID);

    return this.refresh();
}

const fetchUpdates = function() {
    const client = new SkynetClient(portal);

    return client.db.getJSON(publicKey, db.doc)
    .then(res => {
        console.log('FN', res);

        if(res && res.data)
            return fetchPatches(res.data)
        else
            throw new Error('Error fetching updates');
    });
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
            let docUpdateRes = oldDoc = updateDoc(res, oldDoc);
            oldDoc = docUpdateRes.updatedDoc;
            currentPatch = docUpdateRes.currentPatch;
        }

        refreshLoading = false;
        return oldDoc;
    });
}

const syncDoc = function(newDoc) {
    newPatches = [];
    console.log('PATCHES TO APPLY', newPatches);
    console.log('PATCH LOG', patches);
    return fetchUpdates()
    .then(res => {
        console.log('FETCHED UPDATES', res);
        if(res && res.length > 0) {
            console.log('OLD DOC', oldDoc);
            console.log('New updates', res);
            let docUpdateRes = oldDoc = updateDoc(res, oldDoc);
            console.log('DOC UPDATED', docUpdateRes);
            oldDoc = docUpdateRes.updatedDoc;
            console.log('OLD DOC', oldDoc);
            currentPatch = docUpdateRes.currentPatch;
            console.log('CURRENT PATCH ', currentPatch);
            refreshLoading = false;
            return oldDoc;
        } else {
            console.log('No new Updates from collaborators.', res);
            console.log('NEW CHANGES', oldDoc, newDoc);
            //Push local changes now.

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
            });
        }
    });
}

export { refresh, saveDoc, syncDoc, initialize }
