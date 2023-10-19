export type DeferredPromise = {
  resolve: (value?: any | PromiseLike<any>) => void;
  reject: (reason?: any) => void;
  catch: (param: () => any) => void;
  then(param: () => void): any;
};
