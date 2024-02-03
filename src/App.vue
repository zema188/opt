<script setup>
import IconSettings from '@/components/icons/IconSettings.vue'
import TheTable from '@/components/table/TheTable.vue'

</script>

<template>
    <div class="wrapper">
        <header class="header container">
          <div class="header__top">
            <div class="menu-mobile">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="12" viewBox="0 0 15 12">
                  <path d="M1 0h13a1 1 0 1 1 0 2H1a1 1 0 0 1 0-2zm0 5h13a1 1 0 0 1 0 2H1a1 1 0 1 1 0-2zm0 5h13a1 1 0 0 1 0 2H1a1 1 0 1 1 0-2z" fill="#A6B7D4" fill-rule="evenodd"/>
              </svg>
            </div>
            <div class="header__title">
              Проведение ТО и мелкий ремонт
            </div>
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
        <the-table/>
    </div>
</template>

<style lang="scss">
.header {
  margin-bottom: 21px;
  @media (max-width: 539px) {
    margin-bottom: 26px;
  }
		&__title {
      font-size: 30px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
      color: #000;
      @media (max-width: 539px) {
        
      }
		}

		&__action {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
      padding-right: 15px;
      & button {
        padding-top: 4px;
        @media (max-width: 539px) {
          display: none;
        }
      }
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
  padding: 18px 25px;
  margin-bottom: 25px;
  & .btn_blue {
    padding: 10px 5px 8px 7px;
  }
}


.table {
  @media (max-width: 539px) {
    border-radius: 10px;
  }
  &__top {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 20px;
    padding: 10px 15px;
    @media (max-width: 539px) {
      display: none;
    }
    & .save {
      font-size: 12px;
      color: #a6b7d4;
    }
    & button {
      display: flex;
    }
  }
}
.block {
}
.block-table {
  @media (max-width: 539px) {
    background: none;
    box-shadow: none;
    border: none;
    border-radius: 10px;
  }
}
.menu-mobile {
  display: none;
  padding-top: 11px;
  @media (max-width: 539px) {
    display: block;
  }
}


.header__top {
  display: flex;
  gap: 7px;
  margin-bottom: 21px;
  @media (max-width: 539px) {
    margin-bottom: 15px;
  }
}
</style>
