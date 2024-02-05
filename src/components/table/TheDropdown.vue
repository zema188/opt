<script setup>
import { onMounted, onUnmounted } from "vue";
const props = defineProps({
    goods: {
        type: Array,
    },
    isActive: {
        type: Boolean,
    },
    styles: {
        type: Object
    }
})

const emit = defineEmits('updateIsActive')

const handleClick = (event) => {
    const target = event.target
    if(target.classList.contains('dropdown') || (target.closest('.dropdown') && target.closest('.dropdown').classList.contains('dropdown'))) {
    } else {
        if(!target.closest('.input-w') && props.isActive) emit('updateIsActive', !props.isActive)
    }
}

onMounted(() => {
    window.addEventListener('click', handleClick);
})

onUnmounted(() => {
    window.removeEventListener('click', handleClick);
});
</script>

<template>
    <div class="dropdown"
        v-if="props.isActive"
        :style="[
                {
                    left: props.styles.x + 'px',
                    top: props.styles.y + 'px',
                    width: props.styles.width+ 'px',
                }
            ]"
        >
        <div class="dropdown__item"
            v-for="(el, index) of props.goods" :key="index"
            @click="$emit('choiceItem', el)"
        >
            {{ el.name }}
        </div>
    </div>
</template>

<style lang="scss" scoped>
.dropdown {
    position: fixed;
    z-index: 5;
    border-radius: 5px;
    box-shadow: 0 0 3px 0 #000, inset 0 1px 2px 0 rgba(255, 255, 255, 0.5);
    background-color: #fff;
    padding: 5px 10px;
    height: 145px;
    overflow: auto;
&__item {
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #161616;
    cursor: pointer;
    &:not(:last-child) {
        margin-bottom: 12px;
    }
}
}

</style>