import { createApp } from "vue";
import App from "./main.vue";
import { initBolt } from "../lib/utils/bolt";
import '../lib/public.css';
import { i18n } from '../../locales/main'

initBolt();

createApp(App).use(i18n).mount("#root");