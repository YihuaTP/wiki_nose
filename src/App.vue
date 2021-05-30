<template>
  <a-layout>
    
    <WikiHeader></WikiHeader>

    <router-view />
    <a-layout-footer style="text-align: center">
      wiki开放知识库系统 ©2021 Created by love kong company
    </a-layout-footer>
  </a-layout>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import WikiHeader from "@/components/WikiHeader.vue"; // @ is an alias to /src

export default defineComponent({
  name: "App",
  components: {
    WikiHeader
  },
});
</script>

<style>
.logo {
  float: left;
  width: 120px;
  height: 31px;
  margin: 16px 24px 16px 0;
  background: rgba(255, 255, 255, 0.3);
}

.site-layout-background {
  background: #fff;
}
</style>