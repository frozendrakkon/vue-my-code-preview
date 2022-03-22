<template>
  <div class="main">
    <header class="header-container">
      <div class="header-container__header layout-padding">
        <nav>
          <ul>
            <li class="active">
              <p>Изъятие</p>
            </li>
            <li>
              <p>Контроль</p>
            </li>
            <li>
              <p>Рекламации</p>
            </li>
            <li>
              <p>Отчеты</p>
            </li>
          </ul>
        </nav>
        <p @click="signOut">Выйти</p>
      </div>
    </header>
    <main class="main__content">
      <slot />
    </main>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'defaultLayout',
  methods: {
    ...mapActions('auth', ['logout']),
    signOut() {
      try {
        this.logout();

        this.$router.push({ name: 'auth' });
      } catch (err) {
        this.$notify.error({
          title: 'Ошибка!',
          message: err,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.main {
  background-color: #fafafa;
  min-height: 100vh;
  .main__content {
    margin-top: 65px;
  }
}
.header-container {
  .header-container__header {
    z-index: 999;
    position: fixed;
    top: 0;
    box-sizing: border-box;
    width: 100%;
    background-color: #fff;
    border-bottom: 1px solid rgb(230, 230, 230);
    height: 65px;
    display: flex;
    justify-content: space-between;
    p {
      align-self: center;
      cursor: pointer;
      &:hover {
        color: $danger;
      }
    }
    ul {
      height: 100%;
      display: flex;
      li {
        display: flex;
        align-items: center;
        cursor: pointer;
        &:not(:first-child) {
          margin-left: 20px;
        }
      }
    }
  }
}

// * modificators
.active {
  border-bottom: 3px solid $danger;
}
.layout-padding {
  padding: 0 80px;
}
</style>
