<script setup lang="ts">
import { faAlignJustify } from "@fortawesome/free-solid-svg-icons";
import { ElLoading, ElNotification } from "element-plus";
import "element-plus/theme-chalk/src/loading.scss";
import "element-plus/theme-chalk/src/notification.scss";
import "element-plus/theme-chalk/src/message-box.scss";
import { reactive, Ref, ref, toRaw } from 'vue';
import db, { Introduction, Skill, Education, Job, Project, Resume } from '~/store/indexdb/resume/db';
import { EducationConfig, IntroductionConfig, JobConfig, ProjectConfig } from './resumeDefine';
import { v4 as uuidv4 } from 'uuid';
import Draggable from 'vuedraggable';
import { useWebConfigStore } from '~/store/webConfig'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';
dayjs.extend(relativeTime);
dayjs.locale(useWebConfigStore().webConfig.lang.toLowerCase())

const now = dayjs().toDate();
const uuid = uuidv4().replaceAll('-', '');

const introConfig: IntroductionConfig = reactive({
   intros: [],
   activates: [],
   isAllCollapse: false,
});

const resume: Resume = reactive({
   id: uuid,
   isSync: false,
   title: '简历-' + dayjs(now).format('YYYY-MM-DD HH:mm:ss'),
   ctime: now,
   utime: now,
});

// console.log(resume)
const skills: Ref<Skill[]> = ref([]);
const skillsDragOptions = {
   animation: 200,
   group: "description",
   disabled: false,
   ghostClass: "ghost"
};

const eduConfig: EducationConfig = reactive({
   educations: [],
   activates: [],
   isAllCollapse: false,
});

const jobConfig: JobConfig = reactive({
   jobs: [],
   activates: [],
   isAllCollapse: false,
});

const projectConfig: ProjectConfig = reactive({
   projects: [],
   activates: [],
   isAllCollapse: false,
});

const getIntroduction = (isActivate: boolean = false): Introduction => {
   const introduction: Introduction = {
      resumeId: uuid,
      title: '',
      content: '',
      isActivate,
      ctime: now,
      utime: now,
   };
   return introduction;
};

const getSkill = (sort: number = 0): Skill => {
   const skill: Skill = {
      resumeId: uuid,
      content: '',
      ctime: now,
      utime: now,
      sort,
   };
   return skill;
}

const getEducation = (): Education => {
   const education: Education = {
      resumeId: uuid,
      organization: '',
      startDate: now,
      endDate: now,
      startEndDate: [],
      specialty: '',
      certificateNo: '',
      content: '',
      ctime: now,
      utime: now,
   };
   return education;
};

const getJob = (): Job => {
   const job: Job = {
      resumeId: uuid,
      company: '',
      startDate: now,
      endDate: now,
      startEndDate: [],
      profession: '',
      department: '',
      achievement: '',
      content: '',
      isActivate: true,
      ctime: now,
      utime: now,
   };
   return job;
}

const getProject = (): Project => {
   const project: Project = {
      resumeId: uuid,
      name: '',
      startDate: now,
      endDate: now,
      startEndDate: [],
      softwareEnv: '',
      developTool: '',
      desc: '',
      skill: '',
      duty: '',
      solution: '',
      isActivate: true,
      ctime: now,
      utime: now,
   };
   return project;
}


{
   /** 初始化 */
   introConfig.intros.push(getIntroduction(true));
   introConfig.activates.push(0);
   skills.value.push(getSkill());
   eduConfig.educations.push(getEducation());
   eduConfig.activates.push(0);
   jobConfig.jobs.push(getJob());
   jobConfig.activates.push(0);
   projectConfig.projects.push(getProject());
   projectConfig.activates.push(0);
}


const activateIntroduction = (index: number) => {
   // console.log(introConfig.intros[index]);
   introConfig.intros.forEach((intro, idx) => intro.isActivate = idx === index);
}

const toggleCollapseIntroduction = () => {
   introConfig.isAllCollapse = !introConfig.isAllCollapse;
   if (introConfig.isAllCollapse) {
      introConfig.activates.splice(0);
   } else {
      introConfig.activates.push(...introConfig.intros.map((it, idx) => idx));
   }
}

const reverseCollapseIntroduction = () => {
   const reverseIdxs = introConfig.intros.map((it, idx) => idx).filter(idx => !introConfig.activates.includes(idx));
   introConfig.activates.splice(0);
   introConfig.activates.push(...reverseIdxs);
}

