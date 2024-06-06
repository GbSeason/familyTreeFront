// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import ElementUI from 'element-ui';
import './style/font.scss';
import 'element-ui/lib/theme-chalk/index.css';
import './util/draggable'
import './util/formatDate'
// import mxgraph from 'mxgraph'
Vue.config.productionTip = false
Vue.use(ElementUI, { size: 'mini', zIndex: 3000 });
Vue.prototype.$bus = {
  mainView: null,
  currentTest: null,
  loginUser: null
}
Vue.prototype.$checkLocalUser = function () {
  let userinfo = localStorage.getItem("login_user")
  if (userinfo && userinfo.length > 10) {
    return JSON.parse(userinfo)
  }
  return null
}
Vue.prototype.$setLocalUser = function (userInfo) {
  localStorage.setItem("login_user", JSON.stringify(userInfo))
}
let baseUrl = ''
Vue.prototype.$http = axios
Vue.prototype.$API = {
  login: `${baseUrl}/api/login`,
  addPerson: `${baseUrl}/api/addPerson`,
  getAllPersons: `${baseUrl}/api/getPerson`,
  addFamily: `${baseUrl}/api/addFamily`,
  test: `${baseUrl}/api/test`,
  getFamilyInfoAllByFamilyId:`${baseUrl}/api/getFamilyInfoAllByFamilyId`,
  upload:`${baseUrl}/api/upload`,
  getResource:`${baseUrl}/api/getResource`,
  viewResource:`${baseUrl}/viewResource/`,
  addRecord:`${baseUrl}/api/addRecord`,
  getRecord:`${baseUrl}/api/selectRecord`,
  updateRecord:`${baseUrl}/api/updateRecord`,
}
Vue.prototype.$resetForm = function (form) {
  for (let key in form) {
    form[key] = "";
  }
}
Vue.prototype.$DateFormater = function () {
  const formatterCN = new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  return formatterCN;
}
Vue.prototype.convertMillisecondsToDate =function (milliseconds) {
  let date = new Date(milliseconds);
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let h = date.getHours();
  let m = date.getMinutes();
  let s = date.getSeconds();
  return `${year}-${month}-${day} ${h}:${m}:${s}`;
}
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
