<template>
  <div class="control">
    <el-card class="go-back-card">
      <div class="go-back-card__content">
        <div class="go-back-card__back" @click="$router.go(-1)">
          <svg v-svg symbol="arrow-left" height="15" width="15" />
          <p>Назад</p>
        </div>
        <p class="go-back-card__car-name">Осмотр WF Polo</p>
      </div>
    </el-card>
    <el-card class="control-main-content">
      <el-tabs v-model="activeTab" stretch>
        <el-tab-pane v-for="(tab) in tabs" :key="tab.key" :label="tab.label" :name="tab.key">
          <div class="control-main-content__tab" slot="label">
            <svg v-svg :symbol="tab.imageKey" />
            <p>{{ tab.label }}</p>
          </div>
          <keep-alive>
            <component
              v-if="activeTab === tab.key"
              :is="tab.component"
              class="step-padding"
              @next-tab="activeTab = $event"
            />
          </keep-alive>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'inspectionPage',
  data() {
    return {
      activeTab: 'damage',
      tabs: [
        {
          label: 'Информация о ТС',
          key: 'info',
          imageKey: 'info',
          component: 'insepction-step',
        },
        {
          label: 'Фото / Видео',
          key: 'photo',
          imageKey: 'photo',
          component: 'photo-step',
        },
        {
          label: 'Повреждения',
          key: 'damage',
          imageKey: 'details',
          component: 'damage-step',
        },
        {
          label: 'Результат осмотра',
          key: 'result',
          imageKey: 'order',
          component: null,
        },
        {
          label: 'Завершение',
          key: 'finish',
          imageKey: 'success-icon',
          component: null,
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.control {
  padding: 15px 80px;
  width: 38%;
  @media screen and (min-width: 320px) and (max-width: 1400px) {
    width: 80%;
  }
}
.go-back-card {
  height: 48px;
  @include flexbox($alignItems: center, $justifyContent: space-between);
  .go-back-card__content {
    @include flexbox($justifyContent: space-between, $alignItems: center);
  }
  .go-back-card__back {
    @include flexbox($alignItems: center);
    cursor: pointer;
    p {
      margin-left: 10px;
    }
    &:hover {
      opacity: 0.8;
    }
  }
  .go-back-card__car-name {
    color: $gray;
  }
}
.control-main-content {
  margin-top: 25px;

  .control-main-content__tab {
    svg {
      height: 24px;
      width: 24px;
    }
    p {
      font-size: 12px;
    }
  }

  // * modificators
  .tab-width {
    width: 130px;
  }
  .step-padding {
    padding: 32px 40px 50px 40px;
  }
}
::v-deep {
  :nth-child(1) .el-card__body {
    width: 100%;
    padding: 0 10px;
  }
  .el-card__body {
    padding: 20px 0px;
  }
  .el-tabs__item {
    line-height: 1.3;
    height: 60px;
    color: $black;
    opacity: 0.5;
  }

  .el-tabs__item.is-active {
    color: $black;
    opacity: 1;
  }
  .el-tabs__active-bar {
    background-color: $danger;
  }
}
</style>
