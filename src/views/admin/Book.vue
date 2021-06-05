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
      <p>
        <a-form layout="inline" :model="formData">
          <a-form-item>
            <a-input
              v-model:value="formData.name"
              placeholder="请输入名称"
            ></a-input>
          </a-form-item>

          <a-form-item>
            <a-button
              type="primary"
              @click="
                handleQuery({
                  page: 1,
                  size: pagination.pageSize,
                })
              "
            >
              查询
            </a-button>
          </a-form-item>

          <a-form-item>
            <a-button type="primary" @click="add()"> 新增 </a-button>
          </a-form-item>
        </a-form>
      </p>

      <a-modal
        title="新增电子书"
        v-model:visible="addModelVisible"
        :confirm-loading="addModelLoading"
        @ok="addHandleModelOk"
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
            <a-button type="primary" @click="editBook(record, text)">
              编辑
            </a-button>

            <a-popconfirm
              title="删除之后不可回复，请确认删除?"
              ok-text="删除"
              cancel-text="取消"
              @confirm="deleteBook(record.id)"
            >
              <a href="#"><a-button type="danger"> 删除 </a-button></a>
            </a-popconfirm>
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
      <a-form :label-col="{ span: 3, offset: 2 }">
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
</template>

<script lang="ts">
import axios from "axios";
import { defineComponent, onMounted, ref } from "vue";
import { message } from "ant-design-vue";
import {Tool} from "@/util/tool";

export default defineComponent({
  name: "Book",
  setup() {
    const books = ref();

    // 定义加载的缓存图标，默认false
    const loading = ref(false);

    // ant design 提供的分页组件
    const pagination = ref({
      total: 0,
      current: 1,
      pageSize: 4,
    });

    // const formData = ref({
    //   name: "",
    // });

    const formData = ref();

    formData.value = {};

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
        dataIndex: "category1Id",
        slots: { customRender: "category1Id" },
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
        .get("/wiki/book/list", {
          params: {
            page: params.page,
            size: params.size,
            name: formData.value.name
          },
        })
        .then((res) => {
          loading.value = false;
          const data = res.data;
          if (data.success) {
            books.value = data.content.content;
            pagination.value.current = params.page;
            pagination.value.total = data.content.total;
          } else {
            message.error(data.message);
          }
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
      book.value = Tool.copy(record);
    };
    const editHandleModelOk = () => {
      editModelLoading.value = true;
      axios.put("/wiki/book/edit", book.value).then((res) => {
        const data = res.data;
        if (data.success) {
          setTimeout(() => {
            editModelVisible.value = false;
            editModelLoading.value = false;
          }, 50);
        }
        // 重新刷新页面，并且还是本页
        handleQuery({
          page: pagination.value.current,
          size: pagination.value.pageSize,
        });
      });
    };

    // 删除电子书逻辑
    const deleteBook = (id: number) => {
      axios.delete("/wiki/book/remove/" + id).then((res) => {
        if (res.data.success) {
          // 重新刷新页面，并且还是本页
          handleQuery({
            page: 1,
            size: pagination.value.pageSize,
          });
        }
      });
    };

    // 新增电子书信息
    const addModelVisible = ref<boolean>(false);
    const addModelLoading = ref<boolean>(false);
    const add = () => {
      addModelVisible.value = true;
      book.value = {};
    };

    const addHandleModelOk = () => {
      addModelLoading.value = true;
      axios.post("/wiki/book/add", book.value).then((res) => {
        const data = res.data;
        if (data.success) {
          setTimeout(() => {
            addModelVisible.value = false;
            addModelLoading.value = false;
          }, 50);
          // 重新刷新页面，并且还是本页
          handleQuery({
            page: pagination.value.current,
            size: pagination.value.pageSize,
          });
        } else {
          addModelLoading.value = false;
          message.error(data.message);
        }
      });
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

      add,
      addModelVisible,
      addHandleModelOk,
      addModelLoading,

      formData,
      handleQuery,
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

