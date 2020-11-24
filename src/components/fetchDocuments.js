let docSeed;

const checkPermissions = function() {
}

// Fetches all documents
export default function() {
    if(!docSeed)
        docSeed = window.localStorage.getItem('docID');
    console.log('DOC SED', docSeed);
}
