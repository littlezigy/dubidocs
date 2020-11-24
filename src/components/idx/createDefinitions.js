const { createDefinition, publishSchema } = require('@ceramicstudio/idx-tools');
const Ceramic = require('@ceramicnetwork/ceramic-http-client').default
const Wallet = require('identity-wallet').default;
const fromString = require('uint8arrays/from-string');
import { appDefinitions } from  './definitions';
const { dubiProfile } = appDefinitions;

export default function() {
    console.log('SETTING UPD DEFI');
    console.log(process.env.VUE_APP_SEED, '<----- SEED');
    const ceramic = new Ceramic('https://ceramic.3boxlabs.com');

    let config = {
        definitions: { },
        schemas: { },
    }


    return Wallet.create({
        ceramic,
        seed: fromString(process.env.VUE_APP_SEED, 'base16'),
        getPermission() {
            return Promise.resolve([])
        },
        disableIDX: true
    })
    .then(wallet => {
        return ceramic.setDIDProvider(wallet.getDidProvider());
    })
    .then(() => {
        return Promise.all([
            publishSchema(ceramic, { content: dubiProfile })
        ]);
    }).then(res => {
        const [ dubiProfileSchemaID ] = res;

        config.schemas.DubiProfile =  dubiProfileSchemaID.toUrl('base36');

        return createDefinition(ceramic, {
            name: 'dubiProfile',
            description: 'User profile for Dubidocs',
            schema: dubiProfileSchemaID.toUrl('base36')
        });
    })
    .then(dubiProfileID => {
        console.log('DUBI PROIFLED ID', dubiProfileID);

        config.definitions.dubiProfile = dubiProfileID.toString();

        console.log('CONFIG', config);
    });
}
