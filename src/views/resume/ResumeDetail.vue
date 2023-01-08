<script setup lang="ts">
import { onBeforeMount, reactive } from 'vue';
import db, { Introduction, Skill, Education, Job, Project, Resume } from '~/store/indexdb/resume/db'
import { useRoute, } from 'vue-router';
import { useWebConfigStore } from '~/store/webConfig'
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
dayjs.locale(useWebConfigStore().webConfig.lang.toLowerCase());

const route = useRoute();
const uuid: string = route.params.id as string;

interface ResumeVo {
    intros: Introduction[];
    skills: Skill[];
    educations: Education[];
    jobs: Job[];
    projects: Project[];
    resume: Resume;
}

const data: ResumeVo = reactive({
    intros: [] as Introduction[],
    skills: [] as Skill[],
    educations: [] as Education[],
    jobs: [] as Job[],
    projects: [] as Project[],
    resume: {} as Resume,
});

// 挂载前执行一次
onBeforeMount(async () => {
    /** 初始化 */
    const intros = await db.introduction
        .where('resumeId').equals(uuid).and(it => it.isActivate).toArray();
    data.intros.push(...intros);
    const dbskills = await db.skill.where('resumeId').equals(uuid).sortBy('sort');
    data.skills.push(...dbskills);
    const educations = await (await db.education.where('resumeId').equals(uuid).sortBy('startDate')).reverse();
    data.educations.push(...educations);
    const jobs = await (await db.job.where('resumeId').equals(uuid).sortBy('startDate')).reverse();
    data.jobs.push(...jobs);
    const projects = await (await db.project.where('resumeId').equals(uuid).sortBy('startDate')).reverse();
    data.projects.push(...projects);
    const dbresume: Resume = await db.resume.where('id').equals(uuid).first() as Resume;
    data.resume = dbresume;
    Object.assign(data.resume, dbresume);
    // console.log(data.resume);
});

</script>

