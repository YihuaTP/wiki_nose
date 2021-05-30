<template>
  <a-layout>
    
    <WikiHeader></WikiHeader>

    <router-view />

    <Wiki-footer></Wiki-footer>
    
  </a-layout>
</template>

<script lang="ts">
import { defineComponent } from "vue";

// 导入组件，步骤一
import WikiHeader from "@/components/WikiHeader.vue"; 
import WikiFooter from "@/components/WikiFooter.vue"; 


// 导入组件，步骤二
export default defineComponent({
  name: "App",
  components: {
    WikiHeader,
    WikiFooter
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