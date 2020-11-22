import * as diff from 'diff';

const docDiff = function(oldDoc, newDoc) {
    // NO need to create a diff if old file = new file.
    if(oldDoc === newDoc)
        return false;

    else {
        let patch = diff.createPatch('boon', oldDoc, newDoc);
        if(patch == false)
            throw new Error("Couldn't create patch");
        return patch;
    }
}

export default docDiff;
