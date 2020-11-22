let selectedCursorColors = [];
const cursorColors = [
    '#ff0006',
    '#00a7ff',
    'blue',
    '#ff0023',
    'purple'
];

const recursiveRandNo = (cursors, counter) => {
    let x  = Math.ceil(Math.random() * (cursorColors.length - 1));

    console.log('Candidate: X', x);
    console.log('SELECTED CURSORS', selectedCursorColors);
    console.log(!selectedCursorColors.includes(x) )
    counter++;
    if(counter >= 10)
        return x;
    if(cursors.length > cursorColors.length || !selectedCursorColors.includes(x) ) {
        selectedCursorColors.push(x);
        console.log('RETURNING X NOW');
        return x;
    }
    else return recursiveRandNo();
}


const randomizeCursorColors = function( cursors ) {
    let counter = 1;
    let randomNumber = recursiveRandNo(cursors, counter);
    return `border-color: ${ cursorColors[randomNumber] }`;
}


export {
    randomizeCursorColors
}
