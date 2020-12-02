import * as diff from 'diff';

export default function(patches, initialText) {
    let currentPatch = null;

    if( !Array.isArray(patches) )
        patches = [ patches ];

    let newDoc = initialText;

    patches.forEach(patch => {
        let parsedPatch = diff.parsePatch(patch);
        let prevDoc = newDoc;

        console.log('OLDDOC', initialText);

        let update = diff.applyPatch(prevDoc, parsedPatch);

        if(update == false)
            console.log('IGNORING PATCH', update);
        else {
            newDoc = update;
            currentPatch = patch;
        }
    });

    return { newDoc,  currentPatch };
}