const addIntroduction = () => {
   const intro: Introduction = getIntroduction();
   if (introConfig.intros.length === 0) {
      intro.isActivate = true;
   }
   introConfig.intros.unshift(intro);
   const activates = introConfig.activates.map(ac => ac + 1);
   introConfig.activates.splice(0);
   introConfig.activates.push(0, ...activates);
}

const removeIntroduction = (index: number) => {
   introConfig.intros.splice(index, 1);
   if (introConfig.intros.length === 0) {
      introConfig.intros[0].isActivate = true;
   }
   const acIdx = introConfig.activates.findIndex(val => val === index);
   acIdx > -1 && introConfig.activates.splice(acIdx, 1);
}

const onChangeCollapseIntroduction = () => {
   // console.log(introConfig.activates);
   introConfig.isAllCollapse = introConfig.activates.length === 0;
}

const addSkill = () => {
   const maxSort = Math.max(...skills.value.map(sk => sk.sort));
   const skill = getSkill(maxSort + 1);
   skills.value.push(skill);
}

const removeSkill = (index: number) => {
   skills.value.splice(index, 1);
}

const toggleCollapseEducation = () => {
   eduConfig.isAllCollapse = !eduConfig.isAllCollapse;
   if (eduConfig.isAllCollapse) {
      eduConfig.activates.splice(0);
   } else {
      eduConfig.activates.push(...eduConfig.educations.map((it, idx) => idx));
   }
}

const reverseCollapseEducation = () => {
   const reverseIdxs = eduConfig.educations.map((it, idx) => idx).filter(idx => !eduConfig.activates.includes(idx));
   eduConfig.activates.splice(0);
   eduConfig.activates.push(...reverseIdxs);
}

const addEducation = () => {
   const edu: Education = getEducation();
   eduConfig.educations.unshift(edu);
   const activates = eduConfig.activates.map(ac => ac + 1);
   eduConfig.activates.splice(0);
   eduConfig.activates.push(0, ...activates);
}

const removeEducation = (index: number) => {
   eduConfig.educations.splice(index, 1);
   const acIdx = eduConfig.activates.findIndex(val => val === index);
   acIdx > -1 && eduConfig.activates.splice(acIdx, 1);
}

const onChangeCollapseEducation = () => {
   // console.log(eduConfig.activates);
   eduConfig.isAllCollapse = eduConfig.activates.length === 0;
   // console.log(eduConfig.educations);
}

const onChangeEducationStartEndDate = () => {
   eduConfig.educations.forEach(edu => {
      edu.startDate = edu.startEndDate[0] || now;
      edu.endDate = edu.startEndDate[1] || now;
   });
   // console.log(eduConfig.educations);
}


const toggleCollapseJob = () => {
   jobConfig.isAllCollapse = !jobConfig.isAllCollapse;
   if (jobConfig.isAllCollapse) {
      jobConfig.activates.splice(0);
   } else {
      jobConfig.activates.push(...jobConfig.jobs.map((it, idx) => idx));
   }
}

const reverseCollapseJob = () => {
   const reverseIdxs = jobConfig.jobs.map((it, idx) => idx).filter(idx => !jobConfig.activates.includes(idx));
   jobConfig.activates.splice(0);
   jobConfig.activates.push(...reverseIdxs);
}

const addJob = () => {
   const job: Job = getJob();
   jobConfig.jobs.unshift(job);
   const activates = jobConfig.activates.map(ac => ac + 1);
   jobConfig.activates.splice(0);
   jobConfig.activates.push(0, ...activates);
}

const removeJob = (index: number) => {
   jobConfig.jobs.splice(index, 1);
   const acIdx = jobConfig.activates.findIndex(val => val === index);
   acIdx > -1 && jobConfig.activates.splice(acIdx, 1);
}

const onChangeCollapseJob = () => {
   // console.log(jobConfig.activates);
   jobConfig.isAllCollapse = jobConfig.activates.length === 0;
   // console.log(jobConfig.jobs);
}

const onChangeJobStartEndDate = () => {
   jobConfig.jobs.forEach(job => {
      job.startDate = job.startEndDate[0] || now;
      job.endDate = job.startEndDate[1] || now;
   });
   // console.log(eduConfig.educations);
}


const toggleCollapseProject = () => {
   projectConfig.isAllCollapse = !projectConfig.isAllCollapse;
   if (projectConfig.isAllCollapse) {
      projectConfig.activates.splice(0);
   } else {
      projectConfig.activates.push(...projectConfig.projects.map((it, idx) => idx));
   }
}

