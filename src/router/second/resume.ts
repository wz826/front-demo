export default {
   path: "resume",
   meta: { title: "简历" },
   children: [
      {
         path: "", // 上级导航默认显示
         component: () => import("~/views/resume/Resume.vue"),
      },
      {
         path: "add",
         component: () => import("~/views/resume/ResumeAdd.vue"),
         meta: { title: "添加简历" },
      },
      {
         path: "edit/:id",
         component: () => import("~/views/resume/ResumeEdit.vue"),
         props: true,
         meta: { title: "编辑简历" },
      },
      {
         path: "detail/:id",
         component: () => import("~/views/resume/ResumeDetail.vue"),
         props: true,
         meta: { title: "简历详情" },
      },
   ],
}; // end /resume children
