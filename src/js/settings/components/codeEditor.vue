<script setup lang="ts">
import { defineProps, defineEmits, defineExpose, ref } from 'vue'
import { loader, VueMonacoEditor } from "@guolao/vue-monaco-editor"
import * as monaco from "monaco-editor"
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker"
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker"
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker"
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker"
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker"

self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === "json") {
      return new jsonWorker()
    }
    if (label === "css" || label === "scss" || label === "less") {
      return new cssWorker()
    }
    if (label === "html" || label === "handlebars" || label === "razor") {
      return new htmlWorker()
    }
    if (label === "typescript" || label === "javascript") {
      return new tsWorker()
    }
    return new editorWorker()
  }
}

loader.config({ monaco })

const props = defineProps({
    modelValue: String,
    language: { type: String, default: 'javascript' },
    options: { type: Object, default: () => ({ wordWrap: 'on'}) }
})
const emit = defineEmits(['update:modelValue'])
const editorValue = ref(props.modelValue)

</script>

<template>
    <vue-monaco-editor v-model:value="editorValue" @update:value="emit('update:modelValue', $event)" theme="vs-dark"
        :language="props.language" :options="props.options"></vue-monaco-editor>
</template>

<style scoped>
::v-deep(.monaco-editor) {
    position: absolute !important;
}
</style>