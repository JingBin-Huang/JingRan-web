<template>
  <div class="container">
    <Breadcrumb :items="['menu.list', 'menu.blog.list']" />
    <a-card class="general-card" :title="$t('menu.blog.list')">
      <a-row>
        <a-col :flex="1">
          <a-form :model="formModel" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }" label-align="left">
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item field="title" :label="$t('blog.form.title')">
                  <a-input v-model="formModel.title" :placeholder="$t('blog.form.title.placeholder')" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="summary" :label="$t('blog.form.summary')">
                  <a-input v-model="formModel.summary" :placeholder="$t('blog.form.summary.placeholder')" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="category" :label="$t('blog.form.category')">
                  <a-input v-model="formModel.category" :placeholder="$t('blog.form.category.placeholder')" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="author" :label="$t('blog.form.author')">
                  <a-input v-model="formModel.author" :placeholder="$t('blog.form.author.placeholder')" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="created_at" :label="$t('blog.form.created_at')">
                  <a-range-picker v-model="formModel.created_at" style="width: 100%" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="is_published" :label="$t('blog.form.is_published')">
                  <a-input v-model="formModel.is_published" :placeholder="$t('blog.form.is_published.placeholder')" />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
        <a-divider style="height: 84px" direction="vertical" />
        <a-col :flex="'86px'" style="text-align: right">
          <a-space direction="vertical" :size="18">
            <a-button type="primary" @click="search">
              <template #icon>
                <icon-search />
              </template>
              {{ $t('blog.form.search') }}
            </a-button>
            <a-button @click="reset">
              <template #icon>
                <icon-refresh />
              </template>
              {{ $t('blog.form.reset') }}
            </a-button>
          </a-space>
        </a-col>
      </a-row>
      <a-divider style="margin-top: 0" />
      <a-row style="margin-bottom: 16px">
        <a-col :span="12">
          <a-space>
            <a-button type="primary" @click="toDetail">
              <template #icon>
                <icon-plus />
              </template>
              {{ $t('searchTable.operation.create') }}
            </a-button>
          </a-space>
        </a-col>
        <a-col :span="12" style="display: flex; align-items: center; justify-content: end">
          <a-tooltip :content="$t('searchTable.actions.refresh')">
            <div class="action-icon" @click="search"><icon-refresh size="18" /></div>
          </a-tooltip>
          <a-dropdown @select="handleSelectDensity">
            <a-tooltip :content="$t('searchTable.actions.density')">
              <div class="action-icon"><icon-line-height size="18" /></div>
            </a-tooltip>
            <template #content>
              <a-doption v-for="item in densityList" :key="item.value" :value="item.value" :class="{ active: item.value === size }">
                <span>{{ item.name }}</span>
              </a-doption>
            </template>
          </a-dropdown>
          <a-tooltip :content="$t('searchTable.actions.columnSetting')">
            <a-popover trigger="click" position="bl" @popup-visible-change="popupVisibleChange">
              <div class="action-icon"><icon-settings size="18" /></div>
              <template #content>
                <div id="tableSetting">
                  <div v-for="(item, index) in showColumns" :key="item.dataIndex" class="setting">
                    <div style="margin-right: 4px; cursor: move">
                      <icon-drag-arrow />
                    </div>
                    <div>
                      <a-checkbox v-model="item.checked" @change="handleChange($event, item, index)"></a-checkbox>
                    </div>
                    <div class="title">
                      {{ item.title === '#' ? '序列号' : item.title }}
                    </div>
                  </div>
                </div>
              </template>
            </a-popover>
          </a-tooltip>
        </a-col>
      </a-row>
      <a-table
        row-key="id"
        :loading="loading"
        :pagination="pagination"
        :columns="cloneColumns"
        :data="renderData"
        :bordered="false"
        :size="size"
        @page-change="onPageChange"
      >
        <template #index="{ rowIndex }">
          {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
        </template>
        <template #cover_url="{ record }">
          <a-image fit="cover" :src="record.cover_url" :alt="record.title" width="80px" />
        </template>
        <template #operations="{ record }">
          <a-button v-permission="['admin']" type="text" size="small" @click="toView(record.id)">
            {{ $t('blog.columns.operations.view') }}
          </a-button>

          <a-dropdown v-permission="['admin']">
            <a-button type="text" size="small">更多</a-button>
            <template #content>
              <a-doption>
                <a-button v-permission="['admin']" type="text" status="warning" @click="toDetail(record.id)">
                {{ $t('blog.columns.operations.edit') }}
              </a-button>
              </a-doption>
              <a-doption>
                <a-button v-permission="['admin']" type="text" status="danger">
                {{ $t('blog.columns.operations.delete') }}
              </a-button>
              </a-doption>
            </template>
          </a-dropdown>
        </template>
      </a-table>
    </a-card>
  </div>

  <a-drawer width="80%" :visible="visible" @ok="handleOk" @cancel="handleCancel" unmountOnClose>
    <template #title>
      博客详情
    </template>
    <BlogDetail :disabled="disabled"></BlogDetail>
  </a-drawer>
</template>

<script lang="ts" setup>
import { BlogParams, BlogRecord, queryBlogList } from '@/api/blog'
import useLoading from '@/hooks/loading'
import { Pagination } from '@/types/global'
import BlogDetail from '@/views/blog/detail/index.vue'
import type { TableColumnData } from '@arco-design/web-vue/es/table/interface'
import cloneDeep from 'lodash/cloneDeep'
import Sortable from 'sortablejs'
import { computed, nextTick, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

type SizeProps = 'mini' | 'small' | 'medium' | 'large'
type Column = TableColumnData & { checked?: true }

const generateFormModel = () => {
  return {
    title: '',
    summary: '',
    cover_url: '',
    category: '',
    author: '',
    created_at: [],
    is_published: null,
  }
}
const { loading, setLoading } = useLoading(true)
const { t } = useI18n()
const renderData = ref<BlogRecord[]>([])
const formModel = ref(generateFormModel())
const cloneColumns = ref<Column[]>([])
const showColumns = ref<Column[]>([])

const size = ref<SizeProps>('medium')

const basePagination: Pagination = {
  current: 1,
  pageSize: 10,
}
const pagination = reactive({
  ...basePagination,
})
const densityList = computed(() => [
  {
    name: t('searchTable.size.mini'),
    value: 'mini',
  },
  {
    name: t('searchTable.size.small'),
    value: 'small',
  },
  {
    name: t('searchTable.size.medium'),
    value: 'medium',
  },
  {
    name: t('searchTable.size.large'),
    value: 'large',
  },
])
const columns = computed(() => [
  {
    title: t('blog.columns.index'),
    dataIndex: 'index',
    slotName: 'index',
  },
  {
    title: t('blog.form.title'),
    dataIndex: 'title',
  },
  {
    title: t('blog.form.summary'),
    dataIndex: 'summary',
  },
  {
    title: t('blog.form.category'),
    dataIndex: 'category',
    slotName: 'category',
  },
  {
    title: t('blog.form.cover_url'),
    dataIndex: 'cover_url',
    slotName: 'cover_url',
  },
  {
    title: t('blog.form.author'),
    dataIndex: 'author',
  },
  {
    title: t('blog.form.created_at'),
    dataIndex: 'created_at',
  },
  {
    title: t('blog.form.is_published'),
    dataIndex: 'is_published',
    slotName: 'is_published',
    align: 'center',
  },
  {
    title: t('blog.form.operations'),
    dataIndex: 'operations',
    slotName: 'operations',
    align: 'center',
  },
])
const fetchData = async (params: BlogParams = { current: 1, pageSize: 20 }) => {
  setLoading(true)
  try {
    const { data } = await queryBlogList(params)
    renderData.value = data.list
    pagination.current = params.current
    pagination.total = data.total
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false)
  }
}

const search = () => {
  fetchData({
    ...basePagination,
    ...formModel.value,
  } as unknown as BlogParams)
}
const onPageChange = (current: number) => {
  fetchData({ ...basePagination, current })
}

fetchData()
const reset = () => {
  formModel.value = generateFormModel()
}

const handleSelectDensity = (val: string | number | Record<string, any> | undefined, e: Event) => {
  size.value = val as SizeProps
}

const handleChange = (checked: boolean | (string | boolean | number)[], column: Column, index: number) => {
  if (!checked) {
    cloneColumns.value = showColumns.value.filter((item) => item.dataIndex !== column.dataIndex)
  } else {
    cloneColumns.value.splice(index, 0, column)
  }
}

const exchangeArray = <T extends Array<any>>(array: T, beforeIdx: number, newIdx: number, isDeep = false): T => {
  const newArray = isDeep ? cloneDeep(array) : array
  if (beforeIdx > -1 && newIdx > -1) {
    // 先替换后面的，然后拿到替换的结果替换前面的
    newArray.splice(beforeIdx, 1, newArray.splice(newIdx, 1, newArray[beforeIdx]).pop())
  }
  return newArray
}

const popupVisibleChange = (val: boolean) => {
  if (val) {
    nextTick(() => {
      const el = document.getElementById('tableSetting') as HTMLElement
      const sortable = new Sortable(el, {
        onEnd(e: any) {
          const { oldIndex, newIndex } = e
          exchangeArray(cloneColumns.value, oldIndex, newIndex)
          exchangeArray(showColumns.value, oldIndex, newIndex)
        },
      })
    })
  }
}

watch(
  () => columns.value,
  (val) => {
    cloneColumns.value = cloneDeep(val)
    cloneColumns.value.forEach((item, index) => {
      item.checked = true
    })
    showColumns.value = cloneDeep(cloneColumns.value)
  },
  { deep: true, immediate: true }
)

const visible = ref(false)
const disabled = ref(false)
const toDetail = (id?: number) => {
  const url = id ? `/blog/detail/${id}` : '/blog/detail'
  visible.value = true
  disabled.value = false
}
const toView = (id: number) => {
  const url = `/blog/detail/${id}`
  visible.value = true
  disabled.value = true
}
const handleOk = () => {
  visible.value = false
}
const handleCancel = () => {
  visible.value = false
}
</script>

<script lang="ts">
export default {
  name: 'BlogList',
}
</script>

<style scoped lang="less">
.container {
  padding: 0 20px 20px 20px;
}
:deep(.arco-table-th) {
  &:last-child {
    .arco-table-th-item-title {
      margin-left: 16px;
    }
  }
}
.action-icon {
  margin-left: 12px;
  cursor: pointer;
}
.active {
  color: #0960bd;
  background-color: #e3f4fc;
}
.setting {
  display: flex;
  align-items: center;
  width: 200px;
  .title {
    margin-left: 12px;
    cursor: pointer;
  }
}
</style>
