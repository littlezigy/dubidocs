import { IDX } from '@ceramicstudio/idx'
import Ceramic from '@ceramicnetwork/ceramic-core'
import { ThreeIdConnect, EthereumAuthProvider } from '3id-connect'
import IPFS from 'ipfs';

// Import definitions created during development or build time
import { appDefinitions } from './definitions'

export default function() {
    console.log('YAY');
    const threeIdConnect = new ThreeIdConnect()

    return window.ethereum.enable()
    .then(addresses => {
        const authProvider = new EthereumAuthProvider(window.ethereum, addresses[0])
        return threeIdConnect.connect(authProvider)
    })
    .then(async res => {

        console.log('RES******************', res);
        const didProvider = await threeIdConnect.getDidProvider()

        const ipfs = await IPFS.create()
        return Ceramic.create(ipfs, { didProvider })
    })
    .then(ceramic => {
        console.log('CERMAIC', ceramic);
    
        const idx = new IDX({ ceramic, definitions: appDefinitions })
        console.log('IDX', idx);

        return idx.did;
    });
//    const didProvider = await threeIdConnect.getDidProvider()


    // const dubiseed = 'nonono';
    // return idx.set('dubidocProfile', { nickname: 'Alice', dubiSeed })
}
