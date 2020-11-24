import setup from './setup';
import fetchProfile from './fetchProfile';

const connect = function() {
    return setup()
    .then(res => {
        const { ceramic } = res;
        console.log('IDX CONNECTED', res);
        return fetchProfile(ceramic)
    })
}

export default connect;
