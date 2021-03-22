<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <div class="select_tool">
          <!-- 搜索 -->
          <el-select
            v-model="query.gamecode"
            clearable
            size="small"
            placeholder="全部游戏查询"
            class="filter-item"
            style="width: 150px"
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
            v-model="query.id"
            clearable
            placeholder="游戏代码"
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
          @click="changeStatus()"
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
      >
        <el-form
          ref="form"
          :model="scopeData"
          :rules="rules"
          size="small"
          label-width="150px"
        >
          <el-form-item label="全部游戏查询">
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
          <el-form-item label="服务器名">
            <el-input v-model="scopeData.lpoint" style="width: 80%" />
          </el-form-item>
          <el-form-item label="服务器代码">
            <el-input
              v-model="scopeData.moneyHKD"
              style="width: 80%"
            />
          </el-form-item>
          <el-form-item label="经营类型">
            <template>
              <el-radio-group v-model="scopeData.type">
                <el-radio label="1">自家经营</el-radio>
                <el-radio label="2">联营</el-radio>
                <el-radio label="3">独家代理</el-radio>
              </el-radio-group>
            </template>
          </el-form-item>
          <el-form-item label="开服时间">
            <template>
              <el-date-picker
                v-model="serverForOpen"
                type="datetime"
                placeholder="选择日期时间"
              />
            </template>
          </el-form-item>
          <el-form-item label="充值开关">
            <el-radio v-model="scopeData.type" label="1">开</el-radio>
            <el-radio v-model="scopeData.type" label="2">关</el-radio>
          </el-form-item>
          <el-form-item label="登入开关">
            <el-radio v-model="scopeData.show" label="1">开</el-radio>
            <el-radio v-model="scopeData.show" label="2">关</el-radio>
          </el-form-item>
          <el-form-item label="充值域名">
            <el-input
              v-model="scopeData.moneyHKD"
              style="width: 80%"
            />
          </el-form-item>
          <el-form-item label="登入域名">
            <el-input
              v-model="scopeData.moneyHKD"
              style="width: 80%"
            />
          </el-form-item>
          <el-form-item label="登录加密串">
            <el-input
              v-model="scopeData.moneyHKD"
              style="width: 80%"
            />
          </el-form-item>
          <el-form-item label="充值加密串">
            <el-input
              v-model="scopeData.moneyHKD"
              style="width: 80%"
            />
          </el-form-item>
          <el-form-item label="获取角色加密串">
            <el-input
              v-model="scopeData.moneyHKD"
              style="width: 80%"
            />
          </el-form-item>
          <el-form-item label="所属地区">
            <el-select
              v-model="serviceValue"
              placeholder="所属地区"
              style="width: 130px"
            >
              <el-option
                v-for="item in gamePlatform"
                :key="item.id"
                :label="item.gamename"
                :value="item.gameplatform"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="是否推荐">
            <el-radio v-model="scopeData.show" label="1">是</el-radio>
            <el-radio v-model="scopeData.show" label="2">否</el-radio>
          </el-form-item>
          <el-form-item label="是否热门">
            <el-radio v-model="scopeData.show" label="1">是</el-radio>
            <el-radio v-model="scopeData.show" label="2">否</el-radio>
          </el-form-item>
          <el-form-item label="是否新服">
            <el-radio v-model="scopeData.show" label="1">是</el-radio>
            <el-radio v-model="scopeData.show" label="2">否</el-radio>
          </el-form-item>
          <el-form-item label="平台是否展示">
            <el-radio v-model="scopeData.show" label="1">是</el-radio>
            <el-radio v-model="scopeData.show" label="2">否</el-radio>
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
      >
        <el-table-column type="selection" width="60" />
        <el-table-column align="center" prop="id" label="序号" width="65px" />
        <el-table-column
          v-permission="['admin', 'cusQuestionList:edit']"
          label="操作"
          width="200px"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="changeStatus(scope.row)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="changeStatus(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="gamecode"
          label="更新缓存"
          width="120px"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="success"
              icon="el-icon-refresh"
              @click="changeStatus(scope.row)"
            >更新缓存</el-button>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="servercode"
          label="所属游戏"
          width="120px"
        />
        <el-table-column
          align="center"
          prop="roleid"
          label="服务器名"
          width="100px"
        />
        <el-table-column
          align="center"
          prop="passport"
          label="服务器编码"
          width="120px"
        />
        <el-table-column
          align="center"
          prop="passport"
          label="经营类型"
          width="120px"
        />
        <el-table-column
          align="center"
          prop="packagename"
          label="开服时间"
          width="200px"
        />
        <el-table-column
          align="center"
          prop="type"
          label="充值开关"
          width="100px"
        />
        <el-table-column
          align="center"
          prop="language"
          label="入口开关"
          width="120px"
        />
        <el-table-column
          align="center"
          prop="os"
          label="平台展示"
          width="150px"
        />
        <el-table-column
          align="center"
          prop="os"
          label="充值域名"
          width="150px"
        />
        <el-table-column
          align="center"
          prop="os"
          label="登入域名"
          width="150px"
        />
        <el-table-column
          align="center"
          prop="os"
          label="登录加密串"
          width="150px"
        />
        <el-table-column
          align="center"
          prop="os"
          label="充值加密串"
          width="150px"
        />
        <el-table-column
          align="center"
          prop="os"
          label="获取角色加密串"
          width="150px"
        />
        <el-table-column
          align="center"
          prop="os"
          label="所属地区"
          width="150px"
        />
        <el-table-column
          align="center"
          prop="os"
          label="是否推荐"
          width="150px"
        />
        <el-table-column
          align="center"
          prop="os"
          label="是否热门"
          width="150px"
        />
        <el-table-column
          align="center"
          prop="os"
          label="是否新服"
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
  GetDelStatusData
} from '@/api/cusQuestionList'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'

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
      serverForOpen: '',
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
      fileList: [],
      gamePlatform: [
        { id: 1, gamename: '港澳台', gameplatform: 'ggt' },
        { id: 2, gamename: '新马泰', gameplatform: 'xmt' },
        { id: 3, gamename: '港澳', gameplatform: 'ga' },
        { id: 4, gamename: '台湾', gameplatform: 'tw' },
        { id: 5, gamename: '大陆', gameplatform: 'cn' },
        { id: 6, gamename: '全球', gameplatform: 'all' }
      ],
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
    changeStatus() {
      this.isShowDelg = !this.isShowDelg
    },
    getServiceValue() {
      console.log('1')
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
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
      .el-dialog__headerbtn{
        .el-dialog__close{
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
