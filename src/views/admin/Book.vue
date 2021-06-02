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
            <a-button type="primary" @click="editBook(record)"> 编辑 </a-button>
            <a-button type="danger" @click="deleteBook(text)"> 删除 </a-button>
          </a-space>
        </template>
      </a-table>
    </a-layout-content>
  </a-layout>

  <!-- 修改电子书数据模态框 -->
  <a-modal
    title="编辑电子书"
    v-model:visible="editModelVisible"
    :confirm-loading="editModelLoading"
    @ok="editHandleModelOk"
    cancelText="取消"
    okText="确认"
  >
    <p>
      <a-form :model="bookInfo" :label-col="{ span: 3, offset: 2 }">
        <a-form-item label="封面">
          <a-input v-model:value="book.cover" class="len" />
        </a-form-item>
        <a-form-item label="名称">
          <a-input v-model:value="book.name" class="len" />
        </a-form-item>
        <a-form-item label="分类一">
          <a-input v-model:value="book.category1Id" class="len" />
        </a-form-item>
        <a-form-item label="分类二">
          <a-input v-model:value="book.category2Id" class="len" />
        </a-form-item>
        <a-form-item label="描述">
          <a-textarea
            v-model:value="book.description"
            type="textArea"
            class="len"
          />
        </a-form-item>
      </a-form>
    </p>
  </a-modal>

  <!-- 删除电子书拟态对话框 -->
  <a-modal
    title="删除电子书"
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

    // 编辑数据使用，直接使用将record当做参数传递到函数内部
    const book = ref({});
    const editModelVisible = ref<boolean>(false);
    const editModelLoading = ref<boolean>(false);
    const editBook = (record: any) => {
      editModelVisible.value = true;
      book.value = record;
    };
    const editHandleModelOk = () => {
      editModelLoading.value = true;
      axios
        .post("/wiki/book/edit", book.value)
        .then((res) => {
          const data = res.data;
          if (data.success) {
            editModelVisible.value = false;
            editModelLoading.value = false;
          } else {
            editModelVisible.value = false;
            editModelLoading.value = false;
            alert("数据修改失败");
          }

          // 重新刷新页面，并且还是本页
          handleQuery({
            page: pagination.value.current,
            size: pagination.value.pageSize,
          });
        })
        .catch((err) => {
          console.error(err);
        });
    };

    // 删除电子书逻辑
    const modalText = ref<string>("Content of the modal");
    const modelVisible = ref<boolean>(false);
    const modelLoading = ref<boolean>(false);
    const deleteBook = () => {
      modelVisible.value = true;
    };
    const handleModelOk = () => {
      modalText.value = "正在删除ing";
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

      editBook,
      editModelVisible,
      editModelLoading,
      editHandleModelOk,
      book,

      deleteBook,
      modalText,
      modelVisible,
      modelLoading,
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

.len {
  width: 300px;
}
</style>

