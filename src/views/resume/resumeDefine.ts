import { Introduction, Education, Job, Project } from '~/store/indexdb/resume/db';

export interface IntroductionConfig {
    intros: Introduction[];
    activates: number[];
    /** 是否全部收起 */
    isAllCollapse: boolean;
}

export interface EducationConfig {
    educations: Education[];
    activates: number[];
    /** 是否全部收起 */
    isAllCollapse: boolean;
}

export interface JobConfig {
    jobs: Job[];
    activates: number[];
    /** 是否全部收起 */
    isAllCollapse: boolean;
}

export interface ProjectConfig {
    projects: Project[];
    activates: number[];
    /** 是否全部收起 */
    isAllCollapse: boolean;
}