<template>
  <div class="damage">
    <section class="content">
      <div
        v-for="(component, index) in components"
        :key="component.id"
        :class="{ active: component.id === activeCardId }"
        class="content__component"
      >
        <div class="content__component-info" @click="openCard(component)">
          <p>
            {{ index + 1 }}.
            {{ component.name }}
          </p>
          <svg v-if="component.status" v-svg symbol="success-icon-green" width="25" height="25" />
        </div>
        <div class="content__card">
          <DamageCard
            v-if="component.id === activeCardId"
            :component="component"
            @nextCard="nextCard(index + 1)"
            @closeCard="activeCardId = null"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import apiService from '../services/api-service';
import DamageCard from './DamageCard.vue';

export default {
  name: 'DamageStep',

  components: { DamageCard },

  data() {
    return {
      components: null,
      activeCardId: null,
    };
  },

  mounted() {
    this.loadDamage();
  },

  methods: {
    ...mapActions('inspection', ['setDamageStep']),
    async loadDamage() {
      try {
        const response = await apiService.loadDamagesList();

        this.components = response.data.components.map(component => ({
          ...component,
          selectedValue: [],
          comment: '',
          damages: this.getDamages(component, response.data),
          status: false,
          lastItem: false,
          files: [],
        }));

        this.components.push({
          id: String(this.components.length + 2),
          name: 'Общее состояние автомобиля',
          possibleDamages: [],
          selectedValue: [],
          comment: null,
          damages: [],
          files: [],
          status: false,
          lastItem: true,
        });
      } catch (err) {
        this.$notify.error({
          title: 'Что-то пошло не так',
          message: err.response.data.message,
        });
      }
    },

    getDamages(component, response) {
      const result = [];
      response.damages.forEach(damage => {
        damage.isSelected = false;
        const checkDamage = component.possibleDamages.includes(damage.id);
        if (checkDamage) result.push({ ...damage });
      });
      return result;
    },

    openCard(component) {
      this.activeCardId = component.id;
    },

    nextCard(nextCardIndex) {
      if (nextCardIndex < this.components.length) {
        this.activeCardId = this.components[nextCardIndex].id;
      } else {
        const valid = this.components.every((component, index) => {
          const checkPhoto = component.files.length;
          const checkDamages = component.selectedValue.length;
          const checkStatus = component.status;

          const valid = checkStatus && ((checkDamages && checkPhoto) || !checkDamages);

          if (!valid) {
            this.$notify.error({
              title: 'Вы не загрузили фото к повреждению / Вы просмотрели не все карточки',
              message: `${index + 1} ${component.name}`,
            });
          }

          return valid;
        });

        if (valid) {
          this.setDamageStep(this.components);
          this.$emit('next-tab', 'result');
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.damage {
  padding: 20px 40px;
}

.content {
  @include flexbox($wrap: wrap, $justifyContent: space-between);
  .content__component {
    @include flexbox($alignItems: center);
    font-size: 14px;
    color: $black;
    font-weight: 600;
    line-height: 1.5;
    margin-top: 20px;
    padding: 0 10px;
    width: 45%;
    height: 64px;
    border: 1px solid $light-gray;
    cursor: pointer;
    .content__component-info {
      height: 100%;
      width: 100%;
      @include flexbox($alignItems: center, $justifyContent: space-between);
    }
  }
  .content__card {
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
.active {
  background: $danger;
  color: #fff;
  p {
    color: #fff;
  }
}
</style>
