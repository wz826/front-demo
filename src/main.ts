
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router";

import App from "./App.vue";

import "~/styles/index.scss";
import "uno.css";

const app = createApp(App);
app.component("font-awesome-icon", FontAwesomeIcon);
app.use(createPinia());
app.use(router);
app.mount("#app");
