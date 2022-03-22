<template>
  <div class="photo-step">
    <section class="general">
      <h2>Общий вид</h2>
      <div class="photo-step__content">
        <div
          v-for="(item, index) in photoItemsGeneralViews"
          :key="index"
          class="photo-step__content-item"
        >
          <el-upload
            v-loading="item.loading"
            action="#"
            :data="{ index, name: 'photoItemsGeneralViews' }"
            :http-request="uploadFile"
            ref="upload"
            list-type="picture"
            :accept="item.format"
          >
            <div slot="trigger" class="photo-step__content-trigger">
              <svg v-if="item.video" v-svg symbol="combined-shape" height="25" width="80%" />
              <svg v-else v-svg symbol="shape" height="25" width="100%" />
            </div>
            <div slot="file" slot-scope="{ file }">
              <i class="photo-step__delete-photo el-icon-close" @click="deletePhoto(file, index)" />
              <img v-if="!item.video" :src="file.url" @click="openPreview(file, item)" />
              <video v-else :src="file.url" width="112" @click="openPreview(file, item)"></video>
            </div>
          </el-upload>
          <p>{{ item.label }}</p>
        </div>
      </div>
    </section>
    <el-dialog :visible.sync="dialogVisible">
      <img v-if="!dialogItem.video" :src="dialogItem.url" width="100%" />
      <video v-else :src="dialogItem.url" controls="controls"></video>
    </el-dialog>
    <section class="detail">
      <h2>Подробно</h2>
      <div class="photo-step__content">
        <div
          v-for="(item, index) in photoItemsDetail"
          :key="index"
          class="photo-step__content-item"
        >
          <el-upload
            v-loading="item.loading"
            action="#"
            :data="{ index, name: 'photoItemsDetail' }"
            :http-request="uploadFile"
            :accept="item.format"
            ref="upload"
            list-type="picture"
          >
            <div slot="trigger" class="photo-step__content-trigger">
              <svg v-svg symbol="shape" height="25" width="100%" />
            </div>
            <div slot="file" slot-scope="{ file }">
              <i class="photo-step__delete-photo el-icon-close" @click="deletePhoto(file, index)" />
              <img :src="file.url" @click="openPreview(file)" />
            </div>
          </el-upload>
          <p>{{ item.label }}</p>
        </div>
      </div>
    </section>
    <div class="continue-container">
      <button class="continue-container__btn" @click="nextTab">Продолжить</button>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      photoItemsGeneralViews: [
        { label: 'Спереди слева', video: false, format: '.jpg, .png', loading: false },
        { label: 'Спереди справа', video: false, format: '.jpg, .png', loading: false },
        { label: 'Сзади слева', video: false, format: '.jpg, .png', loading: false },
        { label: 'Сзади справа', video: false, format: '.jpg, .png', loading: false },
        { label: 'Круговое видео', video: true, format: '.MOV, .mp4', loading: false },
      ],
      photoItemsDetail: [
        { label: 'Фото VIN-кода', video: false, format: '.jpg, .png', loading: false },
        {
          label: 'Фото передней части салона',
          video: false,
          format: '.jpg, .png',
          loading: false,
        },
        {
          label: 'Фото показаний одометра при включенном зажигании (при наличии ключей от ТС)',
          video: false,
          format: '.jpg, .png',
          loading: false,
        },
        { label: 'Фото шин и дисков', video: false, format: '.jpg, .png', loading: false },
        { label: 'Фото задней части салона', video: false, format: '.jpg, .png', loading: false },
        {
          label: 'Фото подкапотного пространства',
          video: false,
          format: '.jpg, .png',
          loading: false,
        },
      ],
      dialogItem: { url: null, video: null },
      dialogVisible: false,
    };
  },
  methods: {
    ...mapActions('inspection', ['createFile', 'submitFile']),
    async uploadFile(file) {
      const currentItem = this[file.data.name][file.data.index];
      const uid = file.file.uid;

      this.$refs.upload.forEach(async el => {
        if (el.uploadFiles[0] && el.uploadFiles[0].uid === uid) {
          try {
            currentItem.loading = true;
            const response = await this.createFile({ count: 1 });

            const formData = new FormData();
            formData.append('files', el.uploadFiles[0].raw, response.data[0]);

            await this.submitFile(formData);
            currentItem.loading = false;
          } catch (err) {
            this.$notify.error({
              title: 'Что-то пошло не так',
              message: err.response.data.message,
            });
          }
        }
      });
    },

    openPreview(file, item) {
      this.dialogItem.url = file.url;
      this.dialogItem.video = item.video;
      this.dialogVisible = true;
    },

    deletePhoto(file) {
      this.$refs.upload.forEach(el => {
        if (el.uploadFiles[0]) {
          if (el.uploadFiles[0].uid === file.uid) {
            el.uploadFiles = [];
          }
        }
      });
    },

    nextTab() {
      let nextTab = true;
      this.$refs.upload.forEach(el => {
        if (!el.uploadFiles[0]) nextTab = false;
      });

      if (nextTab) this.$emit('next-tab', 'damage');
      else {
        this.$notify.error({
          title: 'Ошибка',
          message: 'Вы заполнили не все поля!',
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.photo-step {
  .photo-step__content {
    margin-top: 16px;
    @include flexbox($wrap: wrap, $justifyContent: space-between);
    div {
      @include flexbox($alignItems: center);
      height: 120px;
      width: 48%;
      p {
        width: 35%;
        font-size: 14px;
        margin-left: 16px;
      }
      div {
        height: 100px;
      }
    }
  }
  .photo-step__content-item {
    border-bottom: 1px solid $light-gray;
    div {
      width: 110px;
    }
  }
  .photo-step__delete-photo {
    z-index: 99;
    position: absolute;
    font-size: 1.3em;
    right: 5px;
    top: 5px;
    color: $danger;
    background-color: $light-gray;
    border: 2px solid $danger;
  }
  .photo-step__error {
    color: $danger;
    font-size: 1.5em;
  }
}

.detail {
  margin-top: 25px;
}

.continue-container {
  @include flexbox($justifyContent: flex-end);
  margin-top: 30px;
  .continue-container__btn {
    @include btn-danger;
    padding: 0 30px;
    height: 40px;
  }
}

::v-deep {
  .el-upload-list--picture .el-upload-list__item {
    padding: 0;
    height: 70px;
    width: 110px;
    img {
      height: 100%;
      width: 100%;
    }
  }
  .el-upload-list {
    position: absolute;
    margin-bottom: 10px;
    cursor: pointer;
  }

  .photo-step__content-trigger {
    background-color: rgba(232, 230, 230, 0.3);
    width: 110px !important;
    height: 70px !important;
  }
  .el-dialog__body {
    display: flex;
    justify-content: center;
  }
}
</style>
