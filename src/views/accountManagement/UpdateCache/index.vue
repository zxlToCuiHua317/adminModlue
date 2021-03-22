<template>
  <div class="changePassWord">
    <div class="change_title">刷新用户账号缓存</div>
    <div class="change_box">
      <div class="userId">
        <div class="userid_left">要刷新缓存的账号ID:</div>
        <div class="userid_right">
          <el-input
            v-model="passport"
            clearable
            placeholder="要刷新缓存的账号ID"
            style="width: 200px"
            class="filter-item"
          />
        </div>
      </div>
      <div class="key_md">
        <div class="key_md_left">验证密钥:</div>
        <div class="key_md_right">
          <el-input
            v-model="key_md"
            clearable
            placeholder="验证密钥"
            style="width: 200px"
            class="filter-item"
          />
        </div>
      </div>
      <div class="suer">
        <div class="suer_left" />
        <div class="suer_right">
          <el-button type="success" style="width:100px" @click="updataCache()">提交</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      passport: null,
      key_md: null
    }
  },
  methods: {
    updataCache: function() {
      console.log(this.passport, this.key_md)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.changePassWord {
  width: 90%;
  background: #f9f9f9;
  margin: 50px auto;
  border-radius: 15px 15px 0 0;
  .change_title {
    width: 100%;
    height: 50px;
    line-height: 50px;
    text-align: center;
    background: #f4f4f4;
    border-radius: 15px 15px 0 0;
  }
  .change_box {
    width: 100%;
    padding: 0 10px;
    margin-top: 15px;
    .userId {
      width: 100%;
      height: 60px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border: 1px solid #ccc;
      border-bottom: none;
      .userid_left {
        flex: 1;
        height: 60px;
        line-height: 60px;
        text-align: right;
        border-right: 1px solid #ccc;
        padding-right: 10px;
      }
      .userid_right {
        flex: 1;
        display: inline-block;
        padding-left: 10px;
      }
    }

    .key_md {
      width: 100%;
      height: 60px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border: 1px solid #ccc;

      .key_md_left {
        flex: 1;
        height: 60px;
        line-height: 60px;
        text-align: right;
        border-right: 1px solid #ccc;
        padding-right: 10px;
      }
      .key_md_right {
        flex: 1;
        display: inline-block;
        padding-left: 10px;
      }
    }
    .suer {
      width: 100%;
      height: 60px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border: 1px solid #ccc;
      border-top: none;

      .suer_left {
        flex: 1;
        height: 60px;
        line-height: 60px;
        text-align: right;
        border-right: 1px solid #ccc;
        margin: 0 10px;
      }
      .suer_right {
        flex: 1;
        display: inline-block;

      }
    }
  }
}

@media screen and (max-width:486px){
  .changePassWord {
  width: 90%;
  background: #f9f9f9;
  margin: 50px auto;
  border-radius: 15px 15px 0 0;
  .change_title {
    width: 100%;
    height: 50px;
    line-height: 50px;
    text-align: center;
    background: #f4f4f4;
    border-radius: 15px 15px 0 0;
  }
  .change_box {
    width: 100%;
    padding: 0 10px;
    margin-top: 15px;
    .userId {
      width: 100%;
      height: 60px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border: 1px solid #ccc;
      border-bottom: none;
      .userid_left {
        flex: 1;
        height: 60px;
        line-height: 60px;
        text-align: right;
        border-right: 1px solid #ccc;
        padding-right: 10px;
        display: none;
      }
      .userid_right {
        flex: 1;
        display: inline-block;
        padding-left: 10px;
      }
    }

    .key_md {
      width: 100%;
      height: 60px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border: 1px solid #ccc;

      .key_md_left {
        flex: 1;
        height: 60px;
        line-height: 60px;
        text-align: right;
        border-right: 1px solid #ccc;
        padding-right: 10px;
        display: none;
      }
      .key_md_right {
        flex: 1;
        display: inline-block;
        padding-left: 10px;
      }
    }
    .suer {
      width: 100%;
      height: 60px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border: 1px solid #ccc;
      border-top: none;

      .suer_left {
        flex: 1;
        height: 60px;
        line-height: 60px;
        text-align: right;
        border-right: 1px solid #ccc;
        margin: 0 10px;
        display: none;
      }
      .suer_right {
        flex: 1;
        display: inline-block;
        text-align: center;
      }
    }
  }
}
}
</style>
