//@flow
import {FakeEvent, FakeEventTarget} from '@playkit-js/playkit-js';

class ResizeWatcher extends FakeEventTarget {
  _observer: Object;
  _config: Object;

  constructor(config: Object) {
    super();
    this._config = config;
    this._initObserver();
  }

  destroy() {
    this._observer.disconnect();
    this._config = {};
  }

  _initObserver() {
    window.ResizeObserver ? this._createNativeObserver() : this._createIframeObserver();
    const el = document.getElementById(this._config.targetId);
    this._observer.observe(el);
  }

  _createNativeObserver() {
    this._observer = new window.ResizeObserver(entries => {
      entries.forEach(() => {
        this._triggerResize();
      });
    });
  }

  _createIframeObserver() {
    this._observer = new IFrameObserver(this._triggerResize.bind(this));
  }

  _triggerResize() {
    this.dispatchEvent(new FakeEvent('resize'));
  }
}

class IFrameObserver {
  _observersStore: Object = {};
  _onChangeCallback: Function;

  constructor(callback: Function) {
    this._onChangeCallback = callback;
  }

  observe(el: HTMLElement) {
    const iframe = this._createIframe();
    const targetId = el.getAttribute('id');
    this._observersStore[targetId] = iframe;
    el.appendChild(iframe);
    iframe.contentWindow.onresize = () => this._onChangeCallback();
  }

  disconnect() {
    for (let target in this._observersStore) {
      const el = document.getElementById(target);
      const iframe = this._observersStore[target];
      iframe.onresize = null;
      el.removeChild(iframe);
    }
  }

  _createIframe(): HTMLElement {
    let iframe = document.createElement('iframe');
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.position = 'absolute';
    iframe.style.visibility = 'hidden';
    return iframe;
  }
}

export {ResizeWatcher};