const reverseCollapseProject = () => {
   const reverseIdxs = projectConfig.projects.map((it, idx) => idx).filter(idx => !projectConfig.activates.includes(idx));
   projectConfig.activates.splice(0);
   projectConfig.activates.push(...reverseIdxs);
}

const addProject = () => {
   const project: Project = getProject();
   projectConfig.projects.unshift(project);
   const activates = projectConfig.activates.map(ac => ac + 1);
   projectConfig.activates.splice(0);
   projectConfig.activates.push(0, ...activates);
}

const removeProject = (index: number) => {
   projectConfig.projects.splice(index, 1);
   const acIdx = projectConfig.activates.findIndex(val => val === index);
   acIdx > -1 && projectConfig.activates.splice(acIdx, 1);
}

const onChangeCollapseProject = () => {
   // console.log(projectConfig.activates);
   projectConfig.isAllCollapse = projectConfig.activates.length === 0;
   // console.log(projectConfig.projects);
}

const onChangeProjectStartEndDate = () => {
   projectConfig.projects.forEach(project => {
      project.startDate = project.startEndDate[0] || now;
      project.endDate = project.startEndDate[1] || now;
   });
}

const isSaved = ref(false);

const saveResume = async () => {
   if (isSaved.value) {
      ElMessageBox.alert('已经保存成功了！', '重复提交', {
         // if you want to disable its autofocus
         // autofocus: false,
         confirmButtonText: '确认',
         type: 'warning'
      });
      return;
   }
   const loading = ElLoading.service({
      lock: true,
      text: '保存中...',
      background: 'rgba(0, 0, 0, 0.7)',
   });
   // console.log(eduConfig.educations);
   const rawSkills: Skill[] = skills.value.map((it, idx) => {
      it.sort = idx;
      return toRaw(it);
   });
   const tables = [db.resume, db.introduction, db.skill, db.education, db.job, db.project,];
   try {
      await db.transaction("rw", tables, async () => {
         let cnt = await db.resume.add(toRaw(resume));
         // console.log(cnt);
         cnt = await db.introduction.bulkAdd(toRaw(introConfig.intros));
         // console.log(cnt);
         cnt = await db.skill.bulkAdd(rawSkills);
         // console.log(cnt);
         cnt = await db.education.bulkAdd(toRaw(eduConfig.educations));
         // console.log(cnt);
         cnt = await db.job.bulkAdd(toRaw(jobConfig.jobs));
         // console.log(cnt);
         cnt = await db.project.bulkAdd(toRaw(projectConfig.projects));
         // console.log(cnt);
      });
      isSaved.value = true;
      loading.close();
      ElNotification.success({
         title: '保存成功',
         message: '简历保存成功',
         position: 'bottom-right',
      });
   } catch (e) {
      loading.close();
      ElNotification.error({
         title: '保存失败',
         message: '简历保存失败',
         position: 'bottom-right',
      });
   }
}

</script>

