<template>
  <div class="serviceEdit">
    <div class="maker">
      <el-button
        type="success"
        icon="el-icon-back"
        circle
        @click="handleBack(data.id)"
      />
      <div class="questionC">
        <template>
          <el-select v-model="serviceValue" placeholder="问题处理状态">
            <el-option
              v-for="item in servicePeople"
              :key="item.id"
              :label="item.questionType"
              :value="item.questionNum"
            />
          </el-select>
        </template>
      </div>
    </div>
    <!-- 视频 -->
    <div class="playVideo">
      <el-dialog
        width="550px"
        top="5vh"
        :visible.sync="isPlayVideo"
        @close="closeVideo"
      >
        <video
          :src="prviewVideo"
          controls
          autoplay
          class="video"
          width="100%"
          height="100%"
        />
      </el-dialog>
    </div>
    <div class="editorCon">
      <div class="editor_left">
        <el-card class="userInfoBox">
          <div slot="header" class="boxTitle">
            <span>客诉内容:</span>
          </div>
          <div class="contextBox">
            <!-- 客诉内容 -->
            <div class="cusContent">
              <el-card class="cus_box" shadow="always">
                <div slot="header" class="cusContent-title">
                  <h3>客诉内容:</h3>
                </div>
                <div class="cusContent-content">{{ data.content }}</div>
              </el-card>
            </div>
            <!-- 用户信息 -->
            <div class="userinfoContent">
              <el-card class="dataLeft">
                <div class="gamecode">游戏: {{ data.gamecode }}</div>
                <div class="id">id: {{ data.id }}</div>
                <div class="os">系统: {{ data.os }}</div>
                <div class="deviceInformation">
                  设备信息: {{ data.deviceInformation }}
                </div>
                <div class="servercode">伺服器: {{ data.servercode }}</div>
                <div class="typeinname">
                  问题类型: {{ data.qusTypeList.typeinname }}
                </div>
                <div class="language">语言: {{ data.language }}</div>
                <div class="ansStatus">回复状态: {{ data.ansStatus }}</div>
                <div class="passport">passport: {{ data.passport }}</div>
                <div class="createtime">创建时间: {{ data.createtime }}</div>
                <div class="ipaddress">Ip: {{ data.ipaddress }}</div>
                <div class="country">国家: {{ data.country }}</div>
                <div class="passport">角色ID: {{ data.roleid }}</div>
                <div class="createtime">包名: {{ data.packagename }}</div>
                <div class="ipaddress">设备系统: {{ data.deviceVersion }}</div>
                <div class="country">删除状态: {{ data.delStatus }}</div>
              </el-card>
              <div class="photoBox">
                <div v-if="data.imageArray" class="showPhoto">
                  <el-image
                    v-for="item of data.imageArray"
                    :key="item.key"
                    style="width: 180px; height: 250px"
                    :src="item"
                    :preview-src-list="data.imageArray"
                  />
                </div>
                <div v-if="data.aplyGetVideo" class="showVideo">
                  <video
                    v-for="item of data.aplyGetVideo"
                    :key="item.key"
                    :src="item"
                    style="width: 180px; height: 250px; margin-left: 10px"
                    @click="prviewVideos(item)"
                  />
                </div>
              </div>
            </div>
            <!-- 用户上传的图片/视频 -->
          </div>
        </el-card>
      </div>
      <div class="editor_right">
        <!-- 客诉回复框 -->
        <div class="sockTip">
          <div class="serviceMune">
            <el-menu
              :default-active="activeIndex"
              class="el-menu-demo"
              mode="horizontal"
            >
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
          <div
            id="chartContent"
            ref="chartContent"
            v-loading="loading"
            class="chartContent"
          >
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
          <!-- 客诉回复按钮 -->
          <div class="chatting-input">
            <el-input
              v-model="inputContent"
              class="inpSendContent"
              type="textarea"
              autosize
              placeholder="回复"
              style="padding-left: 0 height:50%"
              maxlength="300"
              show-word-limit
            />
            <el-button
              v-permission="['admin', 'cusQuestionList:add']"
              type="primary"
              @click="send(data.id)"
            >发送</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { GetContent, delCache, replay } from '@/api/cusQuestionList'
