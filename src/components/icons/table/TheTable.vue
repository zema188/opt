
<script setup>
import { onMounted, onUpdated, ref, reactive, computed } from "vue";
import RowItem from "./RowItem.vue";
import IconSettings from '@/components/icons/IconSettings.vue'


const header = ref([
    ['menu',''],
    ['points', ''],
    ['name_units', 'Наименование еденицы'],
    ['price', 'Цена'],
    ['quantity', 'Кол-во'],
    ['name_product', 'Наименование товара'],
    ['total', 'Итого'],
])

const data = ref([
    {
        name_units: '1111111111111',
        price: 'цена',
        quantity: 12,
        name_product: 'Мраморный щебень',
        total: 1231
    },
    {
        name_units: '22222222222222г',
        price: 'цена',
        quantity: 12,
        name_product: 'Мраморный щебень',
        total: 1231
    },
    {
        name_units: '3333333333333',
        price: 'цена',
        quantity: 12,
        name_product: 'Мраморный щебень',
        total: 1231
    },
])

let hiddenFormIsActive = ref(false)


const activeDragObject = ref(null)
let headerItemsRefs = ref([])
let reactiveStyleForCells = reactive({});
let tableHeader = ref(null)
let tableContent = ref(null)
let heightRow = ref(50)

const setItemRef = (el) => {
  headerItemsRefs.value.push(el);
};

const initStyle = () => {
  headerItemsRefs.value.forEach((el) => {
    reactiveStyleForCells[el.getAttribute('name')] = el.offsetWidth;
  });
};

const namesCols = ref({})

const initNamesCol = () => {
    header.value.forEach(el => {
        let name = el[1]
        if(el[0] === 'menu') name = 'Меню'
        if(el[0] === 'points') name = 'Точки'
        namesCols.value[el[0]] = {
            name: name,
            show: true
        }
    });
}

//для редактирования ширины ячееек
let startX = null
let skeletonIsActive = ref(false)

const startDrag = (event) => {
    const selection = window.getSelection();
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
const dragRowRef = ref(null)
const dragRowCurrentIndex = ref(null)
const fake = ref(null)
const fakeData = ref({})

let x = ref(null)
let y = ref(null)

let shiftX = null
let shiftY = null

const startDragRow = (event, row, i) => {
    dragRowRef.value = event.target.closest('.row')
    dragRowCurrentIndex.value = i

    fakeData.value = {...row}

    dragRowRef.value.classList.add('skeleton')

    const box = event.target.getBoundingClientRect()

    const top = box.top + pageYOffset
    const left = box.left + pageXOffset

    shiftX = event.pageX - left 
    shiftY = event.pageY - top - i * heightRow.value

    skeletonIsActive.value = true;
    moveAt(event)
};

const dragRow = (event) => {
    if (dragRowRef.value) {
        moveAt(event);

        const tableContentRect = tableContent.value.getBoundingClientRect();
        const offsetYInsideTableContent = event.clientY - tableContentRect.top;

        const numberForSkeleton = Math.floor(offsetYInsideTableContent / heightRow.value);

        if(numberForSkeleton < 0) return
        if (dragRowCurrentIndex.value !== numberForSkeleton) {
            swapArray(data.value, dragRowCurrentIndex.value, numberForSkeleton);
            dragRowCurrentIndex.value = numberForSkeleton; // Обновляем текущий индекс
            const skeleton = document.querySelector('.skeleton')
            if(skeleton) {
                skeleton.classList.remove('skeleton')
            }
            const row = document.querySelectorAll('.table__content-item')[dragRowCurrentIndex.value]
            if(row) {
                row.classList.add('skeleton')
            }
        }
    }
};

const stopDragRow = (event) => {
    if(!dragRowRef.value) return
    dragRowRef.value.classList.remove('skeleton');
    dragRowRef.value = null;

    x.value = null;
    y.value = null;

    skeletonIsActive.value = false;

    const skeleton = document.querySelector('.skeleton')
    if(skeleton) {
        skeleton.classList.remove('skeleton')
    }

};

const swapArray = (arr, oldPlace, newPlace) => {
    if (Math.min(oldPlace, newPlace) < 0 || Math.max(oldPlace, newPlace) >= arr.length) {
        return null;
    }
    
    const item = arr.splice(oldPlace, 1)[0]
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


//для перетаскивания колонок
const dragColName = ref(null)
const dragColCurrentIndex = ref(null)

const startDragCol = (event, number, name) => {
    console.log('name', name)
    if(activeDragObject.value) return

    const selection = window.getSelection()

    if (selection.rangeCount > 0) {
        selection.removeAllRanges()
    }

    dragColName.value = name
    const tableHeaderRect = tableHeader.value.getBoundingClientRect();

    const offsetXInsideTableHeader = event.clientX - tableHeaderRect.left;


    dragColCurrentIndex.value = number

};
let lastSwapColName = null
const dragCol = (event) => {
    if (!dragColName.value || activeDragObject.value) return;
    const tableHeaderRect = tableHeader.value.getBoundingClientRect();
    const offsetXInsideTableHeader = event.clientX - tableHeaderRect.left;

    let line = 0;

    for (let index = 0; index < header.value.length; index++) {
        const element =  header.value[index];
        
        line += reactiveStyleForCells[element[0]];

        if (offsetXInsideTableHeader <= line) {
            if (element[0] !== dragColName.value) {
                const currentIndex = dragColCurrentIndex.value;
                const tempArray1 = header.value[index].slice();
                const tempArray2 = header.value[currentIndex].slice();

                [header.value[index], header.value[currentIndex]] = [tempArray2, tempArray1];
                

                // lastSwapColName = element[0]


                dragColCurrentIndex.value = index;
            }
            return false;
        }
    }
};


const stopDragCol = (event) => {
    dragColName.value = null
    dragColCurrentIndex.value = null
};

const addNewRow = () => {
    data.value.push(
        {
            name_units: '',
            price: '',
            quantity: '',
            name_product: '',
            total: ''
        }
    )
}

const deleteRow = numberRow => {
    data.value.splice(numberRow, 1)
}

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
    initNamesCol()
})


