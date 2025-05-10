<script setup lang="ts">
import pkg from '../../../package.json'
import { onBeforeMount, ref, h, watch, computed } from 'vue';
import { openBarHelper } from '../lib/openBarHelper'
import { darkTheme, NConfigProvider, NModalProvider, NScrollbar, NIcon, NTabs, NTabPane, NButton, NTree, TreeOption, NPopconfirm, NModal, NDropdown, NSelect, NTag, NCheckbox, NRadioGroup, NRadio, NDivider, NColorPicker, TreeDropInfo, NSlider, NPopover, NDialog } from 'naive-ui'
import { v4 as uuidv4 } from 'uuid';
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiPlus, mdiSquareEditOutline, mdiEye, mdiTrashCanOutline } from '@mdi/js'
import * as mdi from '@mdi/js'
import PanelForm from './components/panelForm.vue'
import EffectButtonForm from './components/effectButtonForm.vue'
import PresetButtonForm from './components/presetButtonForm.vue'
import ExpressionButtonForm from './components/expressionButtonForm.vue'
import MenuCommandButtonForm from './components/menuCommandButtonForm.vue'
import CommandButton from './components/commandButtonForm.vue'
import AnimationContainer from './components/animationContainer.vue'
import AnimationContainer2 from './components/animationContainer2.vue'
import { useI18n } from 'vue-i18n'
import { languageOptions } from '../../locales/main'
import { evalTS, openLinkInBrowser } from '../lib/utils/bolt'
const { t, locale } = useI18n()

const data = ref<any>(openBarHelper.getData())
watch(data, async (newVal, oldVal) => {
  openBarHelper.setData(newVal)
  openBarHelper.sendUpdatedEvent(newVal)
}, { deep: true })

const selectedNode = ref<any>({}) //打开表单时所点击的节点
const formMode = ref('') //表单模式:add=添加,edit=编辑
const showNodeForm = ref(false) //是否显示表单
const nodeFormType = ref('') //表单类型
const node = ref({}) //表单数据
const draggingNode = ref<any>(null)
const nodeTypes = computed(() =>
  [
    {
      key: 'effectButton',
      title: t('buttonTypes.effect')
    },
    {
      key: 'presetButton',
      title: t('buttonTypes.preset')
    },
    {
      key: 'expressionButton',
      title: t('buttonTypes.expression')
    },
    {
      key: 'menuCommandButton',
      title: t('buttonTypes.menuCommand')
    },
    {
      key: 'commandButton',
      title: t('buttonTypes.command')
    }
  ]
)
const buttonStyleTypes = ['', 'secondary', 'quaternary', 'ghost', 'text']
const buttonShapeTypes = ['', 'round', 'circle']
const buttonSizeString = computed(() => {
  switch (data.value.settings.buttonSize) {
    case 1: return 'tiny'
    case 2: return 'small'
    case 3: return 'medium'
    case 4: return 'large'
  }
})
const showUpdate = ref(false)
const showNoUpdate = ref(false)

