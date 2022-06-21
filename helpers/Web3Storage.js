import { Web3Storage} from 'web3.storage';

function getAcessToken() {
    return process.env.WEB3STORAGE_TOKEN
}

export default getAcessToken;