</script>

<template>
    <div class="container">
        <div class="block-add block">
            <button class="btn btn_blue"
                @click="addNewRow()"
            >
                Добавить строку
            </button>
        </div>
    </div>
    <div class="container">
        <div class="block-table block">
        <div class="table__top">
            <div class="">
                Сохранить изменения
            </div>
            <div class="for-dropdown">
                <button
                    @click="hiddenFormIsActive = !hiddenFormIsActive"
                >
                    <icon-settings/>
                </button>
                <div class="dropwdown"
                    v-if="hiddenFormIsActive"
                >
                    <label class="dropwdown__item"
                        v-for="(value, key) in namesCols" :key="key"
                    >
                        <input type="checkbox"
                            v-model="value.show"
                        />
                        {{ value.name }}
                    </label>
                </div>
            </div>
        </div>
            <div class="table" 
            >
                <div class="table__header"
                    ref="tableHeader"
                >
                    <div class="table__header-item-w"
                        v-for="(item, index) of header"
                        :key="index"
                        :ref="setItemRef"
                        :name="item[0]"
                        :class="[
                            {active: activeDragObject === item[0]},
                            {activeCol: dragColName === item[0]},
                            {customHidden: !(namesCols[item[0]] && namesCols[item[0]].show)}
                        ]"
                        @mousedown="startDragCol($event, index, item[0])"
                        @mousemove="dragCol($event)"
                        @mouseup="stopDragCol($event)"
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
                    <row-item
                        class="fake row"
                        :class="{active: skeletonIsActive}"
                        :style="{left: x + 'px', top: y + 'px', height: heightRow + 'px', width: tableWidth}"
                        ref="fake"
                        :row="fakeData"
                        :number="dragRowCurrentIndex"
                        :heightRow="heightRow"
                        :header="header"
                        :reactiveStyleForCells="reactiveStyleForCells"
                        @mousemove="dragRow($event)"
                        @mouseup="stopDragRow($event)"
                        @mouseout="stopDragRow($event)"
                    />
                    <row-item
                        class="table__content-item row"
                        v-for="(row, i) of data"
                        :class="[
                            {customHidden: (namesCols[row] && namesCols[row].show)}
                        ]"
                        :key="row"
                        :row="row"
                        :number="i"
                        :heightRow="heightRow"
                        :header="header"
                        :reactiveStyleForCells="reactiveStyleForCells"
                        :namesCols="namesCols"
                        @startDragRow="(event, row, number) => startDragRow(event, row, number)"
                        @deleteRow="(row) => deleteRow(row)"
                    />
                </div>
            </div>
        </div>
    </div>

</template>

<style lang="scss">
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
        &::selection {
            background-color: transparent;
        }
    }

    &__content {
        position: relative;
    }

    &__content-item {
        display: flex;
    }
}

.table__header-item-w {
    border-top: 1px solid var(--pale-grey);
    border-bottom: 1px solid var(--pale-grey);
    position: relative;
    cursor: all-scroll;

    &:not(:last-child) {
        border-right: 1px solid var(--pale-grey);
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
    &.activeCol {
        &::after {
            width: 100%;
            height: 100%;
            position: fixed;
            top: 0;
            left: 50%;
            transform: translate(-50%, 0);
            cursor: all-scroll;
            z-index: 5;
            background: red;
            opacity: 0.5;
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
    width: 120px;
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
    position: fixed;
    display: flex;
    pointer-events: none;
    opacity: 0;
    z-index: -5;
    &.active {
        z-index: 10;
        pointer-events: all;
        opacity: 1;
        z-index: 10;
        position: absolute;
        &::after {
            content: "";
            width: 100%;
            height: 241px;
            height: 100%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 5;
            cursor: grab;
        }
    }
}

.dropwdown {
    display: flex;
    flex-direction: column;
    gap: 5px;
    position: absolute;
    background: #fff;
    border-radius: 10px;
    z-index: 5;
    right: 0;
    top: 20px;
    padding: 10px;
    border: 1px solid #969669;
}

.dropwdown__item {
    display: flex;
    align-items: center;
    gap: 10px;
    justify-content: space-between;
    white-space: nowrap;
    & input {
        width: auto;
    }
}

.customHidden {
    opacity: 0;
    position: absolute;
    z-index: -100;
    pointer-events: none;
}

.for-dropdown {
    position: relative;
}
</style>