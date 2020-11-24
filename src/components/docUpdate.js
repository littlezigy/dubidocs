import * as diff from 'diff';

export default function(patches, oldDoc) {
    console.log('UPDATING DOC WITH PATCHESSTARTING FROM LAST', patches);
    console.log('UPDATING DOC WITH ', oldDoc);
    console.log('UPDATING DOC WITH ', typeof oldDoc);
    let currentPatch = null;
    if( !Array.isArray(patches) )
        patches = [ patches ];

    let newDoc = '';

    patches.forEach(patch => {
        console.log('PATCH APPLICATION', newDoc);
        let parsedPatch = diff.parsePatch(patch);
        let prevDoc = newDoc || oldDoc;

        let update = diff.applyPatch(prevDoc, parsedPatch);

        if(update == false)
            console.log('IGNORING PATCH', update);
            // return;
        else {
            console.log('APPLYING PATCH', update);
            newDoc = update;
            currentPatch = patch;
        }
            // throw new Error("Couldn't apply patch");
    });

    console.log('WE GOOD', newDoc);

    return { newDoc,  currentPatch };
}

