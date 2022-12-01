import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/login",
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/home",
    name: "home",
    redirect: "/welcome",
    component: () => import("../views/Home.vue"),
    children: [
      {
        path: "/welcome",
        component: () => import("../views/Welcome.vue"),
      },
      {
        path: "/users",
        component: () => import("../views/User.vue"),
      },
      {
        path: "/rights",
        component: () => import("../views/power/Rights.vue"),
      },
      {
        path: "/roles",
        component: () => import("../views/power/Roles.vue"),
      },
      {
        path: "/categories",
        component: () => import("../views/goods/Categories.vue"),
      },
      {
        path: "/params",
        component: () => import("../views/goods/Params.vue"),
      },
      {
        path: "/goods",
        component: () => import("../views/goods/Goods.vue"),
      },
    ],
  },
];

const router = new VueRouter({
  routes,
});

// 挂载路由首位
router.beforeEach((to, from, next) => {
  // to将要访问的路径 from代表从那个路径跳转而来
  // next表示放行next() next('/login') 强制跳转

  if (to.path === "/login") return next();
  // 获取token
  const tokenStr = window.sessionStorage.getItem("token");
  if (!tokenStr) return next("/login");
  next();
});

export default router;
