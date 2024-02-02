
<script setup>
import IconMenu from '@/components/icons/IconMenu.vue'
import { ref } from 'vue'
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


let pointsFormIsActive = ref(false)
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
                <div class="points-w"
                    @click="pointsFormIsActive = !pointsFormIsActive"
                >
                    <span v-for="point of [1,2,3]" :key="point" class="point">
                    </span>
                </div>
                <button class="points__dropdown"
                    v-if="pointsFormIsActive"
                    @click="$emit('deleteRow', props.number)"
                >
                    Удалить
                </button>
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
._points {
    position: relative;
    overflow: visible;
}

.points-w {
    width: 10px;
    display: flex;
    flex-direction: column;
    gap: 2px;
    justify-content: center;
    align-items: center;
    cursor: pointer;
}

.points__dropdown {
    background: #fff;
    position: absolute;
    padding: 7px 19.4px 7px 5px;
    border-radius: 5px;
    box-shadow: 0 0 3px 0 #000, inset 0 1px 2px 0 rgba(255, 255, 255, 0.5);
    background-color: #fff;
    left: 0;
    top: calc(100% - 13px);
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #ae0a0a;
}
</style>