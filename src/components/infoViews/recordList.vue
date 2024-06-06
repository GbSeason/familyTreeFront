<template>
    <div class="bk-area">
        <div v-for="record in recordList" class="record-area">
            <el-row>
                <el-col :span="18">
                    <label class="h1 margin-l-20">{{ record.subject }}</label>
                </el-col>
                <el-col :span="6" class="title-right">
                    <label style="color:#818181">{{ convertMillisecondsToDate(record.create_time) }}</label>
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="onUpdateButtonClick(record)">{{
                        record.edit ? '保存' : '修改' }}</el-button>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <label class="h2 margin-l-20">{{ record.remark }}</label>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <MyEditor :id="record.idkey" :readOnly="!record.edit" :ref="record.idkey" :initContent="record.content">
                    </MyEditor>
                </el-col>
            </el-row>
        </div>
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
            recordList: [],
        }
    },
    created() {
    },
    mounted() {
        this.selectAllRecord()
    },
    methods: {
        onUpdateButtonClick(record) {
            if (record.edit) {
                this.submitRecord(record)
            }
            record.edit = !record.edit;
        },
        submitRecord(record) {
            let user_check = this.$checkLocalUser()
            let saveForm = {
                idkey: record.idkey,
                name: record.subject,//主题
                remark: record.remark,//简介
                content: this.$refs[record.idkey][0].getContent()//内容
            }
            this.$http.post(this.$API.updateRecord, saveForm).then(res => {
                if (res && res.status == 200 && res.data.code == 1) {
                    this.$message.success("保存成功")
                    record.content = saveForm.content
                } else {
                    this.$message.error("保存失败")
                }
            })
        },
        searchRecord(selectDate,selectTitle){
            this.selectAllRecord(selectDate,selectTitle);
        },
        selectAllRecord(selectDate,selectTitle) {
            let user_check = this.$checkLocalUser()
            let belongIdkey = user_check.family_idkey
            if (belongIdkey) {
                this.$http.post(this.$API.getRecord, { belongIdkey: belongIdkey ,date:selectDate?selectDate:'',title:selectTitle?selectTitle:''}).then(res => {
                    if (res && res.status == 200 && res.data) {
                        res.data.forEach(item => {
                            item.edit = false
                        })
                        this.recordList = res.data
                    }

                })
            }
        }
    }
}
</script>
  
<style scoped>
.title-right {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: space-around;
}

.record-area {
    border: 1px dashed #cfcfcf;
    padding: 5px;
    margin: 20px 0;
}

.h1 {
    font-size: 20px;
    line-height: 40px;
    font-weight: bold;
    margin-top: 20px;
}

.margin-l-20 {
    margin-left: 10px;
}

.h2 {
    font-size: 16px;
    line-height: 32px;
    color: #818181;
}
</style>
  