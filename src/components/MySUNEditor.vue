<template>
    <div>
        <mediaManage ref="mediaManageRef"></mediaManage>
        <div class="kindeditor">
            <textarea :id="id" name="content" class="editor-class"></textarea>
        </div>
    </div>
</template>
<script>
import SunEditor from 'suneditor'
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File
import plugins from 'suneditor/src/plugins'
import lang from 'suneditor/src/lang'
import mediaManage from "@/components/MediaManage"
export default {
    components: { mediaManage },
    data() {
        return {
            editor: null
        }
    },
    props: ['id','readOnly','initContent'],
    watch: {
        readOnly(val){
            this.editor.readOnly(val?true:false)
            if(val){
                this.editor.toolbar.hide()
            }else{
                this.editor.toolbar.show()
            }
        }
    },
    created() {

    },
    mounted() {
        let _this = this
        var customPlugin = {
            name: 'multiMedia',
            display: ('command'),
            title: '多媒体',
            innerHTML: '<div class="ke-icon-multiMedia"></div>',
            buttonClass: '',
            add:function (core, targetElement) {
                // How to set language when setting button properties of plugin directly in plugin
                const titleList = {
                    en: 'multiMedia',
                    zh_cn: '多媒体',
                }
                this.title = titleList[core.lang.code]
            },
            action:function(){
                _this.onMultiMediaClick()
            }
        }
        _this.editor = SunEditor.create((document.getElementById(this.id) || this.id), {
            // All of the plugins are loaded in the "window.SUNEDITOR" object in dist/suneditor.min.js file
            // Insert options
            // Language global object (default: en)
            lang: lang.zh_cn,
            plugins: {...plugins,customPlugin},
            buttonList: [
                ['undo', 'redo'],
                ['font', 'fontSize', 'formatBlock'],
                ['paragraphStyle', 'blockquote'],
                ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
                ['fontColor', 'hiliteColor', 'textStyle'],
                ['removeFormat'],
                '/', // Line break
                ['outdent', 'indent'],
                ['align', 'horizontalRule', 'list', 'lineHeight'],
                ['table', 'link', 'image', 'video', 'audio' /** ,'math' */], // You must add the 'katex' library at options to use the 'math' plugin.
                /** ['imageGallery'] */ // You must add the "imageGalleryUrl".
                ['fullScreen', 'showBlocks', 'codeView'],
                ['preview', 'print'],
                ['save', 'template','multiMedia'],
                /** ['dir', 'dir_ltr', 'dir_rtl'] */ // "dir": Toggle text direction, "dir_ltr": Right to Left, "dir_rtl": Left to Right
            ]
        });
        _this.editor.readOnly(this.readOnly?true:false)
        if(this.readOnly){
            this.editor.toolbar.hide()
        }
        if(this.initContent){
            this.editor.setContents(this.initContent)
        }
    },
    methods: {
        onMultiMediaClick() {
            this.$refs.mediaManageRef.show(true, this.onSourceSelected)
        },
        onSourceSelected(selects) {
            let innerHTML = []
            selects.forEach(item => {
                let html = ""
                let path = this.$API.viewResource + item.resource_path;
                if (item.resource_type == 2) {
                    html = `<img src="${path}" width="60"  height="80" style="object-fit: contain;" v-resizeable/>`
                }
                if (item.resource_type == 3) {
                    html = `<video src="${path}" style="width: 160px;height: 200px;" controls="controls"  v-resizeable></video>`
                }
                if (item.resource_type == 4) {
                    html = `<audio src="${path}" style="width: 240px;height: 50px;" controls="controls"  v-resizeable></audio>`
                }
                innerHTML.push(html)
            })

            this.editor.insertHTML(innerHTML.join(" "))
            // console.log(this.editor.html());
        },
        getContent() {
            return this.editor.getContents()
        }
    }
}
</script>
<style>
.editor-class {
    width: 97%;
    height: auto;
    max-height: 2000px;
    min-height: 300px;
}

.ke-icon-multiMedia {
    background-image: url('../assets/img/multiMedia.png');
    width: 100%;
    height: 20px;
    background-size: contain;
    background-repeat: no-repeat;
    background-position-x: 7px;
}
</style>