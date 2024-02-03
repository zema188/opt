
<script setup>
import { onMounted, onUpdated, ref, reactive, computed } from "vue";
import RowItem from "./RowItem.vue";
import IconSettings from '@/components/icons/IconSettings.vue'
import IconPlus from '@/components/icons/IconPlus.vue'
import TotalInfo from "./TotalInfo.vue";
import TheDropdown from "./TheDropdown.vue";

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
        name_units: '',
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
    {
        name_units: '444444444444444444444',
        price: 1231,
        quantity: 12,
        name_product: 'Мраморный щебень',
        total: 1231
    },
])

const goods = ref([
    'Мраморный щебень фр. 2-5 мм, 25кг',
    'Мраморный щебень фр. 2-5 мм, 25кг (белый)',
    'Мраморный щебень фр. 2-5 мм, 25кг (вайт)',
    'Мраморный щебень фр. 2-5 мм, 25кг, возврат',
    'Мраморный щебень фр. 2-5 мм, 1т',
    'Зеленый щебень фр. 2-5 мм, 25кг',
    'Зеленый щебень фр. 2-5 мм, 25кг (белый)',
    'Зеленый щебень фр. 2-5 мм, 25кг (вайт)',
    'Зеленый щебень фр. 2-5 мм, 25кг, возврат',
    'Зеленый щебень фр. 2-5 мм, 1т',
])

const styleDropDown = ref({})

let dropdownIsActive = ref(false)

let hiddenFormIsActive = ref(false)


const activeDragObject = ref(null)
let headerItemsRefs = ref([])
let reactiveStyleForCells = reactive({});
let tableHeader = ref(null)
let tableContent = ref(null)
let tableList = ref(null)
let heightRow = ref(45)

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

    if(shift < 40) return
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
    updateData.value++
    dragRowRef.value = event.target.closest('.row')
    dragRowCurrentIndex.value = i

    fakeData.value = { ...row }

    dragRowRef.value.classList.add('skeleton')

    const box = event.target.getBoundingClientRect()

    const top = box.top + window.pageYOffset
    const left = box.left + window.pageXOffset

    shiftX = event.pageX - left
    shiftY = event.pageY - top - i * heightRow.value + scrollY

    skeletonIsActive.value = true

    moveAt(event)
};


const dragRow = (event) => {
    if (dragRowRef.value) {
        moveAt(event);

        const tableContentRect = tableContent.value.getBoundingClientRect();
        const offsetYInsideTableContent = event.clientY - tableContentRect.top;

        const numberForSkeleton = Math.floor(offsetYInsideTableContent / heightRow.value);

        if(numberForSkeleton < 0) return
        if(numberForSkeleton > data.value.length - 1) stopDragRow()
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
    return tableList.value.getBoundingClientRect().height + tableHeader.value.getBoundingClientRect().height - 1
})


//для перетаскивания колонок
const dragColName = ref(null)
const dragColCurrentIndex = ref(null)

let fakeHeader = ref(null)
let lastMouseX = null;
let directionLastSwap = null;
let lastSwapColName = null

const startDragCol = (event, number, headerItem) => {
    closeDropdownNameUnits()
    if (activeDragObject.value) return;

    const selection = window.getSelection();

    if (selection.rangeCount > 0) {
        selection.removeAllRanges();
    }

    dragColName.value = headerItem[0];
    dragColCurrentIndex.value = number;
    lastMouseX = event.clientX;

    const tableHeaderRect = tableHeader.value.getBoundingClientRect();
    const headerItemRef = headerItemsRefs.value[number];
    const fakeHeaderLeft = event.clientX - event.offsetX + tableHeader.value.scrollLeft;
    const fakeHeaderTop = headerItemRef.offsetTop + tableHeaderRect.y;

    fakeHeader.value.style.width = reactiveStyleForCells[headerItem[0]] + 'px';
    fakeHeader.value.style.height = tableHeaderRect.height + 'px';
    fakeHeader.value.style.left = fakeHeaderLeft + 1 + 'px';
    fakeHeader.value.style.top = tableHeader.value.getBoundingClientRect().y + 'px';

    const box = event.target.getBoundingClientRect()

    const left = box.left + window.pageXOffset  // Adjust for horizontal scroll
    shiftX = event.pageX - left
};




