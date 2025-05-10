<script setup lang="ts">
import { onMounted, defineProps, ref, h } from 'vue'
import { NCard, NForm, NFormItem, NInput, NSelect, NButton, NList, NListItem, NScrollbar, NTabs, NTabPane, NIcon, NButtonGroup } from 'naive-ui'
import SvgIcon from '@jamescoyle/vue-icon'
import * as mdi from '@mdi/js'
import { evalTS } from '../../lib/utils/bolt'
import { openBarHelper } from '../../lib/openBarHelper'
import './form.css'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

onMounted(() => {
    loadAllEffects()
})
const props = defineProps({
    node: {
        type: Object,
        required: true
    }
})
const emit = defineEmits(['update:node', 'canceled', 'submitted'])

const data = openBarHelper.getData()

const effectList = ref<any[]>([])
const node = ref({ ...props.node })
const effect = ref('')
const mdiIconList: any[] = Object.entries(mdi)
    .filter(([key]) => key.startsWith("mdi"))
    .map(([value, path]) => ({ value, path }))

const onCanceled = () => {
    emit('canceled')
}

const onSubmitted = () => {
    if (data.settings.autoName && node.value.label === '' && node.value.effects.length > 0)
        node.value.label = node.value.effects.length > 1 ? getDisplayName(node.value.effects[0]) + t('settings.effectButtonForm.etc') : getDisplayName(node.value.effects[0])
    emit('submitted', node.value)
}

const loadAllEffects = () => {
    evalTS('getAllEffects').then((effects) => {
        effectList.value = effects
    })
}

const addSelectedEffect = () => {
    evalTS('getSelectedEffects').then((effects) => {
        effects.forEach((e: string) => {
            node.value.effects.push(e)
        })
    })
}

const getDisplayName = (matchName: string) => {
    let e = effectList.value.find(p => p.matchName === matchName)
    if (e)
        return e.displayName
    else
        return ''
}

const renderIconSelection = (o: any) => {
    return h('div', { style: 'display:flex;flex-direction:row;align-items:center;line-height:1' }, [
        h(NIcon, { size: 24 }, () => h(SvgIcon, { type: 'mdi', path: o.path }, {})),
        h('span', { style: 'margin-left:8px' }, o.value)
    ])
}

const up = (effect: string) => {
    const i = node.value.effects.indexOf(effect)
    if (i > 0) {
        const temp = node.value.effects[i - 1]
        node.value.effects[i - 1] = node.value.effects[i]
        node.value.effects[i] = temp
    }
}

const down = (effect: string) => {
    const i = node.value.effects.indexOf(effect)
    if (i !== -1 && i < node.value.effects.length - 1) {
        const temp = node.value.effects[i + 1]
        node.value.effects[i + 1] = node.value.effects[i]
        node.value.effects[i] = temp
    }
}

const remove = (effect: string) => {
    const i = node.value.effects.indexOf(effect)
    if (i !== -1)
        node.value.effects.splice(i, 1)
}
</script>

<template>
    <n-card>
        <n-form ref="formRef" :label-width="80" :model="node" size="small">
            <n-form-item :label="$t('settings.effectButtonForm.name')" path="label">
                <n-input v-model:value="node.label" placeholder="" />
            </n-form-item>
            <n-form-item :label="$t('settings.effectButtonForm.icon')" path="icon">
                <div style="display: flex;width: 100%;align-items: center;">
                    <n-select filterable v-model:value="node.icon" :options="mdiIconList"
                        :render-label="renderIconSelection">
                    </n-select>
                    <n-button round style="margin-left:8px"
                        @click="node.icon = mdiIconList[Math.floor(Math.random() * mdiIconList.length)].value">
                        {{ $t('settings.effectButtonForm.random') }}
                    </n-button>
                </div>
            </n-form-item>
            <n-form-item :label="$t('settings.effectButtonForm.effectList')" path="effects">
                <div style="width: 100%;display: grid;gap: 8px;">
                    <n-list hoverable bordered>
                        <n-scrollbar style="max-height: 120px">
                            <n-list-item v-for="e in node.effects" style="padding: 4px;">
                                <div style="display: flex;width: 100%;align-items: center;">
                                    <span style="flex:1;margin-left:7px;height: 20px;">{{ getDisplayName(e) }}</span>
                                    <n-button-group>
                                        <n-button text @click="up(e)">
                                            <template #icon>
                                                <n-icon>
                                                    <svg-icon type="mdi" :path="mdi.mdiChevronUp"></svg-icon>
                                                </n-icon>
                                            </template>
                                        </n-button>
                                        <n-button text @click="down(e)">
                                            <template #icon>
                                                <n-icon>
                                                    <svg-icon type="mdi" :path="mdi.mdiChevronDown"></svg-icon>
                                                </n-icon>
                                            </template>
                                        </n-button>
                                    </n-button-group>
                                    <n-button text @click="remove(e)">
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
                    <n-tabs type="segment" animated size="small">
                        <n-tab-pane name="chap1" :tab="$t('settings.effectButtonForm.select')">
                            <div style="display:flex;gap:8px">
                                <n-select filterable v-model:value="effect" :options="effectList"
                                    label-field="displayName" value-field="matchName" />
                                <n-button round @click="node.effects.push(effect)" :disabled="effect === ''">
                                    {{ $t('settings.effectButtonForm.add') }}
                                </n-button>
                            </div>
                        </n-tab-pane>
                        <n-tab-pane name="chap2" :tab="$t('settings.effectButtonForm.getFromLayers')">
                            <n-button round @click="addSelectedEffect" style="width:100%">
                                {{ $t('settings.effectButtonForm.addSelected') }}
                            </n-button>
                        </n-tab-pane>
                    </n-tabs>
                </div>
            </n-form-item>
        </n-form>
        <template #footer>
            <div style="width:100%;display: flex;justify-content: flex-end;">
                <n-button round size="small" @click="onCanceled">{{ $t('settings.effectButtonForm.cancel') }}</n-button>
                <n-button style="margin-left: 8px;" type="primary" round size="small" @click="onSubmitted">
                    {{ $t('settings.effectButtonForm.confirm') }}
                </n-button>
            </div>
        </template>
    </n-card>
</template>

<style scoped>
::v-deep(.n-base-select-option__content) {
    line-height: 1;
}
</style>