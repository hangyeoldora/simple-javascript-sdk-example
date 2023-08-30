// 전역 스페이스
var TestSdkVal = (function () {
  "use strict";
  console.log("running test sdk val");
  const evt = new Event("TestSdkVal:initialize", {
    bubbles: true,
    cancelable: false,
  });
  document.dispatchEvent(evt);
  
  console.log('called TestSdkVal');
  function test() { 
    console.log('test');
  }
  return Promise.resolve({
    test() {
        console.log('test')
    }
  });
})();