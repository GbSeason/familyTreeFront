<template>
    <div id="app">
        <div v-if="!loginInfo.session_id">
            <el-row>
                <el-col :span="24" class="login_col">
                    <div class="login_view">
                        <el-form :model="loginInfo" ref="loginfromref" :rules="loginInfoRules" label-width="100px"
                            label-position="left" hide-required-asterisk>
                            <el-form-item label="登录名" prop="login_name">
                                <el-input v-model="loginInfo.login_name" placeholder="请输入姓名"></el-input>
                            </el-form-item>
                            <el-form-item label="密码" prop="login_pwd">
                                <el-input v-model="loginInfo.login_pwd" placeholder="请输入密码" show-password></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="login()">登录</el-button>
                                <el-button @click="resetForm()">重置</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div v-else>
            <el-row>
                <el-col :span="24" class="toolbar">
                    <el-button type="primary" icon="el-icon-user" @click="addPerson()">新增人员</el-button>
                    <el-button type="primary" icon="el-icon-s-home" @click="addFamily()">新增家庭</el-button>
                    <el-button type="primary" icon="el-icon-share" @click="addClan()">新增家族</el-button>
                </el-col>
            </el-row>
            <org-chart :zoom="true" :pan="true" :datasource="familyDataSource" @node-click="selectNode">
            </org-chart>
            <el-drawer :title="currentNode?currentNode.name:''" :visible.sync="drawer" @opened="onDrawerOpen" :wrapperClosable="false" :with-header="true" size="60%" :modal="false">
                <span></span>
                <info-view ref="nodeInfoView"></info-view>
            </el-drawer>
            <add-person ref="addPersonRef"></add-person>
            <add-family ref="addFamilyRef"></add-family>
            <add-clan ref="addClanRef"></add-clan>
        </div>
    </div>
</template>
  
<script>
import OrgChart from '@/components/OrganizationChartContainer.vue'
import infoView from '@/components/infoViews/nodeInfo.vue'
import addPerson from '@/components/infoViews/addPerson'
import addFamily from '@/components/infoViews/addFamily'
import addClan from '@/components/infoViews/addClan'
export default {
    name: 'app',
    components: {
        OrgChart, infoView, addPerson, addFamily, addClan
    },
    data() {
        return {
            loginInfo: {
                login_name: '',
                login_pwd: '',
                session_id: ''
            },
            loginInfoRules: {
                login_name: [
                    { required: true, message: '请输入登录名', trigger: 'blur' },
                    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
                ],
                login_pwd: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
                ]
            },
            drawer: false,
            currentNode: null,
            familyDataSource: {
                'id': '1',
                'name': 'test',
                'title': 'person',
                // 'children': [
                //     { 'id': '2', 'name': 'Bo Miao', 'title': 'department manager' },
                //     {
                //         'id': '3', 'name': 'Su Miao', 'title': 'department manager',
                //         'children': [
                //             { 'id': '4', 'name': 'Tie Hua', 'title': 'senior engineer' },
                //             {
                //                 'id': '5', 'name': 'Hei Hei', 'title': 'senior engineer',
                //                 'children': [
                //                     { 'id': '6', 'name': 'Pang Pang', 'title': 'engineer' },
                //                     { 'id': '7', 'name': 'Xiang Xiang', 'title': 'UE engineer' }
                //                 ]
                //             }
                //         ]
                //     },
                //     { 'id': '8', 'name': 'Hong Miao', 'title': 'department manager' },
                //     { 'id': '9', 'name': 'Chun Miao', 'title': 'department manager' }
                // ]
            }
        }
    },
    created() {
        // this.login();
        this.$bus.mainView = this;
        let user_check = this.$checkLocalUser()
        if (user_check) {
            this.loginInfo = user_check
            this.getFamily()
        }
    },
    mounted() {
        this.resizeView();
        window.addEventListener("resize", () => {
            this.resizeView();
        })
    },
    methods: {
        getFamily() {
            this.$http.post(this.$API.getFamilyInfoAllByFamilyId, { idkey: this.loginInfo.idkey }).then(res => {
                // console.log(res)
                if (res && res.status == 200) {
                    var familyData = res.data;
                    this.makeFamilyData(familyData)
                }
            })
        },
        makeFamilyData(familyData) {
            let fdr = {
                'id': '1',
                'name': 'test',
                'title': 'person',
                'children': []
            }
            if (familyData.family && familyData.family.length > 0) {
                let ftop = familyData.family[0];
                fdr.id = ftop.idkey;
                fdr.name = fdr.title = ftop.family_name;
                let p_m = familyData.person.find((p)=>{
                    return p.idkey == ftop.person_m_idkey;
                })
                let p_f = familyData.person.find((p)=>{
                    return p.idkey == ftop.person_f_idkey;
                })
                fdr.data = {
                    familyData:ftop,
                    m:p_m,
                    f:p_f
                };
            }
            this.familyDataSource = fdr;
        },
        resetForm() {
            this.$refs.loginfromref.resetFields()
        },
        resizeView() {
            let docs = document.getElementsByClassName("orgchart-container");
            if (docs && docs.length > 0) {
                docs[0].style.height = (window.innerHeight - 110) + 'px';
            }
        },
        showDrawer() {
            this.drawer = true;
        },
        closeDrawer() {
            this.drawer = false;
        },
        onDrawerOpen() {
            if (this.currentNode) {
                this.$refs.nodeInfoView.setNodeInfo(this.currentNode);
            }
        },
        selectNode(nodeData) {
            this.showDrawer();
            this.currentNode = nodeData;
            if (this.$refs.nodeInfoView) {
                this.$refs.nodeInfoView.setNodeInfo(this.currentNode);
            }
        },
        addPerson() {
            this.$refs.addPersonRef.show();
        },
        addFamily() {
            this.$refs.addFamilyRef.show();
        },
        addClan() { },
        login() {
            this.$refs.loginfromref.validate((valid) => {
                if (valid) {
                    this.$http.post(this.$API.login, { login_name: this.loginInfo.login_name, login_pwd: this.loginInfo.login_pwd }).then(res => {
                        if (res && res.data && res.data.length > 0) {
                            if (res.data[0].session_id) {
                                this.$message.success("登陆成功")
                                this.$bus.loginUser = res.data[0]
                                this.$setLocalUser(res.data[0])
                                this.loginInfo = res.data[0]
                            } else {
                                this.$message.error("用户名不存在或者密码错误")
                            }
                        } else {
                            this.$message.error("用户名不存在或者密码错误")
                        }
                    })
                } else {
                    return false
                }
            })
        }
    }
}
</script>
  
<style scoped>
.login_col {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 600px;
}

.login_view {
    width: 400px;
    height: 200px;
    border: 1px solid #b5b5b5;
    border-radius: 5px;
    padding: 20px;
}

.toolbar {
    display: flex;
    padding: 10px;
    justify-content: flex-end;
}
</style>
  