// let lastMouseXTest = null;
const dragCol = (event) => {
    if (!dragColName.value || activeDragObject.value) return
    const tableHeaderRect = tableHeader.value.getBoundingClientRect();
    // const isBeforeTable = event.clientX < tableHeaderRect.x + tableHeader.value.scrollLeft;
    // const isAfterTable = event.clientX > tableHeaderRect.x + tableHeaderRect.width + tableHeader.value.scrollLeft;

    // if (isBeforeTable || isAfterTable) {
    //     stopDragCol(event);
    // }
    const offsetXInsideTableHeader = event.clientX - tableHeaderRect.left;

    let line = 0;

    fakeHeader.value.style.left = event.pageX - shiftX + 'px'

    for (let index = 0; index < header.value.length; index++) {
        const element =  header.value[index];
        
        line += reactiveStyleForCells[element[0]];

        if (offsetXInsideTableHeader <= line) {
            if (element[0] !== dragColName.value) {

                const currentIndex = dragColCurrentIndex.value;
                const direction = (lastMouseX === null ? 0 : event.clientX - lastMouseX) >= 0 ? 'right' : 'left'
                if(lastSwapColName && directionLastSwap) {
                    if(lastSwapColName === element[0] && directionLastSwap === direction) {
                        return
                    } else {
                        lastSwapColName = element[0]
                        directionLastSwap = direction
                    }
                } else {
                    lastSwapColName = element[0]
                    directionLastSwap = direction
                }

                lastMouseX = event.clientX;
                const tempArray1 = header.value[index].slice();
                const tempArray2 = header.value[currentIndex].slice();
                [header.value[index], header.value[currentIndex]] = [tempArray2, tempArray1];
                dragColCurrentIndex.value = index;
            }
            return false;
        }
    }
};


const stopDragCol = (event) => {
    dragColName.value = null
    dragColCurrentIndex.value = null
    lastMouseX = null;
    directionLastSwap = null;
    lastSwapColName = null

    fakeHeader.value.style.width = 0 + 'px'
    fakeHeader.value.style.height =  0 + 'px'
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

let updateData = ref(0)

const deleteRow = numberRow => {
    data.value.splice(numberRow, 1)
    updateData.value++
}

const tableWidth = computed(() => {
    let width = 0
    if (reactiveStyleForCells) {
        for (const [key, value] of Object.entries(reactiveStyleForCells)) {
            width += value
        }
        return width;
    }
    return null;
})
let activeRowForChoice = ref(null)

const openDropdownNameUnits = (event, row) => {
    const input =  event.target.closest('.cell').querySelector('input')
    styleDropDown.value.x = input.getBoundingClientRect().x
    styleDropDown.value.y = input.getBoundingClientRect().y  + 40
    styleDropDown.value.width = input.getBoundingClientRect().width
    dropdownIsActive.value = true
    activeRowForChoice.value = row
}

const toggleDropdownNameUnits = (event, row) => {
    if(dropdownIsActive.value) {
        closeDropdownNameUnits()
    } else {
        openDropdownNameUnits(event, row)
    }

}


const closeDropdownNameUnits = event => {
    dropdownIsActive.value = false
    activeRowForChoice.value = {}
}

const choiceItem = item => {
    activeRowForChoice.value.name_units = item
    closeDropdownNameUnits()
}
   
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
                <icon-plus/>
                Добавить строку
            </button>
        </div>
    </div>
    <div class="container">
        <div class="block-table block">
        <div class="table__top">
            <button class="save">
                Сохранить изменения
            </button>
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
                    <div class="fake-header"
                        ref="fakeHeader"
                        @mousemove="dragCol($event)"
                        @mouseup="stopDragCol($event)"
                    ></div>
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
                        @mousedown="startDragCol($event, index, item)"
                        @mousemove="dragCol($event)"
                        @mouseup="stopDragCol($event)"
                    >
                        <div class="table__header-item cell"
                            :class="item[0]"
                            :style="{ width: reactiveStyleForCells[item[0]] + 'px'}"
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
                    <div class="table__content-list"
                        ref="tableList"
                    >
                    <row-item
                        class="fake row"
                        :class="{active: skeletonIsActive}"
                        :style="{left: x + 'px', top: y + 'px', height: heightRow + 'px'}"
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
                        :style="[
                            {width: tableWidth + 'px'}
                        ]"
                        :key="i"
                        :row="row"
                        :number="i"
                        :heightRow="heightRow"
                        :header="header"
                        :reactiveStyleForCells="reactiveStyleForCells"
                        :namesCols="namesCols"
                        :updateData="updateData"
                        :dragColName="dragColName"
                        @startDragRow="(event, row, number) => startDragRow(event, row, number)"
                        @deleteRow="(row) => deleteRow(row)"
                        @openDropdownNameUnits="(event, row) => openDropdownNameUnits(event, row)"
                        @closeDropdownNameUnits="event => closeDropdownNameUnits(event)"
                        @toggleDropdownNameUnits="(event, row) => toggleDropdownNameUnits(event, row)"
                    />
                    </div>
                    <total-info/>
                </div>
            </div>
        </div>
    </div>
    <the-dropdown
        :goods="goods"
        :isActive="dropdownIsActive"
        :styles="styleDropDown"
        @choiceItem="item => choiceItem(item)"
    />
