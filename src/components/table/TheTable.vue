
<script setup>
import { onMounted, ref, reactive, computed } from "vue";
import RowItem from "./RowItem.vue";
import IconSettings from '@/components/icons/IconSettings.vue'
import IconPlus from '@/components/icons/IconPlus.vue'
import IconArrow from '@/components/icons/IconArrow.vue'
import TotalInfo from "./TotalInfo.vue";
import TheDropdown from "./TheDropdown.vue";

const header = ref([
    ['menu',''],
    ['points', ''],
    ['name_units', 'Наименование еденицы'],
    ['price', 'Цена'],
    ['quantity', 'Кол-во'],
    ['name_product', 'Название товара'],
    ['total', 'Итого'],
])

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
let hiddenFormBtnsIsActive = ref(false)
let hiddenFormLabelIsActive = ref(false)


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
let wasInitStyle = false
const initStyle = () => {
    if(window.innerWidth > 539) {
        if(wasInitStyle) return
        headerItemsRefs.value.forEach((el) => {
            reactiveStyleForCells[el.getAttribute('name')] = el.offsetWidth
        });
        wasInitStyle = true
    }

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
    closeDropdownNameUnits()
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

    if(shift < 24) return
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
    dragRowRef.value.style.height = heightRow + 'px' + '!important'

    const box = event.target.getBoundingClientRect()

    const top = box.top + window.pageYOffset
    const left = box.left + window.pageXOffset

    if (window.innerWidth > 539 && event.type !== 'touchstart') {
        shiftX = event.pageX - left
        shiftY = event.pageY - top - i * heightRow.value + scrollY
    }
    if (window.innerWidth <= 539 && event.type !== 'touchstart'){
        shiftX = event.pageX 
        shiftY = event.pageY - i * heightRow.value
    }
    if (window.innerWidth > 539 && event.type === 'touchstart') {
        shiftX = event.changedTouches[0].screenX - left
        shiftY = event.changedTouches[0].screenY - top - i * heightRow.value + scrollY
    }
    if (window.innerWidth <= 539 && event.type === 'touchstart') {
        shiftX = event.changedTouches[0].screenX
        shiftY = event.changedTouches[0].screenY - i * heightRow.value
    }
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
    dragRowRef.value.style.height = 'auto'
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
    if(e.changedTouches) {
        x.value = e.changedTouches[0].screenX - shiftX
        y.value = e.changedTouches[0].screenY - shiftY
    } else {
        x.value = e.pageX - shiftX
        y.value = e.pageY - shiftY
    }

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
    updateData.value++
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
    const fakeHeaderLeft = event.clientX - event.offsetX + tableHeader.value.scrollLeft;

    fakeHeader.value.style.width = reactiveStyleForCells[headerItem[0]] + 'px';
    fakeHeader.value.style.height = tableHeaderRect.height + 'px';
    fakeHeader.value.style.left = fakeHeaderLeft + 1 + 'px';
    fakeHeader.value.style.top = tableHeader.value.getBoundingClientRect().y + 'px';

    const box = event.target.getBoundingClientRect()

    const left = box.left + window.pageXOffset  // Adjust for horizontal scroll
    shiftX = event.pageX - left
};




