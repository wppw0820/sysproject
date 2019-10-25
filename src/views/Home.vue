<template>
  <el-container class="content">
    <!-- 头部 -->
    <el-header class="hd">
      <div class="title">
        <img src="../assets/logo.png" alt />
        <p>源码漏洞扫描系统</p>
      </div>
      <el-button type="success" class="back" v-show="isFlag" @click="goback">返回项目列表</el-button>
      <el-button type="primary" class="logout" @click="exit">退出</el-button> 
    </el-header>
    <!-- 主体部分 -->
    <el-container>
      <!-- main内容区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
	name: '',

	created() {},
	data() {
		return {
     
    }
	},
  computed:{
    isFlag:function(){
      return this.$store.state.isDetailsPage
    }
  },
	methods: {
		exit() {
			//退出登录就要清除sessionStorage中的token 并且跳转登录页面
			window.sessionStorage.clear()
			this.$router.push('/login')
    },
    goback(){
      this.$router.push('list')
      this.$store.commit('setMark',false)
    }
	}
}
</script>

<style lang='less' scoped>
.content {
  height: 100%;
}
.el-header{
  background-color: #0A2438;
}
.el-main {
  background-color: #E1E6F6;
  padding: 4px 10px 10px;
}
.logout {
  position: absolute;
  right: 26px;
  top: 10px;
}
.back{
  position: absolute;
  right: 110px;
  top: 10px;
}
.title {
  display: flex;
  align-items: center;
  img {
    height: 46px;
  }
  p {
    margin-left: 20px;
    color: #fff;
  }
}
</style>
