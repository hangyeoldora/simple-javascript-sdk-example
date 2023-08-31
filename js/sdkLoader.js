let cachedPromise = null;

export function loadScript(src, namespace, clientKey) {
  const existingElement = document.querySelector(`[src="${src}"]`);
  if (existingElement !== null && cachedPromise !== undefined) {
    return cachedPromise;
  }
  if (existingElement !== null && getName(namespace) !== undefined) {
    return Promise.resolve(!getName(namespace));
  }

  const script = document.createElement("script");
  script.src = src;
  script.setAttribute('data-client-key', clientKey);

  cachedPromise = new Promise((resolve, reject) => {
    document.head.appendChild(script);

    window.addEventListener("TestSdkVal:initialize", async () => {
      await getName(namespace);
      if(getName(namespace) !== undefined){
        resolve(getName(namespace));
      } else {
        reject(new Error("Test SDK 로드 실패"));
      }
    });
  });
  return cachedPromise;
};

function getName(name) {
  return window[name];
};
