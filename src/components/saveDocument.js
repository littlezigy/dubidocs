import { SkynetClient } from "skynet-js";
import axios from 'axios';
const portal = 'https://siasky.net';

import docDiff from './docDiff';

import db from './skydbKeys';

let saveCounter = 0;
let refreshes = 0;
const SAVES_PER_CHECKPOINT = 5
const REFRESH_MAX = 5;

const parseSkyhex = function(hex) {
	//var hex  = str1.toString();
	var str = '';
	for (var n = 0; n < hex.length; n += 2) {
		str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
	}
	return str;
}

export default function(oldDoc, newDoc, publicKey, privateKey) {
    const client = new SkynetClient(portal);

    let changes = docDiff(oldDoc, newDoc);
    let patch = {};

    console.log('NEW DOC', newDoc, '\nOLD DOC', oldDoc);
    // Save resources and reduce load on skydb/other db 
    if(changes == false)
        return new Promise(resolve => resolve(false));

    console.log('PROCEEIDNG TO SAVE');

    // let registryUrl = client.registry.getEntryUrl(publicKey, db.diff)
    // return axios.get(registryUrl)
    return client.registry.getEntry(publicKey, db.diff)
    .then(res => {
        console.log('REGISTRY ENTYR', res);
        let dbEntrySkylink = res.entry.data;;
        console.log('DB ENTRY SKYLIKNK', dbEntrySkylink);

        if(saveCounter >= SAVES_PER_CHECKPOINT) {
            prevDiff = parseSkyhex(dbEntrySkylink);
            prevDiff = 'https://siasky.net/' + prevDiff;

            patch.prevDiff = prevDiff;
        }

        return axios.get(portal + '/' + dbEntrySkylink, { timeout: 3000 })
    })
    .then(res => {
        console.log('RES DB', res.data);
        console.log('FETCHED DIFF HISTORY', res.data);
        let prevDiff = null;

        if( Array.isArray(res.data.diff) ) {
            patch.diff = [ ...res.data.diff, changes ];
        } else {
            patch.state = newDoc;
            patch.diff = [ changes ]
        }

        // Save file state every few saves.
        if(saveCounter >= SAVES_PER_CHECKPOINT) {
            patch.state = newDoc;
            saveCounter = 0;
        }

        console.log('PATCH SAVIGN', patch);

        return client.db.setJSON(privateKey, db.diff, patch)
    }).then(res => {


        if(!res || res == undefined)
            return patch;
        else throw new Error('Error saving document');
    })
    .catch(err => {
        console.log('ERRORR WITH SAVE', err);
        if(refresh < REFRESH_MAX) {
            refresh++;
            return saveDocument(oldDoc, newDoc, publicKey, privateKey)
        }
        else throw new Error('Error Saving Document');

    });
}

