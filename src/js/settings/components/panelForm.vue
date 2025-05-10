<script setup lang="ts">
import { onMounted, defineProps, ref } from 'vue';
import { NCard, NForm, NFormItem, NInput, NButton } from 'naive-ui';
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

const onCanceled = () => {
    emit('canceled')
}

const onSubmitted = () => {
    emit('submitted', node.value)
}
</script>

<template>
    <n-card>
        <n-form ref="formRef" :label-width="80" :model="node" size="small">
            <n-form-item :label="$t('settings.panelForm.name')" path="label">
                <n-input v-model:value="node.label" placeholder="" />
            </n-form-item>
        </n-form>
        <template #footer>
            <div style="width:100%;display: flex;justify-content: flex-end;">
                <n-button round size="small" @click="onCanceled">{{ $t('settings.panelForm.cancel') }}</n-button>
                <n-button style="margin-left: 8px;" type="primary" round size="small" @click="onSubmitted">{{ $t('settings.panelForm.confirm') }}</n-button>
            </div>
        </template>
    </n-card>
</template>

<style>

</style>