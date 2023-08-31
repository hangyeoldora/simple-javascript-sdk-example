// 전역 스페이스
var TestSdkVal = (function () {
  "use strict"; // 엄격 모드
  console.log("run test sdk val");

  // 초기화 함수 등록 여부 확인을 위한 이벤트 생성
  const testEvent = new Event("TestSdkVal:initialize", {
    bubbles: true,
    cancelable: false,
  });
  // dom에 이벤트 추가
  document.dispatchEvent(testEvent);
  console.log("TestSdkVal 호출됨");
  let num = 0;
  const key = "c6gBE6HrFVCNdmyl93bT3JTKhjzREs2J";
  const clientKeyAttr = document.head.querySelector("script"); // head에 있는 script module
  const clientKey = clientKeyAttr.attributes[1].nodeValue; // script 속성 값 가져오기
  // 기본 키 값과 파라미터로 받은 키가 같은 경우
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
  } 
  // 기본 키 값과 파라미터로 받은 키가 틀린 경우
  else {
    return Promise.reject({
      에러: new Error("잘못된 클라이언트 키 값"),
    });
  }
})();