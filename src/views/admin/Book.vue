<template>
  <a-layout>
    <a-layout-content
      :style="{
        background: '#fff',
        padding: '24px',
        margin: 0,
        minHeight: '280px',
      }"
    >
      <a-table
        :columns="columns"
        :data-source="books"
        :row-key="(record) => record.id"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <template #cover="{ text: cover }">
          <img v-if="cover" :src="cover" alt="avatar" />
        </template>

        <template v-slot:action="{ text, record }">
          <a-space size="small">
            <a-button type="primary" @click="edit"> 编辑 </a-button>
            <a-button type="danger"> 删除 </a-button>
          </a-space>
        </template>
      </a-table>
    </a-layout-content>
  </a-layout>

  <!-- 拟态对话框 -->
  <a-modal
    title="电子书列表"
    v-model:visible="modelVisible"
    :confirm-loading="modelLoading"
    @ok="handleModelOk"
    cancelText="取消"
    okText="确认"
  >
    <p>{{ modalText }}</p>
  </a-modal>
</template>

<script lang="ts">
import axios from "axios";
import { defineComponent, onMounted, ref } from "vue";

export default defineComponent({
  name: "Book",
  setup() {
    const books = ref();

    // 定义加载的缓存图标，默认false
    const loading = ref(false);

    // ant design 提供的分页最贱
    const pagination = ref({
      total: 0,
      current: 1,
      pageSize: 3,
    });

    // 定义渲染每一列
    const columns = [
      {
        title: "封面",
        dataIndex: "cover",
        slots: { customRender: "cover" },
      },
      {
        title: "名称",
        dataIndex: "name",
      },
      {
        title: "分类",
        slots: { customRender: "category" },
      },
      {
        title: "文档数",
        dataIndex: "docCount",
      },
      {
        title: "阅读数",
        dataIndex: "viewCount",
      },
      {
        title: "点赞数",
        dataIndex: "voteCount",
      },
      {
        title: "Action",
        key: "action",
        slots: { customRender: "action" },
      },
    ];

    // 向后端发起请求
    const handleQuery = (params: any) => {
      loading.value = true;
      axios
        .get("/wiki/book/info", {
          params: {
            page: params.page,
            size: params.size,
          },
        })
        .then((res) => {
          loading.value = false;
          const data = res.data.content;
          books.value = data.content;
          // 重置分页按钮
          pagination.value.current = params.page;
          pagination.value.total = data.total;
        })
        .catch((err) => {
          console.error(err);
        });
    };

    // 表格点击页码时候触发,重新查询
    const handleTableChange = (pagination: any) => {
      handleQuery({
        page: pagination.current,
        size: pagination.pageSize,
      });
    };

    // ref后面定义的是这个响应式类型的数据值，在后面是默认值
    const modalText = ref<string>('确认删除该数据吗？');
    const modelVisible = ref<boolean>(false);
    const modelLoading = ref<boolean>(false);

    const edit = () => {
      modelVisible.value = true;

    };

    const handleModelOk = () => {
      modalText.value = '正在删除中';
      modelLoading.value = true;
      setTimeout(() => {
        modelVisible.value = false;
        modelLoading.value = false;
      }, 2000);
    };

    // 初始化页面数据
    onMounted(() => {
      handleQuery({
        page: pagination.value.current,
        size: pagination.value.pageSize,
      });
    });

    return {
      books,
      pagination,
      columns,
      loading,
      handleTableChange,

      modalText,
      modelVisible,
      modelLoading,
      edit,
      handleModelOk,
    };
  },
});
</script>

// 封面图片的样式
<style scoped>
img {
  width: 50px;
  height: 50px;
}
</style>

