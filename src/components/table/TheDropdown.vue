<script setup>
const props = defineProps({
    goods: {
        type: Array,
    },
    isActive: {
        type: Array,
    },
    styles: {
        type: Object
    }
})
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
            {{ el }}
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
    padding: 7px 10px;
    height: 300px;
    overflow: auto;
&__item {
    cursor: pointer;
    &:not(:last-child) {
        margin-bottom: 20px;
    }
}
}

</style>