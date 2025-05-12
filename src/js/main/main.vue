<script setup lang="ts">
import { csi } from "../lib/utils/bolt";
import { openBarHelper } from '../lib/openBarHelper'
import { onBeforeMount, ref, nextTick, computed, h } from 'vue';
import { darkTheme, NConfigProvider, NDropdown, NButton } from 'naive-ui';
import SvgIcon from '@jamescoyle/vue-icon'
import * as mdi from '@mdi/js'
import { evalTS } from '../lib/utils/bolt'

const data = ref<any>(openBarHelper.getData())
openBarHelper.registerUpdatedEvent(data)

const currentPanel = ref('')
const menuVisible = ref(false)
const menuX = ref(0)
const menuY = ref(0)
const buttonSizeString = computed(() => {
  switch (data.value.settings.buttonSize) {
    case 1: return 'tiny'
    case 2: return 'small'
    case 3: return 'medium'
    case 4: return 'large'
  }
})

onBeforeMount(() => {
  if (openBarHelper.isAeRuntime()) {
    csi.setPanelFlyoutMenu(`<Menu> \
        <MenuItem Label="---"/> \
        <MenuItem Id="settings" Label="${data.value.settings.language === 'zh' ? '设置' : 'Settings'}"/> \
    </Menu>`)
    csi.addEventListener("com.adobe.csxs.events.flyoutMenuClicked", function (event: { data: { menuId: any; }; }) {
      var clickedId = event.data.menuId;

      switch (clickedId) {
        case "refresh":
          location.reload()
          break;
        case "settings":
          csi.requestOpenExtension('com.openbar.cep.settings', {})
          break;
        default:
          alert("unknown menuId：" + clickedId);
          break;
      }
    })
  }

  currentPanel.value = data.value.nodeTree[0].key
})

const handleContextMenu = (e: MouseEvent) => {
  e.preventDefault()
  menuVisible.value = false
  nextTick().then(() => {
    menuVisible.value = true
    menuX.value = e.clientX
    menuY.value = e.clientY
  })
}

const menuClick = (key: string) => {
  currentPanel.value = key
  menuVisible.value = false
}
const menuClickOutside = () => {
  menuVisible.value = false;
}

const buttonClick = async (b: any) => {
  switch (b.type) {
    case 'effectButton':
      await evalTS('applyEffects', b.effects)
      break
    case 'presetButton':
      await evalTS('applyPresets', b.presets)
      break
    case 'expressionButton':
      await evalTS('applyExpression', b.expression)
      break
    case 'menuCommandButton':
      await evalTS('executeCommand', Number(b.menuCommandId))
      break
    case 'commandButton':
      if (b.command)
        await evalTS('callSystem', b.command).then(result => console.log(result))
      break
  }
}

const renderDropdownLabel = (option: any) => {
  const style = currentPanel.value === option.key ? 'color:var(--n-option-text-color-active)' : ''
  return h('span', { style: style }, option.label)
}
</script>

<template>
  <n-config-provider :theme="darkTheme" :theme-overrides="openBarHelper.naiveUITheme"
    :style="{ backgroundColor: openBarHelper.isAeRuntime() ? openBarHelper.aeBackgroundColor : 'black' }"
    @contextmenu="handleContextMenu">
    <div class="container"
      :style="{ flexDirection: data.settings.flexDirection, padding: `${data.settings.flexGap}px`, gap: `${data.settings.flexGap}px` }">
      <n-button class="button"
        v-for="b in data.nodeTree.find((p: any) => p.key === currentPanel)?.children.filter((p: any) => p.isVisible)"
        :key="b.key" :color="data.settings.colorful ? data.settings.color[b.type] : data.settings.color.main"
        :ghost="data.settings.buttonStyleType === 'ghost'" :secondary="data.settings.buttonStyleType === 'secondary'"
        :quaternary="data.settings.buttonStyleType === 'quaternary'" :text="data.settings.buttonStyleType === 'text'"
        :round="data.settings.buttonShapeType === 'round'" :circle="data.settings.buttonShapeType === 'circle'"
        :size="buttonSizeString" @click="buttonClick(b)">
        <span v-if="data.settings.showLabel && b.label !== ''">{{ openBarHelper.getLabel(data.settings.showLabelLength,
          b.label) }}</span>
        <template #icon>
          <svg-icon v-if="data.settings.showIcon" type="mdi" :path="mdi[b.icon]"></svg-icon>
        </template>
      </n-button>
    </div>
    <n-dropdown oncontextmenu="return false" :show="menuVisible" trigger="manual"
      :options="data.nodeTree.filter((p: any) => p.isVisible)" :x="menuX" :y="menuY" placement="bottom-start"
      :on-clickoutside="menuClickOutside" @select="menuClick" :render-label="renderDropdownLabel" />
  </n-config-provider>
</template>

<style>
.n-config-provider {
  height: 100%;
  box-sizing: border-box;
}

.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  box-sizing: border-box;
  padding: 8px;
  gap: 8px;
}
</style>