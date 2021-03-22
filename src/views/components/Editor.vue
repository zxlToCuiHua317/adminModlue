<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col style="width: 80%">
        <div ref="editor" class="text" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { upload } from '@/utils/upload'
import E from 'wangeditor'
export default {
  name: 'Editor',
  data() {
    return {
      init: ''
    }
  },
  computed: {
    ...mapGetters(['imagesUploadApi'])
  },
  mounted() {
    const _this = this
    var editor = new E(this.$refs.editor)
    // 自定义菜单配置
    editor.customConfig.zIndex = 10
    editor.customConfig.menus = [
      'emoticon', // 表情
      'image', // 插入图片
      'video', // 插入视频
      'link' // 插入链接
    ]
    // 文件上传
    editor.customConfig.customUploadImg = function(files, insert) {
      console.log(files)
      console.log(insert)
      // files 是 input 中选中的文件列表
      // insert 是获取图片 url 后，插入到编辑器的方法
      files.forEach((image) => {
        upload(_this.imagesUploadApi, image).then((data) => {
          insert(data.data.url)
        })
      })
    }
    // 插入网络图片成功后回调
    editor.customConfig.linkImgCallback = function(url) {
      // console.log(url) // url 即插入图片的地址
      _this.$emit('editorContent', url)
    }
    // 状态改变触发回调
    editor.customConfig.onchange = (html) => {
      this.$emit('editorContent', editor.txt.html())
    }
    editor.customConfig.onfocus = function(html) {
      // html 即编辑器中的内容
      _this.init = ''
      editor.txt.html(_this.init)
    }
    editor.customConfig.onblur = function(html) {
      // html 即编辑器中的内容
      _this.init = ''
      editor.txt.html(_this.init)
    }
    editor.create()
    editor.txt.clear()

    // 初始化数据
    editor.txt.html(this.init)
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.text {
  text-align: left;
}
// /deep/ .w-e-text-container {
//   height: 300px !important;
// }
</style>
