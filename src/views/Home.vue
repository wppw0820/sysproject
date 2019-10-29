<template>
  <el-container class="content">
    <!-- 头部 -->
    <el-header class="hd">
      <div class="title">
        <img src="../images/logo1.gif" alt />
        <p @click="jump">源码漏洞扫描系统</p>
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
		return {}
	},
	computed: {
		isFlag: function() {
			return this.$store.state.isDetailsPage
		}
	},
	methods: {
		async exit() {
			let res = await this.$confirm('确定退出系统？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).catch(() => {
				//catch方法表示此操作失败或者取消的处理函数
				
			})
			if (res == 'confirm') {
				//confirm确认删除
				//退出登录就要清除sessionStorage中的token 并且跳转登录页面
				window.sessionStorage.clear()
				this.$router.push('/login')
			}
		},
		goback() {
			this.$router.push('list')
			this.$store.commit('setMark', false)
    },
    jump(){
      this.$router.push('/list')
      this.$store.commit('setMark', false)
    }
	}
}
</script>

<style lang='less' scoped>
.content {
	height: 100%;
}
.el-header {
	background-color: #0a2438;
	height: 44px !important;
	// display: flex;
}
.el-main {
	background-color: #e1e6f6;
	padding: 4px 10px 10px;
}
.logout {
	position: absolute;
	right: 20px;
	top: 6px;
	padding: 8px 10px;
}
.back {
	position: absolute;
	right: 90px;
	top: 6px;
	padding: 8px 10px;
}
.title {
  height: 100%;
	display: flex;
	align-items: center;
	img {
    height: 36px;
    border-radius: 50%;
	}
	p {
		margin-left: 20px;
		margin-top: 8px;
		margin-bottom: 8px;
    color: #fff;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
	}
}
</style>