<template>
   <div class="wzblog-resume-add-bg">
      <breadcrumb />
      <div class="wzblog-resume-add-panel">
         <div class="wzblog-resume-add-title">
            <div class="form-line">
               <div class="form-line-label project-form-line-label">
                  <label :for="`resumeTitle`">简历标题</label>
               </div>
               <el-input v-model="resume.title" :name="`resumeTitle`" placeholder="简历标题" :style="{ width: '500px' }"
                  maxlength="50" clearable />
            </div>
            <el-button @click.stop="saveResume()" :disabled="isSaved" type="primary" :style="{ marginLeft: '30px' }">
               <template #default>
                  <span>保存简历</span>
               </template>
            </el-button>
         </div>
         <el-tabs type="border-card">
            <el-tab-pane label="个人优势">
               <div class="wzblog-resume-introductions">
                  <div class="wzblog-resume-introductions-operate-btn-panel">
                     <el-button @click.stop="toggleCollapseIntroduction">
                        <template #default>
                           <span v-text="introConfig.isAllCollapse ? '全部展开' : '全部关闭'" />
                        </template>
                     </el-button>
                     <el-button @click.stop="reverseCollapseIntroduction">
                        <template #default>
                           <span>反向展开</span>
                        </template>
                     </el-button>
                     <el-button @click.stop="addIntroduction">
                        <template #default>
                           <span>添加</span>
                        </template>
                     </el-button>
                  </div>
                  <el-collapse v-model="introConfig.activates" :change="onChangeCollapseIntroduction()">
                     <template v-for="(intro, idx) in introConfig.intros">
                        <el-collapse-item :name="idx">
                           <template #title>
                              <div class="wzblog-resume-introduction-item-head">
                                 <span
                                    v-text="`${intro.title}--${dayjs(intro.ctime).fromNow()}--${dayjs(intro.utime).fromNow()}`" />
                                 <div>
                                    <el-button @click.stop="activateIntroduction(idx)"
                                       :type="intro.isActivate ? 'success' : 'primary'" :disabled="intro.isActivate"
                                       :round="intro.isActivate">
                                       <template #default>
                                          <span v-text="intro.isActivate ? '使用中' : '使用'" />
                                       </template>
                                    </el-button>
                                    <el-popconfirm title="你确定要删除这条记录吗?" @confirm.stop="removeIntroduction(idx)">
                                       <template #reference>
                                          <el-button type="danger" @click.stop="">
                                             <template #default>
                                                <span>删除</span>
                                             </template>
                                          </el-button>
                                       </template>
                                    </el-popconfirm>
                                 </div>
                              </div>
                           </template>
                           <div class="wzblog-resume-introduction-item-body">
                              <div class="form-line">
                                 <div class="form-line-label">
                                    <label :for="`introTitle${idx}`">标题</label>
                                 </div>
                                 <el-input v-model="intro.title" :name="`introTitle${idx}`" placeholder="标题"
                                    :style="{ width: '300px' }" maxlength="20" clearable />
                              </div>
                              <div class="form-line">
                                 <div class="form-line-label">
                                    <label :for="`introContent${idx}`">内容</label>
                                 </div>
                                 <el-input v-model="intro.content" :name="`introContent${idx}`" placeholder="内容"
                                    type="textarea" :autosize="{ minRows: 5, maxRows: 13 }"
                                    :style="{ width: `800px` }" />
                              </div>
                           </div>
                        </el-collapse-item>
                     </template>
                  </el-collapse>
               </div> <!-- end div wzblog-resume-introductions -->
            </el-tab-pane>
            <el-tab-pane label="专业技能">
               <div class="wzblog-resume-skills">
                  <draggable v-model="skills" item-key="sort" tag="div" class="wzblog-resume-skills-body"
                     handle=".form-line-label-skill" v-bind="skillsDragOptions">
                     <template #item="{ element: skill, index: idx }">
                        <div class="skill-form-line form-line" :key="skill.sort">
                           <div class="form-line-label form-line-label-skill">
                              <el-tooltip class="box-item" effect="dark" content="拖拽排序" placement="left-start">
                                 <el-icon>
                                    <font-awesome-icon :icon="faAlignJustify" class="icon"></font-awesome-icon>
                                 </el-icon>
                              </el-tooltip>
                              <label :for="`skillContent${idx}`" v-text="`技能${idx + 1}`"></label>
                           </div>
                           <el-input v-model="skill.content" :name="`skillContent${idx}`" placeholder="技能"
                              class="skill-input" />
                           <el-popconfirm title="你确定要删除这条记录吗?" @confirm.stop="removeSkill(idx)">
                              <template #reference>
                                 <el-button type="danger" @click.stop="">
                                    <template #default>
                                       <span>删除</span>
                                    </template>
                                 </el-button>
                              </template>
                           </el-popconfirm>
                        </div>
                     </template>
                  </draggable>
                  <div class="wzblog-resume-skills-operate-btn-panel">
                     <el-button @click.stop="addSkill">
                        <template #default>
                           <span>添加</span>
                        </template>
                     </el-button>
                  </div>
               </div> <!-- end div wzblog-resume-skills -->
            </el-tab-pane>
            <el-tab-pane label="教育经历">
               <div class="wzblog-resume-educations">
                  <div class="wzblog-resume-educations-operate-btn-panel">
                     <el-button @click.stop="toggleCollapseEducation">
                        <template #default>
                           <span v-text="eduConfig.isAllCollapse ? '全部展开' : '全部关闭'" />
                        </template>
                     </el-button>
                     <el-button @click.stop="reverseCollapseEducation">
                        <template #default>
                           <span>反向展开</span>
                        </template>
                     </el-button>
                     <el-button @click.stop="addEducation">
                        <template #default>
                           <span>添加</span>
                        </template>
                     </el-button>
                  </div>
                  <el-collapse v-model="eduConfig.activates" :change="onChangeCollapseEducation()">
                     <template v-for="(edu, idx) in eduConfig.educations">
                        <el-collapse-item :name="idx">
                           <template #title>
                              <div class="wzblog-resume-educations-item-head">
                                 <span
                                    v-text="`${edu.organization}--${dayjs(edu.startDate).format('YYYY年MM月')}--${dayjs(edu.endDate).format('YYYY年MM月')}`" />
                                 <div>
                                    <el-popconfirm title="你确定要删除这条记录吗?" @confirm.stop="removeEducation(idx)">
                                       <template #reference>
                                          <el-button type="danger" @click.stop="">
                                             <template #default>
                                                <span>删除</span>
                                             </template>
                                          </el-button>
                                       </template>
                                    </el-popconfirm>
                                 </div>
                              </div>
                           </template>
                           <div class="wzblog-resume-educations-item-body">
                              <div class="form-line">
                                 <div class="form-line-label edu-form-line-label">
                                    <label :for="`eduOrg${idx}`">教育机构</label>
                                 </div>
                                 <el-input v-model="edu.organization" :name="`eduOrg${idx}`" placeholder="教育机构"
                                    :style="{ width: '300px' }" maxlength="20" clearable />
                                 <div class="form-line-label edu-form-line-label">
                                    <label :for="`eduStartEndDate${idx}`">教育时间</label>
                                 </div>
                                 <div class="edu-monthrange">
                                    <el-date-picker v-model="edu.startEndDate"
                                       :on-change="onChangeEducationStartEndDate()"
                                       :name="[`eduStartEndDate${idx}`, `eduStartEndDate${idx}`]" type="monthrange"
                                       start-placeholder="起始年月" range-separator="到" end-placeholder="终止年月" unlink-panels
                                       :style="{ width: '280px' }" :editable="false"
                                       popper-class="edu-monthrange-cell" />
                                 </div>
                              </div>
                              <div class="form-line">
                                 <div class="form-line-label edu-form-line-label">
                                    <label :for="`eduSpec${idx}`">专业名称</label>
                                 </div>
                                 <el-input v-model="edu.specialty" :name="`eduSpec${idx}`" placeholder="专业名称"
                                    :style="{ width: '300px' }" maxlength="20" clearable />
                                 <div class="form-line-label edu-form-line-label">
                                    <label :for="`eduCert${idx}`">毕业证书编号</label>
                                 </div>
                                 <el-input v-model="edu.certificateNo" :name="`eduCert${idx}`" placeholder="毕业证书编号"
                                    :style="{ width: '300px' }" maxlength="20" clearable />
                              </div>
                              <div class="form-line">
                                 <div class="form-line-label edu-form-line-label">
                                    <label :for="`eduContent${idx}`">教育内容</label>
                                 </div>
                                 <el-input v-model="edu.content" :name="`eduContent${idx}`" placeholder="教育内容"
                                    type="textarea" :autosize="{ minRows: 5, maxRows: 13 }"
                                    :style="{ width: `710px` }" />
                              </div>
                           </div>
                        </el-collapse-item>
                     </template>
                  </el-collapse>
               </div> <!-- wzblog-resume-educations -->
            </el-tab-pane>
            <el-tab-pane label="工作经历">
               <div class="wzblog-resume-jobs">
                  <div class="wzblog-resume-jobs-operate-btn-panel">
                     <el-button @click.stop="toggleCollapseJob">
                        <template #default>
                           <span v-text="jobConfig.isAllCollapse ? '全部展开' : '全部关闭'" />
                        </template>
                     </el-button>
                     <el-button @click.stop="reverseCollapseJob">
                        <template #default>
                           <span>反向展开</span>
                        </template>
                     </el-button>
                     <el-button @click.stop="addJob">
                        <template #default>
                           <span>添加</span>
                        </template>
                     </el-button>
                  </div>
                  <el-collapse v-model="jobConfig.activates" :change="onChangeCollapseJob()">
                     <template v-for="(job, idx) in jobConfig.jobs">
                        <el-collapse-item :name="idx">
                           <template #title>
                              <div class="wzblog-resume-jobs-item-head">
                                 <span
                                    v-text="`${job.company}--${dayjs(job.startDate).format('YYYY年MM月')}--${dayjs(job.endDate).format('YYYY年MM月')}`" />
                                 <div>
                                    <el-popconfirm title="你确定要删除这条记录吗?" @confirm.stop="removeJob(idx)">
                                       <template #reference>
                                          <el-button type="danger" @click.stop="">
                                             <template #default>
                                                <span>删除</span>
                                             </template>
                                          </el-button>
                                       </template>
                                    </el-popconfirm>
                                 </div>
                              </div>
                           </template>
                           <div class="wzblog-resume-jobs-item-body">
                              <div class="form-line">
                                 <div class="form-line-label job-form-line-label">
                                    <label :for="`jobComp${idx}`">公司名称</label>
                                 </div>
                                 <el-input v-model="job.company" :name="`jobComp${idx}`" placeholder="公司名称"
                                    :style="{ width: '300px' }" maxlength="20" clearable />
                                 <div class="form-line-label job-form-line-label">
                                    <label :for="`jobStartEndDate${idx}`">工作时间</label>
                                 </div>
                                 <div class="job-monthrange">
                                    <el-date-picker v-model="job.startEndDate" :on-change="onChangeJobStartEndDate()"
                                       :name="[`jobStartEndDate${idx}`, `jobStartEndDate${idx}`]" type="monthrange"
                                       start-placeholder="入职年月" range-separator="到" end-placeholder="离职年月" unlink-panels
                                       :style="{ width: '280px' }" :editable="false"
                                       popper-class="job-monthrange-cell" />
                                 </div>
                              </div>
                              <div class="form-line">
                                 <div class="form-line-label job-form-line-label">
                                    <label :for="`jobDept${idx}`">部门名称</label>
                                 </div>
                                 <el-input v-model="job.department" :name="`jobDept${idx}`" placeholder="部门名称"
                                    :style="{ width: '300px' }" maxlength="20" clearable />
                                 <div class="form-line-label job-form-line-label">
                                    <label :for="`jobProf${idx}`">岗位名称</label>
                                 </div>
                                 <el-input v-model="job.profession" :name="`jobProf${idx}`" placeholder="岗位名称"
                                    :style="{ width: '300px' }" maxlength="20" clearable />
                              </div>
                              <div class="form-line">
                                 <div class="form-line-label job-form-line-label">
                                    <label :for="`jobContent${idx}`">工作内容</label>
                                 </div>
                                 <el-input v-model="job.content" :name="`jobContent${idx}`" placeholder="工作内容"
                                    type="textarea" :autosize="{ minRows: 5, maxRows: 13 }"
                                    :style="{ width: `810px` }" />
                              </div>
                              <div class="form-line">
                                 <div class="form-line-label job-form-line-label">
                                    <label :for="`jobAchi${idx}`">工作业绩</label>
                                 </div>
                                 <el-input v-model="job.achievement" :name="`jobAchi${idx}`" placeholder="工作业绩"
                                    type="textarea" :autosize="{ minRows: 5, maxRows: 13 }"
                                    :style="{ width: `810px` }" />
                              </div>
                           </div>
                        </el-collapse-item>
                     </template>
                  </el-collapse>
               </div> <!-- wzblog-resume-jobs -->
            </el-tab-pane>
            <el-tab-pane label="项目经历">
               <div class="wzblog-resume-projects">
                  <div class="wzblog-resume-projects-operate-btn-panel">
                     <el-button @click.stop="toggleCollapseProject">
                        <template #default>
                           <span v-text="projectConfig.isAllCollapse ? '全部展开' : '全部关闭'" />
                        </template>
                     </el-button>
                     <el-button @click.stop="reverseCollapseProject">
                        <template #default>
                           <span>反向展开</span>
                        </template>
                     </el-button>
                     <el-button @click.stop="addProject">
                        <template #default>
                           <span>添加</span>
                        </template>
                     </el-button>
                  </div>
                  <el-collapse v-model="projectConfig.activates" :change="onChangeCollapseProject()">
                     <template v-for="(project, idx) in projectConfig.projects">
                        <el-collapse-item :name="idx">
                           <template #title>
                              <div class="wzblog-resume-projects-item-head">
                                 <span
                                    v-text="`${project.name}--${dayjs(project.startDate).format('YYYY年MM月')}--${dayjs(project.endDate).format('YYYY年MM月')}`" />
                                 <div>
                                    <el-popconfirm title="你确定要删除这条记录吗?" @confirm.stop="removeProject(idx)">
                                       <template #reference>
                                          <el-button type="danger" @click.stop="">
                                             <template #default>
                                                <span>删除</span>
                                             </template>
                                          </el-button>
                                       </template>
                                    </el-popconfirm>
                                 </div>
                              </div>
                           </template>
                           <div class="wzblog-resume-projects-item-body">
                              <div class="form-line">
                                 <div class="form-line-label project-form-line-label">
                                    <label :for="`projectName${idx}`">项目名称</label>
                                 </div>
                                 <el-input v-model="project.name" :name="`projectName${idx}`" placeholder="项目名称"
                                    :style="{ width: '400px' }" maxlength="20" clearable />
                                 <div class="form-line-label project-form-line-label">
                                    <label :for="`projectStartEndDate${idx}`">开发时间</label>
                                 </div>
                                 <div class="project-monthrange">
                                    <el-date-picker v-model="project.startEndDate"
                                       :on-change="onChangeProjectStartEndDate()"
                                       :name="[`projectStartEndDate${idx}`, `projectStartEndDate${idx}`]"
                                       type="monthrange" start-placeholder="立项年月" range-separator="到"
                                       end-placeholder="结项年月" unlink-panels :style="{ width: '280px' }"
                                       :editable="false" popper-class="project-monthrange-cell" />
                                 </div>
                              </div>
                              <div class="form-line">
                                 <div class="form-line-label project-form-line-label">
                                    <label :for="`projectSoft${idx}`">软件环境</label>
                                 </div>
                                 <el-input v-model="project.softwareEnv" :name="`projectSoft${idx}`" placeholder="软件环境"
                                    :style="{ width: '810px' }" maxlength="150" clearable />
                              </div>
                              <div class="form-line">
                                 <div class="form-line-label project-form-line-label">
                                    <label :for="`projectDevTool${idx}`">开发工具</label>
                                 </div>
                                 <el-input v-model="project.developTool" :name="`projectDevTool${idx}`"
                                    placeholder="开发工具" :style="{ width: '810px' }" maxlength="150" clearable />
                              </div>
                              <div class="form-line">
                                 <div class="form-line-label project-form-line-label">
                                    <label :for="`projectSkill${idx}`">技术选型</label>
                                 </div>
                                 <el-input v-model="project.skill" :name="`projectSkill${idx}`" placeholder="技术点"
                                    :style="{ width: '810px' }" maxlength="150" clearable />
                              </div>
                              <div class="form-line">
                                 <div class="form-line-label project-form-line-label">
                                    <label :for="`projectDesc${idx}`">项目描述</label>
                                 </div>
                                 <el-input v-model="project.desc" :name="`projectDesc${idx}`" placeholder="项目描述"
                                    type="textarea" :autosize="{ minRows: 5, maxRows: 13 }"
                                    :style="{ width: `810px` }" />
                              </div>
                              <div class="form-line">
                                 <div class="form-line-label project-form-line-label">
                                    <label :for="`projectDuty${idx}`">岗位职责</label>
                                 </div>
                                 <el-input v-model="project.duty" :name="`projectDuty${idx}`" placeholder="岗位职责"
                                    type="textarea" :autosize="{ minRows: 5, maxRows: 13 }"
                                    :style="{ width: `810px` }" />
                              </div>
                              <div class="form-line">
                                 <div class="form-line-label project-form-line-label">
                                    <label :for="`projectSolution${idx}`">解决方案</label>
                                 </div>
                                 <el-input v-model="project.solution" :name="`projectSolution${idx}`"
                                    placeholder="技术解决方案" type="textarea" :autosize="{ minRows: 5, maxRows: 13 }"
                                    :style="{ width: `810px` }" />
                              </div>
                           </div>
                        </el-collapse-item>
                     </template>
                  </el-collapse>
               </div> <!-- wzblog-resume-projects -->
            </el-tab-pane>
         </el-tabs>
      </div>
   </div>