<template>
    <div class="wzblog-resume-detail-bg">
        <breadcrumb />
        <div class="wzblog-resume-detail-panel">
            <div class="wzblog-resume-detail-item resume-title">
                <span v-text="data.resume.title"></span>
            </div>
            <div class="wzblog-resume-detail-item">
                <div class="resume-outlook"><span>个人优势</span></div>
                <div class="resume-detail" v-for="intro in data.intros">
                    <span v-text="intro.content"></span>
                </div>
            </div>
            <div class="wzblog-resume-detail-item">
                <div class="resume-outlook"><span>专业技能</span></div>
                <div class="resume-detail">
                    <ul>
                        <li v-text="skill.content" v-for="skill in data.skills"></li>
                    </ul>
                </div>
            </div>
            <div class="wzblog-resume-detail-item">
                <div class="resume-outlook"><span>教育经历</span></div>
                <div class="resume-detail" v-for="edu in data.educations">
                    <div class="resume-detail-line">
                        <div>
                            <span class="item-key">学校名称</span>
                            <span class="item-value" v-text="edu.organization"></span>
                        </div>
                        <div>
                            <span v-text="dayjs(edu.startDate).format('YYYY-MM')"></span>
                            ~
                            <span v-text="dayjs(edu.endDate).format('YYYY-MM')"></span>
                        </div>
                    </div>
                    <div class="resume-detail-line">
                        <div>
                            <span class="item-key">专业名称</span>
                            <span class="item-value" v-text="edu.specialty"></span>
                            <span class="item-key item-second">证书号码</span>
                            <span class="item-value" v-text="edu.certificateNo"></span>
                        </div>
                    </div>
                    <div class="resume-detail-line">
                        <div>
                            <span v-text="edu.content"></span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="wzblog-resume-detail-item">
                <div class="resume-outlook"><span>工作经历</span></div>
                <div class="resume-detail" v-for="job in data.jobs">
                    <div class="resume-detail-line">
                        <div>
                            <span class="item-key">公司名称</span>
                            <span v-text="job.company"></span>
                        </div>
                        <div>
                            <span v-text="dayjs(job.startDate).format('YYYY-MM')"></span>
                            ~
                            <span v-text="dayjs(job.endDate).format('YYYY-MM')"></span>
                        </div>
                    </div>
                    <div class="resume-detail-line">
                        <div>
                            <span class="item-key">部门名称</span>
                            <span class="item-value" v-text="job.department"></span>
                            <span class="item-key item-second">岗位名称</span>
                            <span class="item-value" v-text="job.profession"></span>
                        </div>
                    </div>
                    <div class="resume-detail-line">
                        <div class="resume-detail-line-long">
                            <div class="long-item-key">
                                <span class="item-key">工作内容</span>
                            </div>
                            <span v-text="job.content"></span>
                        </div>
                    </div>
                    <div class="resume-detail-line">
                        <div class="resume-detail-line-long">
                            <div class="long-item-key">
                                <span class="item-key">工作业绩</span>
                            </div>
                            <span v-text="job.achievement"></span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="wzblog-resume-detail-item">
                <div class="resume-outlook"><span>项目经历</span></div>
                <div class="resume-detail" v-for="proj in data.projects">
                    <div class="resume-detail-line">
                        <div>
                            <span class="item-key">项目名称</span>
                            <span v-text="proj.name"></span>
                        </div>
                        <div>
                            <span v-text="dayjs(proj.startDate).format('YYYY-MM')"></span>
                            ~
                            <span v-text="dayjs(proj.endDate).format('YYYY-MM')"></span>
                        </div>
                    </div>
                    <div class="resume-detail-line">
                        <div class="resume-detail-line-long">
                            <div class="long-item-key">
                                <span class="item-key">软件环境</span>
                            </div>
                            <span v-text="proj.softwareEnv"></span>
                        </div>
                    </div>
                    <div class="resume-detail-line">
                        <div class="resume-detail-line-long">
                            <div class="long-item-key">
                                <span class="item-key">开发工具</span>
                            </div>
                            <span v-text="proj.developTool"></span>
                        </div>
                    </div>
                    <div class="resume-detail-line">

                        <div class="resume-detail-line-long">
                            <div class="long-item-key">
                                <span class="item-key">技术选型</span>
                            </div>
                            <span v-text="proj.skill"></span>
                        </div>
                    </div>
                    <div class="resume-detail-line">
                        <div class="resume-detail-line-long">
                            <div class="long-item-key">
                                <span class="item-key">项目描述</span>
                            </div>
                            <span v-text="proj.desc"></span>
                        </div>
                    </div>
                    <div class="resume-detail-line">
                        <div class="resume-detail-line-long">
                            <div class="long-item-key">
                                <span class="item-key">项目责任</span>
                            </div>
                            <span v-text="proj.duty"></span>
                        </div>
                    </div>
                    <div class="resume-detail-line">
                        <div class="resume-detail-line-long">
                            <div class="long-item-key">
                                <span class="item-key">解决方案</span>
                            </div>
                            <span v-text="proj.solution"></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@media (min-width: 1024px) {

    .wzblog-resume-detail-bg {
        padding: 3px;
        width: calc(100% - 16px);
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        align-content: center;
        justify-content: center;
        align-items: flex-start;
    }

    .wzblog-resume-detail-panel {
        margin-top: 10px;
        margin-right: 100px;
        width: 900px;
        font-size: 14px;
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        align-content: center;
        justify-content: center;
        align-items: flex-start;
        align-self: center;
    }

    .wzblog-resume-detail-item {
        margin-top: 20px;
        width: 100%;
    }

    .wzblog-resume-detail-item:first-child {
        margin-top: 0;
    }

    .resume-title {
        font-size: 18px;
        letter-spacing: 2px;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        align-content: center;
        justify-content: center;
        align-items: center;
    }

    .resume-outlook {
        margin-bottom: 20px;
        font-size: 16px;
        letter-spacing: 2px;
    }

    .resume-detail {
        margin-top: 10px;
        padding: 3px;
        font-size: 14px;
        letter-spacing: 1px;
    }

    .resume-detail:first-child {
        margin-top: 0;
    }

    .resume-detail ul {
        margin: 0;
        padding: 0 0 0 20px;
    }

    .resume-detail ul li {
        margin: 3px 0;
    }

    .resume-detail-line {
        margin-top: 5px;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        align-content: center;
        justify-content: space-between;
        align-items: center;
    }

    .resume-detail-line:first-child {
        margin-top: 0;
    }

    .item-key {
        padding-right: 10px;
        white-space: nowrap;
    }

    .item-value {
        width: 300px;
        display: inline-block;
    }

    .item-second {
        margin-left: 10px;
    }

    .resume-detail-line-long {
        display: flex;
    }

    .long-item-key {
        display: flex;
    }
}
</style>
