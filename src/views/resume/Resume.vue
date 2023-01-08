<script setup lang="ts">
import { faVcard } from "@fortawesome/free-regular-svg-icons";
import { faLink, faUnlink, } from "@fortawesome/free-solid-svg-icons";
import { reactive, watchEffect } from "vue";
import { Tickets, } from '@element-plus/icons-vue'
import db, { Resume } from '~/store/indexdb/resume/db'
import { syncResume } from '~/store/indexdb/resume/dao';
import { useWebConfigStore } from '~/store/webConfig'
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { faExchange } from "@fortawesome/free-solid-svg-icons";
dayjs.locale(useWebConfigStore().webConfig.lang.toLowerCase())

// /wzblog/
const baseUrl = import.meta.env.BASE_URL;

const resumes: Resume[] = reactive([]);

watchEffect(async () => {
    // 该 effect 会立即运行，后期可以加入变化的值，当变化时会重新运行
    const dbresumes = await db.resume.orderBy('utime').reverse().toArray();
    // console.log(dbresumes[0])
    resumes.push(...dbresumes);
});

const doSyncResume = (uuid: string) => {
    // console.log(uuid)
    const re: Resume = resumes.find(re => re.id === uuid) as Resume;
    re!.isSync = true;
    re!.utime = new Date();
    syncResume(uuid);
}

</script>

<template>
    <div class="wzblog-resume-index-container">
        <breadcrumb />
        <el-card class="resume-card">
            <template #header>
                <div class="card-header">
                    <span class="dashboard-icon-title">
                        <font-awesome-icon :icon="faVcard" class="icon"></font-awesome-icon>
                        <span style="margin-left: 10px;">简历</span>
                    </span>
                    <el-link :href="`${baseUrl}resume/add`">
                        <span class="dashboard-icon-title">
                            <font-awesome-icon :icon="faVcard" class="icon"></font-awesome-icon>
                            <span style="margin-left: 10px;">写简历</span>
                        </span>
                    </el-link>
                </div>
            </template>
            <div class="resume-container-body">
                <div class="onedata-table">
                    <el-table :data="resumes" row-key="id" max-height="500" stripe>
                        <el-table-column label="简历标题" min-width="500">
                            <template #default="{ row }">
                                <el-link :href="`${baseUrl}resume/detail/${row.id}`"
                                    :type="row.isSync ? 'success' : 'info'">
                                    <span class="dashboard-icon-title">
                                        <font-awesome-icon :icon="faVcard" class="icon"></font-awesome-icon>
                                        <span style="margin-left: 10px;" v-text="row.title"></span>
                                    </span>
                                </el-link>
                            </template>
                        </el-table-column>
                        <el-table-column label="状态" width="90">
                            <template #default="{ row }">
                                <span :style="{
                                    color: `var(${row.isSync ? '--ep-color-success' : '--ep-color-info'})`
                                }">
                                    <font-awesome-icon :icon="row.isSync ? faLink : faUnlink"
                                        class="icon mr3"></font-awesome-icon>
                                    <span v-text="row.isSync ? '已同步' : '未同步'"></span>
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column label="更新时间" width="210">
                            <template #default="{ row }">
                                <span v-text="dayjs(row.utime).format('YYYY-MM-DD HH:mm:ss')"></span>
                            </template>
                        </el-table-column>
                        <el-table-column label="创建时间" width="210">
                            <template #default="{ row }">
                                <span v-text="dayjs(row.ctime).format('YYYY-MM-DD HH:mm:ss')"></span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="150">
                            <template #default="{ row }">
                                <el-link :href="`${baseUrl}resume/edit/${row.id}`" :icon="Tickets" type="primary"
                                    class="wz-blog-table-opt-btn">编辑</el-link>
                                <el-button @click="doSyncResume(row.id)" v-if="!row.isSync" text
                                    class="wz-blog-table-opt-btn">
                                    <template #default>
                                        <font-awesome-icon :icon="faExchange" class="icon mr3"></font-awesome-icon>
                                        <span>同步</span>
                                    </template>
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </el-card>
    </div>
</template>

<style scoped>
@media (min-width: 1024px) {

    .wzblog-resume-index-container {
        width: calc(100% - 6px);
        padding: 3px;
    }

    .resume-card {
        margin-top: 10px;
        margin-left: 10px;
        width: calc(100% - 30px);
    }

    .resume-container-body {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-content: center;
        justify-content: flex-start;
        align-items: flex-start;
    }

    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .onedata-table {
        width: 100%;
    }

    .wz-blog-table-opt-btn {
        padding: 0;
    }

    .wz-blog-table-opt-btn:not(:first-child) {
        margin-left: 10px;
    }

    .mr3 {
        margin-right: 3px;
    }

}
</style>