const renderLabel = ({ option }: { option: any }) => {
  switch (option.type) {
    case 'panel': return h('span', { style: 'margin-left:4px', class: option.isVisible ? 'visible' : 'invisible' }, option.label)
    case 'effectButton': return h('div', {
      style: 'display: flex;width: 100%;align-items: center;',
      class: option.isVisible ? 'visible' : 'invisible'
    }, [
      h(NIcon, { size: 16 }, () => h(SvgIcon, { type: 'mdi', path: mdi[option.icon] }, {})),
      h('span', { style: 'margin-left:4px' }, option.label),
      h(NTag, { size: 'small', style: 'margin-left:4px', round: true }, () => t('buttonTypes.effect'))
    ])
    case 'presetButton': return h('div', {
      style: 'display: flex;width: 100%;align-items: center;',
      class: option.isVisible ? 'visible' : 'invisible'
    }, [
      h(NIcon, { size: 16 }, () => h(SvgIcon, { type: 'mdi', path: mdi[option.icon] }, {})),
      h('span', { style: 'margin-left:4px' }, option.label),
      h(NTag, { size: 'small', style: 'margin-left:4px', round: true }, () => t('buttonTypes.preset'))
    ])
    case 'expressionButton': return h('div', {
      style: 'display: flex;width: 100%;align-items: center;',
      class: option.isVisible ? 'visible' : 'invisible'
    }, [
      h(NIcon, { size: 16 }, () => h(SvgIcon, { type: 'mdi', path: mdi[option.icon] }, {})),
      h('span', { style: 'margin-left:4px' }, option.label),
      h(NTag, { size: 'small', style: 'margin-left:4px', round: true }, () => t('buttonTypes.expression'))
    ])
    case 'menuCommandButton': return h('div', {
      style: 'display: flex;width: 100%;align-items: center;',
      class: option.isVisible ? 'visible' : 'invisible'
    }, [
      h(NIcon, { size: 16 }, () => h(SvgIcon, { type: 'mdi', path: mdi[option.icon] }, {})),
      h('span', { style: 'margin-left:4px' }, option.label),
      h(NTag, { size: 'small', style: 'margin-left:4px', round: true }, () => t('buttonTypes.menuCommand'))
    ])
    case 'commandButton': return h('div', {
      style: 'display: flex;width: 100%;align-items: center;',
      class: option.isVisible ? 'visible' : 'invisible'
    }, [
      h(NIcon, { size: 16 }, () => h(SvgIcon, { type: 'mdi', path: mdi[option.icon] }, {})),
      h('span', { style: 'margin-left:4px' }, option.label),
      h(NTag, { size: 'small', style: 'margin-left:4px', round: true }, () => t('buttonTypes.command'))
    ])
  }
}

//树操作按钮渲染
const renderSuffix = ({ option }: { option: TreeOption }) => {
  return [
    h(NDropdown,
      {
        trigger: "click",
        options: nodeTypes.value,
        onSelect: (buttonType) => openNodeForm(option, buttonType, 'add')
      },
      {
        default: () => h(
          NButton,
          {
            text: true, disabled: option.type !== 'panel', onClick: (event) => { event.stopPropagation() },
            class: option.isVisible ? 'visible' : 'invisible'
          },
          { icon: () => h(NIcon, {}, () => h(SvgIcon, { type: 'mdi', path: mdiPlus }, {})) }
        )
      }),
    h(NButton,
      {
        text: true, style: 'margin-left:4px', onClick: (event) => {
          openNodeForm(option, option.type, 'edit')
          event.stopPropagation()
        },
        class: option.isVisible ? 'visible' : 'invisible'
      },
      { icon: () => h(NIcon, {}, () => h(SvgIcon, { type: 'mdi', path: mdiSquareEditOutline }, {})) }
    ),
    h(NButton,
      {
        text: true, style: 'margin-left:4px;', onClick: (event) => {
          option.isVisible = !option.isVisible
          event.stopPropagation()
        },
        class: option.isVisible ? 'visible' : 'invisible'
      },
      { icon: () => h(NIcon, {}, () => h(SvgIcon, { type: 'mdi', path: mdiEye }, {})) }
    ),
    h(NPopconfirm, {
      showIcon: false,
      negativeText: t('settings.buttonManagement.no'),
      positiveText: t('settings.buttonManagement.yes'),
      negativeButtonProps: { round: true, size: 'tiny' },
      positiveButtonProps: { type: 'error', round: true, size: 'tiny' },
      onPositiveClick: () => removeNode(option.key)
    }, {
      trigger: () => h(
        NButton,
        {
          text: true, style: 'margin-left:4px', disabled: option.key === 'default', onClick: (event) => { event.stopPropagation() },
          class: option.isVisible ? 'visible' : 'invisible'
        },
        { icon: () => h(NIcon, {}, () => h(SvgIcon, { type: 'mdi', path: mdiTrashCanOutline }, {})) }
      ),
      default: () => t('settings.buttonManagement.isDelete')
    }),
  ]
}

