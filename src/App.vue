<script setup>
import IconSettings from '@/components/icons/IconSettings.vue'
import TheTable from '@/components/icons/table/TheTable.vue'

</script>

<template>
    <div class="wrapper">
        <header class="header container">
          <div class="header__title">
            Проведение ТО и мелкий ремонт
          </div>
          <div class="header__action">
            <nav class="nav">
              <div class="nav__item">
                Общее
              </div>
              <div class="nav__item active">
                Товары
              </div>
              <div class="nav__item">
                Доп. расходы
              </div>
            </nav>
            <button>
              <icon-settings/>
            </button>
          </div>
        </header>
        <div class="container">
          <div class="block-add block">
            <button class="btn btn_blue">
              
              Добавить строку
            </button>
          </div>
        </div>
        <div class="container">
          <div class="block-table block">
            <div class="table__header">
              <div class="">
                Сохранить изменения
              </div>
              <button>
                <icon-settings/>
              </button>
            </div>
            <the-table/>
          </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.header {
  margin-bottom: 25px;
		&__title {
      font-size: 30px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      color: #000;
      margin-bottom: 21px;
		}

		&__action {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
		}
}
.nav {
    display: flex;
    align-items: center;
    gap: 20px;
		&__item {
      font-size: 16px;
      font-weight: 600;
      color: #1253a2;
      cursor: pointer;
      &.active {
        color: #000;
      }
		}
}


.block-add {
  padding: 20px 25px;
  margin-bottom: 25px;
  & .btn_blue {
    padding: 10px 15px 10px 10px;
  }
}


.table {

  &__header {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 20px;
    font-size: 12px;
    color: #a6b7d4;
    padding: 10px 15px;
    & button {
      display: flex;
    }
  }
}
.block {
}


</style>
