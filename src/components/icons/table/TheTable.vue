
<script setup>
import { onMounted, onUpdated, ref, reactive, computed } from "vue";
import IconMenu from '@/components/icons/IconMenu.vue'

const header = ref({
    menu: '',
    points: '',
    name_units: 'Наименование еденицы',
    price: 'Цена',
    quantity: 'Кол-во',
    name_product: 'Наименование товара',
    total: 'Итого',
})

const data = ref([
    {
        name_units: 'Мраморный щебень фр. 2-5 мм, 25кг',
        price: 1231,
        quantity: 12,
        name_product: 'Мраморный щебень',
        total: 1231
    },
    {
        name_units: 'Мраморный щебень фр. 2-5 мм, 25кг',
        price: 1231,
        quantity: 12,
        name_product: 'Мраморный щебень',
        total: 1231
    },
    {
        name_units: 'Мраморный щебень фр. 2-5 мм, 25кг',
        price: 1231,
        quantity: 12,
        name_product: 'Мраморный щебень',
        total: 1231
    },
])

let headerItemsRefs = ref([])
let reactiveStyleForCells = reactive({});
const activeDragObject = ref(null)
let tableHeader = ref(null)
let tableContent = ref(null)
let startX = null

const setItemRef = (el) => {
  headerItemsRefs.value.push(el);
};

const initStyle = () => {
  headerItemsRefs.value.forEach((el) => {
    reactiveStyleForCells[el.getAttribute('name')] = el.offsetWidth;
  });
};


const startDrag = (event) => {
    const selection = window.getSelection();
    console.log(selection)
    if (selection.rangeCount > 0) {
        selection.removeAllRanges();
    }
    const dragObject = event.target.closest('.table__header-item-w');
    startX = event.clientX
    activeDragObject.value = dragObject.getAttribute('name')
};

const drag = (event) => {
  if (event.buttons === 1 && startX !== null) {
    const dragObject = event.target.closest('.table__header-item-w');
    const currentWidth = reactiveStyleForCells[dragObject.getAttribute('name')];
    const shift = currentWidth - (startX - event.clientX);

    reactiveStyleForCells[dragObject.getAttribute('name')] = shift;
    startX = event.clientX;
  }
};

const stopDrag = (event) => {
  activeDragObject.value = null
  startX = null
  console.log('test')
};

const lineHeight = (() => {
    return tableContent.value.getBoundingClientRect().height + tableHeader.value.getBoundingClientRect().height - 1
})
onMounted(() => {
    initStyle()
})
</script>

<template>
    <div class="table" 
    >
        <div class="table__header"
            ref="tableHeader"
        >
            <div class="table__header-item-w"
                v-for="(item, index) of Object.entries(header)"
                :key="index"
                :ref="setItemRef"
                :name="item[0]"
                :class="{active: activeDragObject === item[0]}"
            >
                <div class="table__header-item cell"
                    :class="item[0]"
                    :style="{ width: reactiveStyleForCells[item[0]] + 'px' + '!important'}"
                >
                    {{ item[1] }}
                </div>
                <div class="line"
                    v-if="tableContent"
                    @mousedown="startDrag($event)"
                    @mousemove="drag($event)"
                    @mouseup="stopDrag($event)"
                    :style="{ height: activeDragObject === item[0] ? lineHeight() + 'px' : '100%'}"
                ></div>
            </div>
        </div>
        <div class="table__content"
            ref="tableContent"
        >
            <div class="table__content-item row" v-for="(row, i) of data" :key="i">
                <div class="cell"
                    v-for="(item, index) of Object.entries(header)"
                    :key="index"
                    :class="[
                        {
                            _menu: item[0] === 'menu',
                            _points: item[0] === 'points',
                        }
                    ]"
                    :style="[
                        {
                            minWidth: reactiveStyleForCells[item[0]] + 'px',
                            width: reactiveStyleForCells[item[0]] + 'px',
                        }
                    ]"
                >
                    <icon-menu v-if="item[0] === 'menu'"/>
                    <span v-if="item[0] === 'menu'">
                        {{ i }}
                    </span>
                    <div v-if="item[0] === 'points'">
                        <span v-for="point of [1,2,3]" :key="point" class="point">
                        </span>
                    </div>
                    <input
                        v-if="item[0] === 'name_units'"
                        v-model="row.name_units"
                    />
                    <input
                        v-if="item[0] === 'price'"
                        v-model="row.price"
                    />
                    <input
                        v-if="item[0] === 'quantity'"
                        v-model="row.quantity"
                    />
                    <input
                        v-if="item[0] === 'name_product'"
                        v-model="row.name_product"
                    />
                    <input
                        v-if="item[0] === 'total'"
                        v-model="row.total"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.table {
    overflow: auto;
    &__header {
        display: flex;
    }

    &__header-item {
        font-size: 16px;
        font-weight: 600;
        color: #000;
        padding: 10px 10px 10px 12px;
    }

    &__content {
    }

    &__content-item {
        display: flex;
    }
}

.table__header-item-w {
    position: relative;
    border-top: 1px solid var(--pale-grey);
    border-bottom: 1px solid var(--pale-grey);
    border-right: 1px solid var(--pale-grey);
    &:not(:last-child) {
    }
    & .table__header-item {
        
    }
    &.active {
        & .line {
            opacity: 1;
            &::after {
                position: fixed;
                width: 100%;
                height: 100%;
            }
        }
    }
}

.cell {
    padding: 10px 10px;
    white-space: nowrap;
    overflow: hidden;
    display: flex;
    align-items: center;
    gap: 5px;
    &._menu {
        & svg {
            min-width: 12px;
        }
        & span {
            padding-top: 2px;
        }
    }
}
.row {
    & ._points {
        & div {
            display: flex;
            flex-direction: column;
            gap: 2px;
            justify-content: center;
            align-items: flex-start;
        }
        & span {
            display: block;
            width: 3px;
            height: 3px;
            background: #a6b7d4;
            border-radius: 50%;
        }
    }
}

input {
    padding: 10px 15px 10px 15px;
    border-radius: 5px;
    border: solid 1px #ccc;
    background-color: #fff;
    width: 100%;
}

.menu {
    width: 44px;
}
.points {
    width: 24px;
}
.name_units {
    width: 603px;
}
.price {
    width: 196px;
}
.quantity {
    width: 196px;
}
.name_product {
    width: 193px;
}
.total {
    width: 130px;
}

.line {
    position: absolute;
    right: 0px;
    top: 0;
    width: 1px;
    height: 100%;
    background: var(--pale-grey);
    cursor: e-resize;
    opacity: 0;
    &::after {
        content: "";
        width: 15px;
        position: absolute;
        top: 0;
        left: 50%;
        height: 100%;
        transform: translate(-50%, 0);
        cursor: e-resize;
        z-index: 5;
    }
}

</style>