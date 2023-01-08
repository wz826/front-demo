import dayjs from "dayjs";
import { Education, Introduction, Job, Project, Resume, Skill } from "./resume";

export interface IntroductionDTO {
    id?: number;
    resumeId?: string;
    title: string;
    content: string;
    activated: boolean;
    createdTime: string;
    updatedTime: string;
}

export interface SkillDTO {
    id?: number;
    resumeId?: string;
    content: string;
    createdTime: string;
    updatedTime: string;
    sort: number;
}


export interface EducationDTO {
    id?: number;
    resumeId?: string;
    organization: string;
    startDate: string;
    endDate: string;
    specialty: string;
    certificateNo: string;
    content: string;
    createdTime: string;
    updatedTime: string;
}

export interface JobDTO {
    id?: number;
    resumeId?: string;
    company: string;
    startDate: string;
    endDate: string;
    profession: string;
    department: string;
    achievement: string;
    content: string;
    activated: boolean;
    createdTime: string;
    updatedTime: string;
}

export interface ProjectDTO {
    id?: number;
    resumeId?: string;
    /** 项目名称 */
    name: string;
    startDate: string;
    endDate: string;
    /** 软件环境 */
    softwareEnv: string;
    /** 开发工具 */
    developTool: string;
    /** 项目描述 */
    desc: string;
    /** 技术点 */
    skill: string;
    /** 岗位职责 */
    duty: string;
    /** 技术解决方案 */
    solution: string;
    activated: boolean;
    createdTime: string;
    updatedTime: string;
}

export interface ResumeDTO {
    id: string;
    title: string;
    createdTime: string;
    updatedTime: string;
    intros?: IntroductionDTO[];
    skills?: SkillDTO[];
    edus?: EducationDTO[];
    jobs?: JobDTO[];
    projects?: ProjectDTO[];
}

/**
 * assembleDTO
 */
export default (resume: Resume): ResumeDTO => {
    const resumeDTO: ResumeDTO = {
        id: resume.id,
        title: resume.title,
        createdTime: dayjs(resume.ctime).format('YYYY-MM-DD HH:mm:ss'),
        updatedTime: dayjs(resume.utime).format('YYYY-MM-DD HH:mm:ss'),
        intros: resume.intros?.map((intro: Introduction) => ({
            id: intro.id,
            resumeId: resume.id,
            title: intro.title,
            content: intro.content,
            activated: intro.isActivate,
            createdTime: dayjs(intro.ctime).format('YYYY-MM-DD HH:mm:ss'),
            updatedTime: dayjs(intro.ctime).format('YYYY-MM-DD HH:mm:ss'),
        } as IntroductionDTO)),
        skills: resume.skills?.map((skill: Skill) => ({
            id: skill.id,
            resumeId: resume.id,
            content: skill.content,
            createdTime: dayjs(skill.ctime).format('YYYY-MM-DD HH:mm:ss'),
            updatedTime: dayjs(skill.ctime).format('YYYY-MM-DD HH:mm:ss'),
            sort: skill.sort,
        } as SkillDTO)),
        edus: resume.edus?.map((edu: Education) => ({
            id: edu.id,
            resumeId: resume.id,
            content: edu.content,
            createdTime: dayjs(edu.ctime).format('YYYY-MM-DD HH:mm:ss'),
            updatedTime: dayjs(edu.ctime).format('YYYY-MM-DD HH:mm:ss'),
            organization: edu.organization,
            startDate: dayjs(edu.ctime).format('YYYY-MM-DD HH:mm:ss'),
            endDate: dayjs(edu.ctime).format('YYYY-MM-DD HH:mm:ss'),
            specialty: edu.specialty,
            certificateNo: edu.certificateNo,
        } as EducationDTO)),
        jobs: resume.jobs?.map((job: Job) => ({
            id: job.id,
            resumeId: resume.id,
            createdTime: dayjs(job.ctime).format('YYYY-MM-DD HH:mm:ss'),
            updatedTime: dayjs(job.ctime).format('YYYY-MM-DD HH:mm:ss'),
            company: job.company,
            startDate: dayjs(job.ctime).format('YYYY-MM-DD HH:mm:ss'),
            endDate: dayjs(job.ctime).format('YYYY-MM-DD HH:mm:ss'),
            profession: job.profession,
            department: job.department,
            achievement: job.achievement,
            content: job.content,
            activated: job.isActivate,
        } as JobDTO)),
        projects: resume.projects?.map((project: Project) => ({
            id: project.id,
            resumeId: resume.id,
            createdTime: dayjs(project.ctime).format('YYYY-MM-DD HH:mm:ss'),
            updatedTime: dayjs(project.ctime).format('YYYY-MM-DD HH:mm:ss'),
            /** 项目名称 */
            name: project.name,
            startDate: dayjs(project.ctime).format('YYYY-MM-DD HH:mm:ss'),
            endDate: dayjs(project.ctime).format('YYYY-MM-DD HH:mm:ss'),
            /** 软件环境 */
            softwareEnv: project.softwareEnv,
            /** 开发工具 */
            developTool: project.developTool,
            /** 项目描述 */
            desc: project.desc,
            /** 技术点 */
            skill: project.skill,
            /** 岗位职责 */
            duty: project.duty,
            /** 技术解决方案 */
            solution: project.solution,
            activated: project.isActivate,
        } as ProjectDTO)),
    };
    return resumeDTO;
}