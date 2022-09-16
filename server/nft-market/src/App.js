import axios from "axios";
import QRCode from 'qrcode.react';
import { useEffect, useState } from "react";
import { getBalance } from './api/UseCaver';
import * as KlipAPI from "./api/UseKlip";
import "bootstrap/dist/css/bootstrap.min.css";
import { Alert, Container, Modal, Button } from "react-bootstrap";
import './App.css';
import './market.css';
import logo from './images/logo.png';

const DEFAULT_QR_CODE = 'DEFAULT';
const DEFAULT_ADDRESS = "0x000000000000000000000000"
function App() {
  // Global Data
  // 1. address
  const [myAddress, setMyAddress] = useState(DEFAULT_ADDRESS);
  // 2. 잔고
  const [myBalance, setMyBalance] = useState("0");
  // 3. NFT
  // const [nfts, setNfts] = useState([]);

  // UI
  const [qrvalue, setQrvalue] = useState(DEFAULT_QR_CODE);
  // 1. Tab 메뉴
  // const [tab, setTab] = useState('MARKET'); // MARKET, MINT, WALLET
  // 2. mintInput
  // const [mintImageUrl, setMintImageUrl] = useState("");
  // 3. Modal
  const [showModal, setShowModal] = useState(false);
  const [modalProps, setModalProps] = useState({
    title: "MODAL",
    onConfirm: () => { }
  });

  // getUserData
  const getUserData = () => {
    // 지갑을 연동하시겠습니까 모달
    setModalProps({
      title: "Klip 지갑을 연동하시겠습니까?",
      onConfirm: () => {
        KlipAPI.getAddress(setQrvalue, async (address) => {
          setMyAddress(address);
          const _balance = await getBalance(address);
          setMyBalance(_balance);
        });
      }
    })
    setShowModal(true);
  };

  // 처음 실행했을 때 나오는 화면 -> useEffect
  useEffect(() => {
    getUserData();
    // fetchMarketNFTs();
  }, [])

  return (
    <div className="App">
      {/* top: 주소 잔고 */}
      <div style={{ backgroundColor: "black", padding: 10 }}>
        <div id="titleouter" style={{textAlign:"center"}}>
          <img src={logo} id="logo" width={450} />
        </div>
        <span id="mywallet" style={{ fontSize: 30, fontWeight: "bold", paddingLeft: 5, marginTop: 10 }}>MY Wallet</span>
        <span id="address">{myAddress}</span>
        <br />
        <Alert id="connect" onClick={getUserData} variant={"balance"} style={{ backgroundColor: "#2f007c", fontSize: 25 }}>
          {myAddress !== DEFAULT_ADDRESS ? `${myBalance} KLAY` : "지갑 연동하기"}
        </Alert>
        {qrvalue == 'DEFAULT' ? (
        <button id = "gamestartbtn">START Space Bar</button>
        ) : null}

        {/* DEFAULT 아닌 경우에만 QR 코드 */}
        {qrvalue !== 'DEFAULT' ? (
          <Container style={{ backgroundColor: "white", width: 300, height: 300, padding: 20 }}>
            <QRCode value={qrvalue} size={256} style={{ margin: "auto" }} />
          </Container>) : null}

        <br />

        {/* 모달 */}
        <Modal
          centered
          size="sm"
          show={showModal}
          onHide={() => {
            setShowModal(false);
          }}
        >

          <Modal.Header
            style={{ border: 0, backgroundColor: "black", opacity: 0.8 }}
          >
            <Modal.Title>
              {modalProps.title}
            </Modal.Title>
          </Modal.Header>
          <Modal.Footer style={{ border: 0, backgroundColor: "black", opacity: 0.8 }}>
            <Button variant="secondary" onClick={() => { setShowModal(false); }}>닫기</Button>
            <Button variant="primary" onClick={() => {
              modalProps.onConfirm();
              setShowModal(false);
            }}
              style={{ backgroundColor: "#2f007c", borderColor: "#2f007c" }}
            >진행</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default App;
