export default {
  path: "credential",
  meta: { title: "凭据管理" },
  children: [
    {
      path: "", // 上级导航默认显示
      component: () => import("~/views/credential/Credential.vue"),
    },
    {
      path: "add",
      component: () => import("~/views/credential/CredentialAdd.vue"),
      meta: { title: "添加凭据" },
    },
    {
      path: "edit/:id",
      component: () => import("~/views/credential/CredentialEdit.vue"),
      props: true,
      meta: { title: "编辑凭据" },
    },
    {
      path: "detail/:bizid",
      component: () => import("~/views/credential/CredentialDetail.vue"),
      props: true,
      meta: { title: "凭据详情" },
    },
  ],
}; // end /credential children
