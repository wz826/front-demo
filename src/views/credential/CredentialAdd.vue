<script lang="ts" setup>
import { Plus, Delete, Back } from '@element-plus/icons-vue';
import { ElLoading, FormInstance, FormRules, ElNotification } from 'element-plus';
import { noop } from 'lodash';
import { ref, reactive, } from 'vue';
import { useRouter } from 'vue-router';
import { urlHelper } from '~/utils/urlHelper';
// If you want to use ElMessage, import it.
import "element-plus/theme-chalk/src/loading.scss";
import "element-plus/theme-chalk/src/notification.scss";

const formData = reactive({
    mainstay: "",
    name: "",
    alias: "",
    createdBy: "",
    createdTime: null,
    updatedBy: "",
    updatedTime: null,
    line: {
        password: "",
        passwordSuggestion: "",
        phone: "",
        phoneSafeList: "",
        mail: "",
        mailSafeList: "",
        address: "",
        addressOftenList: "",
        url: "",
        safeQuestionOne: "",
        safeQuestionTwo: "",
        safeQuestionThree: "",
        safeAnswerOne: "",
        safeAnswerTwo: "",
        safeAnswerThree: "",
        remark: "",
        createdBy: "",
        createdTime: null,
        updatedBy: "",
        updatedTime: null,
    }
});

const ruleFormRef = ref<FormInstance>();
const formSize = ref('default')
const rules = reactive<FormRules>({
    name: [
        { required: true, message: 'Please input credential name', trigger: 'blur' },
        { min: 3, max: 25, message: 'Length should be 3 to 5', trigger: 'blur' },
    ],
    "line.password": [
        { required: true, message: 'Please input credential line.password', trigger: 'blur' },
        { min: 3, max: 25, message: 'Length should be 3 to 5', trigger: 'blur' },
    ],
});

const submitForm = async (formEl: FormInstance | undefined) => {
    const loading = ElLoading.service({
        lock: true,
        text: '保存中...',
        background: 'rgba(0, 0, 0, 0.7)',
    });
    // console.log(formData);
    if (!formEl) return;
    const valid = await formEl.validate(noop);
    // console.log(valid);
    if (!valid) return;
    // console.log('submit!');
    // const ApifoxHost = import.meta.env.VENUS_ApifoxHost;
    const ApifoxHost = "";
    // const ApifoxHost = import.meta.env.VENUS_WZBLOG_HOST;
    const SAVE_CD_API_URL = `${ApifoxHost}/credential/saveCredential`;
    const json = await urlHelper.postData(SAVE_CD_API_URL, formData);
    loading.close();
    // console.log(json);
    ElNotification.success({
        title: '保存成功',
        message: '凭据保存成功',
        position: 'bottom-right',
    });
};

const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.resetFields();
};

const router = useRouter();

const goBack = () => {
    // console.log(router);
    router.back();
};
</script>

