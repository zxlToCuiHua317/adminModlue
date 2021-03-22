<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <div class="select_tool">
          <!-- 搜索 -->
          <el-input
            v-model="query.servercode"
            clearable
            placeholder="工单号搜索"
            style="width: 200px"
            class="filter-item"
            @keyup.enter.native="crud.toQuery"
          />
        </div>
        <el-button
          v-if="crud.optShow.download"
          :loading="crud.downloadLoading"
          class="filter-item"
          size="mini"
          type="warning"
          icon="el-icon-download"
          @click="exportExels()"
        >新增</el-button>
        <rrOperation />
      </div>
      <crudOperation :permission="permission" />
      <!-- 新增工单 -->
      <div class="addwokerOrder">
        <el-dialog
          :visible.sync="isShowDelg"
          width="1000px"
          top="1vh"
          height="95%"
          title="新增问题"
          @close="clearValue"
        >
          <el-form
            ref="form"
            :model="scopeData"
            :rules="rules"
            size="small"
            label-width="120px"
          >
            <el-form-item label="标题">
              <el-input v-model="scopeData.giftName" style="width: 50%" />
            </el-form-item>
            <el-form-item label="问题描述">
              <el-input
                v-model="scopeData.remarks"
                type="textarea"
                :rows="4"
                placeholder="请输入内容"
                style="width: 80%"
              />
            </el-form-item>
            <el-form-item label="提交组别">
              <el-select
                v-model="scopeData.gameCode"
                placeholder="请选择组别"
                style="width: 30%"
              >
                <el-option
                  v-for="item in servicePeople"
                  :key="item.id"
                  :label="item.nickname"
                  :value="item.username"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="优先级">
              <el-select
                v-model="scopeData.gameCode"
                placeholder="请选择优先级"
                style="width: 30%"
              >
                <el-option
                  v-for="item in servicePeople"
                  :key="item.id"
                  :label="item.nickname"
                  :value="item.username"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="处理组别">
              <el-select
                v-model="scopeData.gameCode"
                placeholder="请选择组别"
                style="width: 30%"
              >
                <el-option
                  v-for="item in servicePeople"
                  :key="item.id"
                  :label="item.nickname"
                  :value="item.username"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="联系邮箱">
              <el-input v-model="scopeData.giftContent" style="width: 80%" />
            </el-form-item>
            <el-form-item label="Facebook">
              <el-input v-model="scopeData.giftUse" style="width: 80%" />
            </el-form-item>
            <el-form-item label="游戏名称">
              <el-input v-model="scopeData.giftUse" style="width: 80%" />
            </el-form-item>
            <el-form-item label="服务器">
              <el-select
                v-model="scopeData.gameCode"
                placeholder="请选择服务器"
                style="width: 30%"
              >
                <el-option
                  v-for="item in servicePeople"
                  :key="item.id"
                  :label="item.nickname"
                  :value="item.username"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="角色ID">
              <el-input v-model="scopeData.giftUse" style="width: 80%" />
            </el-form-item>
            <el-form-item label="passport">
              <el-input v-model="scopeData.giftUse" style="width: 80%" />
            </el-form-item>
            <el-form-item label="玩家账号">
              <el-input v-model="scopeData.giftUse" style="width: 80%" />
            </el-form-item>
            <el-form-item label="玩家VIP等级">
              <el-input v-model="scopeData.giftUse" style="width: 20%" />
              <span class="inpSpan">来源:</span>
              <el-select
                v-model="scopeData.gameCode"
                placeholder="请选择来源"
                style="width: 30%"
              >
                <el-option
                  v-for="item in servicePeople"
                  :key="item.id"
                  :label="item.nickname"
                  :value="item.username"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="上传附件">
              <editor v-if="isShowDelg" @editorContent="getEditorContent" />
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="closeDelg">取消</el-button>
            <el-button
              :loading="crud.cu === 2"
              type="primary"
              @click="getServiceValue"
            >确认</el-button>
          </div>
        </el-dialog>
      </div>
      <!-- 派发 -->
      <div class="sendPerson">
        <el-dialog
          :visible.sync="isShowHandle"
          width="500px"
          title="工单分配"
          @close="clearValue"
        >
          <template>
            <el-select v-model="serviceValue" placeholder="客服人员" style="width:50%" @change="selectPerson">
              <el-option
                v-for="item in servicePeople"
                :key="item.id"
                :label="item.nickname"
                :value="item.username"
              />
            </el-select>
          </template>
          <div slot="footer" class="dialog-footer">
            <el-button type="text" @click="isShowHandle=!isShowHandle">取消</el-button>
            <el-button :loading="crud.cu === 2" type="primary" @click="sendHandle">确认</el-button>
          </div>
        </el-dialog>
      </div>
      <!--表格渲染-->
      <el-table
        ref="table"
        v-loading="crud.loading"
        :data="crud.data"
        size="small"
        style="width: 100%"
        @selection-change="crud.selectionChangeHandler"
        @row-dblclick="doubleClick"
      >
        <el-table-column type="selection" width="60" />
        <el-table-column align="center" prop="id" label="序号" width="65px" />
        <el-table-column
          v-permission="['admin', 'edit']"
          label="操作"
          width="120px"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              size="small"
              type="primary"
              icon="el-icon-share"
              @click="changeStatus(scope.row)"
            >分配</el-button>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="gamecode"
          label="编号"
          width="85px"
        />
        <el-table-column
          align="center"
          prop="servercode"
          label="问题"
          width="200px"
        />
        <el-table-column
          align="center"
          prop="roleid"
          label="账号"
          width="110px"
        />
        <el-table-column
          align="center"
          prop="viplevle"
          label="VIP等级"
          width="150px"
        />
        <el-table-column
          align="center"
          prop="status"
          label="状态"
          width="150px"
        />
        <el-table-column
          align="center"
          prop="priority"
          label="优先级"
          width="250px"
        />
        <el-table-column
          align="center"
          prop="type"
          label="处理组"
          width="180px"
        />
        <el-table-column
          align="center"
          prop="language"
          label="处理人"
          width="120px"
        />
        <el-table-column
          align="center"
          prop="uploadtime"
          label="提交时间"
          width="150px"
        />
        <el-table-column
          align="center"
          prop="lastime"
          label="最后更新时间"
          width="150px"
        />
        <el-table-column
          align="center"
          prop="finishtime"
          label="完成时间"
          width="150px"
        />
        <el-table-column
          align="center"
          prop="endtime"
          label="结束时间"
          width="150px"
        />
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import {
  crudCusQuestionList,
  GetGameData,
  GetQusTypeData,
  GetAnsStatusData,
  GetDelStatusData,
  getDataBySotr
} from '@/api/cusQuestionList'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
import editor from '@/views/components/Editor.vue'

