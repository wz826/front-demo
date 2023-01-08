export default {
  path: "notepad",
  meta: { title: "笔记本" },
  children: [
    {
      path: "", // 上级导航默认显示
      component: () => import("~/views/notepad/Notepad.vue"),
    },
    {
      path: "add",
      component: () => import("~/views/notepad/NotepadAdd.vue"),
      meta: { title: "添加笔记" },
    },
    {
      path: "edit/:id",
      component: () => import("~/views/notepad/NotepadEdit.vue"),
      props: true,
      meta: { title: "编辑笔记" },
    },
    {
      path: "detail/:id",
      component: () => import("~/views/notepad/NotepadDetail.vue"),
      props: true,
      meta: { title: "笔记详情" },
    },
  ],
}; // end /notepad children
