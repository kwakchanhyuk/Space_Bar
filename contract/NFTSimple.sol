// SPDX-License-Identifier: MIT
pragma solidity >=0.4.24 <=0.5.6;

contract NFTSimple {
    string public name = "KlayLion";
    string public symbol = "KL"; // 단위 ex) 원

    // 토큰 소유주 확인
    mapping (uint256 => address) public tokenOwner; // 토큰아이디 => 소유주 주소
    
    // 토큰 메시지 확인
    mapping (uint256 => string) public tokenURIs; // 토큰아이디 => 토큰 메시지(URI)

    // 소유한 토큰 리스트
    mapping(address => uint256[]) private _ownedTokens; // 소유주 주소 => 소유한 토큰아이디 리스트

    // onKIP17Received bytes value
    // 컴퓨터는 0x6745782b을 통해 onKIP17Received 함수 실행
    bytes4 private constant _KIP17_RECEIVED = 0x6745782b;

    // mint(tokenId, uri, owner): 발행
    function mintWithTokenURI(address to, uint256 tokenId, string memory tokenURI) public returns (bool) {

        // to에게 tokenId(일련번호)를 발행하겠다.
        tokenOwner[tokenId] = to;
        
        // 적힐 글자는 tokenURI
        tokenURIs[tokenId] = tokenURI;
        
        // add token to the list
        _ownedTokens[to].push(tokenId);

        return true;
    }

    // transferFrom(from, to, tokenId): 전송 -> owner가 바뀌는 것 (from -> to)
    function safeTranferFrom(address from, address to, uint256 tokenId, bytes memory _data) public {

        // transacion의 owner, token의 소유자인 경우에만 전송가능
        require(from == msg.sender, "from != msg.sender");
        require(from == tokenOwner[tokenId], "you are not the owner of the token");
        
        // 기존 소유주 리스트에서 토큰 삭제
        _removeTokenFromList(from, tokenId);

        // 전송받은 소유주 토큰 리스트에 토큰 추가
        tokenOwner[tokenId] = to;
        _ownedTokens[to].push(tokenId);


        // 만약에 받는 쪽이 실행할 코드가 있는 스마트 컨트랙트이면 코드 실행
        require(
            _checkOnKIP17Received(from, to, tokenId, _data), "KIP17: transfer to non KIP17Receiver implementer"
        );
    }


    function _checkOnKIP17Received(address from, address to, uint256 tokenId, bytes memory _data) internal returns (bool) {
        bool success;
        bytes memory returndata;

        // 컨트랙트가 아니라면
        if (!isContract(to)){
            return true;
        }

        // to 컨트랙트의 함수 호출하여 받은 값을 success, returndata 각각에 대입
        (success, returndata) = to.call(
            abi.encodeWithSelector(
                _KIP17_RECEIVED, // 함수명 0x6745782b => onKIP17Received 함수 

                // onKIP17Received 함수의 파라미터들
                msg.sender,
                from,
                tokenId,
                _data
            )
        );

        if (
            returndata.length != 0 &&
            abi.decode(returndata, (bytes4)) == _KIP17_RECEIVED
        ) {
            return true;
        }
        return false;

    }

    // 컨트랙트 판별 함수 => 주소에 코드가 있으면 컨트랙트
    function isContract(address account) internal view returns (bool) {
        uint256 size;

        // account의 코드 사이즈가 0보다 크면 true 반환
        assembly { size := extcodesize(account)}
        return size > 0;
    }

    // token 전송 시 리스트에서 삭제하는 함수
    function _removeTokenFromList(address from, uint256 tokenId) private {
        // [10, 15, 19, 20] => 19번 삭제하고 싶어요
        // [10, 15, 20, 19]
        // [10, 15, 20]

        for(uint256 i=0; i<_ownedTokens[from].length; i++) {
            if (tokenId == _ownedTokens[from][i]) {
                // Swap last token with deleting token
                _ownedTokens[from][i] = _ownedTokens[from][_ownedTokens[from].length - 1];
                _ownedTokens[from][_ownedTokens[from].length - 1] = tokenId;
                break;
            }
        }

        // 길이 감소 (마지막 원소 삭제)
        _ownedTokens[from].length--;
    }

    // 리스트에 토큰 추가하는 함수
    function ownedTokens(address owner) public view returns (uint256[] memory) {
        return _ownedTokens[owner];
    }

    function setTokenUri(uint256 id, string memory uri) public{
        tokenURIs[id] = uri;
    }
}

contract NFTMarket {
    // 토큰을 누가 판매했는가 (토큰아이디 => 해당 토큰을 판매한 계좌 주소)
    mapping(uint256 => address) public seller;


    // 구매할 때 (KLAY를 전송해야하기 때문에 payable)
    function buyNFT(uint256 tokenId, address NFTAddress) public payable returns (bool){

        // payable한 address한테만 클레이 전송 가능
        // address(uint160()): seller address 변환
        address payable receiver = address(uint160(seller[tokenId]));

        // Send 0.01 KLAY to receiver (토큰 판매금)
        // 10 ** 18 PEB == 1 KLAY
        // 10 ** 16 PED == 0.01KLAY
        receiver.transfer(10 ** 16);

        // 구매한 사람한테 토큰 전송
        NFTSimple(NFTAddress).safeTranferFrom(address(this), msg.sender, tokenId, '0x00');

        return true;
    }

    // Market이 토큰을 받았을 때, 판매자가 누구인지 기록
    function onKIP17Received(address operator, address from, uint256 tokenId, bytes memory data) public returns (bytes4) {
        
        seller[tokenId] = from;

        // 위에 선언한 bytes4 private constant _KIP17_RECEIVED = 0x6745782b; 반환
        return bytes4(keccak256("onKIP17Received(address,address,uint256,bytes)"));
    }
}