<template >
    <div class="wzblog-credential-add-container">
        <breadcrumb />
        <el-form :model="formData" ref="ruleFormRef" :size="formSize" :rules="rules" status-icon label-width="120px">
            <el-card class="box-card form-card">
                <template #header>
                    <div class="card-header">
                        <span>凭据主体</span>
                        <el-button type="primary" :icon="Back" @click="goBack" class="button btn-back">返回</el-button>
                    </div>
                </template>
                <div>
                    <el-row :gutter="20" class="form-row">
                        <el-col :span="6">
                            <el-form-item label="主体" prop="mainstay">
                                <el-input v-model="formData.mainstay" clearable />
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="名称" prop="name">
                                <el-input v-model="formData.name" clearable />
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="别名" prop="alias">
                                <el-input v-model="formData.alias" clearable />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <!-- 凭据主体-审计字段 -->
                    <el-row :gutter="20" class="form-row">
                        <el-col :span="6">
                            <el-form-item label="创建人UUID" prop="createdBy">
                                <el-input v-model="formData.createdBy" clearable />
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="创建时间" prop="createdTime">
                                <el-date-picker v-model="formData.createdTime" type="datetime" placeholder="创建时间"
                                    value-format="YYYY-MM-DD HH:mm:ss" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="修改人UUID" prop="updatedBy">
                                <el-input v-model="formData.updatedBy" clearable />
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="修改时间" prop="updatedTime">
                                <el-date-picker v-model="formData.updatedTime" type="datetime" placeholder="修改时间"
                                    value-format="YYYY-MM-DD HH:mm:ss" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>
            </el-card>
            <el-card class="box-card form-card">
                <template #header>
                    <div class="card-header">
                        <span>凭据详情</span>
                    </div>
                </template>
                <el-row :gutter="20" class="form-row">
                    <el-col :span="6">
                        <el-form-item label="密码" prop="line.password">
                            <el-input v-model="formData.line.password" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="密码提示" prop="line.passwordSuggestion">
                            <el-input v-model="formData.line.passwordSuggestion" clearable />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" class="form-row">
                    <el-col :span="6">
                        <el-form-item label="网址" prop="line.url">
                            <el-input v-model="formData.line.url" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="创建地址" prop="line.address">
                            <el-input v-model="formData.line.address" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="常用地址列表" prop="line.addressOftenList">
                            <el-input v-model="formData.line.addressOftenList" clearable />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" class="form-row">
                    <el-col :span="6">
                        <el-form-item label="手机号码" prop="line.phone">
                            <el-input v-model="formData.line.phone" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="安全手机列表" prop="line.phoneSafeList">
                            <el-input v-model="formData.line.phoneSafeList" clearable />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" class="form-row">
                    <el-col :span="6">
                        <el-form-item label="电子邮箱" prop="line.mail">
                            <el-input v-model="formData.line.mail" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="安全邮箱列表" prop="line.mailSafeList">
                            <el-input v-model="formData.line.mailSafeList" clearable />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" class="form-row">
                    <el-col :span="12">
                        <el-form-item label="安全问题1" prop="line.safeQuestionOne">
                            <el-input v-model="formData.line.safeQuestionOne" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="安全答案1" prop="line.safeAnswerOne">
                            <el-input v-model="formData.line.safeAnswerOne" clearable />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" class="form-row">
                    <el-col :span="12">
                        <el-form-item label="安全问题2" prop="line.safeQuestionTwo">
                            <el-input v-model="formData.line.safeQuestionTwo" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="安全答案2" prop="line.safeAnswerTwo">
                            <el-input v-model="formData.line.safeAnswerTwo" clearable />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" class="form-row">
                    <el-col :span="12">
                        <el-form-item label="安全问题3" prop="line.safeQuestionThree">
                            <el-input v-model="formData.line.safeQuestionThree" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="安全答案3" prop="line.safeAnswerThree">
                            <el-input v-model="formData.line.safeAnswerThree" clearable />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" class="form-row">
                    <el-col :span="24">
                        <el-form-item label="备注" prop="line.remark">
                            <el-input v-model="formData.line.remark" :rows="3" type="textarea" placeholder="备注"
                                clearable />
                        </el-form-item>
                    </el-col>
                </el-row>
                <!-- 凭据详情-审计字段 -->
                <el-row :gutter="20" class="form-row">
                    <el-col :span="6">
                        <el-form-item label="创建人UUID" prop="line.createdBy">
                            <el-input v-model="formData.line.createdBy" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="创建时间" prop="line.createdTime">
                            <el-date-picker v-model="formData.line.createdTime" type="datetime" placeholder="创建时间"
                                value-format="YYYY-MM-DD HH:mm:ss" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="修改人UUID" prop="line.updatedBy">
                            <el-input v-model="formData.line.updatedBy" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="修改时间" prop="line.updatedTime">
                            <el-date-picker v-model="formData.line.updatedTime" type="datetime" placeholder="修改时间"
                                value-format="YYYY-MM-DD HH:mm:ss" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-card>
            <el-row :gutter="20" style="margin: 50px 0;">
                <el-col :span="24">
                    <el-form-item>
                        <el-button type="primary" @click="submitForm(ruleFormRef)" :icon="Plus" size="large">提交
                        </el-button>
                        <el-button @click="resetForm(ruleFormRef)" :icon="Delete" size="large">重置</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>

<style scoped>
@media (min-width: 1024px) {

    .wzblog-credential-add-container {
        width: calc(100% - 14px);
        padding: 3px;
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
        margin: 0 !important;
    }

    .btn-back {
        width: 100px;
    }
}
</style>