let cachedPromise = null;

export function loadScript(src, namespace) {
  const existingElement = document.querySelector(`[src="${src}"]`);
  if (existingElement !== null && cachedPromise !== undefined) {
    return cachedPromise;
  }
  if (existingElement !== null && getName(namespace) !== undefined) {
    return Promise.resolve(!getName(namespace));
  }

  const script = document.createElement("script");
  script.src = src;
  cachedPromise = new Promise((resolve, reject) => {
    document.head.appendChild(script);

    window.addEventListener("TestSdkVal:initialize", () => {
      if(getName(namespace) === undefined){
        resolve(getName(namespace))
      } else {
        reject(new Error("Failed to load Test SDK"));
      }
    });
  });
  console.log(cachedPromise)
  return cachedPromise;
}

function getName(name) {
  return window[name];
}
