import { loadSDK } from "./loader.js"; // loader 추가

(async () => {
    // 서비스와 클라이언트키를 전달하여 window 객체 내 TestSdkVal 생성
    const webcashSDK = await loadSDK('TestSdkVal', 'c6gBE6HrFVCNdmyl93bT3JTKhjzREs2J');
    await webcashSDK.increase(); // 증가 메서드 호출
    console.group('webcashSDK test')
    console.log('num:', webcashSDK.getValue());
    await webcashSDK.decrease(); // 감소 메서드 호출
    console.log('num:', webcashSDK.getValue()); 
    console.log('client key:', webcashSDK.getClientKey()); // 파라미터로 보낸 클라이언트 키 값
    console.groupEnd();
})();