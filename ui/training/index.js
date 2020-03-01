/* global M, Vue */
import App from "./app.js";

new Vue({
  render: h => h(App)
}).$mount(`#app`);

function init() {
  var tabs = M.Tabs.init(document.querySelectorAll(".tabs"));
  tabs = M.Tabs.getInstance(document.querySelectorAll(".tabs")[0]);
  tabs.select("malayalam");
  var elems = document.querySelectorAll(".collapsible");
  M.Collapsible.init(elems, {});
}

window.addEventListener("load", init);
