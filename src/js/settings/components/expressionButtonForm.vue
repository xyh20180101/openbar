<script setup lang="ts">
import { onMounted, defineProps, ref, h } from 'vue';
import { NCard, NForm, NFormItem, NInput, NSelect, NButton, NIcon } from 'naive-ui';
import SvgIcon from '@jamescoyle/vue-icon'
import * as mdi from '@mdi/js'
import codeEditor from './codeEditor.vue'
import './form.css'

onMounted(() => {
})
const props = defineProps({
    node: {
        type: Object,
        required: true
    }
})
const emit = defineEmits(['update:node', 'canceled', 'submitted']);

const node = ref({ ...props.node })
const mdiIconList: any[] = Object.entries(mdi)
    .filter(([key]) => key.startsWith("mdi"))
    .map(([value, path]) => ({ value, path }))

const onCanceled = () => {
    emit('canceled')
}

const onSubmitted = () => {
    emit('submitted', node.value)
}

const renderIconSelection = (o: any) => {
    return h('div', { style: 'display:flex;flex-direction:row;align-items:center;line-height:1' }, [
        h(NIcon, { size: 24 }, () => h(SvgIcon, { type: 'mdi', path: o.path }, {})),
        h('span', { style: 'margin-left:8px' }, o.value)
    ])
}
</script>

<template>
    <n-card>
        <n-form ref="formRef" :label-width="80" :model="node" size="small">
            <n-form-item :label="$t('settings.expressionButtonForm.name')" path="label">
                <n-input v-model:value="node.label" placeholder="" />
            </n-form-item>
            <n-form-item :label="$t('settings.expressionButtonForm.icon')" path="icon">
                <div style="display: flex;width: 100%;align-items: center;">
                    <n-select filterable v-model:value="node.icon" :options="mdiIconList"
                        :render-label="renderIconSelection">
                    </n-select>
                    <n-button round style="margin-left:8px"
                        @click="node.icon = mdiIconList[Math.floor(Math.random() * mdiIconList.length)].value">{{ $t('settings.expressionButtonForm.random') }}</n-button>
                </div>
            </n-form-item>
            <n-form-item :label="$t('settings.expressionButtonForm.expression')" path="expression">
                <div style="height: 200px;width: 100%;">
                    <code-editor v-model="node.expression"></code-editor>
                </div>
            </n-form-item>
        </n-form>
        <template #footer>
            <div style="width:100%;display: flex;justify-content: flex-end;">
                <n-button round size="small" @click="onCanceled">{{ $t('settings.expressionButtonForm.cancel') }}</n-button>
                <n-button style="margin-left: 8px;" type="primary" round size="small" @click="onSubmitted">{{ $t('settings.expressionButtonForm.confirm') }}</n-button>
            </div>
        </template>
    </n-card>
</template>

<style>

</style>