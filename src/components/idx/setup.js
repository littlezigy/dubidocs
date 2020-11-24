import { IDXWeb } from '@ceramicstudio/idx-web';
import Ceramic from '@ceramicnetwork/ceramic-core'
import { ThreeIdConnect, EthereumAuthProvider } from '3id-connect'
import IPFS from 'ipfs';


const IDX = IDXWeb;
// Import definitions created during development or build time
// import { appDefinitions } from './definitions'
import { definitions } from './config.json';

export default function() {
    const threeIdConnect = new ThreeIdConnect()

    return window.ethereum.enable()
    .then(addresses => {
        const authProvider = new EthereumAuthProvider(window.ethereum, addresses[0])
        return threeIdConnect.connect(authProvider)
    })
    .then(async () => {

        const didProvider = await threeIdConnect.getDidProvider()

        const ipfs = await IPFS.create()
        return Ceramic.create(ipfs, { didProvider })
    })
    .then(ceramic => {
    
        const idx = new IDX({ ceramic, definitions })

        return { idx, ceramic };
    });
//    const didProvider = await threeIdConnect.getDidProvider()


    // const dubiseed = 'nonono';
    // return idx.set('dubidocProfile', { nickname: 'Alice', dubiSeed })
}
