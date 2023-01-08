import db, { Resume } from '~/store/indexdb/resume/db';
import assembleDTO, { ResumeDTO } from '~/store/indexdb/resume/resumeDTO';
import { urlHelper } from '~/utils/urlHelper';

const syncResume = async (uuid: string) => {
    if (!uuid) return;

    const intros = await db.introduction
        .where('resumeId').equals(uuid).and(it => it.isActivate).toArray();

    const dbskills = await db.skill.where('resumeId').equals(uuid).sortBy('sort');

    const educations = await (await db.education.where('resumeId').equals(uuid).sortBy('startDate')).reverse();

    const jobs = await (await db.job.where('resumeId').equals(uuid).sortBy('startDate')).reverse();

    const projects = await (await db.project.where('resumeId').equals(uuid).sortBy('startDate')).reverse();

    const dbresume: Resume = await db.resume.where('id').equals(uuid).first() as Resume;

    dbresume.isSync = true;
    dbresume.utime = new Date();
    dbresume.intros = intros;
    dbresume.skills = dbskills;
    dbresume.edus = educations;
    dbresume.jobs = jobs;
    dbresume.projects = projects;

    // console.log(dbresume)
    db.resume.put(dbresume);

    const API_URL = '/resume/saveResume';
    const resumeDTO: ResumeDTO = assembleDTO(dbresume);
    const json = await urlHelper.postData(API_URL, resumeDTO);

};

export { syncResume }