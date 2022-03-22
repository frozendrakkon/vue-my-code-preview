import Vue from 'vue';
import ElementUI from 'element-ui';
import lang from 'element-ui/lib/locale/lang/ru-RU';
import locale from 'element-ui/lib/locale';
import SvgSprite from 'vue-svg-sprite';
import App from './app.vue';
import router from './router/router';
import store from './store';
import storageAxios from './middleware/auth-interceptors';
import 'reset-css';
import 'element-ui/lib/theme-chalk/index.css';
import 'element-ui/lib/theme-chalk/display.css';
import DefaultLayout from './layouts/DefaultLayout.vue';
import EmptyLayout from './layouts/EmptyLayout.vue';
import InspectionStep from '@/components/InspectionStep.vue';
import DamageStep from '@/components/DamageStep.vue';
import PhotoStep from '@/components/PhotoStep.vue';

const urlSvgSprite = require('./assets/icons.svg');

Vue.component('default-layout', DefaultLayout);
Vue.component('empty-layout', EmptyLayout);
Vue.component('insepction-step', InspectionStep);
Vue.component('damage-step', DamageStep);
Vue.component('photo-step', PhotoStep);
storageAxios();
Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(SvgSprite, {
  url: urlSvgSprite,
});
locale.use(lang);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
