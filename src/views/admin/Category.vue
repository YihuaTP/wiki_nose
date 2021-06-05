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
      <p><a-button type="primary" @click="add()"> 新增 </a-button></p>

      <a-modal
        title="新增分类"
        v-model:visible="addModelVisible"
        :confirm-loading="addModelLoading"
        @ok="addHandleModelOk"
        cancelText="取消"
        okText="确认"
      >
        <p>
          <a-form :label-col="{ span: 3, offset: 2 }">
            <a-form-item label="名称">
              <a-input v-model:value="category.name" class="len" />
            </a-form-item>
            <a-form-item label="父类目">
              <a-input v-model:value="category.parent" class="len" />
            </a-form-item>
            <a-form-item label="顺序">
              <a-input v-model:value="category.sort" class="len" />
            </a-form-item>
          </a-form>
        </p>
      </a-modal>

      <a-table
        :columns="columns"
        :data-source="leave1"
        :row-key="(record) => record.id"
        :loading="loading"
        :pagination="false"
      >
        <template #cover="{ text: cover }">
          <img v-if="cover" :src="cover" alt="avatar" />
        </template>

        <template v-slot:action="{ text, record }">
          <a-space size="small">
            <a-button type="primary" @click="editCategory(record, text)">
              编辑
            </a-button>

            <a-popconfirm
              title="删除之后不可回复，请确认删除?"
              ok-text="删除"
              cancel-text="取消"
              @confirm="deleteCategory(record.id)"
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
    title="编辑分类信息"
    v-model:visible="editModelVisible"
    :confirm-loading="editModelLoading"
    @ok="editHandleModelOk"
    cancelText="取消"
    okText="确认"
  >
    <p>
      <a-form :label-col="{ span: 3, offset: 2 }">
        <a-form-item label="名称">
          <a-input v-model:value="category.name" class="len" />
        </a-form-item>
        <a-form-item label="父类目">
          <a-select v-model:value="category.parent" ref="select" class="len">
            <a-select-option :value="0"> 无 </a-select-option>
            <a-select-option
              v-for="c in leave1"
              :key="c.id"
              :value="c.id"
              :disabled="category.id === c.id"
            >
              {{ c.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="顺序">
          <a-input v-model:value="category.sort" class="len" />
        </a-form-item>
      </a-form>
    </p>
  </a-modal>
</template>

<script lang="ts">
import axios from "axios";
import { defineComponent, onMounted, ref } from "vue";
import { Tool } from "@/util/tool";

export default defineComponent({
  name: "Category",
  setup() {
    const categorys = ref();
    // 定义加载的缓存图标，默认false
    const loading = ref(false);
    const leave1 = ref();

    // 定义渲染每一列
    const columns = [
      {
        title: "名称",
        dataIndex: "name",
      },
      {
        title: "顺序",
        dataIndex: "sort",
      },
      {
        title: "Action",
        key: "action",
        slots: { customRender: "action" },
      },
    ];

    // 页面初始化，向后端发起请求
    const handleQuery = () => {
      loading.value = true;
      axios.get("/wiki/category/list").then((res) => {
        loading.value = false;
        categorys.value = res.data.content;
        leave1.value = [];
        leave1.value = Tool.array2Tree(categorys.value, 0);
      });
    };

    // 编辑数据使用，直接使用将record当做参数传递到函数内部
    const category = ref({});
    const editModelVisible = ref<boolean>(false);
    const editModelLoading = ref<boolean>(false);
    const editCategory = (record: any) => {
      editModelVisible.value = true;
      category.value = Tool.copy(record);
    };
    const editHandleModelOk = () => {
      editModelLoading.value = true;
      axios.put("/wiki/category/edit", category.value).then((res) => {
        const data = res.data;
        if (data.success) {
          setTimeout(() => {
            editModelVisible.value = false;
            editModelLoading.value = false;
          }, 50);
        }
        handleQuery();
      });
    };

    // 删除电子书逻辑
    const deleteCategory = (id: number) => {
      axios.delete("/wiki/category/remove/" + id).then((res) => {
        if (res.data.success) {
          // 重新刷新页面，并且还是本页
          handleQuery();
        }
      });
    };

    // 新增电子书信息
    const addModelVisible = ref<boolean>(false);
    const addModelLoading = ref<boolean>(false);
    const add = () => {
      addModelVisible.value = true;
      category.value = {};
    };

    const addHandleModelOk = () => {
      addModelLoading.value = true;
      axios.post("/wiki/category/add", category.value).then((res) => {
        const data = res.data;
        if (data.success) {
          setTimeout(() => {
            addModelVisible.value = false;
            addModelLoading.value = false;
          }, 50);
          handleQuery();
        }
      });
    };

    // 页面初始化，查询所有的分类
    onMounted(() => {
      handleQuery();
    });

    return {
      // 表格初始化数据
      leave1,
      columns,
      loading,
      handleQuery,

      category,
      editCategory,
      editModelVisible,
      editModelLoading,
      editHandleModelOk,

      add,
      addModelVisible,
      addHandleModelOk,
      addModelLoading,

      deleteCategory,
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

