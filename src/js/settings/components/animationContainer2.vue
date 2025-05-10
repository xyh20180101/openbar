<template>
    <div class="reveal-wrapper" ref="wrapperRef">
        <div class="reveal-content">
            <slot />
        </div>
        <div class="reveal-mask" :class="'mask-' + maskStart" :style="{
            width: maskStart === 'left' || maskStart === 'right' ? width + 'px' : '100%',
            height: maskStart === 'top' || maskStart === 'bottom' ? height + 'px' : '100%',
            animationDelay: (props.delay) + 'ms'
        }" ref="maskRef"></div>
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'

const props = defineProps({
    delay: {
        type: String,
        default: '0'
    },
    maskStart: {
        type: String,
        default: 'left',
        validator: val => ['left', 'right', 'top', 'bottom'].includes(val)
    }
})

const wrapperRef = ref(null)
const maskRef = ref(null)
const width = ref(0)
const height = ref(0)

onMounted(async () => {
    await nextTick()
    width.value = wrapperRef.value.offsetWidth
    height.value = wrapperRef.value.offsetHeight
})
</script>

<style scoped>
.reveal-wrapper {
    display: inline-block;
    position: relative;
    overflow: visible;
}

.reveal-content {
    white-space: nowrap;
    position: relative;
    z-index: 1;
}

.reveal-mask {
    position: absolute;
    background-color: white;
    z-index: 2;
    animation: maskMove 1.2s cubic-bezier(1, 0, 0.1, 1) forwards;
}

/* 从左向右移出 */
.mask-left {
  top: 0;
  left: 0;
  bottom: 0;
  animation-name: maskMoveLeft;
}

/* 从右向左移出 */
.mask-right {
  top: 0;
  right: 0;
  bottom: 0;
  animation-name: maskMoveRight;
}

/* 从上往下移出 */
.mask-top {
  top: 0;
  left: 0;
  right: 0;
  animation-name: maskMoveTop;
}

/* 从下往上移出 */
.mask-bottom {
  bottom: 0;
  left: 0;
  right: 0;
  animation-name: maskMoveBottom;
}

@keyframes maskMoveLeft {
  0% {
    left: 0;
    width: 100%;
  }
  100% {
    left: 100%;
    width: 0;
  }
}

@keyframes maskMoveRight {
  0% {
    right: 0;
    width: 100%;
  }
  100% {
    right: 100%;
    width: 0;
  }
}

@keyframes maskMoveTop {
  0% {
    top: 0;
    height: 100%;
  }
  100% {
    top: 100%;
    height: 0;
  }
}

@keyframes maskMoveBottom {
  0% {
    bottom: 0;
    height: 100%;
  }
  100% {
    bottom: 100%;
    height: 0;
  }
}
</style>