(() => {
    const attrList = document.currentScript.attributes;
    for(let ele of attrList) console.log(`${ele.nodeName}: ${ele.nodeValue}`);
    for(let ele of attrList) {
        ele.nodeName === 'data-client-id' && console.log('ok')
    };
    [...attrList].forEach(ele => console.log(`${ele.nodeName}: ${ele.nodeValue}`));
    Array.from(attrList).forEach(ele => console.log(`${ele.nodeName}: ${ele.nodeValue}`));
})();


// const t1 = document.querySelector('script[data-client-id]');
// const t2 = t1.getAttribute('data-client-id');
// console.log(t2);