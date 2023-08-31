// 전역 스페이스
var TestSdkVal = (function () {
  "use strict";
  console.log("running test sdk val");
  const evt = new Event("TestSdkVal:initialize", {
    bubbles: true,
    cancelable: false,
  });
  document.dispatchEvent(evt);
  console.log('TestSdkVal 호출됨');
  let value = 0;
  const key = 'c6gBE6HrFVCNdmyl93bT3JTKhjzREs2J';
  const clientKeyAttr = document.head.querySelector('script');
  const clientKey = clientKeyAttr.attributes[1].nodeValue;
  if(key === clientKey){
    return Promise.resolve({
      increase : () => {
        value = value + 1;
        return value;
      },
      decrease : () => {
        value = value - 1;
      },
      getValue : () => value
    })
  } else {
    return Promise.reject({
      에러: new Error('잘못된 클라이언트 키 값')
    });
  };
  
})();