import { parseTime } from '@/utils/index'
import { crud } from '@crud/crud'
export default {
  name: 'ServicerEdit',
  data() {
    return {
      isPlayVideo: false,
      loading: true,
      data: {
        id: null,
        gamecode: null,
        servercode: null,
        roleid: null,
        passport: null,
        packagename: null,
        content: null,
        imageArray: null,
        aplyGetVideo: null,
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
      getVideo: [],
      prviewVideo: [],
      activeIndex: '1',
      inputContent: '',
      isShow: false,
      msgs: [],
      servicePeople: [
        { id: 1, questionType: '已完结', questionNum: 'Yui' },
        { id: 2, questionType: '待处理', questionNum: 'Rae' },
        { id: 3, questionType: '未处理', questionNum: 'Elaine' }
      ],
      serviceValue: ''
    }
  },
  created() {
    crud.loading = true
    this.data = this.$route.query.data
    this.getContent(this.data.id)
    console.log(this.data)
  },
  methods: {
    // 预览视屏
    prviewVideos(data) {
      this.isPlayVideo = true
      this.prviewVideo = data
    },
    // 关闭视频
    closeVideo() {
      var closeVideo = document.querySelector('.video')
      closeVideo.pause()
    },
    // 获取用户回复内容
    getContent(id) {
      GetContent(id).then((result) => {
        this.loading = false
        for (let j = 0; j < result.length; j++) {
          const indexs = j
          result[indexs].createtime = parseTime(result[indexs].createtime)
          if (result[indexs].type === '1') {
            result[indexs].type = true
          } else if (result[indexs].type === '2') {
            result[indexs].type = false
          }
        }

        this.$nextTick(() => {
          this.$refs.chartContent.scrollTop = this.$refs.chartContent.scrollHeight
        })
        this.msgs = result
      })
    },
    send(id) {
      this.$refs.chartContent.scrollTop = this.$refs.chartContent.scrollHeight
      if (this.inputContent === '') {
        this.$notify({
          message: '请输入内容',
          type: 'warning'
        })
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
                this.$nextTick(() => {
                  this.$refs.chartContent.scrollTop = this.$refs.chartContent.scrollHeight
                })
              })
            })
            this.inputContent = ''
          })
          .catch((err) => {
            console.log(err)
          })
      }
    },
    handleBack(id) {
      // 返回上一层 发送数据
      delCache(id).then((res) => {
        this.getMsg = ''
      })
      this.$router.go(-1)
    },
    postData: function() {
      console.log('data')
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
div {
  margin-top: 5px;
}
.el-image {
  margin-left: 10px;
  margin-bottom: 10px;
}
h3 {
  margin-top: 5px;
  margin-bottom: 0;
}

.serviceEdit {
  width: 100%;
  height: 100%;
  position: relative;
  .maker {
    width: 100%;
    height: 40px;
    padding: 0 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .editorCon {
    position: relative;
    display: flex;
    justify-content: space-around;
    .editor_left {
      position: relative;
      max-width: 51%;
      .userInfoBox {
        margin-left: 15px;
        // margin: auto;
        .contextBox {
          display: flex;
          justify-content: space-between;
          flex-direction: column;
          flex-wrap: wrap;
          .userinfoContent {
            display: flex;
            align-items: center;
            justify-content: space-around;

            .photoBox {
              max-width: 380px;
              overflow: auto;
              display: flex;
              .showPhoto {
                max-width: 380px;
                position: relative;
                display: flex;
                flex-shrink: 0;
                /deep/ .el-image {
                  flex-shrink: 0;
                  margin-left: 10px;
                  margin-bottom: 10px;
                }
                ::-webkit-scrollbar {
                  width: 12px;
                }
              }
              .showVideo {
                max-width: 380px;
                position: relative;
                display: flex;
                flex-shrink: 0;
                video {
                  flex-shrink: 0;
                  margin-left: 10px;
                  margin-bottom: 10px;
                }
              }
            }
          }
          .photoCard {
            .el-card {
              border-radius: 4px;
              border: 1px solid #e6ebf5;
              background-color: #fff;
              overflow: auto;
              color: #303133;
              -webkit-transition: 0.3s;
              transition: 0.3s;
            }
            .showPhoto {
              max-width: 380px;
              height: 260px;
            }
          }
          .cusContent {
            border: none;
            .cusContent-content {
              max-height: 258px;
              overflow: auto;
            }
          }
        }
      }
    }
    .editor_right {
      position: relative;
      flex: 1;
      padding: 0 20px;
      .sockTip {
        width: 100%;
        margin-bottom: 12px;
        position: relative;
        height: 560px;
        .chartContent {
          width: 100%;
          height: 80%;
          overflow-y: auto;
          border: 1px solid #ccc;
          border-radius: 5px;
          background: rgba(0, 0, 0, 0.1);
          overflow: auto;
          background-image: linear-gradient(
              45deg,
              aliceblue 25%,
              transparent 25%,
              transparent 75%,
              aliceblue 75%,
              aliceblue
            ),
            linear-gradient(
              45deg,
              aliceblue 25%,
              transparent 25%,
              transparent 75%,
              aliceblue 75%,
              aliceblue
            );
          background-size: 4px 4px;
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
                max-width: 300px;
                word-wrap: break-word;
                word-break: break-all;
                margin-left: 10px;
                margin-top: 5px;
                background-color: #a6d4f2;
                padding: 10px 10px;
                border-radius: 10px;
                font-size: 16px;
                position: relative;
                &:before {
                  content: "";
                  position: absolute;
                  top: 17px;
                  left: -5px;
                  width: 10px;
                  height: 10px;
                  margin-top: -10px;
                  background: inherit;
                  /*自动继承父元素的背景*/
                  transform: rotate(45deg);
                }
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
                max-width: 300px;
                word-wrap: break-word;
                word-break: break-all;
                margin-right: 10px;
                margin-top: 5px;
                color: #fff;
                background-color: green;
                padding: 10px 10px;
                border-radius: 10px;
                font-size: 16px;
                font-family: "Courier New", Courier, monospace;
                position: relative;
                &:before {
                  content: "";
                  position: absolute;
                  top: 16px;
                  right: -3px;
                  width: 13px;
                  height: 13px;
                  margin-top: -10px;
                  background: inherit;
                  /*自动继承父元素的背景*/
                  transform: rotate(45deg);
                }
              }
              .right-start {
                padding-right: 20px;
              }
            }
          }
        }
        .chatting-input {
          display: flex;
          height: 28%;
          width: 100%;
          position: relative;
          bottom: 0;
          background: #fff;
          border: 1px solid #c0c4cc;
          border-radius: 3px;
          .el-textarea {
            flex: 1;
            padding-left: 0;
            height: 100%;
            font-size: 18px;
            margin-top: 0px;

            /deep/ .el-textarea__inner {
              display: block;
              resize: vertical;
              padding: 5px 8px;
              line-height: 1.5;
              -webkit-box-sizing: border-box;
              box-sizing: border-box;
              width: 100%;
              font-size: inherit;
              color: #606266;
              background-color: #fff;
              background-image: none;
              border: none;
              border-radius: 4px;
              -webkit-transition: border-color 0.2s
                cubic-bezier(0.645, 0.045, 0.355, 1);
              transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
              overflow-y: auto;
              height: 75% !important;
            }
            &::-webkit-scrollbar {
              width: 5px;
              border-radius: 5px;
            }
            /deep/.el-input__count {
              color: #909399;
              background: #fff;
              position: absolute;
              font-size: 12px;
              bottom: 5px;
              right: 95px;
            }
          }
          button {
            width: 90px;
            height: 40px;
            position: absolute;
            right: 0;
            bottom: 0;
            line-height: 8px;
            background-color: #2196f3;
            color: #fff;
            font-size: 18px;
          }
        }
      }
    }
  }
}

