<template>
    <div>
        <el-row>
            <el-col :span="8">
                <div class="person-row">
                    <div class="icon-head" :style="{ 'background-image': `url(${m_head_img})` }">
                        {{ m_head_img?'':m_show_txt }}
                    </div>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="person-row">
                    <div class="icon-head" :style="{ 'background-image': `url(${f_head_img})` }">
                        {{ f_head_img?'':f_show_txt }}
                    </div>
                </div>
            </el-col>
        </el-row>
        <el-row>
            
        </el-row>
    </div>
</template>
  
<script>
export default {
    name: 'nodeview',
    components: {
    },
    props: ["nodeData"],
    data() {
        return {
            m_head_img: null,
            f_head_img: null,
            m_show_txt:null,
            f_show_txt:null,
        }
    },
    created() {
    },
    mounted() {
        this.renderView();
    },
    methods: {
        showIcon() {
            if (this.nodeData && this.nodeData.m && this.nodeData.f) {
                if (this.nodeData.m.head_img) {
                    this.m_head_img = this.nodeData.m.head_img
                    this.f_head_img = this.nodeData.f.head_img
                }else{
                    this.m_show_txt = this.nodeData.m.name.substr(0,1).toUpperCase();
                    this.f_show_txt = this.nodeData.f.name.substr(0,1).toUpperCase();
                }
            }
        },
        renderView() {
            // console.log(this.nodeData);
            this.showIcon()
        }
    }
}
</script>
  
<style scoped>
.person-row {
    display: flex;
}

.icon-head {
    width: 20px;
    height: 20px;
    border: 1px solid #07aefc;
    border-radius: 20px;
    background-color: #26b9ff;
    color: #FFF;
    font-size: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
  