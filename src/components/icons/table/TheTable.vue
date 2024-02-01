
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
        name_units: '1111111111111',
        price: 1231,
        quantity: 12,
        name_product: 'Мраморный щебень',
        total: 1231
    },
    {
        name_units: '22222222222222г',
        price: 1231,
        quantity: 12,
        name_product: 'Мраморный щебень',
        total: 1231
    },
    {
        name_units: '3333333333333',
        price: 1231,
        quantity: 12,
        name_product: 'Мраморный щебень',
        total: 1231
    },
])


const activeDragObject = ref(null)
let headerItemsRefs = ref([])
let reactiveStyleForCells = reactive({});
let tableHeader = ref(null)
let tableContent = ref(null)
let heightRow = ref(45)

const setItemRef = (el) => {
  headerItemsRefs.value.push(el);
};

const initStyle = () => {
  headerItemsRefs.value.forEach((el) => {
    reactiveStyleForCells[el.getAttribute('name')] = el.offsetWidth;
  });
};

//для редактирования ширины ячееек
let startX = null
let skeletonIsActive = ref(false)

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
};

//для перетаскивания строк
const gragRowRef = ref(null)
const gragRowCurrentIndex = ref(null)
const fake = ref(null)
let x = ref(null)
let y = ref(null)

let shiftX = null
let shiftY = null

const startDragRow = (event, i) => {
    gragRowRef.value = event.target.closest('.row')
    gragRowCurrentIndex.value = i

    const clonedRow = gragRowRef.value.cloneNode(true);
    fake.value.innerHTML = '';  
    fake.value.appendChild(clonedRow);

    gragRowRef.value.classList.add('skeleton')

    const box = event.target.getBoundingClientRect()

    const top = box.top + pageYOffset
    const left = box.left + pageXOffset

    shiftX = event.pageX - left 
    shiftY = event.pageY - top - i * heightRow.value

    // toggleSkeleton(i + 1, true)
    skeletonIsActive.value = true;
    moveAt(event)
};

const dragRow = (event) => {
    if (gragRowRef.value) {
        moveAt(event);

        const tableContentRect = tableContent.value.getBoundingClientRect();
        const offsetYInsideTableContent = event.clientY - tableContentRect.top;

        const numberForSkeleton = Math.floor(offsetYInsideTableContent / heightRow.value);

        if (gragRowCurrentIndex.value !== numberForSkeleton) {
            swapArray(data.value, gragRowCurrentIndex.value, numberForSkeleton);
            gragRowCurrentIndex.value = numberForSkeleton; // Обновляем текущий индекс
            document.querySelector('.skeleton').classList.remove('skeleton')
            document.querySelectorAll('.table__content-item')[gragRowCurrentIndex.value].classList.add('skeleton')
        }
    }
};

const stopDragRow = (event) => {
    if(!gragRowRef.value) return
    gragRowRef.value.classList.remove('skeleton');
    gragRowRef.value = null;

    x.value = null;
    y.value = null;
    fake.value.innerHTML = '';  
    skeletonIsActive.value = false;

    const tableContentRect = tableContent.value.getBoundingClientRect();
    const offsetYInsideTableContent = event.clientY - tableContentRect.top;
    const numberForSkeleton = parseInt(offsetYInsideTableContent / heightRow.value);

    document.querySelector('.skeleton').classList.remove('skeleton')

};


const swapArray = (arr, oldPlace, newPlace) => {
    if (Math.min(oldPlace, newPlace) < 0 || Math.max(oldPlace, newPlace) >= arr.length) {
        return null;
    }
    
    const item = arr.splice(oldPlace, 1)[0]; // Убрал лишний [0], чтобы получить элемент напрямую
    arr.splice(newPlace, 0, item);
    
    return arr;
};

function moveAt(e) {
    x.value = e.pageX - shiftX
    y.value = e.pageY - shiftY
}

const lineHeight = (() => {
    return tableContent.value.getBoundingClientRect().height + tableHeader.value.getBoundingClientRect().height - 1
})

// const tableWidth = () => {
//     if(reactiveStyleForCells.value) {
//         for (const [key, value] of Object.entries(reactiveStyleForCells.value)) {
//             console.log(`${key}: ${value}`);
//         }

//         return reactiveStyleForCells.value[0]
//     }
//     return null
// }

const tableWidth = computed(() => {
    let width = 0
    console.log(reactiveStyleForCells)
    if(reactiveStyleForCells.value) {
        for (const [key, value] of Object.entries(reactiveStyleForCells.value)) {
            console.log(`${key}: ${value}`);
            width += value
        }
        return width 

    } 
    return null
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
                    :style="{ height: activeDragObject === item[0] ? lineHeight() + 'px' : '100%'}"
                    @mousedown="startDrag($event)"
                    @mousemove="drag($event)"
                    @mouseup="stopDrag($event)"
                ></div>
            </div>
        </div>
        <div class="table__content"
            ref="tableContent"
        >
            <div class="fake"
                ref="fake"
                :class="{active: skeletonIsActive}"
                :style="{left: x + 'px', top: y + 'px', height: heightRow + 'px', width: tableWidth}"
                @mousemove="dragRow($event)"
                @mouseup="stopDragRow($event)"
            >

            </div>
            <div class="table__content-item row"
                v-for="(row, i) of data" :key="i"
                :style="{height: heightRow + 'px'}"
            >
            <b>
                {{ i }}
            </b>
                <div class="cell"
                    v-for="(item, index) of Object.entries(header)"
                    :key="index"
                    :style="[
                        {
                            minWidth: reactiveStyleForCells[item[0]] + 'px',
                            width: reactiveStyleForCells[item[0]] + 'px',
                        }
                    ]"
                    :class="[
                        {
                            _menu: item[0] === 'menu',
                            _points: item[0] === 'points',
                        }
                    ]"
                >
                    <div
                        v-if="item[0] === 'menu'"
                        @mousedown="startDragRow($event, i)"
                        @mousemove="dragRow($event)"
                        @mouseup="stopDragRow($event)"
                        class="menu-btn"
                    >
                        <icon-menu />
                        <span>
                            {{ i }}
                        </span>
                    </div>
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
        position: relative;
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
        & .menu-btn {
            display: flex;
            align-items: center;
            gap: 5px;
            position: relative;
            cursor: grab;
        }
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

.skeleton {
    width: 100%;
    border-radius: 5px;
    border: 2px dashed #a6b7d4;
    background-color: #fbfcfd;
    & .cell {
        display: none;
    }
}

.fake {
    position: absolute;
    display: flex;
    pointer-events: none;
    &.active {
        z-index: 10;
        pointer-events: all;
        &::after {
            content: "";
            width: calc(100% + 200px);
            height: 241px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 5;
            cursor: grab;
        }
    }
}

</style>