import { SkynetClient } from "skynet-js";
import axios from 'axios';
const portal = 'https://siasky.net';

import docDiff from './docDiff';

import db from './skydbKeys';

let refresh = 0;
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

const saveDoc = function(oldDoc, newDoc, publicKey, privateKey) {
    const client = new SkynetClient(portal);

    let prevDiff = null;

    let patch = {};
    let changes = docDiff(oldDoc, newDoc);
    if(changes == false)
        return new Promise(resolve => resolve(false));

    console.log('PROCEEIDNG TO SAVE');

    return client.registry.getEntry(publicKey, db.diff)
    .then(res => {
        let dbEntrySkylink = res.entry.data;;

        prevDiff = parseSkyhex(dbEntrySkylink);
        prevDiff = 'https://siasky.net/' + prevDiff;

        return axios.get(portal + '/' + dbEntrySkylink, { timeout: 3000 })
    })
    .then(res => {
        let saveCounter = 0;
        if(res.data.diff)
            saveCounter = res.data.diff.length;

        patch = res.data;

        if( (!res.data.state && res.data.state != '')
                        ||
            (saveCounter > SAVES_PER_CHECKPOINT) )
        {
            patch.state = newDoc;
            patch.prevDiff = prevDiff;
        } else {
            let oldDiffs = res.data.diff || [];
            patch.diff = [ ...oldDiffs, changes ];
        }

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
            return saveDoc(oldDoc, newDoc, publicKey, privateKey)
        }
        else throw new Error('Error Saving Document');

    });
}

export default saveDoc;
