function addDemoStylesheet() {
  let head = document.getElementsByTagName('head')[0];
  let link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = '/base/test/src/integration/demo-styles.css';
  head.appendChild(link);
  document.getElementsByTagName("head")[0].appendChild(link);
}

export {addDemoStylesheet};
