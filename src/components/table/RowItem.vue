
<script setup>
import IconMenu from '@/components/icons/IconMenu.vue'
import IconTriangle from '@/components/icons/IconTriangle.vue'
import { ref, watchEffect } from 'vue'
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
    },
    updateData: {
        type: Number,
    },
    goods: {
        type: Array,
    },
    dragColName: {
        type: Number,
    }
})

const emit = defineEmits(['openDropdownNameUnits', 'toggleDropdownNameUnits'])


let pointsFormIsActive = ref(false)
const openDropdownNameUnits = (event) => {
    emit('openDropdownNameUnits', event, props.row)
}

const toggleDropdownNameUnits = (event) => {
    emit('toggleDropdownNameUnits', event, props.row)
}

watchEffect(() => {
    if (props.updateData) {
        pointsFormIsActive.value = false
    }
});

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
                    move: props.dragColName === item[0],
                    customHidden: namesCols && !(namesCols[item[0]] && namesCols[item[0]].show)
                },
            ]"
        >
            <div class="subtitle" v-if="item[0] === 'menu'">
                Номер строки
            </div>
            <div class="subtitle" v-if="item[0] === 'points'">
                Действие
            </div>
            <div class="subtitle" v-if="item[0] === 'name_units'">
                Название
            </div>
            <div class="subtitle" v-if="item[0] === 'price'">
                Цена
            </div>
            <div class="subtitle" v-if="item[0] === 'quantity'">
                Количество
            </div>
            <div class="subtitle" v-if="item[0] === 'name_product'">
                Название товара
            </div> 
            <div class="subtitle" v-if="item[0] === 'total'">
                Итого
            </div>
            <div
                v-if="item[0] === 'menu'"
                @mousedown="$emit('startDragRow',$event, props.row, props.number)"
                @mousemove="$emit('dragRow',$event)"
                @mouseup="$emit('stopDragRow',$event)"
                class="menu-btn"
            >
                <icon-menu />
                <span>
                    {{ props.number + 1}}
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
            <div class="input-w"
                v-if="item[0] === 'name_units'"
            >
                <input
                    v-model="props.row.name_units"
                    @focus="openDropdownNameUnits($event)"
                    @input="$emit('updateData')"
                />
                <div class="input-w__btn"
                    @click="toggleDropdownNameUnits"
                >
                    <icon-triangle/>
                </div>
            </div>
            <input
                v-if="item[0] === 'price'"
                v-model="props.row.price"
                @input="$emit('updateData')"
            />
            <div class="input-w"
                v-if="item[0] === 'quantity'"
            >
                <input
                    v-model="props.row.quantity"
                    @input="$emit('updateData')"
                />
                <div class="input-w__btn">
                    <icon-triangle/>
                </div>
            </div>
            <input
                v-if="item[0] === 'name_product'"
                v-model="props.row.name_product"
                @input="$emit('updateData')"
            />
            <input
                v-if="item[0] === 'total'"
                v-model="props.row.total"
                @input="$emit('updateData')"
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
    z-index: 1;
    @media (max-width: 539px) {
        left: 17px;
        top: calc(100% - 0px);
        width: 70%;
        max-width: 355px;
        text-align: left;
        padding: 7px 19.4px 7px 10px;
    }
}

._menu {
    padding: 10px 10px 10px 15px;
}

.subtitle {
    display: none;
    font-size: 10px;
    color: #8f8f8f;
    flex: 0 0 100%;
    @media (max-width: 539px) {
        display: block;
    }
}

.move {
    background: rgba(249, 249, 249, 0.5);
}
.input-w {
    position: relative;
    width: 100%;

    &__btn {
        right: 1px;
        top: 1px;
        position: absolute;
        border-radius: 4px;
        width: 21px;
        height: calc(100% - 1px);
        background-color: rgba(0, 0, 0, 0.07);
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        & svg {
            width: 5px;
            height: 5px;
            transform: rotate(90deg);
        }
    }
}
</style>