const dragCol = (event) => {
    if (!dragColName.value || activeDragObject.value) return
    const tableHeaderRect = tableHeader.value.getBoundingClientRect();
    const offsetXInsideTableHeader = event.clientX - tableHeaderRect.left;

    let line = 0;

    fakeHeader.value.style.left = event.pageX - shiftX + 'px'

    for (let index = 0; index < header.value.length; index++) {
        const element =  header.value[index];
        if(namesCols.value[element[0]].show) line += reactiveStyleForCells[element[0]];

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
            if(namesCols.value[key].show) width += value
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
    updateData.value++
    activeRowForChoice.value.name_units = item
    closeDropdownNameUnits()
}
 
const handleLineMouseOver = event => {
    event.target.style.height = lineHeight() + 'px'
    event.target.style.opacity = 1
}

const handleLineMouseOut = event => {
    event.target.style.height = '100%'
}

const save = () => {
}

onMounted(() => {
    initStyle()
    initNamesCol()
    setTimeout(() => {
        if(window.innerWidth <= 539) {
            heightRow.value = document.querySelectorAll('.table__content-item')[0].getBoundingClientRect().height
        }
    }, 0);

})

let mobileToPC = false

addEventListener("resize", (event) => {
    heightRow.value = document.querySelectorAll('.table__content-item')[0].getBoundingClientRect().height
    if(window.innerWidth <= 539) {
        mobileToPC = true
    } else if(mobileToPC){
        initStyle()
        initNamesCol()
    }

    if(window.innerWidth > 539) {
        heightRow.value = 45
    }
});

let prevScrollY = window.scrollY;

addEventListener('scroll', (event) => {
  // Текущее значение прокрутки
  const currentScrollY = window.scrollY;

  // Разница между предыдущим и текущим значением прокрутки
  const scrollDelta = currentScrollY - prevScrollY;

  // Обновление предыдущего значения прокрутки для следующего события
  prevScrollY = currentScrollY;

  // Теперь scrollDelta содержит информацию о том, насколько изменилась прокрутка
  console.log('Изменение прокрутки:', scrollDelta);

  // Далее, вы можете использовать scrollDelta по вашему усмотрению
  styleDropDown.value.y += -scrollDelta;

  console.log('scrollDelta', scrollDelta )
});
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
            <button class="save"
                v-if="updateData"
                @click="save()"
            >
                Сохранить изменения
            </button>
            <div class="for-dropdown">
                <button
                    @click="hiddenFormIsActive = !hiddenFormIsActive, hiddenFormBtnsIsActive = true, hiddenFormLabelIsActive = false"
                >
                    <icon-settings/>
                </button>
                <div class="dropwdown"
                    v-if="hiddenFormIsActive"
                >
                    <div class="dropwdown__btns"
                        v-if="hiddenFormBtnsIsActive"
                    >
                        <!-- <button class="dropwdown__btn">
                            Порядок столбцов
                            <icon-arrow/>
                        </button> -->
                        <button class="dropwdown__btn"
                            @click="hiddenFormLabelIsActive = !hiddenFormLabelIsActive, hiddenFormBtnsIsActive = false"
                        >
                            Отображение столбцов
                            <icon-arrow/>
                        </button>
                    </div>
                    <div class="hidden-form"
                        v-if="hiddenFormLabelIsActive"
                    >
                        <p class="hidden-form__subtitle">
                            <icon-arrow
                                @click="hiddenFormBtnsIsActive = true, hiddenFormLabelIsActive = false"
                            />
                            Отображение столбцов
                        </p>
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
        </div>
            <div class="table"
            >
                <div class="table__header"
                    ref="tableHeader"
                >
                    <div class="fake-header"
                        :class="{active: dragColName}"
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
                            @mouseover="handleLineMouseOver($event)"
                            @mouseout="handleLineMouseOut($event)"
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
                        :namesCols="namesCols"
                        @mousemove="dragRow($event)"
                        @mouseup="stopDragRow($event)"
                        @mouseout="stopDragRow($event)"
                        @touchend="stopDragRow($event)"
                    />
                    <row-item
                        class="table__content-item row"
                        v-for="(row, i) of data"
                        :class="[
                            {customHidden: (namesCols[row] && namesCols[row].show)}
                        ]"
                        :style="[
                            {
                                width: tableWidth + 'px',
                            }
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
                        @updateData="updateData++"
                        @dragRow="dragRow($event)"
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
    @media (max-width: 539px) {
        overflow: visible;
    }
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
    height: 46px;
    border-top: 1px solid var(--pale-grey);
    border-bottom: 1px solid var(--pale-grey);
    position: relative;
    cursor: all-scroll;
    // border-right: 1px solid var(--pale-grey);
    .cell {
        padding: 10px 10px 10px 10px;
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
    padding: 10px 11px 10px 10px;
    white-space: nowrap;
    overflow: hidden;
    display: flex;
    align-items: center;
    gap: 5px;
    @media (max-width: 539px) {
        width: 100% !important;
        min-width: auto !important;
        flex-wrap: wrap;
        padding: 0px 14px 13px 14px;
        gap: 2px;
    }
    &._menu {
        @media (max-width: 539px) {
            width: auto !important;
            min-width: auto !important;
            flex: 0 0 100%;
            padding: 0 10px 13px 14px;
            gap: 0px;
        }
        & .menu-btn {
            display: flex;
            align-items: center;
            gap: 4px;
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
        padding-bottom: 11px;
        padding-top: 12px;
        &:not(:last-child) {
            margin-bottom: 5px;
        }
    }
    & ._points {
        padding: 10px 10px 10px 9px;
        @media (max-width: 539px) {
            padding: 0px 10px 13px 13px;
            gap: 5px;
        }
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
    width: 48px;
}
.points {
    width: 24px;
}
.name_units {
    width: 624px;
}
.price {
    width: 217px;
}
.quantity {
    width: 217px;
}
.name_product {
    width: 168px;
}
.total {
    width: 144px;
}

.line {
    position: absolute;
    right: 0px;
    top: 0;
    width: 1px;
    height: 100%;
    background: var(--pale-grey);
    cursor: e-resize;
    opacity: 1px;
    height: 100%;
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
        @media (max-width: 539px) {
            display: block;
            opacity: 0;
        }
    }
}

.fake {
    position: fixed;
    display: flex;
    pointer-events: none;
    opacity: 0;
    z-index: -5;
    @media (max-width: 539px) {
        flex-direction: column;
    }
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
    position: fixed;
    z-index: -100;
    pointer-events: none;
    left: 0;
    top: 0;
    padding: 0;
    &._points {
        width: 0 !important;
        min-width: 0 !important;
        padding: 0px;
    }
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
    &.active {
        &::after {
            display: block;
        }
    }
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
        display: none;
    }
}
.dropwdown__btn {
    white-space: nowrap;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    width: 100%;
    &:not(:last-child) {
        margin-bottom: 10px
    }
    & svg {
        width: 11px;
    }
}

.hidden-form__subtitle {
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    width: 100%;
    white-space: nowrap;
    & svg {
        width: 11px;
        cursor: pointer;
        transform: rotate(180deg);
    }
}
</style>