@media screen and (max-width: 486px) {
  .serviceEdit {
    width: 100%;
    height: 100%;
    position: relative;
    .maker {
      width: 100%;
      height: 40px;
      padding: 0 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .editorCon {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      .editor_left {
        position: relative;
        max-width: 100%;
        .userInfoBox {
          margin-left: 15px;
          // margin: auto;
          .contextBox {
            display: flex;
            justify-content: space-between;
            flex-direction: column;
            flex-wrap: wrap;
            .userinfoContent {
              display: flex;
              align-items: center;
              justify-content: space-around;

              .photoBox {
                max-width: 380px;
                overflow: auto;
                display: flex;
                .showPhoto {
                  max-width: 380px;
                  position: relative;
                  display: flex;
                  flex-shrink: 0;
                  /deep/ .el-image {
                    flex-shrink: 0;
                    margin-left: 10px;
                    margin-bottom: 10px;
                  }
                  ::-webkit-scrollbar {
                    width: 12px;
                  }
                }
                .showVideo {
                  max-width: 380px;
                  position: relative;
                  display: flex;
                  flex-shrink: 0;
                  video {
                    flex-shrink: 0;
                    margin-left: 10px;
                    margin-bottom: 10px;
                  }
                }
              }
            }
            .photoCard {
              .el-card {
                border-radius: 4px;
                border: 1px solid #e6ebf5;
                background-color: #fff;
                overflow: auto;
                color: #303133;
                -webkit-transition: 0.3s;
                transition: 0.3s;
              }
              .showPhoto {
                max-width: 380px;
                height: 260px;
              }
            }
            .cusContent {
              border: none;
              .cusContent-content {
                max-height: 258px;
                overflow: auto;
              }
            }
          }
        }
      }
      .editor_right {
        position: relative;
        flex: 1;
        padding: 0 20px;
        margin-bottom: 100px;
        .sockTip {
          width: 100%;
          margin-bottom: 12px;
          position: relative;
          height: 560px;
          .chartContent {
            width: 100%;
            height: 80%;
            overflow-y: auto;
            border: 1px solid #ccc;
            border-radius: 5px;
            background: rgba(0, 0, 0, 0.1);
            overflow: auto;
            background-image: linear-gradient(
                45deg,
                aliceblue 25%,
                transparent 25%,
                transparent 75%,
                aliceblue 75%,
                aliceblue
              ),
              linear-gradient(
                45deg,
                aliceblue 25%,
                transparent 25%,
                transparent 75%,
                aliceblue 75%,
                aliceblue
              );
            background-size: 4px 4px;
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
                  max-width: 300px;
                  word-wrap: break-word;
                  word-break: break-all;
                  margin-left: 10px;
                  margin-top: 5px;
                  background-color: #a6d4f2;
                  padding: 10px 10px;
                  border-radius: 10px;
                  font-size: 16px;
                  position: relative;
                  &:before {
                    content: "";
                    position: absolute;
                    top: 17px;
                    left: -5px;
                    width: 10px;
                    height: 10px;
                    margin-top: -10px;
                    background: inherit;
                    /*自动继承父元素的背景*/
                    transform: rotate(45deg);
                  }
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
                  max-width: 300px;
                  word-wrap: break-word;
                  word-break: break-all;
                  margin-right: 10px;
                  margin-top: 5px;
                  color: #fff;
                  background-color: green;
                  padding: 10px 10px;
                  border-radius: 10px;
                  font-size: 16px;
                  font-family: "Courier New", Courier, monospace;
                  position: relative;
                  &:before {
                    content: "";
                    position: absolute;
                    top: 16px;
                    right: -3px;
                    width: 13px;
                    height: 13px;
                    margin-top: -10px;
                    background: inherit;
                    /*自动继承父元素的背景*/
                    transform: rotate(45deg);
                  }
                }
                .right-start {
                  padding-right: 20px;
                }
              }
            }
          }
          .chatting-input {
            display: flex;
            height: 28%;
            width: 100%;
            position: relative;
            bottom: 0;
            background: #fff;
            border: 1px solid #c0c4cc;
            border-radius: 3px;
            .el-textarea {
              flex: 1;
              padding-left: 0;
              height: 100%;
              font-size: 18px;
              margin-top: 0px;

              /deep/ .el-textarea__inner {
                display: block;
                resize: vertical;
                padding: 5px 8px;
                line-height: 1.5;
                -webkit-box-sizing: border-box;
                box-sizing: border-box;
                width: 100%;
                font-size: inherit;
                color: #606266;
                background-color: #fff;
                background-image: none;
                border: none;
                border-radius: 4px;
                -webkit-transition: border-color 0.2s
                  cubic-bezier(0.645, 0.045, 0.355, 1);
                transition: border-color 0.2s
                  cubic-bezier(0.645, 0.045, 0.355, 1);
                overflow-y: auto;
                height: 75% !important;
              }
              &::-webkit-scrollbar {
                width: 5px;
                border-radius: 5px;
              }
              /deep/.el-input__count {
                color: #909399;
                background: #fff;
                position: absolute;
                font-size: 12px;
                bottom: 5px;
                right: 95px;
              }
            }
            button {
              width: 90px;
              height: 40px;
              position: absolute;
              right: 0;
              bottom: 0;
              line-height: 8px;
              background-color: #2196f3;
              color: #fff;
              font-size: 18px;
            }
          }
        }
      }
    }
  }
}
</style>
