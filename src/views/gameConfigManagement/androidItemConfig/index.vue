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
            v-model="query.gameCode"
            clearable
            placeholder="gameCode"
            style="width: 130px"
            class="filter-item"
            @keyup.enter.native="crud.toQuery"
          />
          <el-input
            v-model="query.packageName"
            clearable
            placeholder="packageName"
            style="width: 180px"
            class="filter-item"
            @keyup.enter.native="crud.toQuery"
          />
          <el-input
            v-model="query.serverCode"
            clearable
            placeholder="serverCode"
            style="width: 180px"
            class="filter-item"
            @keyup.enter.native="crud.toQuery"
          />
          <el-input
            v-model="query.siteCode"
            clearable
            placeholder="siteCode"
            style="width: 180px"
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
      <el-dialog
        :visible.sync="isShowDelg"
        width="1000px"
        top="1vh"
        height="95%"
        title="新增"
        @close="clearValue"
      >
        <el-form
          ref="form"
          :model="scopeData"
          :rules="rules"
          size="small"
          label-width="120px"
        >
          <el-form-item label="游戏名称">
            <el-select
              v-model="serviceValue"
              placeholder="全部游戏查询"
              style="width: 130px"
            >
              <el-option
                v-for="item in servicePeople"
                :key="item.id"
                :label="item.nickname"
                :value="item.username"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="itemCode">
            <el-input v-model="scopeData.itemCode" style="width: 200px" />
          </el-form-item>
          <el-form-item label="lpoint">
            <el-input v-model="scopeData.lpoint" style="width: 200px" />
          </el-form-item>
          <el-form-item label="moneyHKD">
            <el-input
              v-model="scopeData.moneyHKD"
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="moneyUSD">
            <el-input
              v-model="scopeData.moneyUSD"
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="游戏币">
            <el-input
              v-model="scopeData.gold"
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="品项类型">
            <el-radio v-model="scopeData.type" label="1">储值游戏币</el-radio>
            <el-radio v-model="scopeData.type" label="2">VIP卡,月卡</el-radio>
          </el-form-item>
          <el-form-item label="品项类型名称">
            <el-input
              v-model="scopeData.typeName"
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="是否展示">
            <el-radio v-model="scopeData.show" label="1">隐藏</el-radio>
            <el-radio v-model="scopeData.show" label="2">展示</el-radio>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="isShowDelg = !isShowDelg">取消</el-button>
          <el-button
            :loading="crud.cu === 2"
            type="primary"
            @click="getServiceValue"
          >确认</el-button>
        </div>
      </el-dialog>
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
          v-permission="['admin', 'cusQuestionList:edit']"
          label="操作"
          width="125px"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="changeStatus(scope.row)"
            >编辑</el-button>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="gamecode"
          label="gameCode"
          width="85px"
        />
        <el-table-column
          align="center"
          prop="servercode"
          label="itemCode"
          width="120px"
        />
        <el-table-column
          align="center"
          prop="roleid"
          label="lpoint"
          width="100px"
        />
        <el-table-column
          align="center"
          prop="passport"
          label="moneyHKD"
          width="120px"
        />
        <el-table-column
          align="center"
          prop="passport"
          label="moneyUSD"
          width="120px"
        />
        <el-table-column
          align="center"
          prop="packagename"
          label="gold"
          width="80px"
        />
        <el-table-column
          align="center"
          prop="type"
          label="类型"
          width="100px"
        />
        <el-table-column
          align="center"
          prop="language"
          label="创建时间"
          width="120px"
        />
        <el-table-column
          align="center"
          prop="os"
          label="类型名"
          width="150px"
        />
        <el-table-column
          align="center"
          prop="os"
          label="是否展示"
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
  GetContent,
  replay,
  getDataBySotr
} from '@/api/cusQuestionList'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
import { parseTime } from '@/utils/index'

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
  components: { pagination, crudOperation, rrOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  // 数据字典
  dicts: ['cus_delstatus', 'cus_status', 'cus_kr_desc'],
  cruds() {
    return CRUD({
      title: '客诉列表',
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
      inputContent: '',
      timer: null,
      getMsg: '',
      getDefualDate: null,
      getLastDate: null,
      isSendMsg: true,
      activeIndex: '1',
      defaultTime: [],
      valuenum: null,
      scopeData: {
        id: null,
        gameCode: null,
        itemCode: null,
        lpoint: null,
        moneyHKD: null,
        moneyUSD: null,
        gold: null,
        type: null,
        createtime: null,
        typeName: null,
        show: null
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
      oContent: {},
      msgs: [],
      serviceValue: ''
    }
  },
  created: function() {
    this.getGameData()
    this.getQusTypeData()
    this.getAnsStatusData()
    this.getDelStatusData()
    this.getDate()
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
      this.isShowDelg = !this.isShowDelg
    },
    send(id) {
      this.$refs.chartContent.scrollTop = this.$refs.chartContent.scrollHeight

      if (this.inputContent === '') {
        this.crud.notify('请输入内容')
      } else {
        this.$confirm('此操作将回复用户消息不能撤回, 是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            replay(id, this.inputContent).then((res) => {
              GetContent(id).then((result) => {
                for (let j = 0; j < result.length; j++) {
                  const indexs = j
                  result[indexs].createtime = parseTime(
                    result[indexs].createtime
                  )
                  if (result[indexs].type === '1') {
                    result[indexs].type = true
                  } else if (result[indexs].type === '2') {
                    result[indexs].type = false
                  }
                }
                this.msgs = result
              })
            })
            this.inputContent = ''
            var that = this
            // 客服回复后，设置计时器获取用户回复的消息
            setTimeout(function() {
              that.$refs.chartContent.scrollTop =
                that.$refs.chartContent.scrollHeight

              GetContent(id).then((res) => {
                for (let i = 0; i < res.length; i++) {
                  const index = i
                  // parseTime 时间格式化方法
                  res[index].createtime = parseTime(res[index].createtime)
                  if (res[index].type === '1') {
                    res[index].type = true
                  } else if (res[index].type === '2') {
                    res[index].type = false
                  }
                }
                this.msgs = res
              })
            }, 10000)
          })
          .catch((err) => {
            console.log(err)
          })
      }
    },
    prviewVideo(data) {
      this.isPlayVideo = true
      this.getVideo = data
    },
    closeVideo() {
      var closeVideo = document.querySelector('.video')
      closeVideo.pause()
    },
    getServiceValue() {
      console.log(this.serviceValue)
      this.serviceValue = ''
      this.isShowDelg = !this.isShowDelg
    },
    clearValue() {
      this.serviceValue = ''
    },
    refreshData() {
      getDataBySotr().then((res) => {})
    },
    getDate() {
      this.getDefualDate = this.LastparseTimes(new Date())
      this.getLastDate = this.parseTimes(new Date())
      this.defaultTime.push(this.getLastDate)
      this.defaultTime.push(this.getDefualDate)
    },
    parseTimes(time, cFormat) {
      if (arguments.length === 0) {
        return null
      }
      const format = cFormat || '{y}-{m}-{d} 00:00:00'
      let date
      if (typeof time === 'undefined' || time === null || time === 'null') {
        return ''
      } else if (typeof time === 'object') {
        date = time
      } else {
        if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
          time = parseInt(time)
        }
        if (typeof time === 'number' && time.toString().length === 10) {
          time = time * 1000
        }
        date = new Date(time)
      }
      const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth(),
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
      }
      const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
        let value = formatObj[key]
        // Note: getDay() returns 0 on Sunday
        if (key === 'a') {
          return ['日', '一', '二', '三', '四', '五', '六'][value]
        }
        if (result.length > 0 && value < 10) {
          value = '0' + value
        }
        return value || 0
      })
      return time_str
    },
    LastparseTimes(time, cFormat) {
      if (arguments.length === 0) {
        return null
      }
      const format = cFormat || '{y}-{m}-{d} 23:59:59'
      let date
      if (typeof time === 'undefined' || time === null || time === 'null') {
        return ''
      } else if (typeof time === 'object') {
        date = time
      } else {
        if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
          time = parseInt(time)
        }
        if (typeof time === 'number' && time.toString().length === 10) {
          time = time * 1000
        }
        date = new Date(time)
      }
      const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
      }
      const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
        let value = formatObj[key]
        // Note: getDay() returns 0 on Sunday
        if (key === 'a') {
          return ['日', '一', '二', '三', '四', '五', '六'][value]
        }
        if (result.length > 0 && value < 10) {
          value = '0' + value
        }
        return value || 0
      })
      return time_str
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
    },
    getInputNum(value) {
      this.valuenum = value.length
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
// .crud-opts {
//   // display: none;
// }
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

/deep/ .el-dialog__wrapper {
  .el-dialog {
    height: 95%;
    .el-dialog__header {
      padding: 20px;
      padding-bottom: 10px;
      background: #438eb9;
      .el-dialog__title {
        line-height: 24px;
        font-size: 18px;
        color: #fff;
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
        padding: 10px 0;
        .el-form-item__content {
          line-height: 40px;
          position: relative;
          font-size: 14px;
          border-left: 1px solid #ccc;
          padding: 0 10px;
        }
      }
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
</style>
