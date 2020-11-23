import setup from './setup';

const connect = function() {
    console.log('RUNNING CONNECT');
    return setup()
    .then(res => {
        console.log('IDX CONNECTED', res);
        return res;
    });
}

export default connect;
