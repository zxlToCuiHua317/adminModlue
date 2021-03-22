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
            v-model="query.roleid"
            clearable
            placeholder="gameCode"
            style="width: 150px"
            class="filter-item"
            @keyup.enter.native="crud.toQuery"
          />
          <el-input
            v-model="query.passport"
            clearable
            placeholder="packageName"
            style="width: 150px"
            class="filter-item"
            @keyup.enter.native="crud.toQuery"
          />
          <el-input
            v-model="query.oteherid"
            clearable
            placeholder="serverCode"
            style="width: 180px"
            class="filter-item"
            @keyup.enter.native="crud.toQuery"
          />
          <el-input
            v-model="query.regip"
            clearable
            placeholder="passport"
            style="width: 180px"
            class="filter-item"
            @keyup.enter.native="crud.toQuery"
          />

          <el-select
            v-model="query.gamecode"
            clearable
            size="small"
            placeholder="全部"
            class="filter-item"
            style="width: 120px"
            @change="crud.toQuery"
          >
            <el-option
              v-for="item in gameOptions"
              :key="item.key"
              :label="item.value"
              :value="item.label"
            />
          </el-select>

        </div>
        <rrOperation />
      </div>
      <crudOperation :permission="permission" />
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
          align="center"
          prop="gamecode"
          label="passport"
          width="200px"
        />
        <el-table-column
          align="center"
          prop="servercode"
          label="siteCode"
          width="100px"
        />
        <el-table-column
          align="center"
          prop="roleid"
          label="gameCode"
          width="100px"
        />
        <el-table-column
          align="center"
          prop="passport"
          label="serverCode"
          width="100px"
        />
        <el-table-column
          align="center"
          prop="passport"
          label="param"
          width="200px"
        />
        <el-table-column
          align="center"
          prop="packagename"
          label="param2"
          width="200px"
        />
        <el-table-column
          align="center"
          prop="type"
          label="stime"
          width="200px"
        />
        <el-table-column
          align="center"
          prop="language"
          label="tag"
          width="100px"
        />
        <el-table-column
          align="center"
          prop="os"
          label="ipAddress"
          width="180px"
        />
        <el-table-column
          align="center"
          prop="deviceInformation"
          label="country"
          width="100px"
        />
        <el-table-column
          align="center"
          prop="deviceVersion"
          label="packageName"
          width="180px"
        />
        <el-table-column
          align="center"
          prop="deviceVersion"
          label="os"
          width="100px"
        />
        <el-table-column
          align="center"
          prop="deviceVersion"
          label="language"
          width="80px"
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
import { parseTime, downloadFile } from '@/utils/index'
import { download } from '@/api/data'

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
        status: null,
        passport: null,
        username: null,
        lunplay_orderID: null,
        money: null,
        productID: null,
        serverCode: null,
        payGame_lpoint: null,
        time: null,
        packageName: null,
        siteCode: null,
        ipAddress: null,
        country: null,
        pay_tag: null,
        Lpoint: null,
        gameCode: null,
        transactionID: null,
        roleid: null
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
      var setStartDate
      var setEndDate
      var params = this.crud.getQueryParams()
      if (date !== null) {
        setStartDate = date[0]
        setEndDate = date[1]
        params.createTime = [
          setStartDate + ' 00:00:00',
          setEndDate + ' 23:59:59'
        ]
      } else {
        setStartDate = this.getLastDate
        setEndDate = this.getDefualDate
        params.createTime = [setStartDate, setEndDate]
      }

      download(this.crud.url + '/download', params)
        .then((result) => {
          downloadFile(result, '客诉列表数据', 'xlsx')
          this.crud.downloadLoading = false
        })
        .catch(() => {
          this.crud.downloadLoading = false
        })
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
.userinfo {
  width: 100%;
  height: 150px;
  display: flex;
  .userinfo-left {
    flex: 1;
  }
  .userinfo-center {
    flex: 1;
  }
  .userinfo-right {
    flex: 1;
  }
  .userinfo-top {
    flex: 1;
  }
}
.showMsg {
  position: absolute;
  top: 22px;
  left: 110px;
  font-size: 18px;
  color: red;
  font-weight: 600;
}
.el-dialog__body {
  padding: 0px 20px;
  color: #606266;
  font-size: 14px;
  word-break: break-all;
}
.sockTip {
  width: 100%;
  height: 300px;
  .chartContent {
    width: 100%;
    height: 250px;
    overflow-y: auto;
    border: 1px solid #ccc;
    border-radius: 5px;
    background: rgba(0, 0, 0, 0.1);
    overflow: auto;
    .content {
      width: 100%;
      border-radius: 5px;
      .left-content {
        padding: 10px;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        .msg-date {
          text-align: center;
          color: gray;
          font-size: 16px;
          padding-left: 16px;
        }
        .usercontent {
          float: left;
          word-wrap: break-word;
          word-break: break-all;
          margin-left: 10px;
          margin-top: 5px;
          background-color: #fff;
          width: 75%;
          padding: 6px 10px;
          border-radius: 10px;
          font-size: 16px;
        }
        .left-start {
          padding-left: 17px;
        }
      }
      .right-content {
        padding: 10px;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        .msg-date {
          text-align: center;
          color: gray;
          font-size: 16px;
          padding-right: 18px;
        }
        .servicecontent {
          word-wrap: break-word;
          word-break: break-all;
          margin-right: 10px;
          margin-top: 5px;
          color: #fff;
          background-color: green;
          width: 75%;
          padding: 6px 10px;
          border-radius: 10px;
          font-size: 16px;
          font-family: "Courier New", Courier, monospace;
        }
        .right-start {
          padding-right: 20px;
        }
      }
    }
  }
}
.chatting-input {
  display: flex;
  height: 40px;
  width: 100%;
  margin-top: 12px;
  .el-input {
    flex: 1;
    padding-left: 10px;
    // padding-top: 10px;
    height: 100%;
    font-size: 18px;
  }
  button {
    width: 90px;
    height: 33px;
    line-height: 8px;
    background-color: #2196f3;
    color: #fff;
    font-size: 18px;
  }
}
.serviceDel {
  position: absolute;
  top: 25px;
  right: 23px;
}
</style>
