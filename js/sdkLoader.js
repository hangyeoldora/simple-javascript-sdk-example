let cachedPromise = null; // 캐싱 변수

// 기능 src path, 기능명, 클라이언트 키
export function loadScript(src, namespace, clientKey) {
  const existingElement = document.querySelector(`[src="${src}"]`);
  // 이미 script module이 dom에 있으면서 캐싱 변수에 값이 있는 경우
  if (existingElement !== null && cachedPromise !== undefined) {
    return cachedPromise;
  }
  // 이미 script module이 dom에 있으면서, window 전역 객체에도 생성 함수가 있는 경우
  if (existingElement !== null && getName(namespace) !== undefined) {
    return Promise.resolve(!getName(namespace));
  }

  // script 생성
  const script = document.createElement("script");
  script.src = src;
  // 파라미터로 받은 클라이언트 키 값을 속성으로 추가
  script.setAttribute('data-client-key', clientKey);

  // promise 변수
  cachedPromise = new Promise((resolve, reject) => {
    document.head.appendChild(script); // head 태그 내 삽입

    // 초기화 함수에서 생성한 이벤트에 대한 리스너 추가
    window.addEventListener("TestSdkVal:initialize", async () => {
      await getName(namespace);
      if(getName(namespace) !== undefined){
        // window 전역 객체에 초기화 함수가 있는 경우, resolve
        resolve(getName(namespace));
      } else {
        // 없는 경우 error로 reject
        reject(new Error("Test SDK 로드 실패"));
      }
    });
  });
  // promise 값 반환
  return cachedPromise;
};

// window 전역 객체 내 name 요소 여부 return
function getName(name) {
  return window[name];
};