const defaultForm = {
  id: null,
  gamecode: null,
  servercode: null,
  roleid: null,
  passport: null,
  packagename: null,
  content: null,
  imageArray: null,
  qusType: null,
  type: null,
  language: null,
  os: null,
  deviceInformation: null,
  deviceVersion: null,
  createtime: null,
  ipaddress: null,
  country: null,
  ansStatus: null,
  delStatus: null
}
export default {
  name: 'CusQuestionList',
  components: { pagination, crudOperation, rrOperation, editor },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  // 数据字典
  dicts: ['cus_delstatus', 'cus_status', 'cus_kr_desc'],
  cruds() {
    return CRUD({
      title: '工单列表',
      url: 'api/cusQuestionList',
      sort: 'id,desc',
      crudMethod: { ...crudCusQuestionList }
    })
  },
  data() {
    return {
      isShow: false,
      isShowDelg: false,
      isPlayVideo: false,
      isShowOtherType: true,
      checkedSel: false,
      isShowHandle: false,
      inputContent: '',
      timer: null,
      getMsg: '',
      getDefualDate: null,
      getLastDate: null,
      activeIndex: '1',
      defaultTime: [],
      uploadURL: '',
      scopeData: {
        giftName: null,
        giftType: null,
        giftContent: null,
        giftUse: null,
        gameCode: null,
        giftTime: null,
        remarks: null
      },
      permission: {
        add: ['admin', 'cusQuestionList:add'],
        edit: ['admin', 'cusQuestionList:edit'],
        del: ['admin', 'cusQuestionList:del']
      },
      rules: {
        ansStatus: [
          { required: true, message: '回复状态不能为空', trigger: 'blur' }
        ],
        delStatus: [
          { required: true, message: '是否删除状态不能为空', trigger: 'blur' }
        ]
      },
      gameOptions: [],
      qusTypeOptions: [],
      ansStatusOptions: [],
      delStatusOptions: [],
      servicePeople: [
        { id: 1, nickname: '张维文', username: 'Yui' },
        { id: 2, nickname: '招晓怡', username: 'Rae' },
        { id: 3, nickname: '谭红英', username: 'Elaine' },
        { id: 4, nickname: '陈凯鹏', username: 'Jenna' },
        { id: 5, nickname: '钟伟宇', username: 'Kiki' },
        { id: 6, nickname: '杜振烨', username: 'Jason' },
        { id: 7, nickname: '陈安琪', username: 'Angela' }
      ],
      oContent: {},
      msgs: [],
      getEditorData: [],
      getFileterData: [],
      serviceValue: '',
      selectPersonData: null
    }
  },
  created: function() {
    this.getGameData()
    this.getQusTypeData()
    this.getAnsStatusData()
    this.getDelStatusData()
  },

  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    getGameData() {
      GetGameData().then((res) => {
        this.gameOptions = res.content
      })
    },
    getEditorContent(editorContent) {
      console.log(editorContent)
      this.getEditorData.push(editorContent)

      this.getFileterData = this.getEditorData.filter((item, index) => {
        return this.getEditorData.indexOf(item, 0) === index
      })

      console.log(this.getFileterData)
      console.log(this.getEditorData)
    },
    getQusTypeData() {
      GetQusTypeData().then((res) => {
        this.qusTypeOptions = res.content
      })
    },
    getAnsStatusData() {
      GetAnsStatusData().then((res) => {
        this.ansStatusOptions = res.content
      })
    },
    closeEdictor() {
      this.isShowDelg = !this.isShowDelg
    },
    getDelStatusData() {
      GetDelStatusData().then((res) => {
        this.delStatusOptions = res.content
      })
    },
    changeEnabled(data, val) {
      if (val) {
        val = '未删除'
      } else {
        val = '已删除'
      }
      this.$confirm(
        '此操作将删除状态改为 "' +
          this.dict.label.cus_delstatus[val] +
          '", 是否继续？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          crudCusQuestionList
            .edit(data)
            .then((res) => {
              this.crud.notify(
                this.dict.label.cus_delstatus[val] + '成功',
                CRUD.NOTIFICATION_TYPE.SUCCESS
              )
            })
            .catch(() => {
              data.delStatus = !data.delStatus
            })
        })
        .catch(() => {
          data.delStatus = !data.delStatus
        })
    },
    changeAnsStatus(data, val) {
      if (val) {
        val = '未回复'
      } else {
        val = '已回复'
      }
      this.$confirm(
        '此操作将问题回复改为 "' +
          this.dict.label.cus_status[val] +
          '", 是否继续？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          if (data.ansStatus) {
            data.ansStatus = 1
          } else {
            data.ansStatus = 0
          }
          crudCusQuestionList
            .edit(data)
            .then((res) => {
              this.crud.notify(
                this.dict.label.cus_status + '成功',
                CRUD.NOTIFICATION_TYPE.SUCCESS
              )
            })
            .catch(() => {
              data.ansStatus = !data.ansStatus
            })
        })
        .catch(() => {
          data.ansStatus = !data.ansStatus
        })
    },
    changeStatus(data) {
      this.isShowHandle = !this.isShowHandle
    },
    closeDelg() {
      this.getEditorData = []
      this.isShowDelg = !this.isShowDelg
    },
    selectPerson(data) {
      this.selectPersonData = data
    },
    getServiceValue() {
      console.log(this.scopeData)
      this.isShowDelg = !this.isShowDelg
    },
    sendHandle(data) {
      console.log(this.selectPersonData)
    },
    clearValue() {
      this.serviceValue = ''
    },
    refreshData() {
      getDataBySotr().then((res) => {})
    },
    exportExels(date) {
      this.isShowDelg = !this.isShowDelg
    },
    doubleClick(row) {
      this.isShowDelg = !this.isShowDelg
    },
    changeDelete(data) {
      console.log(data)
    },
    chnageRoides() {
      console.log('cuihua')
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
/deep/ .crud-opts-left {
  display: none;
}
/deep/ .cell {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.serviceSel {
  float: right;
}

.changeRed {
  color: red;
}

.demo-image__preview {
  overflow: auto;
}

.el-form-item {
  margin-bottom: 5px;
}

.el-image {
  margin-left: 10px;
  margin-bottom: 10px;
}

.clearfix {
  *zoom: 1;
}
.clearfix::before {
  display: table;
  content: " ";
}
.clearfix::after {
  clear: both;
  display: table;
  content: " ";
}
.addwokerOrder{
/deep/ .el-dialog__wrapper {
  .el-dialog {
    height: 95%;
    overflow: auto;
    .el-dialog__header {
      padding: 20px;
      padding-bottom: 10px;
      background: #438eb9;
      .el-dialog__title {
        line-height: 24px;
        font-size: 18px;
        color: #fff;
      }
      .el-dialog__headerbtn {
        .el-dialog__close {
          color: #fff;
        }
      }
    }
    .el-dialog__body {
      padding: 0 1px;
      color: #606266;
      font-size: 14px;
      word-break: break-all;
      .el-form-item {
        margin-bottom: 5px;
        border-bottom: 1px solid #ccc;
        padding: 5px 0;
        .el-form-item__content {
          line-height: 40px;
          position: relative;
          font-size: 14px;
          border-left: 1px solid #ccc;
          padding: 0 10px;
        }
      }
    }
    .inpSpan {
      margin-left: 15px;
      font-weight: 600;
    }
    .el-dialog__footer {
      padding: 20px;
      padding-top: 10px;
      text-align: center;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      border-bottom: 1px solid #ccc;
    }
  }
}
}

</style>
