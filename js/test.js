// 전역 스페이스
var TestSdkVal = (function () {
  "use strict";
  console.log("run test sdk val");
  const testEvent = new Event("TestSdkVal:initialize", {
    bubbles: true,
    cancelable: false,
  });
  document.dispatchEvent(testEvent);
  console.log("TestSdkVal 호출됨");
  let num = 0;
  const key = "c6gBE6HrFVCNdmyl93bT3JTKhjzREs2J";
  const clientKeyAttr = document.head.querySelector("script");
  const clientKey = clientKeyAttr.attributes[1].nodeValue;
  if (key === clientKey) {
    return Promise.resolve({
      getClientKey: () => clientKey,
      getEventType: () => testEvent.type,
      increase: () => {
        num += 1;
      },
      decrease: () => {
        num -= 1;
      },
      getValue: () => num,
    });
  } else {
    return Promise.reject({
      에러: new Error("잘못된 클라이언트 키 값"),
    });
  }
})();
