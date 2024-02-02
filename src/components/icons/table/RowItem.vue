
<script setup>
import IconMenu from '@/components/icons/IconMenu.vue'
const props = defineProps({
    row: {
        type: Object,
        required: true
    },
    header: {
        type: Object,
    },
    heightRow: {
        type: Number,
    },
    number: {
        type: Number,
    },
    reactiveStyleForCells: {
        type: Object,
    },
    namesCols: {
        type: Object,
    }
})
</script>

<template>
    <div
        :style="{height: props.heightRow + 'px'}"
    >
        <div class="cell"
            v-for="(item, index) of props.header"
            :key="index"
            :style="[
                {
                    minWidth: props.reactiveStyleForCells[item[0]] + 'px',
                    width: props.reactiveStyleForCells[item[0]] + 'px',
                }
            ]"
            :class="[
                {
                    _menu: item[0] === 'menu',
                    _points: item[0] === 'points',
                },
                {customHidden: !(props.namesCols && props.namesCols[item[0]] && props.namesCols[item[0]].show)}
            ]"
        >
            <div
                v-if="item[0] === 'menu'"
                @mousedown="$emit('startDragRow',$event, props.row, props.number)"
                @mousemove="$emit('dragRow',$event)"
                @mouseup="$emit('stopDragRow',$event)"
                class="menu-btn"
            >
                <icon-menu />
                <span>
                    {{ props.number }}
                </span>
            </div>
            <div v-if="item[0] === 'points'">
                <span v-for="point of [1,2,3]" :key="point" class="point">
                </span>
            </div>
            <input
                v-if="item[0] === 'name_units'"
                v-model="props.row.name_units"
            />
            <input
                v-if="item[0] === 'price'"
                v-model="props.row.price"
            />
            <input
                v-if="item[0] === 'quantity'"
                v-model="props.row.quantity"
            />
            <input
                v-if="item[0] === 'name_product'"
                v-model="props.row.name_product"
            />
            <input
                v-if="item[0] === 'total'"
                v-model="props.row.total"
            />
        </div>
    </div>
</template>

<style lang="scss" scoped>

</style>