</template>

<style lang="scss">
.table {
    overflow: auto;
    &__header {
        display: flex;
        @media (max-width: 539px) {
            display: none;
        }
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
        padding-bottom: 25px;
        padding-top: 5px;
        @media (max-width: 539px) {
            padding-top: 0px;
        }
    }

    &__content-item {
        display: flex;
        @media (max-width: 539px) {
            flex-wrap: wrap;
        }
    }
}

.table__header-item-w {
    border-top: 1px solid var(--pale-grey);
    border-bottom: 1px solid var(--pale-grey);
    position: relative;
    cursor: all-scroll;
    border-right: 1px solid var(--pale-grey);
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
    padding: 10px 10px 10px 10px;
    white-space: nowrap;
    overflow: hidden;
    display: flex;
    align-items: center;
    gap: 5px;
    @media (max-width: 539px) {
        width: 100% !important;
        min-width: auto !important;
        flex-wrap: wrap;
        padding: 7.5px 15px 7.5px 15px;
    }
    &._menu {
        @media (max-width: 539px) {
            width: auto !important;
            min-width: auto !important;
            flex: 0 0 100%;
        }
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
    @media (max-width: 539px) {
        height: auto !important;
        width: 100% !important;
        border-radius: 10px;
        box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.07);
        border: solid 1px var(--pale-grey);
        background-color: #fff;
        &:not(:last-child) {
            margin-bottom: 5px;
        }
    }
    & ._points {
        & span {
            display: block;
            width: 3px;
            height: 3px;
            background: #a6b7d4;
            border-radius: 50%;
            @media (max-width: 539px) {
                background: #1253a2;
            }
        }
    }
}

input {
    padding: 7px 15px 7px 15px;
    border-radius: 5px;
    border: solid 1px #ccc;
    background-color: #fff;
    width: 100%;
}

.menu {
    width: 49px;
}
.points {
    width: 24px;
}
.name_units {
    width: 620px;
}
.price {
    width: 216px;
}
.quantity {
    width: 216px;
}
.name_product {
    width: 186px;
}
.total {
    width: 145px;
}

.line {
    position: absolute;
    right: -1px;
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
            height: 100%;
            position: fixed;
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
        height: 100%;
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

.block-add {
    & svg {
        width: 15px;
    }
}

.fake-header {
    position: fixed;
    border: 1px solid var(--pale-grey);
    cursor: all-scroll;
    background: rgba(249, 249, 249, 0.5);
    z-index: 10;
}
</style>