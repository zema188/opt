<script setup>
const props = defineProps({
    object: {
        type: Array,
        required: true
    },
    reactiveStyleForCells: {
        type: Object,
        required: true 
    },
    activeDragObject: {
        type: Object,
        required: true
    }
})
</script>

<template>
    <div class="table__header-item-w"
        :name="props.object[0]"
        :class="{active: props.activeDragObject === props.object[0]}"
    >
        <div class="table__header-item cell"
            :class="props.object[0]"
            :style="{ minWidth: reactiveStyleForCells[props.object[0]] + 'px' + '!important'}"
        >
            {{ props.object[1] }}
        </div>
        <div class="line"
            v-if="tableContent"
            @mousedown="startDrag($event)"
            @mousemove="drag($event)"
            @mouseup="stopDrag($event)"
            :style="{ height: props.activeDragObject === props.object[0] ? lineHeight() + 'px' : '100%'}"
        ></div>
    </div>
</template>

<style lang="scss" scoped>

</style>