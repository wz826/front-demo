// db.ts
import Dexie, { Table } from "dexie";
import schemas, { Introduction, Skill, Education, Job, Project, Resume } from './resume';

export class MySubClassedDexie extends Dexie {
  // We just tell the typing system this is the case
  introduction!: Table<Introduction>;
  skill!: Table<Skill>;
  education!: Table<Education>;
  job!: Table<Job>;
  project!: Table<Project>;
  resume!: Table<Resume>;

  constructor() {
    super("WzBlogUseEpResumeDatabase");
    this.version(1).stores(schemas);
  }
}

const db = new MySubClassedDexie();

export default db;

export type { Introduction, Skill, Education, Job, Project, Resume }