//节点操作方法
const addNode = (parentKey: any, node: any) => {
  if (!parentKey) {
    data.value.nodeTree.push(node)
    return
  }

  const queue = [...data.value.nodeTree]

  while (queue.length > 0) {
    const currentNode = queue.shift()
    if (currentNode.key === parentKey) {
      currentNode.children = currentNode.children || []
      currentNode.children.push(node)
    }
    if (currentNode.children) {
      queue.push(...currentNode.children)
    }
  }
}

const removeNode = (key: any) => {
  const index = data.value.nodeTree.findIndex((n: any) => n.key === key)
  if (index !== -1) {
    data.value.nodeTree.splice(index, 1)
    return
  }

  const queue = [...data.value.nodeTree]

  while (queue.length > 0) {
    const currentNode = queue.shift()
    if (currentNode.children) {
      const index = currentNode.children.findIndex((child: { key: string; }) => child.key === key)
      if (index !== -1) {
        currentNode.children.splice(index, 1)
      }
      queue.push(...currentNode.children)
    }
  }
}

const allowDrop = (info: any) => {
  const source = draggingNode.value
  const target = info.node
  const dropPosition = info.dropPosition

  if (!source || !target) return false

  const isSourcePanel = source.type === 'panel'
  const isTargetPanel = target.type === 'panel'

  // 面板->面板：只允许 before/after，不允许 inside
  if (isSourcePanel && isTargetPanel) {
    return dropPosition !== 'inside'
  }

  // 面板->按钮：不允许
  if (isSourcePanel && !isTargetPanel) {
    return false
  }

  // 按钮->面板：只允许 inside
  if (!isSourcePanel && isTargetPanel) {
    return dropPosition === 'inside'
  }

  // 按钮->按钮：允许 before/after，不允许 inside（不嵌套按钮）
  if (!isSourcePanel && !isTargetPanel) {
    return dropPosition !== 'inside'
  }

  return false
}

const dragStart = (data: { node: TreeOption, event: DragEvent }) => {
  draggingNode.value = data.node
}

const handleDrop = ({ node, dragNode, dropPosition }: TreeDropInfo) => {
  const [dragNodeSiblings, dragNodeIndex] = findSiblingsAndIndex(dragNode, data.value.nodeTree)
  if (dragNodeSiblings === null || dragNodeIndex === null)
    return
  dragNodeSiblings.splice(dragNodeIndex, 1)
  if (dropPosition === 'inside') {
    if (node.children) {
      node.children.unshift(dragNode)
    }
    else {
      node.children = [dragNode]
    }
  }
  else if (dropPosition === 'before') {
    const [nodeSiblings, nodeIndex] = findSiblingsAndIndex(node, data.value.nodeTree)
    if (nodeSiblings === null || nodeIndex === null)
      return
    nodeSiblings.splice(nodeIndex, 0, dragNode)
  }
  else if (dropPosition === 'after') {
    const [nodeSiblings, nodeIndex] = findSiblingsAndIndex(node, data.value.nodeTree)
    if (nodeSiblings === null || nodeIndex === null)
      return
    nodeSiblings.splice(nodeIndex + 1, 0, dragNode)
  }
  data.value.nodeTree = Array.from(data.value.nodeTree)
}

function findSiblingsAndIndex(
  node: TreeOption,
  nodes?: TreeOption[]
): [TreeOption[], number] | [null, null] {
  if (!nodes)
    return [null, null]
  for (let i = 0; i < nodes.length; ++i) {
    const siblingNode = nodes[i]
    if (siblingNode.key === node.key)
      return [nodes, i]
    const [siblings, index] = findSiblingsAndIndex(node, siblingNode.children)
    if (siblings && index !== null)
      return [siblings, index]
  }
  return [null, null]
}

//节点表单方法
const nodeFormComponent = computed(() => {
  const map = {
    panel: PanelForm,
    effectButton: EffectButtonForm,
    presetButton: PresetButtonForm,
    expressionButton: ExpressionButtonForm,
    menuCommandButton: MenuCommandButtonForm,
    commandButton: CommandButton
  }
  return map[nodeFormType.value] || null
})

