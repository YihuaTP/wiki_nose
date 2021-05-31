import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import * as Icons from '@ant-design/icons-vue';
import axios from 'axios';

const app = createApp(App);
app.use(store).use(router).use(Antd).mount('#app');

// 全局使用图标
const icons: any = Icons;
for (const i in icons) {
  app.component(i, icons[i]);
}

// 打印环境日志
console.log('环境：', process.env.NODE_ENV)
console.log('服务端：', process.env.VUE_APP_SERVER)

// 修改请求的默认url，发送请求的时候就可以忽略
axios.defaults.baseURL = process.env.VUE_APP_SERVER;

// 使用axios提供的拦截器。1、打印请求和返回日志
axios.interceptors.request.use(function (config) {      // 拦截请求 
  console.log('请求参数：', config);
  return config;
}, error => {
  return Promise.reject(error);
});
axios.interceptors.response.use(function (response) {   //  拦截返回
  console.log('返回结果：', response);
  return response;
}, error => {
  console.log('返回错误：', error);
  return Promise.reject(error);
});

