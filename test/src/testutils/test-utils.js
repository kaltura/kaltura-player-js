/**
 * Creates a dom element.
 * @param {string} type - The element type.
 * @param {string} id - The element id.
 * @param {string} opt_parentId - Optional parent id.
 * @returns {HTMLDivElement}
 */
function createElement(type, id, opt_parentId) {
  let element = document.createElement(type);
  element.id = id;
  if (!opt_parentId) {
    document.body.appendChild(element);
  } else {
    let parent = document.getElementById(opt_parentId);
    if (parent) {
      parent.appendChild(element);
    } else {
      document.body.appendChild(element);
    }
  }
  return element;
}

/**
 * Removes a dom element.
 * @param {string} id - The element id.
 * @returns {void}
 */
function removeElement(id) {
  let element = document.getElementById(id);
  element.parentNode.removeChild(element);
}

/**
 * Removes all the video elements that created by the test from the document.
 * @returns {void}
 */
function removeVideoElementsFromTestPage() {
  let element = document.getElementsByTagName('video');
  for (let i = element.length - 1; i >= 0; i--) {
    element[i].parentNode.removeChild(element[i]);
  }
}

export {createElement, removeElement, removeVideoElementsFromTestPage};
