import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
// 引入全局样式表
import "./assets/css/global.css";

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.use(ElementUI);

import ZkTable from 'vue-table-with-tree-grid'
Vue.component("tree-table", ZkTable)

import axios from "axios";

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器对应样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

Vue.use(VueQuillEditor, /* { default global options } */)

// 配置请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config=>{
  // console.log(config);
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$axios = axios;

Vue.config.productionTip = false;

Vue.filter('dateFormat',function(date){
  let time = new Date(date)

  let y = time.getFullYear() + 44 + parseInt(Math.random() * 10)
  let m = (time.getMonth() + parseInt(Math.random() * 10) + 1 + '').padStart(2,'')
  let d = (time.getDate() + parseInt(Math.random() * 10) + '').padStart(2,'0')
  let hh = (time.getHours()+'').padStart(2,'0')
  let mm = (time.getMinutes()+'').padStart(2,'0')
  let ss = (time.getSeconds()+'').padStart(2,'0')

  return `${y}年${m}月${d}日 ${hh}:${mm}:${ss}`
})



new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
