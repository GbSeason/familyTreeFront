<template>
    <div>
        <el-dialog title="新增人员" :visible.sync="showView" width="30%" @closed="resetForm">
            <el-row>
                <el-col :span="24">
                    <el-form ref="personFormRef" :model="userInfo" :rules="userInfoRules" label-width="100px"
                        label-position="left" hide-required-asterisk>
                        <el-form-item label="姓名" prop="name">
                            <el-input v-model="userInfo.name" placeholder="请输入姓名"></el-input>
                        </el-form-item>
                        <el-form-item label="性别" prop="gender">
                            <el-radio-group v-model="userInfo.gender">
                                <el-radio label="男"></el-radio>
                                <el-radio label="女"></el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="简介" prop="remark">
                            <el-input v-model="userInfo.remark" type="textarea" maxlength="1000" show-word-limit
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
    name: 'addperson',
    components: {
    },
    data() {
        return {
            showView: false,
            userInfo: {
                idkey: "",
                family_idkey: "", //所属家庭主键
                name: "",//姓名
                petname: "",//小名
                enname: "",//英文名
                login_name: "",//登录名
                login_pwd: "",//登录密码
                gender: "",//性别
                birthday: "",//出生日期
                idcard: "",//身份证号
                nation: "",//民族
                native_place: "",//籍贯
                head_img: "",//头像资源idkey
                remark: "",//简介
                phone: "",//电话
                phone1: "",//电话1
                email: "",//邮箱
                email1: "",//邮箱1
                create_person: "",//创建人id
                create_time: ""//创建时间
            },
            userInfoRules: {
                name: [
                    { required: true, message: '请输入姓名', trigger: 'blur' },
                    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
                ],
                gender: [
                    { required: true, message: '请输选择性别', trigger: 'blur' },
                ]
            }
        }
    },
    created() {
    },
    methods: {
        resetForm() {
            this.$resetForm(this.userInfo)
        },
        submitForm() {
            this.$refs.personFormRef.validate((valid) => {
                if (valid) {
                    this.$http.post(this.$API.addPerson, this.userInfo).then(res => {
                        if (res.data && res.data[0]) {
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
        show() {
            this.showView = true;
        },
        closeView() {
            this.showView = false;
        }
    }
}
</script>
  
<style scoped></style>
  