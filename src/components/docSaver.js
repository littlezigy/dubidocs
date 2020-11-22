import { SkynetClient, genKeyPairFromSeed } from "skynet-js";
import axios from 'axios';
const portal = 'https://siasky.net';

const seed = 'ta ta ta dadada. Samurai Jack. watch out!';

import updateDoc from './docUpdate';
import docDiff from './docDiff';

let oldDoc = '';
let patches = [];
let currentPatch = null;

let fileid = 234;
let diffKey = 'diff' + fileid;

const getOldDoc = function() {
    return oldDoc;
}

const parseSkyhex = function(hex) {
	//var hex  = str1.toString();
	var str = '';
	for (var n = 0; n < hex.length; n += 2) {
		str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
	}
	return str;
}

const saveDoc = function(newDoc) {
    const client = new SkynetClient(portal);
    const { privateKey, publicKey } = genKeyPairFromSeed(seed);

    let changes = docDiff(oldDoc, newDoc);

    console.log('NEW DOC', newDoc, '\nOLD DOC', oldDoc);
    // Save resources and reduce load on skydb/other db 
    if(changes == false)
        return new Promise(resolve => resolve(false));

    // Get entry url first
    let skylink = client.registry.getEntryUrl(publicKey, diffKey)
    return axios.get(skylink, {timeout: 3000})
    .catch(err => {
        if(err.message.includes('timeout of') && err.message.includes('exceeded'))
            return;
        else
            throw err;
    })
    .then(res => {
        console.log('PROCEEIDNG TO SAVE');
        let prevDiff = null;

        if(res && res.data && res.data.data) {
            prevDiff = parseSkyhex(res.data.data);
            prevDiff = 'https://siasky.net/' + prevDiff;
        }

        let data = {
            diff: changes,
            ...prevDiff && { prevDiff }
        }

        // console.debug(privateKey, diffKey, data);

        return client.db.setJSON(privateKey, diffKey, data)
    }).then(res => {
        if(!res || res == undefined)
            // Save resources and reduce load on skydb/other db 
            return true;
        else throw new Error('Error saving document');
    });
}

const fetchPatches = function( payload ) {
    console.log('FETCHING PATCHES', payload);
    if(payload.diff) {
        // Latest patch is fetched first.
        if( currentPatch && (payload.prevDiff === currentPatch.prevDiff) )
            console.log('NO NEED TO fetch');
        else {
            // If current patch is the first diff, it won't have property prevDiff
            // if(currentPatch && currentPatch.prevDiff)
            console.log('WHY AR YPU PUSING\nCurrent patch:', currentPatch, '\nfetched patch:', payload);
                patches.push(payload);

            if(payload.prevDiff) {
                return axios.get(payload.prevDiff)
                .then(res => {
                    return fetchPatches(res.data);
                });
            } else {
                return patches;
            }
        }
    }
}

const fetchUpdates = function() {
    const client = new SkynetClient(portal);
    const { publicKey } = genKeyPairFromSeed(seed);

    return client.db.getJSON(publicKey, diffKey)
    .then(res => {
        console.log('FN', res);

        if(res && res.data)
            return fetchPatches(res.data)
        else
            return null;
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
    console.log('===================================================\nSYNCING...\n', newDoc);
    return fetchUpdates()
    .then(res => {
        console.log('FETCHED UPDATES', res);
        if(res)
            oldDoc = updateDoc(res, '');
        else {
            console.log('No new Updates from collaborators.', res);
            //Push local changes now.

            return saveDoc(newDoc)
            .then(res => {
                console.log('SAVE RES', res);
                oldDoc = newDoc;
            });
        }

        refreshLoading = false;
    });
}

export { refresh, saveDoc, getOldDoc, syncDoc }

// const docFn = { refresh, saveDoc }

// export { docFn as default }
