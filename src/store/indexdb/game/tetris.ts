/** 俄罗斯方块TOP10 */
export interface Top10 {
    id?: number;
    name: string;
    score: number;
    ctime: Date;
}

export default {
    top10: "++id, &name, score, ctime", // Primary key and indexed props
}