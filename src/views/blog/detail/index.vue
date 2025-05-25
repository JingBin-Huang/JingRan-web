<template>
  <div class="container">
    <a-card class="general-card">
      <a-form
        ref="formRef"
        :model="formModel"
        class="blog-detail-form"
        :label-align="'right'"
        :rules="formRules"
        :disabled="disabled"
      >
        <a-form-item label="标题" field="title" label-col-flex="100px">
          <a-input v-model="formModel.title" class="w-1/3" placeholder="请输入文章标题"  allow-clear />
        </a-form-item>
        <a-form-item label="分类" field="category" label-col-flex="100px">
          <a-select v-model="formModel.category" class="w-1/3" placeholder="请选择分类" allow-clear >
            <a-option v-for="item in categories" :key="item.value" :value="item.value">
              {{ item.label }}
            </a-option>
          </a-select>
        </a-form-item>
        <a-form-item label="摘要" field="summary" label-col-flex="100px">
          <a-textarea v-model="formModel.summary" class="w-1/3" placeholder="请输入文章摘要"  allow-clear/>
        </a-form-item>
        <a-form-item label="封面" field="cover_url" label-col-flex="100px">
          <a-input v-model="formModel.cover_url" class="w-1/3" placeholder="请添加文章封面" allow-clear />
        </a-form-item>
        <a-form-item label="作者" field="author" label-col-flex="100px">
          <a-input v-model="formModel.author" class="w-1/3" placeholder="请输入作者" allow-clear disabled/>
        </a-form-item>
        <a-form-item label="是否发布" field="is_published" label-col-flex="100px">
          <a-switch v-model:checked="formModel.is_published">
            <template #checked>
              发布
            </template>
            <template #unchecked>
              草稿
            </template>
          </a-switch>
        </a-form-item>
        <a-form-item label="内容" field="content" label-col-flex="100px">
          <Markdown v-model="formModel.content" :disabled="disabled"/>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import Markdown from '@/components/markdown/index.vue';
import { ref, Ref } from 'vue';

const props = defineProps({
  rid: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const formRef: Ref<any> = ref(null)

const generateFormModel = () => {
  return {
    rid: '',
    title: '',
    summary: '',
    content: '',
    cover_url: '',
    category: '',
    author: 'admin',
    created_at: null,
    is_published: false,
  }
}

const formModel = ref(generateFormModel())

const formRules = {
  rid: [{ required: true, message: '请输入ID' }],
  title: [{ required: true, message: '请输入标题' }],
  summary: [{ required: true, message: '请输入摘要' }],
  category: [{ required: true, message: '请输入分类' }],
}

const categories = [
  { label: '综合', value: 'comprehensive' },
  { label: '后端', value: 'backend' },
  { label: '前端', value: 'frontend' },
  { label: 'Android', value: 'android' },
  { label: 'iOS', value: 'ios' },
  { label: '人工智能', value: 'ai' },
  { label: '开发工具', value: 'devtools' },
  { label: '代码人生', value: 'code-life' },
  { label: '阅读', value: 'reading' }
];

</script>

<script lang="ts">
export default {
  name: 'BlogDetail',
}
</script>

<style scoped lang="less">
.container {
  padding: 0 20px 20px 20px;
}
</style>
