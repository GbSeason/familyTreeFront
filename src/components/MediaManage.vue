<template>
    <div style="z-index=999">
        <el-dialog title="多媒体管理" :visible.sync="showView" width="50%" :modal="false" :close-on-click-modal="false"
            v-draggable="true" :close-on-press-escape="false">
            <el-row>
                <el-col :span="4">
                    <el-row>
                        <el-col :span="24">
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-menu :default-active="currentMenu" class="media-manage" @select="onMenuSelect">
                                <el-menu-item v-for="item in fileTypes" :index="item.type" :key="item.type">
                                    <template slot="title">
                                        <i :class="item.icon"></i>
                                        <span>{{ item.label }}</span>
                                    </template>
                                </el-menu-item>
                            </el-menu>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="20">
                    <el-row class="media-manage">
                        <el-col :span="18">
                            <el-row>
                                <el-col :span="4">
                                    <label style="line-height:30px;color:#409EFF">文件列表</label>
                                </el-col>
                                <el-col :span="20">
                                    日期 <el-date-picker v-model="selectDate" type="daterange" placeholder=""
                                        @change="onDateChange" value-format="timestamp"
                                        format="yyyy-MM-dd"></el-date-picker>
                                </el-col>
                            </el-row>
                            <el-divider></el-divider>
                            <div class="images-frame scrolly">
                                <template v-for="(resource, index) in resourceList">
                                    <div class="images-one" :key="resource.idkey+'img'" v-if="resource.resource_type == 2 && currentMenu == resource.resource_type">
                                        <img :src="$API.viewResource + resource.resource_path" class="image-img" />
                                        <el-checkbox label="" v-if="selectMode" v-model="resource.selected"></el-checkbox>
                                    </div>
                                    <div class="images-one" :key="resource.idkey+'video'" v-if="resource.resource_type == 3 && currentMenu == resource.resource_type">
                                        <video :src="$API.viewResource + resource.resource_path" class="video-img" controls="controls"></video>
                                        <el-checkbox label="" v-if="selectMode" v-model="resource.selected"></el-checkbox>
                                    </div>
                                    <div class="images-one" :key="resource.idkey+'audio'" v-if="resource.resource_type == 4 && currentMenu == resource.resource_type">
                                        <audio :src="$API.viewResource + resource.resource_path" class="audio-img" controls="controls"></audio>
                                        <el-checkbox label="" v-if="selectMode" v-model="resource.selected"></el-checkbox>
                                    </div>
                                </template>
                            </div>
                        </el-col>
                        <el-col :span="6" class="line-left media-manage scrolly">
                            <el-row>
                                <el-col :span="12"><el-button type="text" @click="selectFile">选择文件...</el-button>
                                    <input type="file" style="display: none;" ref="fileInput" multiple="true"
                                        accept="image/png,image/jpeg,image/jpg,video/mp4,video/avi,audio/mp3" /></el-col>
                                <el-col :span="12">
                                    <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload"
                                        :disabled="fileIsNotCanUpload">
                                        上传
                                    </el-button>
                                </el-col>
                            </el-row>
                            <el-divider></el-divider>
                            <el-row v-for="(item, index) in selectUploadFiles" :key="item.name">
                                <el-col :span="20" class="filelistname" :title="item.name">
                                    <label style="line-height:20px;color:#409EFF">{{ index + 1 }}</label>
                                    <label>{{ showFileNameShort(item.name) }}</label>
                                </el-col>
                                <el-col :span="4">
                                    <i v-show="item.done" style="line-height:20px;color:#409EFF"
                                        class="el-icon-circle-check"></i>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
            <el-row v-if="selectMode">
              <el-col :span="24" style="display: flex; justify-content: flex-end;">
                <el-button type="primary" @click="selectDone">确定选择</el-button>
            </el-col>
            </el-row>
        </el-dialog>
    </div>
</template>
  