const openNodeForm = (option: any, nodeType: any, mode: string) => {
  selectedNode.value = option
  formMode.value = mode

  if (mode === 'add') {
    switch (nodeType) {
      case 'effectButton':
        node.value = { key: uuidv4(), label: '', children: null, type: nodeType, icon: 'mdiAlphaEBox', isVisible: true, effects: [] }
        break
      case 'presetButton':
        node.value = { key: uuidv4(), label: '', children: null, type: nodeType, icon: 'mdiAlphaPBox', isVisible: true, presets: [] }
        break
      case 'expressionButton':
        node.value = { key: uuidv4(), label: '', children: null, type: nodeType, icon: 'mdiAlphaEBox', isVisible: true, expression: '' }
        break
      case 'menuCommandButton':
        node.value = { key: uuidv4(), label: '', children: null, type: nodeType, icon: 'mdiAlphaMBox', isVisible: true, menuCommandId: '' }
        break
      case 'commandButton':
        node.value = { key: uuidv4(), label: '', children: null, type: nodeType, icon: 'mdiAlphaCBox', isVisible: true, command: '' }
        break
    }
  }
  else if (mode === 'edit')
    node.value = option

  nodeFormType.value = nodeType
  showNodeForm.value = true
}

const closeNodeForm = () => {
  selectedNode.value = {}
  node.value = {}
  showNodeForm.value = false
}

const submitNodeForm = (node: any) => {
  if (formMode.value === 'add')
    addNode(selectedNode.value.key, node)
  else if (formMode.value === 'edit') {
    Object.assign(selectedNode.value, node)
  }

  closeNodeForm()
}

const collectFiles = () => {
  const stack = [...data.value.nodeTree].reverse()
  const fileNames = new Set()

  //遍历节点,汇总所有文件路径
  while (stack.length > 0) {
    const node = stack.pop()

    switch (node.type) {
      case 'presetButton':
        for (let i = 0; i < node.presets; i++)
          fileNames.add(node.presets[i])
        break
    }

    if (node.children && node.children.length > 0) {
      for (let i = node.children.length - 1; i >= 0; i--) {
        stack.push(node.children[i])
      }
    }
  }

  //生成复制明细
  const copyInfo = <any[]>[]

  //todo

  evalTS('copyFiles', []).then(result => console.log(result))
}

const checkUpdate = () => {
  fetch('https://api.github.com/repos/xyh20180101/openbar/releases/latest').then(response => response.json())
    .then(data => {
      const githubVersion = data.tag_name
      const currentVersion = pkg.version
      if (compareVersions(githubVersion, currentVersion) > 0) {
        showUpdate.value = true
      }
      else {
        showNoUpdate.value = true
      }
    })
}

function compareVersions(v1, v2) {
  const a = v1.split('.').map(Number)
  const b = v2.split('.').map(Number)
  const len = Math.max(a.length, b.length)
  for (let i = 0; i < len; i++) {
    const num1 = a[i] || 0
    const num2 = b[i] || 0
    if (num1 > num2) return 1
    if (num1 < num2) return -1
  }
  return 0
}
</script>

