<template>
    <div class="node-info-panel">
        <el-row>
            <el-col :span="24" class="node-info-top">
                <el-button type="success" icon="el-icon-plus" @click="addRecord()">新增记录</el-button>
                <el-date-picker class="item-margin" v-model="selectDate" type="daterange" start-placeholder="开始时间" end-placeholder="结束时间"
                    range-separator="至" value-format="timestamp" format="yyyy-MM-dd" clearable></el-date-picker>
                <el-input class="item-margin" v-model="selectTitle" placeholder="记录标题" clearable style="width:300px;"></el-input>
                <el-button class="item-margin" type="primary" icon="el-icon-search" @click="searchRecordInfo">搜索</el-button>
            </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row>
            <el-col :span="24">
                <add-record v-if="showAddRecordView" :nodeInfo="info"></add-record>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <record-list ref="recordListRef"></record-list>
            </el-col>
        </el-row>
    </div>
</template>
  
<script>
import addRecord from "@/components/infoViews/addRecord"
import recordList from "@/components/infoViews/recordList"
export default {
    name: 'nodeview',
    components: {
        addRecord, recordList
    },
    data() {
        return {
            info: null,
            showAddRecordView: false,
            selectDate: [],
            selectTitle:""
        }
    },
    created() {
    },
    methods: {
        searchRecordInfo(){
            this.$refs.recordListRef.searchRecord(this.selectDate,this.selectTitle)
        },
        setNodeInfo(nodeInfo) {
            this.info = JSON.stringify(nodeInfo)
        },
        addRecord() {
            this.showAddRecordView = true
        }
    }
}
</script>
  
<style>
.node-info-top{
    display: flex;
}
.item-margin{
    margin-left: 20px;
}
.node-info-panel {
    font-size: 14px;
    padding: 10px;
    background-color: #ececec;
}

.el-drawer__header {
    color: #000000;
    display: flex;
    margin-bottom: 0px;
    padding: 10px 5px 10px;
    font-size: 16px;
    border-bottom: 1px solid rgb(73, 197, 255);
}
</style>
  