<script>
export default {
    name: 'mediaManage',
    components: {
    },
    computed: {
        fileIsNotCanUpload() {
            if (this.selectUploadFiles.length == 0 || this.uploading) {
                return true;
            }
            return false
        }

    },
    props: [],
    data() {
        return {
            selectedResource:[],//选择模式中，选择的资源信息
            selectCallBack:null,//选择回调
            selectMode:false,//选择模式开启
            loginInfo: null,
            uploading: false,
            selectUploadFiles: [],
            resourceList: [],
            currentMenu: '2',
            updateParam: {
                // idkey varchar(100) PRIMARY KEY, --主键
                upload_person: this.$checkLocalUser().idkey,//--上传人主键
                resource_name: '',//--资源名称
                resource_type: '',//--资源类型： 1文字 2图片 3视频 4音频 5富文本
                resource_path: '',//--资源地址
                create_person: this.$checkLocalUser().idkey,// --创建人
                create_time: +new Date(),// --创建时间
                remark: '',// text--简介
            },
            selectDate: [+new Date() - 3600 * 1000 * 24 * 10, +new Date()],
            //2图片 3视频 4音频
            fileTypes: [{ type: '2', label: '图片', icon: 'el-icon-picture-outline' },
            { type: '3', label: '视频', icon: 'el-icon-video-camera' },
            { type: '4', label: '音频', icon: 'el-icon-microphone' }],
            fileList: [],
            showView: false,
        }
    },
    created() {
    },
    mounted() {
        // console.log(this.updateParam.upload_person);
        // @onchange="fileSelected"

    },
    methods: {
        show(selectMode_,selectCallBack_) {
            this.selectMode = selectMode_;
            this.selectCallBack = selectCallBack_;
            this.showView = true;
            // while (!this.$refs.fileInput){
            //     console.log(this.$refs.fileInput);
            // }
            let intervalId = setInterval(() => {
                if (this.$refs.fileInput) {
                    window['uploadInput'] = this.$refs.fileInput
                    this.$refs.fileInput.onchange = this.fileSelected
                    clearInterval(intervalId);
                }
            }, 1000);
            this.getResourceData()
        },
        selectDone(){
            this.selectedResource = []
            this.resourceList.forEach(item=>{
                if(item.selected){
                    this.selectedResource.push(JSON.parse(JSON.stringify(item)))
                }
            })
            if(this.selectCallBack && typeof this.selectCallBack == 'function'){
                this.selectCallBack(this.selectedResource)
                this.close()
            }
        },
        close(){
            this.showView = false;
        },
        showFileNameShort(name) {
            let splits = name.split('.');
            let newname = "";
            if (splits.length > 1) {
                newname = `${splits[0].substr(0, 7)}...${splits[splits.length - 1]}`
            } else {
                newname = name.substr(0, 7)
            }
            return newname;
        },
        getLoginUser() {
            let user_check = this.$checkLocalUser()
            if (user_check) {
                this.loginInfo = user_check
            }
        },
        getResourceData() {
            this.getLoginUser();
            this.$http.post(this.$API.getResource, { date: this.selectDate, idkey: this.loginInfo.idkey }).then(res => {
                // console.log(res)
                if (res && res.status == 200) {
                    let sources = res.data;
                    if (sources && sources.length > 0) {
                        sources.forEach(item=>{
                            item.selected = false;
                        })
                        this.resourceList = sources
                    } else {
                        this.resourceList = []
                    }
                }
            })
        },
        submitUpload() {
            let files = this.$refs.fileInput.files
            this.uploadFileDo(files)
        },
        selectFile() {
            this.$refs.fileInput.click()
        },
        fileSelected() {
            console.log(this.$refs.fileInput.files);
            if (this.$refs.fileInput.files.length > 0) {
                for (let index = 0; index < this.$refs.fileInput.files.length; index++) {
                    const element = this.$refs.fileInput.files[index];
                    this.selectUploadFiles.push(
                        {
                            name: element.name,
                            done: false,
                            type: element.type,
                        }
                    )
                }
            }


        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePreview(file) {
            console.log(file);
        },
        handleOpen(key, keyPath) {
            console.log(key, keyPath);
        },
        onDateChange(date) {
            this.getResourceData()
        },
        onMenuSelect(key, keyPath) {
            this.currentMenu = key
            console.log(this.currentMenu);
        }
        , onUploadSuccess(response, file, fileList) {
            if (response && response.msg) {
                this.$message.success(response.msg)
            }
        },
        onUploadError(err, file, fileList) { },
        uploadFileDo(files, feedback) {
            if (files.length > 0) {
                this.uploading = true;
                setTimeout(() => {
                    this.uploadFileMultiple(0, files)
                }, 200);
            }
            // this.uploadFileMultiple()
        },
        uploadFileMultiple(fileIndex, fileList) {
            let that = this;
            let xhr = new XMLHttpRequest();
            const token = sessionStorage.getItem("keyinfo_token");
            let formData = new FormData();
            let file = fileList[fileIndex];
            formData.append("file", file);
            let fileType = file.type.indexOf("image/") >= 0 ? 2 : file.type.indexOf("video/") >= 0 ? 3 : file.type.indexOf("audio/") >= 0 ? 4 : -1;
            if (fileType < 0) {
                if (fileIndex < fileList.length - 1) {
                    that.uploadFileMultiple(fileIndex + 1, fileList);
                }
            }
            this.updateParam.resource_type = fileType;
            for (let key in this.updateParam) {
                formData.append(key, this.updateParam[key]);
            }
            xhr.open("POST", this.$API.upload, false); //建立连接
            xhr.setRequestHeader("Authorization", `Bearer ${token}`);
            xhr.addEventListener("load", () => {
                if (xhr.responseText) {
                    let resp = JSON.parse(xhr.responseText);
                    console.log(resp);
                    if (resp && resp.code == 1) {
                        this.selectUploadFiles[fileIndex]['done'] = true;
                        setTimeout(() => {
                            if (fileIndex < fileList.length - 1) {

                                that.uploadFileMultiple(fileIndex + 1, fileList);
                            }
                            if (fileIndex == fileList.length - 1) {
                                that.uploading = false;
                                that.selectUploadFiles = [];
                                that.$message.success(resp.msg)
                                that.getResourceData()
                            }
                        }, 300);
                    }
                }
            });
            xhr.addEventListener("error", () => {
                that.uploading = false;
                that.resetInputFile();
                this.$selfNotify.error(`Upload failed! Reason:${xhr.responseText}`);
            });
            xhr.addEventListener("timeout", () => {
                that.uploading = false;
                that.resetInputFile();
                this.$selfNotify.error(`Upload failed! Reason:timeout`);
            });
            xhr.send(formData); //发送请求
        }

    }
}
</script>
  
<style scoped>
.audio-img{
    width: 240px;
    height: 50px;
}
.video-img{
    width: 160px;
    height: 200px;
}
.image-img {
    width: 60px;
    height: 80px;
    object-fit: contain;
}

.images-one {
    padding: 5px;
    margin: 2px;
    border: 1px solid #e6e6e6;
    width: fit-content;
    height: fit-content;
}

.images-frame {
    width: 100%;
    height: 400px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    flex-wrap: wrap;
}

.filelistname {
    display: flex;
    justify-content: flex-start;
    padding-left: 5px;
    margin-top: 5px;
}

.media-manage {
    height: 500px;
}
.scrolly{
    overflow-y: auto;
}
.line-left {
    border-left: 1px solid #e6e6e6;
}
</style>
  