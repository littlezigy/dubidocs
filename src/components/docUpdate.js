import * as diff from 'diff';

export default function(patches, oldDoc) {
    // console.log('UPDATING DOC WITH PATCHESSTARTING FROM LAST', patches);
    let currentPatch = null;
    if( !Array.isArray(patches) )
        patches = [ patches ];

    let updatedDoc; 
    patches.slice().reverse().forEach(patch => {
        let parsedPatch = diff.parsePatch(patch.diff);
        let prevDoc = updatedDoc || oldDoc;

        let update = diff.applyPatch(prevDoc, parsedPatch);

        if(update == false)
            return;
        else {
            updatedDoc = update;
            currentPatch = patch;
        }
            // throw new Error("Couldn't apply patch");
    });

    return { updatedDoc,  currentPatch };
}

