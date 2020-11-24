// import { definitions } from '@ceramicstudio/idx-constants'

const dubiProfile = {
    "type": "object",
    "$schema": "http://json-schema.org/draft-07/schema#",
    "required": [
        'nickname',
        'dubidocSeed'
    ],
    "properties": {
        nickname: {
            type: 'string',
            maxLength: 15,
        }, 
        dubidocSeed: {
            type: 'string'
        }
    },
    additionalProperties: false
}

export const appDefinitions = {
  dubiProfile
}
