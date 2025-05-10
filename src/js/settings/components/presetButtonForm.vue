<script setup lang="ts">
import { onMounted, defineProps, ref, h } from 'vue';
import { NCard, NForm, NFormItem, NInput, NSelect, NButton, NIcon, NList, NListItem, NScrollbar, NPopover, NButtonGroup, NUpload, NUploadDragger, UploadCustomRequestOptions } from 'naive-ui';
import SvgIcon from '@jamescoyle/vue-icon'
import * as mdi from '@mdi/js'
import { evalTS } from '../../lib/utils/bolt'
import { openBarHelper } from '../../lib/openBarHelper'
import './form.css'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

onMounted(() => {
})
const props = defineProps({
    node: {
        type: Object,
        required: true
    }
})
const emit = defineEmits(['update:node', 'canceled', 'submitted'])

const data = openBarHelper.getData()

const node = ref({ ...props.node })
const mdiIconList: any[] = Object.entries(mdi)
    .filter(([key]) => key.startsWith("mdi"))
    .map(([value, path]) => ({ value, path }))
const fileList = ref<any[]>([])

const onCanceled = () => {
    emit('canceled')
}

const onSubmitted = () => {
    if (data.settings.autoName && node.value.label === '' && node.value.presets.length > 0)
        node.value.label = node.value.presets.length > 1 ? getNameFromPath(node.value.presets[0]) + t('settings.effectButtonForm.etc') : getNameFromPath(node.value.presets[0])
    emit('submitted', node.value)
}

const renderIconSelection = (o: any) => {
    return h('div', { style: 'display:flex;flex-direction:row;align-items:center;line-height:1' }, [
        h(NIcon, { size: 24 }, () => h(SvgIcon, { type: 'mdi', path: o.path }, {})),
        h('span', { style: 'margin-left:8px' }, o.value)
    ])
}

const dragFile = (options: any) => {
    console.log(options)
    node.value.presets.push(options.file.fullPath)
}

const openAeFileSelector = () => {
    evalTS('selectFiles').then((fileNames: string[]) => {
        console.log(fileNames)
        for (let i = 0; i < fileNames.length; i++)
            node.value.presets.push(fileNames[i])
    })
}

function getNameFromPath(path: string) {
    const fileNameWithExt = path.split(/[/\\]/).pop()
    if (!fileNameWithExt) return ''

    const dotIndex = fileNameWithExt.lastIndexOf('.')
    if (dotIndex === -1) return fileNameWithExt

    return fileNameWithExt.substring(0, dotIndex)
}

const up = (preset: string) => {
    const i = node.value.presets.indexOf(preset)
    if (i > 0) {
        const temp = node.value.presets[i - 1]
        node.value.presets[i - 1] = node.value.presets[i]
        node.value.presets[i] = temp
    }
}

const down = (preset: string) => {
    const i = node.value.presets.indexOf(preset)
    if (i !== -1 && i < node.value.presets.length - 1) {
        const temp = node.value.presets[i + 1]
        node.value.presets[i + 1] = node.value.presets[i]
        node.value.presets[i] = temp
    }
}

const remove = (preset: string) => {
    const i = node.value.presets.indexOf(preset)
    if (i !== -1)
        node.value.presets.splice(i, 1)
}
</script>

<template>
    <n-card>
        <n-form ref="formRef" :label-width="80" :model="node" size="small">
            <n-form-item :label="$t('settings.presetButtonForm.name')" path="label">
                <n-input v-model:value="node.label" placeholder="" />
            </n-form-item>
            <n-form-item :label="$t('settings.presetButtonForm.icon')" path="icon">
                <div style="display: flex;width: 100%;align-items: center;">
                    <n-select filterable v-model:value="node.icon" :options="mdiIconList"
                        :render-label="renderIconSelection">
                    </n-select>
                    <n-button round style="margin-left:8px"
                        @click="node.icon = mdiIconList[Math.floor(Math.random() * mdiIconList.length)].value">{{
                            $t('settings.presetButtonForm.random') }}</n-button>
                </div>
            </n-form-item>
            <n-form-item :label="$t('settings.presetButtonForm.presetList')" path="presets">
                <div style="width: 100%;display: grid;gap: 8px;">
                    <n-list hoverable bordered>
                        <n-scrollbar style="max-height: 120px">
                            <n-list-item v-for="p in node.presets" style="padding: 4px;">
                                <div style="display: flex;width: 100%;align-items: center;">
                                    <n-popover trigger="hover">
                                        <template #trigger>
                                            <n-icon style="margin-left: 7px;margin-right: 8px;">
                                                <svg-icon type="mdi" :path="mdi.mdiFile"></svg-icon>
                                            </n-icon>
                                        </template>
                                        <span>{{ p }}</span>
                                    </n-popover>
                                    <span style="flex: 1;height: 20px;white-space: nowrap;">{{ getNameFromPath(p) }}</span>
                                    <n-button-group>
                                        <n-button text @click="up(p)">
                                            <template #icon>
                                                <n-icon>
                                                    <svg-icon type="mdi" :path="mdi.mdiChevronUp"></svg-icon>
                                                </n-icon>
                                            </template>
                                        </n-button>
                                        <n-button text @click="down(p)">
                                            <template #icon>
                                                <n-icon>
                                                    <svg-icon type="mdi" :path="mdi.mdiChevronDown"></svg-icon>
                                                </n-icon>
                                            </template>
                                        </n-button>
                                    </n-button-group>
                                    <n-button text @click="remove(p)">
                                        <template #icon>
                                            <n-icon>
                                                <svg-icon type="mdi" :path="mdi.mdiTrashCanOutline"></svg-icon>
                                            </n-icon>
                                        </template>
                                    </n-button>
                                </div>
                            </n-list-item>
                        </n-scrollbar>
                    </n-list>
                    <n-button @click="openAeFileSelector" round>
                        {{ $t('settings.presetButtonForm.selectFile') }}
                    </n-button>
                </div>
            </n-form-item>
        </n-form>
        <template #footer>
            <div style="width:100%;display: flex;justify-content: flex-end;">
                <n-button round size="small" @click="onCanceled">{{ $t('settings.presetButtonForm.cancel') }}</n-button>
                <n-button style="margin-left: 8px;" type="primary" round size="small" @click="onSubmitted">{{
                    $t('settings.presetButtonForm.confirm') }}</n-button>
            </div>
        </template>
    </n-card>
</template>

<style></style>