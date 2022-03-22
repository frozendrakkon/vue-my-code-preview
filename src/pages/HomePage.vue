<template>
  <el-row v-loading="loading">
    <el-col v-if="contracts" class="contracts-container" :span="24">
      <el-input
        v-model="searchValue"
        class="contracts-container__search"
        placeholder="Что вы ищите?"
        suffix-icon="el-icon-search"
      />
      <div class="contracts-container__find-contracts">
        <p class="text-black">Найдено: {{ getFiltersContracts.length }} контрактов</p>
      </div>
      <section v-for="contract in getFiltersContracts" :key="contract.id">
        <div class="contracts">
          <el-card
            :class="{ 'contracts__active-card': contract.id === activeCardId }"
            :body-style="{ padding: '24px 35px 24px 56px' }"
            class="contracts__contract"
            @click.native="openCard(contract)"
          >
            <el-row>
              <el-col :lg="16" :span="24">
                <h2 class="contracts__car-name">
                  {{ contract.car.make }} {{ contract.car.model }}
                </h2>
                <div class="contracts__car-vin-plate-container">
                  <p>{{ contract.car.licensePlate }}</p>
                  <p>VIN:{{ contract.car.vin }}</p>
                </div>
                <p>{{ contract.client.clientName }}</p>
              </el-col>
              <el-col class="contracts__credit-status" :lg="8" :span="24">
                <p>HB{{ contract.car.pledgeAgreementNumber }}</p>
                <p class="contracts__status">{{ contract.creditAgreementStatus }}</p>
              </el-col>
            </el-row>
          </el-card>
        </div>
        <SelectedCard
          v-if="contract.id === activeCardId"
          :contract="contract"
          class="contracts-container__card"
          @closeCard="clearCardId"
        />
      </section>
    </el-col>
  </el-row>
</template>

<script>
import SelectedCard from '../components/SelectedCard.vue';
import apiService from '../services/api-service';

export default {
  name: 'HomePage',
  components: { SelectedCard },
  data() {
    return {
      searchValue: '',
      loading: true,
      activeCardId: null,
      contracts: null,
    };
  },
  computed: {
    getFiltersContracts() {
      const searchValue = this.searchValue.toLowerCase();

      if (searchValue) {
        return this.contracts.filter(contract => {
          const model = contract.car.model.toLowerCase();
          const make = contract.car.make.toLowerCase();

          return model.includes(searchValue) || make.includes(searchValue);
        });
      }
      return this.contracts;
    },
  },
  mounted() {
    this.getContracts();
  },
  methods: {
    openCard(contract) {
      if (contract.id) {
        this.activeCardId = contract.id;
      }
    },
    clearCardId() {
      this.activeCardId = null;
    },
    async getContracts() {
      try {
        const contracts = await apiService.loadContracts();
        this.contracts = contracts.data;

        this.loading = false;
      } catch (err) {
        this.$notify.error({
          title: 'Что-то пошло не так',
          message: err.response.data.message,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.contracts-container {
  padding-left: 80px;
  position: relative;
  .contracts-container__find-contracts {
    margin-top: 24px;
  }
  .contracts-container__search {
    margin-top: 25px;
    width: 40%;
    @media screen and (min-width: 320px) and (max-width: 1400px) {
      width: 50%;
    }
  }
  .contracts-container__card {
    width: 55%;
    position: fixed;
    right: 0;
    top: 64px;
    @media screen and (min-width: 320px) and (max-width: 1400px) {
      width: 100%;
      z-index: 999;
    }
  }
}
hr {
  background-color: $light-gray;
  border-top: none;
  height: 1px;
  margin-top: 35px;
}
.contracts {
  font-size: 14px;
  color: $black;
  width: 40%;
  @media screen and (min-width: 320px) and (max-width: 1400px) {
    width: 50%;
  }
  div:not(:first-child) {
    margin-top: 10px;
  }
  > :first-child {
    margin-top: 24px;
  }
  .contracts__contract {
    cursor: pointer;
  }
  .contracts__credit-status {
    @include flexbox($alignItems: flex-end, $direction: column);
    @media screen and (min-width: 320px) and (max-width: 1400px) {
      display: block;
    }
  }
  .contracts__active-card {
    background-color: $danger;
    color: #fff;
  }
  .contracts__car-name {
    font-size: 18px;
  }
  .contracts__car-vin-plate-container {
    @include flexbox($wrap: wrap);
    :first-child::after {
      content: '|';
      height: 15px;
      margin: 0 10px;
      width: 2px;
      color: #d8d8d8;
    }
  }
  .contracts__status {
    font-size: 12px;
    margin-top: 8px;
  }
  @media screen and (min-width: 320px) and (max-width: 1400px) {
    p,
    small {
      line-height: 1.5;
      font-size: 15px;
    }
  }
}

.text-black {
  color: $black;
}
</style>
