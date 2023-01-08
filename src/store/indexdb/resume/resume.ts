const schemas: Record<string, string> = {};

export interface Introduction {
    id?: number;
    resumeId?: string;
    title: string;
    content: string;
    isActivate: boolean;
    ctime: Date;
    utime: Date;
}
schemas.introduction = "++id, resumeId, title, content, isActivate, ctime, utime";

export interface Skill {
    id?: number;
    resumeId?: string;
    content: string;
    ctime: Date;
    utime: Date;
    sort: number;
}
schemas.skill = "++id, resumeId, sort, content, ctime, utime";


export interface Education {
    id?: number;
    resumeId?: string;
    organization: string;
    startDate: Date;
    endDate: Date;
    startEndDate: Date[];
    specialty: string;
    certificateNo: string;
    content: string;
    ctime: Date;
    utime: Date;
}
schemas.education = "++id, resumeId, organization, startDate, endDate, "
    + "specialty, certificateNo, content, ctime, utime";

export interface Job {
    id?: number;
    resumeId?: string;
    company: string;
    startDate: Date;
    endDate: Date;
    startEndDate: Date[];
    profession: string;
    department: string;
    achievement: string;
    content: string;
    isActivate: boolean;
    ctime: Date;
    utime: Date;
}
schemas.job = "++id, resumeId, company, startDate, endDate, "
    + "profession, department, achievement, content, isActivate, ctime, utime";

export interface Project {
    id?: number;
    resumeId?: string;
    /** 项目名称 */
    name: string;
    startDate: Date;
    endDate: Date;
    startEndDate: Date[];
    /** 软件环境 */
    softwareEnv: string,
    /** 开发工具 */
    developTool: string,
    /** 项目描述 */
    desc: string,
    /** 技术点 */
    skill: string,
    /** 岗位职责 */
    duty: string,
    /** 技术解决方案 */
    solution: string,
    isActivate: boolean;
    ctime: Date;
    utime: Date;
}
schemas.project = "++id, resumeId, name, startDate, endDate, "
    + "softwareEnv, developTool, desc, skill, duty, solution, isActivate, ctime, utime";

export interface Resume {
    id: string;
    title: string;
    isSync: boolean;
    ctime: Date;
    utime: Date;
    intros?: Introduction[];
    skills?: Skill[];
    edus?: Education[];
    jobs?: Job[];
    projects?: Project[];
}
schemas.resume = "id, &title, ctime, utime";

export default schemas;