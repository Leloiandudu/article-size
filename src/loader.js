const Callbacks = [];
const Dependencies = new Set();

export function loadUsing(deps, callback) {
   if (callback) {
      Callbacks.push(callback);
   }

   if (!Array.isArray(deps)) {
      Dependencies.add(deps);
      return;
   }

   for (const dep of deps) {
      Dependencies.add(dep);
   }
}

export function initGadget() {
   window.RLQ.push(function() {
      mw.loader.using([ ...Dependencies ], function () {
         Callbacks.forEach(cb => cb());
      });
   });
}
