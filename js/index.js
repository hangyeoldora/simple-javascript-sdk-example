// const TEST_URL = './js/test.js';
(() => {
    // -- script tag의 속성 값 가져오기
    const attrList = document.currentScript.attributes;
    console.group('get attr test');
    for(let ele of attrList) console.log(`${ele.nodeName}: ${ele.nodeValue}`);
    for(let ele of attrList) {
        ele.nodeName === 'data-client-id' && console.log('ok')
    };
    console.groupEnd();
    // [...attrList].forEach(ele => console.log(`${ele.nodeName}: ${ele.nodeValue}`));
    // Array.from(attrList).forEach(ele => console.log(`${ele.nodeName}: ${ele.nodeValue}`));
    // const TEST_URL = './js/index.js';
    // const scriptSel = document.querySelector('script[data-client-id]');
    // const scriptSelVal = scriptSel.getAttribute('data-client-id');
    // console.log(scriptSelVal);
    // console.log(scriptSel.attributes)
    // console.log(document.querySelector(`script[src="${TEST_URL}"]`));
    // -- script 추가
})();
