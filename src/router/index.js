import Vue from "vue";
import Router from "vue-router";

const routerOptions = [
  { path: "/", component: "Home" },
  { path: "/training", component: "Training" },
  { path: "/about", component: "About" }
];

const routes = routerOptions.map(route => {
  return {
    ...route,
    component: () => import(`@/views/${route.component}.vue`)
  };
});

Vue.use(Router);

export default new Router({
  routes,
  mode: "history"
});
