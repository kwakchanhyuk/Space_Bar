import Caver from 'caver-js';
import { KAS_AUTH, CHAIN_ID } from '../constants';

const option = {
    headers: [
        {
            name: "Authorization",
            value: KAS_AUTH
        },
        { name: "x-chain-id", value: CHAIN_ID }
    ]
}

// klaytn api 연결
const caver = new Caver(new Caver.providers.HttpProvider("https://node-api.klaytnapi.com/v1/klaytn", option));

// balance 가져오기 함수
export const getBalance = (address) => {
    // caver.rpc.klay.getBalance(): address에 있는 클레이 가져와주는 함수
    return caver.rpc.klay.getBalance(address).then((response) => {
        // caver.utils.convertFromPeb: 펩 단위에서 클레이 단위로
        const balance = caver.utils.convertFromPeb(caver.utils.hexToNumberString(response));
        console.log(`BALANCE: ${balance}`)
        return balance;
    })
}