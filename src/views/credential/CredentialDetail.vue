<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { ref, onBeforeMount } from 'vue';
import {
    MoreFilled, Back, Iphone, Location, MapLocation,
    Message, QuestionFilled, InfoFilled, Memo, Timer,
    Calendar, Link, User, Stamp, Open, TurnOff,
} from '@element-plus/icons-vue';
import { dataHelper } from '~/utils/DataHelper';
import { urlHelper } from '~/utils/urlHelper';
// TODO 只要导入此包，表格样式就乱了
// import { ElTable } from 'element-plus';
// const tableRef = ref<InstanceType<typeof ElTable>>()

const route = useRoute();
const bizid = route.params.bizid;
const getDetailData = async (): Promise<any> => {
    // console.log(bizid.value);    
    // const ApifoxHost = import.meta.env.VENUS_ApifoxHost;
    const ApifoxHost = "";
    const API_URL = `${ApifoxHost}/credential/detail/${bizid}`;
    const json = await urlHelper.getData(API_URL);
    // console.log(json);
    return json;
}
/**
 * TODO 高亮当前行
 */
const headTableRef = ref({});
const lineTableRef = ref({});
const detailData: any = ref([]);
const detailDataAllLines: any = ref([]);
const detailDataLines: any = ref([]);
const detailDataFirst: any = ref({});
const isShowAllDetailLines = ref(true);
const currentDetailLineHeadId = ref('');

const onIsShowAllDetailLinesChange = (next: any) => {
    // console.log("isShowAllDetailLines");
    if (next) {
        detailDataLines.value = detailDataAllLines.value;
    } else {
        detailDataLines.value = detailDataAllLines.value
            .filter((line: any) => {
                return line.head.id === currentDetailLineHeadId.value;
            });
    }
};

const getDetailOne = (hidx: any = 0, lidx: any = 0) => {
    // console.log(hidx);
    // console.log(lidx);
    let one = Object.assign({}, detailData.value[hidx]);
    delete one.line;
    delete one.lines;
    if (!dataHelper.isEmpty(detailData.value[hidx].lines)) {
        one.line = detailData.value[hidx].lines[lidx];
    } else {
        // TODO Apifox会返回空数组，尽管已经设置最小个数，但不生效
        one.line = detailData.value[hidx].line;
    }
    // console.log(one);
    currentDetailLineHeadId.value = one.id;
    onIsShowAllDetailLinesChange(isShowAllDetailLines.value);
    return one;
};


// 挂载前执行一次
onBeforeMount(async () => {
    const respData = await getDetailData();
    detailData.value = respData;
    detailDataAllLines.value = respData.map((head: any) => {
        const oneHead = Object.assign({}, head);
        delete oneHead.line;
        delete oneHead.lines;
        if (!dataHelper.isEmpty(head.lines)) {
            return head.lines.map((line: any) => {
                line.head = oneHead;
                return line;
            });
        } else {
            const oneLine = Object.assign({}, head.line);
            oneLine.head = oneHead;
            return [oneLine];
        }
    }).reduce((pre: any, cur: any) => pre.concat(cur));
    detailDataLines.value = detailDataAllLines.value;
    if (!dataHelper.isEmpty(respData)) {
        detailDataFirst.value = getDetailOne(0, 0);
    }
});

const router = useRouter();
const goBack = () => {
    // console.log(router);
    router.back();
};

const calendar = ref();
const selectDate = (val: string) => {
    calendar.value.selectDate(val);
};

const doViewDetailTheOne = (hidx: any, lidx: any) => {
    detailDataFirst.value = getDetailOne(hidx, lidx);
};

//点击行展示
const clickHeadRowHandle = (row: any, column: any, event: any) => {
    // console.log('clickHeadRowHandle');
    // console.log(row);
    // console.log(column);
    // console.log(event);
    // console.log(headTableRef);
    let head = row;
    let line;
    if (row?.head) {
        // console.log(row);
        head = detailData.value.filter((oh: any) => {
            return oh.id === row.head.id;
        })[0];
        line = row;
    }
    const one = Object.assign({}, head);
    delete one.line;
    delete one.lines;
    if (line) {
        one.line = line;
    } else {
        if (!dataHelper.isEmpty(head.lines)) {
            one.line = head.lines[0];
        } else {
            // TODO Apifox会返回空数组，尽管已经设置最小个数，但不生效
            one.line = head.line;
        }
    }
    // console.log(one);
    currentDetailLineHeadId.value = one.id;
    onIsShowAllDetailLinesChange(isShowAllDetailLines.value);
    detailDataFirst.value = one;
};
</script>

