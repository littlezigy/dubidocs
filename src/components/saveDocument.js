import { SkynetClient } from "skynet-js";
import axios from 'axios';
const portal = 'https://siasky.net';

import docDiff from './docDiff';

import db from './skydbKeys';

let saveCounter = 0;
const SAVES_PER_CHECKPOINT = 5

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
    let patch;

    console.log('NEW DOC', newDoc, '\nOLD DOC', oldDoc);
    // Save resources and reduce load on skydb/other db 
    if(changes == false)
        return new Promise(resolve => resolve(false));

    // Get entry url first
    let skylink = client.registry.getEntryUrl(publicKey, db.diff)
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

        // Save file state every 5 saves.
        let state;

        if(saveCounter >= SAVES_PER_CHECKPOINT) {
            state = newDoc;
            saveCounter = 0;
        }

        patch = {
            diff: changes,
            ...prevDiff && { prevDiff },
            ...state && { state }
        }

        return client.db.setJSON(privateKey, db.diff, patch)
    }).then(res => {
        saveCounter++;

        if(!res || res == undefined)
            // Save resources and reduce load on skydb/other db 
            return patch;
        else throw new Error('Error saving document');
    });
}

