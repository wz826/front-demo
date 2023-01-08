// db.ts
import Dexie, { Table } from "dexie";
import schemas, { Top10 } from './tetris';

export class MySubClassedDexie extends Dexie {
  // We just tell the typing system this is the case
  top10!: Table<Top10>;

  constructor() {
    super("WzBlogUseEpGameDatabase");
    this.version(1).stores(schemas);
  }
}

const db = new MySubClassedDexie();

export default db;

export type { Top10 }
