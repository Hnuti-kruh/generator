import { createRouter, createWebHistory } from "vue-router";
import TEMPLATES from "../templates";

import defaultFavicon from "../assets/favicon.png";

let routes = [
  {
    path: "/avatar",
    name: "avatar",
    component: () => import("../views/avatar/Avatar.vue"),
    meta: {
      title: "Profilové obrázky",
    },
  },
  //TODO toto je dočasné, než bude v obecném generátoru něco.
  {
    path: "/",
    name: "avatar",
    component: () => import("../views/avatar/Avatar.vue"),
    meta: {
      title: "Profilové obrázky",
    },
  },
];

for (let [identifier, templateData] of Object.entries(TEMPLATES)) {
  routes.push({
    path: templateData.path,
    name: identifier,
    component: templateData.component,
    meta: templateData.meta,
  });
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
});

router.beforeEach((to, from, next) => {
  document.title = "Generátor grafiky";

  if (to.meta.title) {
    document.title = `${to.meta.title} | ${document.title}`;
  }
  // END Title

  // BEGIN Favicon
  const link = document.createElement("link");
  link.rel = "icon";

  if (to.meta.favicon !== undefined) {
    link.href = to.meta.favicon;
  } else {
    link.href = defaultFavicon;
  }

  document.head.appendChild(link);
  // END Favicon

  next();
});

export default router;
