

<script setup>

</script>

<template>
    <div class="total">
        <div class="total__list">
            <div class="total__item">
                <span>
                    Сумма:
                </span>
                <p>
                    152 212 руб
                </p>
            </div>
            <div class="total__item">
                <span>
                    Кол-во:
                </span>
                <p>
                    24 шт
                </p>
            </div>
            <div class="total__item">
                <span>
                    Общий вес:
                </span>
                <p>
                    2 322 кг
                </p>
            </div>
        </div>
        <div class="total__all">
            <span>
                Общая сумма:
            </span>
            <p>
                152 212 руб
            </p>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.total {
    min-width: 320px;
    margin: 15px 0 0 auto;
    padding-right: 15px;
    @media (max-width: 539px) {
        width: 100%;
        min-width: auto;
        padding-right: 0px;
        margin: 25px 0 0 auto;
    }
    &__list {
        padding: 13px 15px;
        border-radius: 5px;
        border: solid 1px var(--pale-grey);
        background-color: #fbfcfd;
        margin-bottom: 5px;
        @media (max-width: 539px) {
            padding: 11px 14px 14px 14px;
            margin-bottom: 5px;
        }
    }

    &__item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        flex-wrap: wrap;
        &:not(:last-child) {
            margin-bottom: 13px;
            @media (max-width: 539px) {
                margin-bottom: 12px;
            }
        }
        & span {
            font-size: 14px;
            color: #8f8f8f;
            @media (max-width: 539px) {
                font-size: 16px;
            }
        }
        & p {
            font-size: 14px;
            color: #000;
            @media (max-width: 539px) {
                font-size: 16px;
            }
        }
    }

    &__all {
        padding: 12px 15px;
        border-radius: 5px;
        border: solid 1px var(--pale-grey);
        background-color: #fbfcfd;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        flex-wrap: wrap;
        @media (max-width: 539px) {
            padding: 10px 15px 15px 15px;
        }
        & span {
            font-size: 14px;
            color: #000;
            @media (max-width: 539px) {
                font-size: 16px;
            }
        }
        & p {
            font-size: 14px;
            font-weight: 600;
            color: #000;
            @media (max-width: 539px) {
                font-size: 16px;
            }
        }
    }
}

</style>