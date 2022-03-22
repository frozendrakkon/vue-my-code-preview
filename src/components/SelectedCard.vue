<template>
  <el-card justify="space-around" class="custom-card">
    <div slot="header">
      <article class="car-info">
        <div class="car-info__about-container">
          <h2>{{ contract.car.make }} {{ contract.car.model }}</h2>
          <div class="car-info__about">
            <div class="car-info__about-item">
              <p class="text-gray">Год</p>
              <p>{{ contract.car.manufactureYear }}</p>
            </div>
            <div class="car-info__about-item">
              <p class="text-gray">Л/С</p>
              <p>{{ contract.car.enginePower }}</p>
            </div>
            <div class="car-info__about-item">
              <p class="text-gray">Цвет</p>
              <p>{{ contract.car.color }}</p>
            </div>
            <div class="car-info__about-item">
              <p class="text-gray">Гос. Номер</p>
              <p>{{ contract.car.licensePlate }}</p>
            </div>
            <div class="car-info__about-item">
              <p class="text-gray">Vin</p>
              <p>{{ contract.car.vin }}</p>
            </div>
          </div>
        </div>
        <div class="car-info__actions">
          <svg
            v-svg
            symbol="close-icon"
            height="25"
            width="25"
            class="car-info__close"
            @click="closeCard"
          />

          <button class="car-info__btn">Документы</button>
        </div>
      </article>
    </div>
    <div>
      <article class="user-info">
        <div class="user-info__content">
          <div class="user-info__photo">
            <img height="80" width="80" src="../assets/user.png" alt="user-photo" />
          </div>
          <div class="user-info__about">
            <div class="user-info__about-item">
              <p class="text-gray">Заемщик</p>
              <p>{{ contract.client.clientName }}</p>
            </div>
            <div class="user-info__about-item">
              <p class="text-gray">Номер кредитного договора</p>
              <p>{{ contract.creditAgreementNumber }}</p>
            </div>
            <div class="user-info__about-item">
              <p class="text-gray">Сумма долга</p>
              <p>{{ contract.totalDebt }}</p>
            </div>
            <div class="user-info__about-item">
              <p class="text-gray">Адрес регистрации</p>
              <p>{{ contract.client.clientAddress }}</p>
            </div>
            <div class="user-info__about-item">
              <p class="text-gray">Статус кредитного договора</p>
              <p>{{ contract.creditAgreementStatus }}</p>
            </div>
            <div class="user-info__about-item">
              <p class="text-gray">Подстатус кредитного договора</p>
              <p>{{ contract.creditAgreementSubStatus }}</p>
            </div>
          </div>
        </div>
        <div class="user-info__btn-container">
          <button class="user-info__btn" @click="goInspection(contract)">Начать осмотр</button>
        </div>
      </article>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'SelectedCard',
  props: {
    contract: {
      type: Object,
      required: true,
    },
  },
  methods: {
    closeCard() {
      this.$emit('closeCard');
    },
    goInspection() {
      this.$router.push({ name: 'inspection', params: { id: this.contract.id } });
    },
  },
};
</script>

<style lang="scss" scoped>
.custom-card {
  min-height: 100vh;
}
.car-info {
  @include flexbox($justifyContent: space-between);
  h2 {
    font-size: 28px;
  }
  .car-info__about {
    margin-top: 20px;
    display: flex;
  }
  .car-info__about-item {
    height: 48px;
    padding: 0 20px;
    border-right: 1px solid rgba(232, 230, 230, 0.2);
    &:first-child {
      padding: 0 20px 0 0;
    }
    &:last-child {
      border: 0;
    }
    :nth-child(2) {
      margin-top: 10px;
    }
  }
  .car-info__close {
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  }
  .car-info__btn {
    width: 130px;
    height: 30px;
    background-color: $black;
    border: 1px solid #fff;
    color: #fff;
    &:hover {
      opacity: 0.8;
    }
  }
  .car-info__actions {
    @include flexbox($direction: column, $alignItems: flex-end, $justifyContent: space-between);
  }
}

.user-info {
  img {
    border-radius: 50%;
  }
  .user-info__photo {
    @include flexbox($alignItems: center);
  }
  .user-info__about {
    display: flex;
    flex-wrap: wrap;
  }
  .user-info__content {
    display: flex;
    border-bottom: 1px solid $light-gray;
    padding: 20px 0;
  }
  .user-info__about-item {
    border-right: 1px solid $light-gray;
    margin: 20px 0 0 15px;
    height: 48px;
    width: 31%;
    :nth-child(2) {
      margin-top: 10px;
    }
  }
  .user-info__btn-container {
    @include flexbox($justifyContent: flex-end);
  }
  .user-info__btn {
    @include btn-danger;
    margin-top: 28px;
    padding: 0 30px;
    height: 35px;
  }
}

// * modificators
.text-gray {
  color: $gray;
}

::v-deep {
  .el-card__body {
    padding: 32px 80px;
    @media screen and (min-width: 320px) and (max-width: 1400px) {
      padding: 32px 40px;
    }
  }
  .el-card__header {
    color: #fff;
    padding: 32px 80px;
    background-color: $black;
    @media screen and (min-width: 320px) and (max-width: 1400px) {
      padding: 32px 40px;
    }
  }
}
</style>
