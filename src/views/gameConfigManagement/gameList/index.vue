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
          <el-form-item label="排序编号">
            <el-input v-model="scopeData.itemCode" style="width: 80%" />
          </el-form-item>
          <el-form-item label="游戏名称">
            <el-input v-model="scopeData.lpoint" style="width: 80%" />
          </el-form-item>
          <el-form-item label="游戏代码">
            <el-input
              v-model="scopeData.moneyHKD"
              style="width: 80%"
            />
          </el-form-item>
          <el-form-item label="游戏类型">
            <el-radio v-model="scopeData.type" label="1">网络页游</el-radio>
            <el-radio v-model="scopeData.type" label="2">网络手游</el-radio>
          </el-form-item>
          <el-form-item label="游戏所属平台">
            <el-select
              v-model="serviceValue"
              placeholder="游戏所属平台"
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
          <el-form-item label="经营类型">
            <template>
              <el-radio-group v-model="scopeData.type">
                <el-radio label="1">自家经营</el-radio>
                <el-radio label="2">联营</el-radio>
                <el-radio label="3">独家代理</el-radio>
              </el-radio-group>
            </template>
          </el-form-item>
          <el-form-item label="是否屏蔽">
            <el-radio v-model="scopeData.show" label="1">开</el-radio>
            <el-radio v-model="scopeData.show" label="2">关</el-radio>
          </el-form-item>
          <el-form-item label="运营状态">
            <el-select
              v-model="serviceValue"
              placeholder="运营状态"
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
          <el-form-item label="游戏兑换比例">
            <el-input
              v-model="scopeData.moneyHKD"
              style="width: 80%"
            />
          </el-form-item>
          <el-form-item label="游戏名称">
            <el-input
              v-model="scopeData.moneyHKD"
              style="width: 80%"
            />
          </el-form-item>
          <el-form-item label="游戏类型(如棋牌、冒险等)">
            <el-input
              v-model="scopeData.moneyHKD"
              style="width: 80%"
            />
          </el-form-item>
          <el-form-item label="游戏收益提成">
            <el-input
              v-model="scopeData.moneyHKD"
              style="width: 80%"
            />
          </el-form-item>
          <el-form-item label="IOS下载地址">
            <el-input
              v-model="scopeData.moneyHKD"
              style="width: 80%"
            />
          </el-form-item>
          <el-form-item label="GooGle下载地址">
            <el-input
              v-model="scopeData.moneyHKD"
              style="width: 80%"
            />
          </el-form-item>
          <el-form-item label="游戏官网">
            <el-input
              v-model="scopeData.moneyHKD"
              style="width: 80%"
            />
          </el-form-item>
          <el-form-item label="fb粉丝页地址">
            <el-input
              v-model="scopeData.moneyHKD"
              style="width: 80%"
            />
          </el-form-item>
          <el-form-item label="手游二维码链接">
            <el-input
              v-model="scopeData.moneyHKD"
              style="width: 80%"
            />
          </el-form-item>
          <el-form-item label="平台手游星级图标">
            <el-select
              v-model="serviceValue"
              placeholder="平台手游星级图标"
              style="width: 180px"
            >
              <el-option
                v-for="item in gamePlatform"
                :key="item.id"
                :label="item.gamename"
                :value="item.gameplatform"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="平台图片">
            <el-upload
              action="https://jsonplaceholder.typicode.com/posts/"
              list-type="picture-card"
              :on-success="handlePreview"
              :on-remove="handleRemove"
              :file-list="fileList"
            >
              <i class="el-icon-plus" />
            </el-upload>
          </el-form-item>
          <el-form-item label="游戏描述">
            <el-input
              v-model="scopeData.moneyHKD"
              style="width: 80%"
            />
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
          label="排序号"
          width="120px"
        />
        <el-table-column
          align="center"
          prop="roleid"
          label="grid"
          width="100px"
        />
        <el-table-column
          align="center"
          prop="passport"
          label="游戏名"
          width="120px"
        />
        <el-table-column
          align="center"
          prop="passport"
          label="游戏代码"
          width="120px"
        />
        <el-table-column
          align="center"
          prop="packagename"
          label="游戏币"
          width="80px"
        />
        <el-table-column
          align="center"
          prop="type"
          label="兑换比例"
          width="100px"
        />
        <el-table-column
          align="center"
          prop="language"
          label="游戏类型"
          width="120px"
        />
        <el-table-column
          align="center"
          prop="os"
          label="经营类型"
          width="150px"
        />
        <el-table-column
          align="center"
          prop="os"
          label="所属平台"
          width="150px"
        />
        <el-table-column
          align="center"
          prop="os"
          label="展示"
          width="150px"
        />
        <el-table-column
          align="center"
          prop="os"
          label="运行状态"
          width="150px"
        />
        <el-table-column
          align="center"
          prop="os"
          label="链接地址"
          width="150px"
        />
        <el-table-column
          align="center"
          prop="os"
          label="图片地址"
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
