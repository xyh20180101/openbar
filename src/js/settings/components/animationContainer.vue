<template>
    <div class="reveal-wrapper" ref="wrapperRef">
        <div class="reveal-content" :style="contentStyle">
            <slot />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue'

const props = defineProps({
    delay: {
        type: String,
        default: '0'
    },
})

const wrapperRef = ref(null)
const width = ref(0)
const showContent = ref(false)

onMounted(async () => {
    await nextTick()
    width.value = wrapperRef.value.offsetWidth

    setTimeout(() => {
        showContent.value = true
    }, Number(props.delay))
})

const contentStyle = computed(() => ({
    animationDelay: `${props.delay}ms, ${props.delay}ms`,
    visibility: showContent.value ? 'visible' : 'hidden'
}))
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
    animation: scaleDown 1s cubic-bezier(0, 0, 0.1, 1) forwards,
        blur 1s cubic-bezier(0, 0, 0.1, 1) forwards;
    transform-origin: center;
    will-change: transform, filter;
}

@keyframes scaleDown {
    0% {
        transform: scale(1.2) translateX(-50%);
    }

    100% {
        transform: scale(1) translateX(0%);
    }
}

@keyframes blur {
    0% {
        filter: blur(10px);
    }

    100% {
        filter: blur(0.1px);
    }
}
</style>