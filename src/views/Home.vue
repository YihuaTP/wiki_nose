<template>
  <a-layout>
    <a-layout-sider width="200" style="background: #fff">
      <a-menu
        mode="inline"
        :style="{ height: '100%', borderRight: 0 }"
        @click="handleClick"
      >
        <a-menu-item key="welcome">
          <MailOutlined />
          <span>欢迎</span>
        </a-menu-item>
        <a-sub-menu v-for="item in level1" :key="item.id">
          <template v-slot:title>
            <span><user-outlined />{{ item.name }}</span>
          </template>
          <a-menu-item v-for="child in item.children" :key="child.id">
            <MailOutlined /><span>{{ child.name }}</span>
          </a-menu-item>
        </a-sub-menu>
        <a-menu-item key="tip" :disabled="true">
          <span>以上菜单在分类管理配置</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>

    <a-layout-content
      :style="{
        background: '#fff',
        padding: '24px',
        margin: 0,
        minHeight: '280px',
      }"
    >
      <div class="welcome" v-show="isShowWelcome">欢迎来到编程世界</div>

      <a-list
        v-show="!isShowWelcome"
        item-layout="vertical"
        size="large"
        :data-source="books"
        :grid="{ gutter: 16, column: 3 }"
      >
        <template #renderItem="{ item }">
          <a-list-item key="item.name">
            <template #actions>
              <span v-for="{ type, text } in actions" :key="type">
                <component v-bind:is="type" style="margin-right: 8px" />
                {{ text }}
              </span>
            </template>
            <a-list-item-meta :description="item.description">
              <template #title>
                <a :href="item.href">{{ item.name }}</a>
              </template>
              <template #avatar><a-avatar :src="item.cover" /></template>
            </a-list-item-meta>
          </a-list-item>
        </template>
      </a-list>
    </a-layout-content>
  </a-layout>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import axios from "axios";
import { message } from "ant-design-vue";
import { Tool } from "@/util/tool";

export default defineComponent({
  name: "Home",

  setup() {
    // 定义图标组件
    const actions: any = [
      { type: "StarOutlined", text: "156" },
      { type: "LikeOutlined", text: "156" },
      { type: "MessageOutlined", text: "2" },
    ];

    // 向后端发起请求，调用某个二级类目下的电子书
    const books = ref();
    const handleQueryBook = () => {
      axios
        .get("/wiki/book/list", {
          params: {
            page: 1,
            size: 100,
            category2Id: category2Id,
          },
        })
        .then((res) => {
          books.value = res.data.content.content;
        });
    };

    const level1 = ref();
    let categorys: any;
    /**
     * 查询所有分类
     **/
    const handleQueryCategory = () => {
      axios.get("/wiki/category/list").then((response) => {
        const data = response.data;
        if (data.success) {
          categorys = data.content;
          console.log("原始数组：", categorys);

          // 加载完分类后，将侧边栏全部展开
          // openKeys.value = [];
          // for (let i = 0; i < categorys.length; i++) {
          //   openKeys.value.push(categorys[i].id);
          // }

          level1.value = [];
          level1.value = Tool.array2Tree(categorys, 0);
          console.log("树形结构：", level1.value);
        } else {
          message.error(data.message);
        }
      });
    };

    const isShowWelcome = ref(true);
    let category2Id = 0;

    const handleClick = (value: any) => {
      if (value.key === "welcome") {
        isShowWelcome.value = true;
      } else {
        category2Id = value.key;
        isShowWelcome.value = false;
        handleQueryBook();
      }
    };

    onMounted(() => {
      handleQueryCategory();
    });

    return {
      books,
      actions,
      level1,
      handleClick,
      isShowWelcome,
    };
  },
});
</script>

// 设置文档图标样式，scoped：表示只是在当前页面有效果
<style scoped>
.ant-avatar {
  width: 50px;
  height: 50px;
  line-height: 50px;
  border-radius: 8%;
  margin: 5px 0;
}
</style>