<template>
    <div class="wzblog-credential-detail-container">
        <breadcrumb />
        <el-row class="wzblog-credential-detail-row" :gutter="10">
            <el-col :span="4">
                <el-timeline id="affix_timeline" style="padding-left: 10px; margin-top: 15px;">
                    <el-timeline-item v-for="(head, hidx) in detailData" :key="hidx"
                        :icon="head.lines && 1 < head.lines.length ? MoreFilled : ''"
                        :color="head.enabled ? 'green' : ''" :timestamp="head.createdTime">
                        <el-card v-if="head.lines && head.lines?.length" body-style="padding: 1rem; ">
                            <template #header>
                                <el-link :icon="Stamp" @click="doViewDetailTheOne(hidx, 0)" :underline="false"
                                    class="ellipsis-class cd-timeline-head">
                                    {{ head.mainstay }}
                                </el-link>
                            </template>
                            <el-timeline style="padding: 0;">
                                <el-timeline-item v-for="(line, lidx) in head.lines" :key="lidx"
                                    :color="line.enabled ? 'green' : ''" :timestamp="line.createdTime">
                                    <el-link :icon="Stamp" @click="doViewDetailTheOne(hidx, lidx)" :underline="false"
                                        class="ellipsis-class cd-timeline-line">
                                        {{ line.passwordSuggestion }}
                                    </el-link>
                                </el-timeline-item>
                            </el-timeline>
                        </el-card>
                        <span v-else>{{ head.mainstay }}No Detail Line Data</span>
                    </el-timeline-item>
                </el-timeline>
            </el-col>
            <el-col :span="20">
                <el-card class="box-card form-card credential-card">
                    <template #header>
                        <div class="card-header">
                            <span>凭据主体</span>
                            <el-button type="primary" :icon="Back" @click="goBack" class="button btn-back">返回
                            </el-button>
                        </div>
                    </template>
                    <el-row class="form-row">
                        <el-col :span="2">
                            <div class="cell-item-lable">
                                <el-icon>
                                    <Stamp />
                                </el-icon>
                                主体
                            </div>
                        </el-col>
                        <el-col :span="4">
                            <div class="cell-item-value">{{ detailDataFirst.mainstay }}</div>
                        </el-col>
                        <el-col :span="2">
                            <div class="cell-item-lable">
                                <el-icon>
                                    <Stamp />
                                </el-icon>
                                名称
                            </div>
                        </el-col>
                        <el-col :span="4">
                            <div class="cell-item-value">{{ detailDataFirst.name }}</div>
                        </el-col>
                        <el-col :span="2">
                            <div class="cell-item-lable">
                                <el-icon>
                                    <Stamp />
                                </el-icon>
                                别名
                            </div>
                        </el-col>
                        <el-col :span="10">
                            <div class="cell-item-value">{{ detailDataFirst.alias }}</div>
                        </el-col>
                    </el-row>
                    <el-row class="form-row">
                        <el-col :span="2">
                            <div class="cell-item-lable">
                                <el-icon>
                                    <user />
                                </el-icon>
                                创建人
                            </div>
                        </el-col>
                        <el-col :span="4">
                            <div class="cell-item-value">{{ detailDataFirst.createdBy }}</div>
                        </el-col>
                        <el-col :span="2">
                            <div class="cell-item-lable">
                                <el-icon>
                                    <Calendar />
                                </el-icon>
                                创建时间
                            </div>
                        </el-col>
                        <el-col :span="4">
                            <div class="cell-item-value">{{ detailDataFirst.createdTime }}</div>
                        </el-col>
                        <el-col :span="2">
                            <div class="cell-item-lable">
                                <el-icon>
                                    <user />
                                </el-icon>
                                修改人
                            </div>
                        </el-col>
                        <el-col :span="4">
                            <div class="cell-item-value">{{ detailDataFirst.updatedBy }}</div>
                        </el-col>
                        <el-col :span="2">
                            <div class="cell-item-lable">
                                <el-icon>
                                    <Timer />
                                </el-icon>
                                修改时间
                            </div>
                        </el-col>
                        <el-col :span="4">
                            <div class="cell-item-value">{{ detailDataFirst.updatedTime }}</div>
                        </el-col>
                    </el-row>
                    <el-card v-if="detailData && 1 < detailData.length" class="box-card form-card credential-card">
                        <template #header>
                            <div class="card-header">
                                <span>凭据主体历史</span>
                            </div>
                        </template>
                        <el-table ref="headTableRef" :data="detailData" stripe row-key="id"
                            @row-click="clickHeadRowHandle" highlight-current-row style="width: 100%;" :max-height="300"
                            border>
                            <el-table-column show-overflow-tooltip fixed prop="mainstay" label="主体" width="150" />
                            <el-table-column show-overflow-tooltip fixed prop="name" label="名称" width="150" />
                            <el-table-column show-overflow-tooltip prop="alias" label="别名" width="150" />
                            <el-table-column show-overflow-tooltip prop="createdTime" label="创建时间" width="150" />
                            <el-table-column show-overflow-tooltip prop="lines[0].password" label="密码" width="80" />
                            <el-table-column show-overflow-tooltip prop="lines[0].passwordSuggestion" label="密码提示"
                                width="150" />
                            <el-table-column show-overflow-tooltip prop="lines[0].phone" label="手机号码" width="120" />
                            <el-table-column show-overflow-tooltip prop="lines[0].mail" label="电子邮箱" width="150" />
                            <el-table-column show-overflow-tooltip prop="lines[0].url" label="网址" width="150" />
                            <el-table-column show-overflow-tooltip prop="lines[0].address" label="创建地址" width="150" />
                        </el-table>
                    </el-card>
                </el-card>
                <!-- end 凭据主体 -->

                <el-card class="box-card form-card credential-card">
                    <template #header>
                        <div class="card-header">
                            <span>凭据详情</span>
                        </div>
                    </template>
                    <el-row class="form-row">
                        <el-col :span="2">
                            <div class="cell-item-lable">
                                <el-icon>
                                    <Stamp />
                                </el-icon>
                                密码
                            </div>
                        </el-col>
                        <el-col :span="4">
                            <div class="cell-item-value">{{ detailDataFirst.line?.password }}</div>
                        </el-col>
                        <el-col :span="3">
                            <div class="cell-item-lable">
                                <el-icon>
                                    <Stamp />
                                </el-icon>
                                密码提示
                            </div>
                        </el-col>
                        <el-col :span="15">
                            <div class="cell-item-value">{{ detailDataFirst.line?.passwordSuggestion }}</div>
                        </el-col>
                    </el-row>
                    <el-row class="form-row">
                        <el-col :span="2">
                            <div class="cell-item-lable">
                                <el-icon>
                                    <Link />
                                </el-icon>
                                网址
                            </div>
                        </el-col>
                        <el-col :span="22">
                            <div class="cell-item-value">{{ detailDataFirst.line?.url }}</div>
                        </el-col>
                    </el-row>
                    <el-row class="form-row">
                        <el-col :span="2">
                            <div class="cell-item-lable">
                                <el-icon>
                                    <Location />
                                </el-icon>
                                创建地址
                            </div>
                        </el-col>
                        <el-col :span="4">
                            <div class="cell-item-value">{{ detailDataFirst.line?.address }}</div>
                        </el-col>
                        <el-col :span="3">
                            <div class="cell-item-lable">
                                <el-icon>
                                    <MapLocation />
                                </el-icon>
                                常用地址列表
                            </div>
                        </el-col>
                        <el-col :span="15">
                            <div class="cell-item-value">{{ detailDataFirst.line?.addressOftenList }}</div>
                        </el-col>
                    </el-row>
                    <el-row class="form-row">
                        <el-col :span="2">
                            <div class="cell-item-lable">
                                <el-icon>
                                    <Iphone />
                                </el-icon>
                                手机号码
                            </div>
                        </el-col>
                        <el-col :span="4">
                            <div class="cell-item-value">{{ detailDataFirst.line?.phone }}</div>
                        </el-col>
                        <el-col :span="3">
                            <div class="cell-item-lable">
                                <el-icon>
                                    <Iphone />
                                </el-icon>
                                安全手机列表
                            </div>
                        </el-col>
                        <el-col :span="15">
                            <div class="cell-item-value">{{ detailDataFirst.line?.phoneSafeList }}</div>
                        </el-col>
                    </el-row>
                    <el-row class="form-row">
                        <el-col :span="2">
                            <div class="cell-item-lable">
                                <el-icon>
                                    <Message />
                                </el-icon>
                                电子邮箱
                            </div>
                        </el-col>
                        <el-col :span="4">
                            <div class="cell-item-value">{{ detailDataFirst.line?.mail }}</div>
                        </el-col>
                        <el-col :span="3">
                            <div class="cell-item-lable">
                                <el-icon>
                                    <Message />
                                </el-icon>
                                安全邮箱列表
                            </div>
                        </el-col>
                        <el-col :span="15">
                            <div class="cell-item-value">{{ detailDataFirst.line?.mailSafeList }}</div>
                        </el-col>
                    </el-row>
                    <el-row class="form-row">
                        <el-col :span="2">
                            <div class="cell-item-lable">
                                <el-icon>
                                    <QuestionFilled />
                                </el-icon>
                                安全问题1
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div class="cell-item-value">{{ detailDataFirst.line?.safeQuestionOne }}</div>
                        </el-col>
                        <el-col :span="2">
                            <div class="cell-item-lable">
                                <el-icon>
                                    <InfoFilled />
                                </el-icon>
                                安全答案1
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div class="cell-item-value">{{ detailDataFirst.line?.safeAnswerOne }}</div>
                        </el-col>
                    </el-row>
                    <el-row class="form-row">
                        <el-col :span="2">
                            <div class="cell-item-lable">
                                <el-icon>
                                    <QuestionFilled />
                                </el-icon>
                                安全问题2
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div class="cell-item-value">{{ detailDataFirst.line?.safeAnswerTwo }}</div>
                        </el-col>
                        <el-col :span="2">
                            <div class="cell-item-lable">
                                <el-icon>
                                    <InfoFilled />
                                </el-icon>
                                安全答案2
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div class="cell-item-value">{{ detailDataFirst.line?.safeAnswerTwo }}</div>
                        </el-col>
                    </el-row>
                    <el-row class="form-row">
                        <el-col :span="2">
                            <div class="cell-item-lable">
                                <el-icon>
                                    <QuestionFilled />
                                </el-icon>
                                安全问题3
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div class="cell-item-value">{{ detailDataFirst.line?.safeQuestionThree }}</div>
                        </el-col>
                        <el-col :span="2">
                            <div class="cell-item-lable">
                                <el-icon>
                                    <InfoFilled />
                                </el-icon>
                                安全答案3
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div class="cell-item-value">{{ detailDataFirst.line?.safeAnswerThree }}</div>
                        </el-col>
                    </el-row>
                    <el-row class="form-row">
                        <el-col :span="2">
                            <div class="cell-item-lable">
                                <el-icon>
                                    <Memo />
                                </el-icon>
                                备注
                            </div>
                        </el-col>
                        <el-col :span="22">
                            <div class="cell-item-value" style="line-height: 1.5rem;">{{ detailDataFirst.line?.remark }}
                            </div>
                        </el-col>
                    </el-row>
                    <el-row class="form-row">
                        <el-col :span="2">
                            <div class="cell-item-lable">
                                <el-icon>
                                    <user />
                                </el-icon>
                                创建人
                            </div>
                        </el-col>
                        <el-col :span="4">
                            <div class="cell-item-value">{{ detailDataFirst.line?.createdBy }}</div>
                        </el-col>
                        <el-col :span="2">
                            <div class="cell-item-lable">
                                <el-icon>
                                    <Calendar />
                                </el-icon>
                                创建时间
                            </div>
                        </el-col>
                        <el-col :span="4">
                            <div class="cell-item-value">{{ detailDataFirst.line?.createdTime }}</div>
                        </el-col>
                        <el-col :span="2">
                            <div class="cell-item-lable">
                                <el-icon>
                                    <user />
                                </el-icon>
                                修改人
                            </div>
                        </el-col>
                        <el-col :span="4">
                            <div class="cell-item-value">{{ detailDataFirst.line?.updatedBy }}</div>
                        </el-col>
                        <el-col :span="2">
                            <div class="cell-item-lable">
                                <el-icon>
                                    <Timer />
                                </el-icon>
                                修改时间
                            </div>
                        </el-col>
                        <el-col :span="4">
                            <div class="cell-item-value">{{ detailDataFirst.line?.updatedTime }}</div>
                        </el-col>
                    </el-row>
                    <el-card v-if="detailDataLines && 1 < detailDataLines.length"
                        class="box-card form-card credential-card">
                        <template #header>
                            <div class="card-header">
                                <span>凭据详情历史</span>
                                <el-switch v-model="isShowAllDetailLines" @change="onIsShowAllDetailLinesChange"
                                    active-text="全部凭据详情历史" inactive-text="当前凭据详情历史" />
                            </div>
                        </template>
                        <el-table ref="lineTableRef" :data="detailDataLines" stripe row-key="id"
                            @row-click="clickHeadRowHandle" highlight-current-row style="width: 100%;" :max-height="300"
                            border>
                            <el-table-column show-overflow-tooltip fixed prop="head.mainstay" label="主体" width="100" />
                            <el-table-column show-overflow-tooltip fixed prop="head.name" label="名称" width="100" />
                            <el-table-column show-overflow-tooltip prop="head.alias" label="别名" width="100" />
                            <el-table-column show-overflow-tooltip prop="password" label="密码" width="100" />
                            <el-table-column show-overflow-tooltip prop="passwordSuggestion" label="密码提示" width="170" />
                            <el-table-column show-overflow-tooltip prop="phone" label="手机号码" width="120" />
                            <el-table-column show-overflow-tooltip prop="mail" label="电子邮箱" width="190" />
                            <el-table-column show-overflow-tooltip prop="url" label="网址" width="190" />
                            <el-table-column show-overflow-tooltip prop="address" label="创建地址" width="150" />
                            <el-table-column show-overflow-tooltip prop="head.createdTime" label="创建时间" width="120" />
                            <el-table-column show-overflow-tooltip fixed="right" label="状态" width="65">
                                <template #default="{ row }">
                                    <div v-if="row.enabled" class="tab-col-status" style="color: green;">
                                        <el-icon>
                                            <Open />
                                        </el-icon>
                                        使用
                                    </div>
                                    <div v-else class="tab-col-status">
                                        <el-icon>
                                            <TurnOff />
                                        </el-icon>
                                        禁用
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-card>
                </el-card>
                <!-- end 凭据详情 -->
            </el-col>
        </el-row>
    </div>
</template>

<style scoped>
@media (min-width: 1024px) {

    .wzblog-credential-detail-container {
        width: calc(100% - 6px);
        padding: 3px;
    }

    .wzblog-credential-detail-row {
        width: calc(100% - 6px);
    }

    .credential-card {
        font-size: 14px;
    }

    .form-card {
        margin-top: 10px;
    }

    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .form-row {
        margin: 0;
        line-height: 2.5rem;
    }

    .btn-back {
        width: 100px;
    }

    /** 子节点样式 */
    :deep(#affix_timeline .ep-card__body > .ep-timeline > .ep-timeline-item:last-child) {
        padding: 0;
    }

    .cell-item-lable {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: end;
        padding-right: 5px;
        color: var(--ep-text-color-secondary);
        background-color: var(--ep-bg-color);
    }

    .tab-col-status {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: start;
    }

    .cell-item-value {
        height: 100%;
        padding-left: 5px;
        background-color: var(--ep-fill-color-extra-light);
    }

    :deep(.cd-timeline-head .ep-link__inner) {
        display: inline-block;
        width: 120px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    :deep(.cd-timeline-line .ep-link__inner) {
        display: inline-block;
        width: 100px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}
</style>