</template>

<style scoped>
@media (min-width: 1024px) {
   .wzblog-resume-add-bg {
      padding: 3px;
      width: calc(100% - 16px);
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      align-content: center;
      justify-content: center;
      align-items: flex-start;
   }

   .wzblog-resume-add-panel {
      margin-top: 10px;
      width: 80%;
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      align-content: center;
      justify-content: center;
      align-items: flex-start;
      align-self: center;
   }

   .wzblog-resume-add-title {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-content: center;
      justify-content: center;
      align-items: flex-start;
   }

   .wzblog-resume-add-panel .ep-tabs {
      margin-top: 20px;
      width: 100%;
   }

   .wzblog-resume-introductions {
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      align-content: center;
      justify-content: center;
      align-items: flex-start;
   }

   .wzblog-resume-introductions .ep-collapse {
      margin-top: 10px;
      width: 100%;
   }

   .wzblog-resume-introduction-item-head {
      padding-right: 12px;
      width: 100%;
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-content: center;
      justify-content: space-between;
      align-items: center;
   }

   .wzblog-resume-introduction-item-head .ep-button {
      padding: 3px 10px;
      height: 20px;
   }

   .wzblog-resume-introduction-item-body {
      width: calc(100% - 100px);
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      align-content: center;
      justify-content: center;
      align-items: flex-start;
   }

   .form-line {
      margin-top: 20px;
      width: 100%;
      font-size: 14px;
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-content: center;
      justify-content: flex-start;
      align-items: center;
   }

   .form-line:first-child {
      margin-top: 0;
   }

   :deep(.form-line .ep-input__inner) {
      font-size: 13px;
   }

   .form-line-label {
      padding-right: 10px;
      width: 50px;
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-content: center;
      justify-content: flex-end;
      align-items: center;
   }

   .form-line-label-skill {
      width: 80px;
   }

   .form-line-label-skill i {
      cursor: move;
   }

   .form-line-label-skill label {
      cursor: move;
   }

   .skill-input {
      width: calc(100% - 100px);
   }

   .wzblog-resume-skills {
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      align-content: center;
      justify-content: center;
      align-items: flex-start;
   }

   .ghost {
      opacity: 0.5;
      background: #c8ebfb;
   }

   .wzblog-resume-skills-body {
      margin: 20px 0;
      width: calc(100% - 50px);
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      align-content: center;
      justify-content: center;
      align-items: flex-start;
   }

   .skill-form-line {
      margin-top: 30px;
   }

   .skill-form-line .ep-button {
      margin-left: 20px;
      padding: 3px 10px;
      height: 20px;
   }


   .wzblog-resume-educations {
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      align-content: center;
      justify-content: center;
      align-items: flex-start;
   }

   .wzblog-resume-educations .ep-collapse {
      margin-top: 10px;
      width: 100%;
   }

   .wzblog-resume-educations-item-head {
      padding-right: 12px;
      width: 100%;
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-content: center;
      justify-content: space-between;
      align-items: center;
   }

   .wzblog-resume-educations-item-head .ep-button {
      padding: 3px 10px;
      height: 20px;
   }

   .wzblog-resume-educations-item-body {
      width: calc(100% - 100px);
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      align-content: center;
      justify-content: center;
      align-items: flex-start;
   }

   .edu-form-line-label {
      width: 100px;
   }

   .edu-monthrange {
      width: 300px;
   }

   .edu-monthrange-cell {
      padding: 0;
   }

   .edu-monthrange-cell .cell {
      width: 50px;
      height: 30px;
   }



   .wzblog-resume-jobs {
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      align-content: center;
      justify-content: center;
      align-items: flex-start;
   }

   .wzblog-resume-jobs .ep-collapse {
      margin-top: 10px;
      width: 100%;
   }

   .wzblog-resume-jobs-item-head {
      padding-right: 12px;
      width: 100%;
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-content: center;
      justify-content: space-between;
      align-items: center;
   }

   .wzblog-resume-jobs-item-head .ep-button {
      padding: 3px 10px;
      height: 20px;
   }

   .wzblog-resume-jobs-item-body {
      width: calc(100% - 100px);
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      align-content: center;
      justify-content: center;
      align-items: flex-start;
   }

   .job-form-line-label {
      width: 100px;
   }

   .job-monthrange {
      width: 300px;
   }

   .job-monthrange-cell {
      padding: 0;
   }

   .job-monthrange-cell .cell {
      width: 50px;
      height: 30px;
   }

   .wzblog-resume-projects {
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      align-content: center;
      justify-content: center;
      align-items: flex-start;
   }

   .wzblog-resume-projects .ep-collapse {
      margin-top: 10px;
      width: 100%;
   }

   .wzblog-resume-projects-item-head {
      padding-right: 12px;
      width: 100%;
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-content: center;
      justify-content: space-between;
      align-items: center;
   }

   .wzblog-resume-projects-item-head .ep-button {
      padding: 3px 10px;
      height: 20px;
   }

   .wzblog-resume-projects-item-body {
      width: calc(100% - 100px);
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      align-content: center;
      justify-content: center;
      align-items: flex-start;
   }

   .project-form-line-label {
      width: 100px;
   }

   .project-monthrange {
      width: 300px;
   }

   .project-monthrange-cell {
      padding: 0;
   }

   .project-monthrange-cell .cell {
      width: 50px;
      height: 30px;
   }

}
</style>
