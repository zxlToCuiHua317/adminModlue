<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-select
          v-model="query.gamecode"
          clearable
          size="small"
          placeholder="游戏"
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
        <el-input
          v-model="query.servercode"
          clearable
          placeholder="游戏服"
          style="width: 150px"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        />
        <el-input
          v-model="query.id"
          clearable
          placeholder="id"
          style="width: 60px"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        />
        <el-input
          v-model="query.roleid"
          clearable
          placeholder="角色ID"
          style="width: 150px"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        />
        <el-input
          v-model="query.passport"
          clearable
          placeholder="passport"
          style="width: 180px"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        />
        <el-input
          v-model="query.packagename"
          clearable
          placeholder="包名"
          style="width: 180px"
          class="filter-item"
          @keyup.enter.native="crud.toQuery"
        />
        <div class="changeline">
          <el-select
            v-model="query.qusType"
            clearable
            size="small"
            placeholder="问题类型"
            class="filter-item"
            style="width: 120px"
            @change="crud.toQuery"
          >
            <el-option
              v-for="item in qusTypeOptions"
              :key="item.key"
              :label="item.value"
              :value="item.label"
            />
          </el-select>

          <el-select
            v-model="query.os"
            clearable
            size="small"
            placeholder="系统"
            class="filter-item"
            style="width: 120px"
            @change="crud.toQuery"
          >
            <el-option
              v-for="item in getOsData"
              :key="item.key"
              :label="item.data"
              :value="item.data"
            />
          </el-select>
          <el-date-picker
            v-model="defaultTime"
            :default-time="['00:00:00', '23:59:59']"
            type="daterange"
            range-separator=":"
            size="small"
            class="date-item"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />

          <el-select
            v-model="query.ansStatus"
            clearable
            size="small"
            placeholder="回复状态"
            class="filter-item"
            style="width: 120px"
            @change="crud.toQuery"
          >
            <el-option
              v-for="item in ansStatusOptions"
              :key="item.key"
              :label="item.value"
              :value="item.label"
            />
          </el-select>
          <el-select
            v-model="query.delStatus"
            clearable
            size="small"
            placeholder="是否删除状态"
            class="filter-item"
            style="width: 150px"
            @change="crud.toQuery"
          >
            <el-option
              v-for="item in delStatusOptions"
              :key="item.key"
              :label="item.value"
              :value="item.label"
            />
          </el-select>
        </div>
        <rrOperation />
        <el-button
          v-if="crud.optShow.download"
          :loading="crud.downloadLoading"
          :disabled="!crud.data.length"
          class="filter-item"
          size="mini"
          type="warning"
          icon="el-icon-download"
          @click="exportExels(defaultTime)"
        >导出</el-button>
        <div class="serviceSel">
          <template>
            <!-- `checked` 为 true 或 false -->
            <el-checkbox v-model="checkedSel" @change="hiddenTypes">客服勾选</el-checkbox>
          </template>
        </div>
      </div>
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog
        :visible.sync="isShowDelg"
        width="500px"
        title="客诉派发"
        :modal="false"
        @close="clearValue"
      >
        <template>
          <el-select v-model="serviceValue" placeholder="客服人员" style="width:50%">
            <el-option
              v-for="item in servicePeople"
              :key="item.id"
              :label="item.nickname"
              :value="item.username"
            />
          </el-select>
        </template>

        <!-- <el-form ref="form" :model="scopeData" :rules="rules" size="small" label-width="80px">
          <div class="userinfo">
            <div class="userinfo-left">
              <el-form-item label="游戏">
                <el-input v-model="scopeData.gamecode" disabled style="width: 90px;" />
              </el-form-item>
              <el-form-item label="id">
                <el-input v-model="scopeData.id" disabled style="width: 60px;" />
              </el-form-item>
              <el-form-item label="系统">
                <el-input v-model="scopeData.os" disabled style="width: 120px;" />
              </el-form-item>
              <el-form-item label="设备信息">
                <el-input v-model="scopeData.deviceInformation" disabled style="width: 120px;" />
              </el-form-item>

            </div>
            <div class="userinfo-center">
              <el-form-item label="伺服器">
                <el-input v-model="scopeData.servercode" disabled style="width: 90px;" />
              </el-form-item>

              <el-form-item label="问题类型">
                <el-input v-model="scopeData.qusTypeList.typeinname" disabled style="width: 120px;" />
              </el-form-item>
              <el-form-item v-show="isShow" label="type">
                <el-input v-model="scopeData.type" disabled style="width: 120px;" />
              </el-form-item>
              <el-form-item label="语言">
                <el-input v-model="scopeData.language" disabled style="width: 120px;" />
              </el-form-item>
              <el-form-item label="回复状态" prop="ansStatus">
                <el-input v-model="scopeData.ansStatus" disabled style="width: 120px;" />
              </el-form-item>
            </div>
            <div class="userinfo-right">
              <el-form-item label="passport">
                <el-input v-model="scopeData.passport" disabled style="width: 180px;" />
              </el-form-item>

              <el-form-item label="创建时间">
                <el-input v-model="scopeData.createtime" disabled style="width: 170px;" />
              </el-form-item>
              <el-form-item label="IP">
                <el-input v-model="scopeData.ipaddress" disabled style="width: 130px;" />
              </el-form-item>
              <el-form-item label="国家地区">
                <el-input v-model="scopeData.country" disabled style="width: 120px;" />
              </el-form-item>

            </div>
            <div class="userinfo-top">
              <el-form-item label="角色ID">
                <el-input v-model="scopeData.roleid" disabled style="width: 100px;" />
              </el-form-item>
              <el-form-item label="包名">
                <el-input v-model="scopeData.packagename" disabled style="width: 180px;" />
              </el-form-item>
              <el-form-item label="设备系统">
                <el-input v-model="scopeData.deviceVersion" disabled style="width: 120px;" />
              </el-form-item>
              <el-form-item label="删除状态" prop="delStatus">
                <el-input v-model="scopeData.delStatus" disabled style="width: 120px;" />
              </el-form-item>
            </div>
          </div>
          <el-form-item prop="imageArray" label="图片">
            <div v-if="scopeData.imageArray" class="showPhoto">
              <el-image
                v-for="item of scopeData.imageArray"
                :key="item.key"
                style="width: 100px; height: 100px"
                :src="item"
                :preview-src-list="scopeData.imageArray"
              />
              <div v-if="scopeData.aplyGetVideo" class="showVideo">
                <video
                  v-for="item of scopeData.aplyGetVideo"
                  :key="item.key"
                  :src="item"
                  style="width: 100px; height: 100px"
                  @click="prviewVideo(scopeData.aplyGetVideo)"
                />
              </div>
            </div>
          </el-form-item>
          <el-form-item label="客诉内容">
            <el-input v-model="scopeData.content" disabled type="textarea" :rows="3" style="width: 100%;" />
          </el-form-item>
          <div class="showMsg">{{ getMsg }}</div>
          <div class="sockTip">
            <div class="serviceMune">
              <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
                <el-menu-item index="1">客诉回复</el-menu-item>
                <div class="serviceDel">
                  <el-button
                    v-show="isShow"
                    size="mini"
                    type="danger"
                    icon="el-icon-delete"
                    @click="changeDelete(scopeData)"
                  />
                </div>
              </el-menu>
            </div>
            <div id="chartContent" ref="chartContent" class="chartContent">
              <div v-for="item of msgs" :key="item.key" class="content">
                <div v-if="item.type" class="right-content clearfix">
                  <div class="msg-date">{{ item.createtime }}</div>
                  <div class="servicecontent">{{ item.content }}</div>
                  <div class="right-start">
                    <el-rate v-model="item.star" disabled text-color="#ff9900" />
                  </div>
                </div>

                <div v-else class="left-content clearfix">
                  <div class="msg-date">{{ item.createtime }}</div>
                  <div class="usercontent">{{ item.content }}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="chatting-input">
            <el-input
              v-model="inputContent"
              class="el-input el-input--small"
              placeholder="回复"
              style="padding-left:0"
              @keyup.enter="send"
              @input="getInputNum"
            />
            <el-button
              v-permission="['admin','cusQuestionList:add']"
              type="primary"
              @click="send(scopeData.id)"
            >发送</el-button>
          </div>
          <div v-if="valuenum" class="getnum">{{ valuenum }}</div>
        </el-form> -->
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="isShowDelg=!isShowDelg">取消</el-button>
          <el-button :loading="crud.cu === 2" type="primary" @click="getServiceValue">确认</el-button>
        </div>
      </el-dialog>
      <div class="playVideo">
        <el-dialog width="550px" top="5vh" :visible.sync="isPlayVideo" @close="closeVideo">
          <video :src="getVideo" controls autoplay class="video" width="100%" height="100%" />
        </el-dialog>
      </div>
      <!--表格渲染-->
      <el-table
        ref="table"
        v-loading="crud.loading"
        :data="crud.data"
        size="small"
        style="width: 100%;"
        @selection-change="crud.selectionChangeHandler"
        @row-dblclick="doubleClick"
      >
        <el-table-column type="selection" width="60" />
        <el-table-column
          v-permission="['admin','cusQuestionList:edit']"
          label="操作"
          width="125px"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-edit"
              @click="changeStatus(scope.row)"
            >派发</el-button>
            <el-button
              v-show="isShow"
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="changeDelete(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column align="center" prop="id" label="id" width="65px" />
        <el-table-column align="center" prop="gamecode" label="游戏" width="65px" />
        <el-table-column align="center" prop="servercode" label="伺服器" width="75px" />
        <el-table-column align="center" prop="roleid" label="角色id" width="120px" />
        <el-table-column align="center" prop="passport" label="passport" width="200px" />
        <el-table-column align="center" prop="ansStatus" type="danger" class-name="changeRed" :class="'changeRed'" label="回复状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.ansStatus==='未回复'" size="small" type="danger">{{ scope.row.ansStatus }}</el-tag>
            <el-tag v-if="scope.row.ansStatus==='已回复'" size="small" type="success">{{ scope.row.ansStatus }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="qusTypeList.typeinname" label="问题类型" />
        <el-table-column show-overflow-tooltip prop="content" label="客诉内容" />
        <el-table-column prop="imageArray" label="图片">
          <template slot-scope="scope">
            <div class="demo-image__preview">
              <div v-if="scope.row.imageArray[0]" class="showImg">
                <el-image
                  v-for="item of scope.row.imageArray"
                  :key="item.key"
                  style="width: 50px; height: 50px"
                  :src="item"
                  :preview-src-list="scope.row.imageArray"
                />
              </div>

              <div v-if="scope.row.videoArr" class="getvideo">
                <video
                  v-for="item of scope.row.videoArr"
                  :key="item.key"
                  :src="item"
                  style="width: 50px; height: 50px"
                  @click="prviewVideo(scope.row.videoArr)"
                />
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          v-if="isShowOtherType"
          align="center"
          prop="packagename"
          label="包名"
          width="200px"
        />
        <el-table-column v-if="isShow" align="center" prop="type" label="type" />
        <el-table-column v-if="isShow" align="center" prop="language" label="语言" />
        <el-table-column v-if="isShowOtherType" align="center" prop="os" label="系统" />
        <el-table-column v-if="isShow" align="center" prop="deviceInformation" label="设备信息" />
        <el-table-column v-if="isShow" align="center" prop="deviceVersion" label="设备系统" />
        <el-table-column prop="createtime" align="center" label="创建时间" width="140px" />
        <el-table-column prop="last_reply_time" align="center" label="最后回复时间" width="140px" />
        <el-table-column
          v-if="isShowOtherType"
          align="center"
          prop="ipaddress"
          label="IP"
          width="110px"
        />
        <el-table-column v-if="isShowOtherType" align="center" prop="country" label="国家地区" />
        <el-table-column align="center" prop="delStatus" label="删除状态" />
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
  // getDataById,
  replay,
  getDataBySotr
} from '@/api/cusQuestionList'
import { getInfo } from '@/api/login'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
// import udOperation from '@crud/UD.operation'
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
  delStatus: null,
  last_modify_time: null
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
        delStatus: null,
        qusTypeList: {
          gamecode: null,
          id: null,
          type: null,
          typeinname: null,
          typename: null
        }
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
      getOsData: [
        { id: 1, data: 'Android' },
        { id: 2, data: 'IOS' }
      ],
      oContent: {},
      msgs: [],
      getVideo: [],
      aplyGetVideo: [],
      servicePeople: [
        { id: 1, nickname: '张维文', username: 'Yui' },
        { id: 2, nickname: '招晓怡', username: 'Rae' },
        { id: 3, nickname: '谭红英', username: 'Elaine' },
        { id: 4, nickname: '陈凯鹏', username: 'Jenna' },
        { id: 5, nickname: '钟伟宇', username: 'Kiki' },
        { id: 6, nickname: '杜振烨', username: 'Jason' },
        { id: 7, nickname: '陈安琪', username: 'Angela' }
      ],
      serviceValue: ''
    }
  },
  created: function() {
    this.getGameData()
    this.getQusTypeData()
    this.getAnsStatusData()
    this.getDelStatusData()
    this.getDate()
    this.consoInfo()
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    getGameData() {
      GetGameData().then(res => {
        this.gameOptions = res.content
      })
    },
    getQusTypeData() {
      GetQusTypeData().then(res => {
        this.qusTypeOptions = res.content
      })
    },
    getAnsStatusData() {
      GetAnsStatusData().then(res => {
        this.ansStatusOptions = res.content
      })
    },
    getDelStatusData() {
      GetDelStatusData().then(res => {
        this.delStatusOptions = res.content
      })
    },
    consoInfo: function() {
      getInfo().then(res => {
        console.log(res)
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
            .then(res => {
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
            .then(res => {
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
            replay(id, this.inputContent).then(res => {
              GetContent(id).then(result => {
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

              GetContent(id).then(res => {
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
          .catch(err => {
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
    hiddenTypes() {
      this.isShowOtherType = !this.isShowOtherType
    },
    refreshData() {
      getDataBySotr().then(res => {})
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
        if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
          time = parseInt(time)
        }
        if ((typeof time === 'number') && (time.toString().length === 10)) {
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
        if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
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
        if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
          time = parseInt(time)
        }
        if ((typeof time === 'number') && (time.toString().length === 10)) {
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
        if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
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
        params.createTime = [setStartDate + ' 00:00:00', setEndDate + ' 23:59:59']
      } else {
        setStartDate = this.getLastDate
        setEndDate = this.getDefualDate
        params.createTime = [setStartDate, setEndDate]
      }

      download(this.crud.url + '/download', params).then(result => {
        downloadFile(result, '客诉列表数据', 'xlsx')
        this.crud.downloadLoading = false
      }).catch(() => {
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
/deep/ .cell {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

/deep/ .el-dialog {
  margin-top: 5vh;
}

.serviceSel {
  float: right;
}

.changeRed{
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
  .userinfo-top{
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
.el-dialog__body{
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
.serviceDel{
    position: absolute;
    top: 25px;
    right: 23px;
}
</style>
