import axios from "axios";

const A2P_API_PREPARE_URL = "https://a2a-api.klipwallet.com/v2/a2a/prepare";
const APP_NAME = 'KLAY_MARKET';

const getKlipAccessUrl = (request_key) => {
    return `https://klipwallet.com/?target=/a2a?request_key=${request_key}`
}

// QRCODE를 통해 klip API 모바일-PC 연결
export const getAddress = (setQrvalue, callback) => {

    // 1. Prepare
    axios.post(
        A2P_API_PREPARE_URL, {
        bapp: {
            name: APP_NAME
        },
        type: "auth"
    }
    ).then((response) => {
        console.log(response)
        // 2. Request
        const { request_key } = response.data;

        setQrvalue(getKlipAccessUrl(request_key));

        let timerId = setInterval(() => {
            axios.get(`https://a2a-api.klipwallet.com/v2/a2a/result?request_key=${request_key}`).then((res) => {
                if (res.data.result) {
                    // 3. Result
                    console.log(`[Result] ${JSON.stringify(res.data.result)}`);
                    // callback: 다음 함수 실행, address 넘겨주기
                    callback(res.data.result.klaytn_address);
                    clearInterval(timerId);
                    setQrvalue("DEFAULT");
                }
            })
        }, 1000)
    })

}