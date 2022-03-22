<template>
  <main class="auth">
    <img
      class="auth__main-img"
      src="../assets/authLogo3x.png"
      srcset="../assets/authLogo2x.png, ../assets/authLogo.png"
    />
    <section class="form">
      <h1>ВХОД В СИСТЕМУ</h1>
      <el-form class="form__el-form" ref="ruleForm" :model="ruleForm" :rules="rules">
        <el-form-item prop="login">
          <el-input placeholder="Логин" v-model="ruleForm.login"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input placeholder="Пароль" type="password" v-model="ruleForm.password"></el-input>
        </el-form-item>
      </el-form>
      <button @click="signIn('ruleForm')" class="form__btn">Войти</button>
    </section>
  </main>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'AuthPage',
  data() {
    return {
      ruleForm: {
        login: '',
        password: '',
      },
      rules: {
        login: [
          {
            required: true,
            message: 'Это поле обязательное',
            trigger: 'blur',
          },
          {
            min: 3,
            max: 30,
            message: 'Длина логина - не менее 3 символов, и не более 30',
            trigger: 'blur',
          },
        ],
        password: [
          {
            required: true,
            message: 'Это поле обязательное',
            trigger: 'blur',
          },
          {
            min: 3,
            max: 30,
            message: 'Длина пароля - не менее 3 символов, и не более 30',
            trigger: 'blur',
          },
        ],
      },
    };
  },

  methods: {
    ...mapActions('auth', ['loginAuth', 'refreshToken']),
    signIn(formName) {
      const loginPassword = {
        login: this.ruleForm.login,
        password: this.ruleForm.password,
      };

      this.$refs[formName].validate(async valid => {
        if (valid) {
          try {
            await this.loginAuth(loginPassword);

            this.$router.push({ name: 'home' });
          } catch (err) {
            this.createNotification(err.response.data.message);
          }
        }
      });
    },
    createNotification(message) {
      this.$notify.error({
        title: 'Ошибка!',
        message,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.auth {
  height: 100vh;
  @include flexbox($alignItems: center);
  @media screen and (min-width: 240px) and (max-width: 992px) {
    justify-content: center;
  }
  .auth__main-img {
    height: 100vh;
    width: 50%;
    @media screen and (min-width: 992px) and (max-width: 1400px) {
      width: 60%;
    }
    @media screen and (min-width: 240px) and (max-width: 991px) {
      display: none;
    }
  }
}

.form {
  margin-left: 80px;
  @media screen and (min-width: 992px) and (max-width: 1400px) {
    margin-left: 40px;
  }
  @media screen and (min-width: 320px) and (max-width: 991px) {
    margin-left: 0px;
  }
  h1 {
    font-size: $h1;
    margin-bottom: 18px;
    @media screen and (min-width: 992px) and (max-width: 1400px) {
      font-size: $subtitle;
    }
    @media screen and (min-width: 320px) and (max-width: 991px) {
      font-size: 18px;
    }
  }
  .form__el-form {
    width: 320px;
  }
  .form__btn {
    @include btn-danger;
    margin-top: 30px;
    padding: 0 30px;
    height: 36px;
    @media screen and (min-width: 320px) and (max-width: 992px) {
      width: 80px;
      height: 28px;
    }
    @media screen and (min-width: 320px) and (max-width: 991px) {
      width: 132px;
      height: 36px;
    }
  }
}
</style>
