<template>
  <el-card justify="space-around" class="card">
    <div slot="header" class="card__header">
      <h1>{{ component.id }}. {{ component.name }}</h1>
      <div class="card__header-close" @click="closeCard">
        <svg v-svg symbol="close-icon" class="car-info__close" height="25" width="25" />
      </div>
    </div>
    <div v-if="!component.lastItem" class="content">
      <div class="photos">
        <h3>Фотографии</h3>
        <div class="photos__content">
          <input
            id="file"
            class="photos__upload"
            type="file"
            accept="image/x-png,image/gif,image/jpeg"
            @change="upload($event)"
          />
          <label for="file" class="photos__btn-upload">
            <svg v-svg symbol="shape" width="115px" height="70px" />
          </label>
          <div
            v-for="(file, index) in component.files"
            :key="index"
            v-loading="file.loading"
            class="photos__content-photo"
          >
            <img v-if="file.url" :src="file.url" />
            <button @click="deletePhoto(index)">
              <svg v-svg symbol="close-icon" class="car-info__close" height="20" width="20" />
            </button>
          </div>
        </div>
      </div>
      <div class="damage">
        <h3>Тип Повреждения</h3>
        <div class="damage__content">
          <div v-for="damage in component.damages" :key="damage.id" class="damage__content-item">
            <el-checkbox v-model="damage.isSelected" @change="addSelectValue(damage)">
              <span>{{ damage.name }}</span>
            </el-checkbox>
          </div>
        </div>
      </div>
      <div class="comment">
        <div class="comment__content">
          <h3>Комментарий</h3>
          <el-input
            v-model="component.comment"
            placeholder="Введите текст комментария"
            class="comment__input"
          ></el-input>
        </div>
      </div>
      <hr class="card__line" />
      <button class="card__continue-btn" @click="nextCard">Далее</button>
    </div>
    <div v-else class="content">
      <div class="comment">
        <div class="comment__content">
          <h3>Описание состояния</h3>
          <p>
            В свободной форме опишите внешнее состояние транспортного средства
          </p>
          <el-input
            v-model="component.comment"
            placeholder="Введите текст комментария"
            class="comment__input"
          ></el-input>
        </div>
      </div>
      <hr class="card__line" />
      <button class="card__continue-btn" @click="nextCard">Далее</button>
    </div>
  </el-card>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'DamageCard',
  props: {
    component: {
      required: true,
      type: Object,
    },
  },
  methods: {
    ...mapActions('inspection', ['createFile', 'submitFile']),
    addSelectValue(damage) {
      if (damage.isSelected) {
        this.component.selectedValue.push(damage);
      } else {
        const indexDeleteItem = this.component.selectedValue.findIndex(
          damageItem => damage.id === damageItem.id,
        );

        if (indexDeleteItem > -1) this.component.selectedValue.splice(indexDeleteItem, 1);
      }
    },
    nextCard() {
      const selectedLength = this.component.selectedValue.length;
      const filesLength = this.component.files.length;
      if ((selectedLength && filesLength) || !selectedLength) {
        this.component.status = true;
        this.$emit('nextCard');
      } else {
        this.$notify.error({
          title: 'Ошибка!',
          message: 'Каждому повреждению должна соответствовать хотя бы одна фотография',
        });
      }
    },
    closeCard() {
      this.$emit('closeCard');
    },
    async upload(event) {
      try {
        const url = URL.createObjectURL(event.target.files[0]);
        const fileUrl = { loading: true, url };
        const response = await this.createFile({ count: 1 });
        const formData = new FormData();

        this.component.files.push(fileUrl);
        formData.append('files', event.target.files[0], response.data[0]);
        await this.submitFile(formData);

        event.target.value = '';
        fileUrl.loading = false;
      } catch (err) {
        this.$notify.error({
          title: 'Что-то пошло не так',
          message: err.response.data.message,
        });
      }
    },
    deletePhoto(index) {
      this.component.files.splice(index, 1);
    },
  },
};
</script>

<style lang="scss" scoped>
h1 {
  font-size: $h1;
}
h3 {
  font-size: 18px;
  font-weight: 600;
}
.card {
  min-height: 100vh;
  .card__continue-btn {
    @include btn-danger;
    margin-top: 20px;
    width: 140px;
    height: 40px;
  }
  .card__header {
    @include flexbox($justifyContent: space-between);
  }
  .card__header-close {
    display: none;
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
    @media screen and (min-width: 320px) and (max-width: 1400px) {
      display: block;
    }
  }
  .card__line {
    margin-top: 25px;
    border: none;
    border-bottom: 1px solid $light-gray;
  }
}
.damage__content {
  @include flexbox($wrap: wrap);
}
.damage__content-item {
  width: 25%;
  margin-top: 20px;
  span {
    font-size: 14px;
    font-weight: 600;
  }
}
.photos,
.damage,
.comment {
  margin-top: 20px;
}
.comment {
  width: 90%;
  p {
    margin-top: 10px;
  }
  .comment__content {
    width: 40%;
  }
  .comment__input {
    margin-top: 20px;
  }
}
.photos {
  .photos__upload {
    display: none;
  }
  .photos__btn-upload {
    margin-top: 15px;
    width: 112px;
    height: 72px;
    border: none;
    cursor: pointer;
    background-color: $light-gray;
    position: relative;
    img {
      position: absolute;
      top: 0;
      left: 0;
    }
    button {
      position: absolute;
      right: 10px;
      top: 10px;
    }
  }
  .photos__content {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }
  .photos__content-photo {
    @include flexbox($justifyContent: center);
    position: relative;
    margin-top: 15px;
    margin-left: 15px;
    width: 112px;
    height: 72px;
    background-color: $light-gray;
    border: 1px solid $light-gray;
    img {
      max-width: 112px;
      max-height: 72px;
    }
    button {
      border-radius: 50%;
      color: $danger;
      background-color: #fff;
      cursor: pointer;
      border: 0;
      position: absolute;
      top: 5px;
      right: 5px;
      &:hover {
        opacity: 0.7;
      }
    }
  }
}

::v-deep {
  .el-card__body {
    padding: 12px 80px !important;
    width: auto !important;
    cursor: default;
  }
  .el-card__header {
    color: #fff;
    cursor: default;
    padding: 32px 80px;
    background-color: $black;
  }
  //   checkbox
  .el-checkbox__inner::after {
    border-color: $danger;
  }
  .el-checkbox__inner {
    border-color: $light-gray;
  }
  .el-checkbox__input.is-focus .el-checkbox__inner {
    border: 1px solid $light-gray;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner,
  .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color: #fff;
    border-color: $light-gray;
  }
  .el-checkbox__input.is-checked + .el-checkbox__label {
    color: $black;
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
}
</style>
