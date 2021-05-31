<template>
  <a-layout-header class="header">
    <div class="logo" />
    <a-menu theme="dark" mode="horizontal" :style="{ lineHeight: '64px' }">
      <a-menu-item key="index">
        <router-link to="/">首页</router-link>
      </a-menu-item>
      <a-menu-item key="book-manager">
        <router-link to="/admin/book">电子书管理</router-link>
      </a-menu-item>
      <a-menu-item key="about-we">
        <router-link to="/about">关于我们</router-link>
      </a-menu-item>
      <a-menu-item key="1">
        <router-link to="/">友情赞助商</router-link>
      </a-menu-item>
    </a-menu>
  </a-layout-header>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "WikiHeader",
});
</script>