<template>
  <n-config-provider :theme="darkTheme" :theme-overrides="openBarHelper.naiveUITheme"
    :style="{ backgroundColor: openBarHelper.isAeRuntime() ? 'transparent' : 'black' }">
    <n-modal-provider>
      <n-tabs type="line" animated placement="left">
        <n-tab-pane name="setting1" :tab="$t('settings.buttonManagement.title')">
          <n-scrollbar class="main-scrollbar">

            <!----------新建面板按钮---------->
            <n-button
              @click="() => { addNode('', { key: uuidv4(), label: $t('settings.buttonManagement.newPanel'), children: [], type: 'panel', isVisible: true }) }"
              round size="small">{{ $t('settings.buttonManagement.newPanel') }}
              <template #icon>
                <svg-icon type="mdi" :path="mdiPlus"></svg-icon>
              </template>
            </n-button>

            <!----------面板按钮树---------->
            <n-tree block-line draggable expand-on-dragenter :data="data.nodeTree" expand-on-click
              :render-suffix="renderSuffix" :render-label="renderLabel" @drop="handleDrop" :allow-drop="allowDrop"
              @dragstart="dragStart" />
            <n-modal v-model:show="showNodeForm">
              <component :is="nodeFormComponent" v-model:node="node" @canceled="closeNodeForm"
                @submitted="submitNodeForm" />
            </n-modal>

          </n-scrollbar>
        </n-tab-pane>
        <n-tab-pane name="setting2" :tab="$t('settings.globalSettings.title')">
          <n-scrollbar class="main-scrollbar">
            <div style="display:flex;flex-direction: column;gap: 18px;">

              <!----------语言---------->
              <div class="settings-div-stretch">
                <span class="settings-title">{{ $t('settings.globalSettings.language') }}</span>
                <n-select v-model:value="data.settings.language" :options="languageOptions" size="small" @update:value="(value: any) => {
                  locale = value
                }"></n-select>
              </div>
              <n-divider></n-divider>

              <!----------布局---------->
              <div class="settings-div-stretch">
                <span class="settings-title">{{ $t('settings.globalSettings.layout') }}</span>
                <n-radio-group v-model:value="data.settings.flexDirection" name="flexDirection">
                  <n-radio key="row" value="row">
                    {{ $t('settings.globalSettings.horizontalLayout') }}
                  </n-radio>
                  <n-radio key="column" value="column">
                    {{ $t('settings.globalSettings.verticalLayout') }}
                  </n-radio>
                </n-radio-group>
                <span class="settings-title">{{ $t('settings.globalSettings.gap') }}</span>
                <n-slider v-model:value="data.settings.flexGap" :step="1" :min="0" :max="24"
                  style="padding: 0 8px;box-sizing: border-box;" :format-tooltip="(number) => `${number}px`" />
              </div>
              <n-divider></n-divider>

              <!----------按钮显示---------->
              <div class="settings-div">
                <span class="settings-title">{{ $t('settings.globalSettings.buttonDisplay') }}</span>
                <n-checkbox style="line-height: 1;" v-model:checked="data.settings.showIcon">{{
                  $t('settings.globalSettings.showIcon') }}</n-checkbox>
                <div style="display:flex;width: 100%;align-items: center;">
                  <n-checkbox style="line-height: 1;" v-model:checked="data.settings.showLabel">{{
                    $t('settings.globalSettings.showText') }}</n-checkbox>
                  <n-select style="width:200px" v-model:value="data.settings.showLabelLength"
                    :options="[{ value: '1', label: $t('settings.globalSettings.show1') }, { value: '2', label: $t('settings.globalSettings.show2') }, { value: 'all', label: $t('settings.globalSettings.showAll') }]"
                    size="tiny">
                  </n-select>
                </div>

              </div>

              <!----------按钮样式---------->
              <div class="settings-div">
                <span class="settings-title">{{ $t('settings.globalSettings.buttonStyle') }}</span>
                <n-radio-group v-model:value="data.settings.buttonStyleType" name="buttonStyleType"
                  style="display:flex;flex-wrap: wrap;align-items: center;gap:8px">
                  <div v-for="bst in buttonStyleTypes" style="display: flex;align-items: center;">
                    <n-radio :key="bst" :value="bst"></n-radio>
                    <n-button style="margin-left:8px" :ghost="bst === 'ghost'" :secondary="bst === 'secondary'"
                      :tertiary="bst === 'tertiary'" :quaternary="bst === 'quaternary'" :text="bst === 'text'"
                      :size="buttonSizeString" :color="data.settings.color.main">
                      <span v-if="data.settings.showLabel">{{ openBarHelper.getLabel(data.settings.showLabelLength,
                        $t('settings.globalSettings.sample')) }}</span>
                      <template #icon>
                        <svg-icon v-if="data.settings.showIcon" type="mdi" :path="mdi['mdiAlphaEBox']"></svg-icon>
                      </template>
                    </n-button>
                  </div>
                </n-radio-group>
              </div>

              <!----------按钮形状---------->
              <div class="settings-div">
                <span class="settings-title">{{ $t('settings.globalSettings.buttonShape') }}</span>
                <n-radio-group v-model:value="data.settings.buttonShapeType" name="radiogroup"
                  style="display:flex;flex-wrap: wrap;align-items: center;gap:8px">
                  <div v-for="bst in buttonShapeTypes" style="display: flex;align-items: center;">
                    <n-radio :key="bst" :value="bst"></n-radio>
                    <n-button style="margin-left:8px" ghost :round="bst === 'round'" :circle="bst === 'circle'"
                      :size="buttonSizeString" :color="data.settings.color.main">
                      <span v-if="data.settings.showLabel">{{ openBarHelper.getLabel(data.settings.showLabelLength,
                        $t('settings.globalSettings.sample')) }}</span>
                      <template #icon>
                        <svg-icon v-if="data.settings.showIcon" type="mdi" :path="mdi['mdiAlphaEBox']"></svg-icon>
                      </template>
                    </n-button>
                  </div>
                </n-radio-group>
              </div>

              <!----------按钮颜色---------->
              <div class="settings-div-stretch">
                <span class="settings-title">{{ $t('settings.globalSettings.buttonColor') }}</span>
                <n-checkbox style="line-height: 1;" v-model:checked="data.settings.colorful">{{
                  $t('settings.globalSettings.distinguishDifferentTypesByColor') }}</n-checkbox>
                <div style="display: table;" v-if="data.settings.colorful">
                  <div v-for="nt in nodeTypes" style="display: table-row;">
                    <span style="display: table-cell;white-space: nowrap;vertical-align: middle;padding-right: 8px;">{{
                      nt.title
                    }}</span>
                    <n-color-picker size="small" style="display: table-cell;vertical-align: middle;"
                      v-model:value="data.settings.color[nt.key]" />
                  </div>
                </div>
                <n-color-picker v-if="!data.settings.colorful" size="small" v-model:value="data.settings.color.main" />
              </div>

              <!----------按钮大小---------->
              <div class="settings-div-stretch">
                <span class="settings-title">{{ $t('settings.globalSettings.buttonSize') }}</span>
                <n-slider v-model:value="data.settings.buttonSize" :step="1" :min="1" :max="4"
                  style="padding: 0 8px;box-sizing: border-box;"
                  :marks="{ 1: 'tiny', 2: 'small', 3: 'medium', 4: 'large' }" :tooltip="false" />
              </div>
              <n-divider></n-divider>

              <!----------自动命名---------->
              <div class="settings-div">
                <span class="settings-title">{{ $t('settings.globalSettings.createEditButton') }}</span>
                <div style="display:flex;align-items: center;">
                  <n-checkbox style="line-height: 1;" v-model:checked="data.settings.autoName">{{
                    $t('settings.globalSettings.enableAutoName') }}</n-checkbox>
                  <n-popover style="max-width: 200px" trigger="hover" placement="top" :flip="true">
                    <template #trigger>
                      <svg-icon type="mdi" :path="mdi.mdiHelpCircle" style="height: 16px;outline: none;"></svg-icon>
                    </template>
                    <span>{{ $t('settings.globalSettings.autoNameHint') }}</span>
                  </n-popover>
                </div>
              </div>
              <n-divider></n-divider>

              <!----------备份---------->
              <div class="settings-div">
                <span class="settings-title">{{ $t('settings.globalSettings.backup') }}</span>
                <n-button round size="small"
                  @click="() => { evalTS('openDirectory', openBarHelper.getDataDirectory()) }">{{
                    $t('settings.globalSettings.openDirectory')
                  }}</n-button>
                <div style="display:flex;align-items: center;" v-if="false">
                  <n-button round size="small" @click="collectFiles">{{
                    $t('settings.globalSettings.collectFiles')
                  }}</n-button>
                  <n-popover style="max-width: 200px" trigger="hover" placement="top" :flip="true">
                    <template #trigger>
                      <svg-icon type="mdi" :path="mdi.mdiHelpCircle"
                        style="height: 16px;outline: none;margin-left: 8px;"></svg-icon>
                    </template>
                    <span>{{ $t('settings.globalSettings.collectFilesHint') }}</span>
                  </n-popover>
                </div>
              </div>
            </div>
          </n-scrollbar>
        </n-tab-pane>
        <n-tab-pane name="setting3" :tab="$t('settings.about.title')">
          <div style="display: flex;flex-direction: column;align-items: center;height: 100%;">
            <animation-container delay="0" style="font-size: 32px;font-weight: bold;">openbar</animation-container>
            <animation-container delay="100">
              <div style="display: flex;align-items: center;">
                {{ pkg.version }}
                <n-button size="small" text @click="checkUpdate" style="margin-left: 8px;">
                  <template #icon>
                    <svg-icon type="mdi" :path="mdi.mdiUpdate"></svg-icon>
                  </template>
                </n-button>
              </div>
            </animation-container>
            <animation-container delay="200">
              <animation-container2 maskStart="left" style="margin-top: 32px;">Author: WL</animation-container2>
            </animation-container>
            <animation-container delay="300" style="margin-top: 4px;">
              <animation-container2 maskStart="left">
                <n-button size="small" round ghost @click="openLinkInBrowser('https://github.com/xyh20180101/openbar')">
                  <template #icon>
                    <svg-icon type="mdi" :path="mdi.mdiGithub"></svg-icon>
                  </template>
                  GitHub
                </n-button>
              </animation-container2>
            </animation-container>
          </div>
          <n-modal v-model:show="showUpdate">
            <n-dialog :title="$t('settings.globalSettings.update')" :content="$t('settings.globalSettings.isUpdate')"
              :negative-text="$t('settings.globalSettings.cancel')"
              :positive-text="$t('settings.globalSettings.confirm')" @close="showUpdate = false"
              @positive-click="openLinkInBrowser('https://github.com/xyh20180101/openbar/releases'); showUpdate = false"
              @negative-click="showUpdate = false" :negativeButtonProps="{ round: true }" :positiveButtonProps="{ round: true }" />
          </n-modal>
          <n-modal v-model:show="showNoUpdate">
            <n-dialog :title="$t('settings.globalSettings.update')" :content="$t('settings.globalSettings.isNoUpdate')"
              :negative-text="$t('settings.globalSettings.cancel')" @close="showNoUpdate = false"
              @negative-click="showNoUpdate = false" :negativeButtonProps="{ round: true }" />
          </n-modal>
        </n-tab-pane>
      </n-tabs>
    </n-modal-provider>
  </n-config-provider>
</template>

<style>
.n-config-provider {
  height: 100%;
  padding: 8px;
  box-sizing: border-box;
}

.n-tabs {
  height: 100%;
}

.n-tree {
  margin-top: 4px;
}

.n-tree-node-content__text {
  line-height: 1;
}

.n-tree-node-content:hover .n-tree-node-content__suffix {
  opacity: 1;
  visibility: visible;
  transition: opacity 0.3s, visibility 0.3s;
}

.n-tree-node-content__suffix {
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s, visibility 0.3s;
}

.settings-div {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-self: flex-start;
}

.settings-div-stretch {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-self: flex-start;
  width: 100%;
  max-width: 300px;
}

.settings-title {
  font-weight: bold;
  font-size: 18px;
}

.n-base-selection-input {
  line-height: 2 !important;
}

.main-scrollbar {
  height: 100%;
}

.main-scrollbar .n-scrollbar-content {
  padding-right: 16px;
}

.visible {
  opacity: 1;
  transition: opacity 0.3s;
}

.invisible {
  opacity: 0.38;
  transition: opacity 0.3s;
}
</style>