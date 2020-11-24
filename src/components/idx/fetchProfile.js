// import { definitions } from '@ceramicstudio/idx-constants'
// import Ceramic from '@ceramicnetwork/ceramic-http-client'
import { IDXWeb } from '@ceramicstudio/idx-web'
import { EthereumAuthProvider } from '3id-connect'
// import Web3Modal from 'web3modal'

import { definitions } from './config.json'

// const CERAMIC_URL = 'https://ceramic.3boxlabs.com' // 'http://localhost:7007'

// const web3modal = new Web3Modal({ network: 'mainnet', cacheProvider: true })

const fetchProfile = function(ceramic) {
    console.log('FETCHING USER PROFILE');

    let ethereumProvider = window.ethereum;

    // const ceramic = new Ceramic(CERAMIC_URL)
    const idx = new IDXWeb({ ceramic, definitions })
    return window.ethereum.enable()
    .then(accounts => {

//     return web3modal.connect()
        console.log('DIDD', idx.did);
        return idx.authenticate({
            authProvider: new EthereumAuthProvider(ethereumProvider, accounts[0]),
        })
    })
    .then(() => {
        return idx.get( 'dubiProfile' )
    })
    .then(profile => {
        console.log('************************************');
        console.log('PROFILE', profile);
        console.log('************************************');
        return profile;
    });
}

export default fetchProfile;
