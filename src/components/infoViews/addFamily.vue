<template>
    <div>
        <el-dialog title="新增家庭" :visible.sync="showView" width="30%" @closed="resetForm">
            <el-row>
                <el-col :span="24">
                    <el-form ref="personFormRef" :model="familyInfo" :rules="familyInfoRules" label-width="150px"
                        label-position="left" hide-required-asterisk>
                        <el-form-item label="家庭名称" prop="family_name">
                            <el-input v-model="familyInfo.family_name" placeholder="请输入家庭名称"></el-input>
                        </el-form-item>
                        <el-form-item label="家庭主要成员-夫" prop="person_m_idkey">
                            <el-select v-model="familyInfo.person_m_idkey" placeholder="选择家庭主要成员">
                                <el-option v-for="item in allPerson_m" :label="item.name" :value="item.idkey"
                                    :key="item.idkey+'_m'"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="家庭主要成员-妻" prop="person_f_idkey">
                            <el-select v-model="familyInfo.person_f_idkey" placeholder="选择家庭主要成员">
                                <el-option v-for="item in allPerson_f" :label="item.name" :value="item.idkey"
                                    :key="item.idkey+'_f'"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="简介" prop="remark">
                            <el-input v-model="familyInfo.remark" type="textarea" maxlength="1000" show-word-limit
                                placeholder="请输入简介"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="submitForm()">创建</el-button>
                            <el-button @click="resetForm()">重置</el-button>
                            <el-button @click="closeView()">关闭</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </el-dialog>
    </div>
</template>
  
<script>
export default {
    name: 'addfamily',
    components: {
    },
    data() {
        return {
            showView: false,
            allPerson:[],
            allPerson_m: [],
            allPerson_f: [],
            familyInfo: {
                idkey: "",
                family_name: "", //家庭名称
                person_m_idkey: "",//家庭初始人员主键-夫
                person_f_idkey: "",//家庭初始人员主键-妻
                remark: "",//简介
                create_person: "",//创建人id
                create_time: ""//创建时间
            },
            familyInfoRules: {
                family_name: [
                    { required: true, message: '请输入家庭名称', trigger: 'blur' },
                    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
                ],
                person_m_idkey: [
                    { required: true, message: '选择成员-夫', trigger: 'blur' },
                ],
                person_f_idkey: [
                    { required: true, message: '选择成员-妻', trigger: 'blur' },
                ]
            }
        }
    },
    created() {
    },
    methods: {
        resetForm() {
            this.$resetForm(this.familyInfo)
        },
        submitForm() {
            this.$refs.personFormRef.validate((valid) => {
                if (valid) {
                    this.$http.post(this.$API.addFamily, this.familyInfo).then(res => {
                        if(res.data && res.data[0]){
                            this.$message.success("新增成功")
                            this.closeView();
                        }
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });

        },
        getAllPersons() {
            this.allPerson_m = []
            this.allPerson_f = []
            this.$http.post(this.$API.getAllPersons).then(res => {
                if (res && res.data) {
                    this.allPerson = res.data
                    res.data.forEach(item=>{
                        if(item.gender=='男'){
                            this.allPerson_m.push(item)
                        }
                        if(item.gender=='女'){
                            this.allPerson_f.push(item)
                        }
                    })
                }
            })
        },
        show() {
            this.showView = true;
            this.getAllPersons();
        },
        closeView() {
            this.showView = false;
        }
    }
}
</script>
  
<style scoped></style>
  