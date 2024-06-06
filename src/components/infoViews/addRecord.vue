<template>
    <div>
        <el-form ref="recordFormRef" :model="recordForm" :rules="recordFormRules" label-width="100px" label-position="left"
            hide-required-asterisk>
            <el-form-item label="主题" prop="name">
                <el-input v-model="recordForm.name" placeholder="请输入主题"></el-input>
            </el-form-item>
            <el-form-item label="简介" prop="remark">
                <el-input v-model="recordForm.remark" type="textarea" maxlength="1000" show-word-limit
                    placeholder="请输入简介"></el-input>
            </el-form-item>
        </el-form>
        <el-row>
            <el-col :span="24" class="left-float">
                内容
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24" style="padding-top:20px">
                <MyEditor :id="'editor123'" ref="myEditor" :uploadJson="$API.upload"></MyEditor>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <el-button type="primary" @click="submitForm()">保存</el-button>
                <el-button @click="resetForm()">重置</el-button>
            </el-col>
        </el-row>
    </div>
</template>
  
<script>
import MyEditor from "@/components/MySUNEditor"
export default {
    name: 'nodeview',
    components: {
        MyEditor
    },
    props: ['nodeInfo'],
    data() {
        return {
            fileList: [],
            content: null,
            recordForm: {
                idkey: '',
                belongType: 2,//--记录所属：1成员，2家庭，3家族
                belongIdkey: '',
                level: 5,
                name: "",//主题
                remark: "",//简介
                content: ""//内容
            },
            recordFormRules: {
                name: [
                    { required: true, message: '请输入主题', trigger: 'blur' }
                ]
            }
        }
    },
    created() {
    },
    mounted() { },
    methods: {
        submitForm() {
            let user_check = this.$checkLocalUser()
            this.recordForm.belongIdkey = user_check.family_idkey
            this.recordForm.create_person = user_check.idkey
            this.recordForm.content = this.$refs.myEditor.getContent()
            if (!this.recordForm.idkey) {
                this.$http.post(this.$API.addRecord, this.recordForm).then(res => {
                    console.log(res)
                    if (res && res.status == 200 && res.data.code == 1) {
                        this.recordForm.idkey = res.data.idkey
                        this.$message.success("保存成功")
                    } else {
                        this.$message.error("保存失败")
                    }
                })
            } else {
                this.$http.post(this.$API.updateRecord, this.recordForm).then(res => {
                    console.log(res)
                    if (res && res.status == 200 && res.data.code == 1) {
                        this.$message.success("保存成功")
                    } else {
                        this.$message.error("保存失败")
                    }
                })
            }
        },
        resetForm() { },
        onEditorChange() {
            console.log(this.content);
        }

    }
}
</script>
  
<style scoped>
.left-float {
    display: flex;
    justify-content: flex-start;
}
</style>
  