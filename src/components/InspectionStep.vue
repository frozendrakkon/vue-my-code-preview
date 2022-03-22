<template>
  <div class="inspection">
    <div v-if="contract" class="about-car">
      <h3>Информация из КХД</h3>
      <div class="about-car__info">
        <div class="about-car__info-item">
          <small>Марка</small>
          <p>
            {{ contract.car.make }}
          </p>
          <small>Год выпуска</small>
          <p>
            {{ contract.car.manufactureYear }}
          </p>
          <small>Цвет</small>
          <p>
            {{ contract.car.color }}
          </p>
          <small>VIN</small>
          <p>
            {{ contract.car.vin }}
          </p>
        </div>
        <div class="about-car__info-item">
          <small>Модель</small>
          <p>
            {{ contract.car.model }}
          </p>
          <small>Л/С</small>
          <p>
            {{ contract.car.enginePower }}
          </p>
          <small>Гос. номер</small>
          <p>
            {{ contract.car.licensePlate }}
          </p>
        </div>
      </div>
    </div>
    <div v-if="inspectionParams" class="general-info">
      <el-form
        v-for="(inspection, index) in inspectionParams"
        :key="inspection.id"
        :ref="`inspectionParams[${index}]`"
        :model="inspectionParams[index]"
        class="general-info__form"
      >
        <small>{{ inspection.name }}</small>
        <el-form-item
          prop="selectedValue"
          :rules="{
            required: true,
            message: 'Это поле обязательное для заполнения',
            trigger: ['blur', 'change'],
          }"
          class="general-info__item"
        >
          <div v-if="inspection.values.length">
            <el-select
              v-model="inspection.selectedValue"
              value-key="id"
              @blur="validateDropdown(index)"
            >
              <el-option
                v-for="value in inspection.values"
                :key="value.id"
                :label="value.name"
                :value="value"
              >
              </el-option>
            </el-select>
          </div>
          <div v-else class="general-info__input-item">
            <el-input
              v-model="inspection.selectedValue"
              prop="selectedValue"
              :placeholder="inspection.name"
            ></el-input>
          </div>
        </el-form-item>
        <div
          v-if="inspection.selectedValue && inspection.selectedValue.textRequired"
          class="general-info__input-item"
        >
          <el-form-item
            prop="comments"
            :rules="{
              required: true,
              message: 'Пожалуйста напишите комментарий',
              trigger: ['blur', 'change'],
            }"
          >
            <el-input v-model="inspection.comments" placeholder="Комментарий"></el-input>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="inspection__btn-container">
      <button class="inspection__btn" @click="nextStep">Продолжить</button>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import apiService from '../services/api-service';

export default {
  name: 'InspectionStep',
  data() {
    return {
      inspectionParams: null,
      contract: null,
    };
  },
  mounted() {
    const contractId = this.$route.params.id;
    this.getinspectionParams();
    this.getContracts(contractId);
  },
  methods: {
    ...mapActions('inspection', ['setInspectionStep']),
    async getinspectionParams() {
      try {
        const response = await apiService.loadInspectionParams();
        this.inspectionParams = response.data.map(el => ({
          ...el,
          selectedValue: null,
          comments: '',
        }));
      } catch (err) {
        this.$notify.error({
          title: 'Что-то пошло не так',
          message: err.response.data.message,
        });
      }
    },

    async getContracts(contractId) {
      try {
        const contracts = await apiService.loadContracts();
        this.contract = contracts.data.find(contract => contract.id === contractId);
      } catch (err) {
        this.$notify.error({
          title: 'Что-то пошло не так',
          message: err.response.data.message,
        });
      }
    },

    nextStep() {
      let validate = true;

      this.inspectionParams.forEach((el, index) => {
        this.$refs[`inspectionParams[${index}]`][0].validate(valid => {
          if (!valid) validate = false;
        });
      });

      if (validate) {
        this.setInspectionStep(this.inspectionParams);
        this.$emit('next-tab', 'photo');
      } else {
        this.$notify.error({
          title: 'Ошибка!',
          message: 'Вы заполнили не все поля',
        });
      }
    },

    validateDropdown(index) {
      this.$refs[`inspectionParams[${index}]`][0].validateField('selectedValue');
    },
  },
};
</script>

<style lang="scss" scoped>
h3 {
  font-size: 16px;
}
small {
  font-size: 12px;
  color: $gray;
}
b {
  color: $danger;
  font-size: 12px;
  margin-top: 10px;
}

.inspection {
  padding: 32px 40px 50px 40px;
  .inspection__btn-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 30px;
  }
  .inspection__btn {
    @include btn-danger;
    padding: 0 30px;
    height: 40px;
  }
}

.about-car {
  .about-car__info {
    @include flexbox($justifyContent: space-between);
  }
  .about-car__info-item {
    width: 50%;
    @include flexbox($direction: column);
    small {
      margin-top: 16px;
    }
    p {
      width: 90%;
      height: 25px;
      margin-top: 4px;
      border-bottom: 1px solid $light-gray;
    }
  }
}

.general-info {
  @include flexbox($wrap: wrap, $justifyContent: space-between);
  margin-top: 32px;
  .general-info__form {
    width: 50%;
  }
  .general-info__item {
    width: 90%;
  }
  .general-info__input-item {
    ::placeholder {
      color: $gray;
    }
  }
}

::v-deep {
  input::placeholder {
    color: $black;
    font-size: 14px;
  }
  .el-input__inner {
    border: 1px solid red;
    color: $black;
    border: none;
    border-bottom: 1px solid $light-gray;
    padding: 0 15px 0 0;
    border-radius: 0;
    &:focus {
      border-bottom: 1px solid $danger;
    }
  }
  .el-icon-arrow-up:before {
    content: '⯅';
  }
  .el-select .el-input .el-select__caret {
    color: #000;
    opacity: 0.5;
  }
  .el-select {
    display: block;
  }
  .el-select .el-input.is-focus .el-input__inner {
    border-bottom: 1px solid $danger;
  }
}
</style>
