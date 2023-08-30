import { loadSDK } from "./loader.js";
// const TEST_URL = './js/test.js';
// (() => {
//     // -- script tag의 속성 값 가져오기
//     const attrList = document.currentScript.attributes;
//     for(let ele of attrList) console.log(`${ele.nodeName}: ${ele.nodeValue}`);
//     for(let ele of attrList) {
//         ele.nodeName === 'data-client-id' && console.log('ok')
//     };
//     // [...attrList].forEach(ele => console.log(`${ele.nodeName}: ${ele.nodeValue}`));
//     // Array.from(attrList).forEach(ele => console.log(`${ele.nodeName}: ${ele.nodeValue}`));
//     // const TEST_URL = './js/index.js';
//     // const scriptSel = document.querySelector('script[data-client-id]');
//     // const scriptSelVal = scriptSel.getAttribute('data-client-id');
//     // console.log(scriptSelVal);
//     // console.log(scriptSel.attributes)
//     // console.log(document.querySelector(`script[src="${TEST_URL}"]`));

//     // -- script 추가
//     const script = document.createElement('script');
//     script.src = TEST_URL;
//     document.head.appendChild(script);
//     window.addEventListener('TestSdkVal:initialize', () => {
//         // window의 전역 스페이스에 'TestSdkVal'가 존재하는 경우 호출
//         getName('TestSdkVal') !== undefined && getName('TestSdkVal');
//         console.log(window.TestSdkVal());
//         console.log('ama')
//     });
// })();

// function getName(name) {
//     return window[name];
// };


(async () => {
    console.log(await loadSDK('TestSdkVal'));
})();
