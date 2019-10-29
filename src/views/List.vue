<template>
  <div class="table-box">
    <!-- 卡片视图 -->
    <el-card class="box-card" v-loading="loading" element-loading-text="数据加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.5)">
      <!-- 标题 -->
      <h3 class="pro_list"></h3>
      <!-- 表格数据操作 -->
      <el-row>
        <el-col :span="16">
          <div class="gird-content bg-purple">
            <div>
              <el-button type="primary" @click="createPro">
                <img class="create_icon" src="../images/u47.png" alt="">
                <span>创建项目</span>
              </el-button>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="gird-content bg-purple">
            <el-input placeholder="请输入内容" clearable v-model="queryInfo">
              <el-button slot="append" @click="search">搜索</el-button>
            </el-input>
          </div>
        </el-col>
      </el-row>
      <!-- 数据列表 -->
      <el-table :data="tablePageData" style="width:100%;margin-top:10px;" border>
        <el-table-column prop="srcPath" label="项目包名" align="center" width="260px" sortable></el-table-column>
        <el-table-column prop="ltype" label="项目类型" align="center" sortable></el-table-column>
        <el-table-column prop="scannedFiles" label="扫描文件数" align="center" width="120px" sortable></el-table-column>
        <el-table-column prop="execLoc" label="可执行loc" align="center" width="120px" sortable></el-table-column>
        <el-table-column prop="status" label="项目状态" align="center" :formatter="fomatter" sortable></el-table-column>
        <el-table-column prop="uploadTime" label="创建时间" align="center" width="180px" sortable></el-table-column>
        <el-table-column prop="endTime" label="完成时间" align="center" width="180px" sortable></el-table-column>
        <el-table-column prop="detail" label="描述信息" align="center" width="160px" sortable></el-table-column>
        <el-table-column label="操作" align="center" width="180px">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" :disabled="isPrevent1(scope.row)" @click="handleDetails(scope.$index, scope.row)">查看详情</el-button>
            <el-button type="danger" size="mini" :disabled="isPrevent2(scope.row)" @click="handleDel(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页展示由前台操作 -->
      <el-pagination class="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryPro.pagenum" :page-sizes="[10,15,20]" :page-size="queryPro.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>

      <!-- 创建项目对话框 -->
      <el-dialog title="创建项目" :visible.sync="dialogVisible" width="30%" @close="closeDialog" center>
        <!-- 上传文件 -->
        <el-upload ref="upload" class="upload-demo" action="" :auto-upload="false" :on-change="handleChange" :before-upload="beforeUpload" multiple :limit="3" accept=".zip" :show-file-list="false" :on-success="uploadSuccess">
          <el-tooltip class="item" effect="light" placement="top">
            <div slot="content" style="line-height:18px">只能上传.zip格式<br />且不超过100M</div>
            <el-button size="small" type="primary">上传项目源码</el-button>
          </el-tooltip>
        </el-upload>
        <el-input v-model="fileName" class="fileName" readonly></el-input>
        <!-- 表单 -->
        <el-form :model="createProject" ref="addFormRef" label-position="right" label-width="120px">
          <el-form-item label="项目类型" required>
            <el-select placeholder="请选择项目类型" clearable v-model="createProject.ltype" @change="select">
              <el-option :key="index" v-for="(item,index) in proType" :value="item"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item :label="typeVersionName" v-show="flag1" required>
            <el-select placeholder="请选择项目版本" clearable v-model="version">
              <el-option :key="index" v-for="(item,index) in typeVersion" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-tooltip :content="msg" placement="bottom" effect="light">
            <el-form-item :label="typePathName" v-show="flag2" :required="isMust">
              <el-input v-model="typePath"></el-input>
            </el-form-item>
          </el-tooltip>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm">创建项目</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
import { getLists, delPro, createPro } from '@/api/proLists/api.js'
import { Loading } from 'element-ui'
export default {
	data() {
		return {
			loading: true,
			//获取项目列表参数对象
			queryPro: {
				pagenum: 1,
				pagesize: 10
			},
			total: 0,
			// 定义查询信息
			queryInfo: '',
			// 定义对话框打开
			dialogVisible: false,
			// 定义表格总数据
			tableData: [],
			// 定义展示的分页数据
			tablePageData: [],
			// 定义搜索数据集合
			tableSearchData: [],
			// 定义要删除的数据
			delId: [],
			// 定义创建项目信息
			createProject: {
				file: {},
				ltype: '',
				extraInfo: {
					dev: {}
				}
			},
			fileName: '',
			flag1: false,
			flag2: false,
			isMust: false,
			msg: 'aa',
			// 定义项目类型的版本名字
			typeVersionName: '',

			// 定义项目类型版本号
			typeVersion: [],
			version: '',
			// 定义项目类型库路径名字
			typePathName: '',
			// 定义项目类型路径
			typePath: '',
			// 定义项目类型
			proType: ['Java', 'Python', 'JavaScript', 'PHP', 'Visual Studio', 'Make']
		}
	},
	created() {
		this.getAllPro()
	},
	methods: {
		// 定义获取所有项目列表方法
		getAllPro() {
			getLists().then(res => {
				if (res.code !== 0) return this.$message.error('获取数据失败')
				this.tableData = res.data
				// console.log(res.data[0].detail == undefined);
				const obj = {
					detail: '',
					endTime: '',
					execLoc: 0,
					extraInfo: {},
					id: 0,
					ltype: '',
					scannedFiles: 0,
					srcPath: '',
					status: 0,
					uploadTime: ''
				}
				this.tableData.forEach(item => {
					for (let k in obj) {
						if (item[k] == undefined) {
							item[k] = ''
						}
					}
				})
				console.log(this.tableData)
				this.total = res.data.length
				this.getPageData(this.tableData)
			})
		},
		// 定义展示的分页数据方法
		getPageData(data) {
			let pagenum = this.queryPro.pagenum
			let pagesize = this.queryPro.pagesize
			let total = this.total
			let startIndex = (pagenum - 1) * pagesize
			let endIndex = startIndex + pagesize
			setTimeout(() => {
				this.tablePageData = data.slice(startIndex, endIndex)
				this.$nextTick(function() {
					this.loading = false
				})
			}, 500)
		},
		// 页面尺寸发生变化时的处理函数
		handleSizeChange(pagesize) {
			// console.log(pagesize);
			this.queryPro.pagesize = pagesize
			this.search()
		},
		// 当前页发生变化时的处理函数
		handleCurrentChange(pagenum) {
			this.queryPro.pagenum = pagenum
			this.search()			
		},
		// 点击搜索
		search() {
			// detail: "解析问题路径失败"
			// endTime: '2019-10-22 17:27:35'
			// execLoc: 28
			// extraInfo: Object
			// id: 37
			// ltype: 'Java'
			// scannedFiles: 5
			// srcPath: 'jackson-datatype-jdk7-master.zip'
			// status: 4
			// uploadTime: '2019-10-22 17:26:14'
			const searchData = this.queryInfo.trim()
			// console.log(searchData.trim())
			if (searchData == '') {
				this.getAllPro()
			} else if (searchData - 0 == searchData) {
				// 说明输入的是数字则在查找过程中直接只去匹配纯数字的那一列 或者 时间那一列
				const arr = []
				this.tableData.forEach(item => {
					if (
						item.endTime.toString().includes(searchData) ||
						item.uploadTime.toString().includes(searchData) ||
						item.execLoc.toString().includes(searchData) ||
						item.scannedFiles.toString().includes(searchData)
					) {
						arr.push(item)
					}
				})
				// if (this.tableSearchData.length == 0)  this.$message.error('查询不到对应数据')
				this.getPageData(arr)
			} else {
        const arr = []
        const objStatus = { 0: '等待处理', 1: '扫描中', 2: '解析中', 3: '处理失败', 4: '处理成功' }
				this.tableData.forEach(item => {
          item.status = objStatus[item.status] || item.status
					for (let k in item) {
						if (('' + item[k]).includes(searchData)) {
							arr.push(item)
							break
						}
					}
				})
				// if (this.tableSearchData.length == 0)  this.$message.error('查询不到对应数据')
				this.getPageData(arr)
			}
		},
		// 点击创建项目按钮打kai创建对话框
		createPro() {
			this.dialogVisible = true
		},
		//任何使对话框关闭会触发close事件使表单清空
		closeDialog() {
			this.$refs.addFormRef.resetFields()
			this.typePath = ''
			this.version = ''
			this.fileName = ''
			this.createProject.ltype = ''
			this.flag1 = false
			this.flag2 = false
		},
		// 上传文件的change事件
		handleChange(file, fileList) {
			this.createProject.file = {}
			this.fileName = ''
			if (!file) return this.$message.error('上传文件错误')
			const size = file.raw.size / 1024 / 1024 <= 100 // 原始单位是字节 转变厚变成M
			const isZip = file.raw.type == 'application/x-zip-compressed'
			if (!isZip) return this.$message.error('只能上传.zip格式!')
			if (!size) return this.$message.error('上传文件不能超过100M')
			this.createProject.file = file.raw
			this.fileName = file.raw.name
		},
		// 上传之前的处理事件
		beforeUpload(file) {},
		// 文件上传成功时的处理
		uploadSuccess() {},
		// 点击创建按钮创建项目
		submitForm() {
			if (this.flag1 && this.flag2) {
				if (!this.createProject.ltype || !this.fileName || !this.version) {
					return this.$message.warning('请完善表单信息')
				}
			} else if (!this.flag1 && this.flag2) {
				if (!this.createProject.ltype || !this.fileName || !this.typePath) {
					return this.$message.warning('请完善表单信息')
				}
			} else if (!this.flag1 && !this.flag2) {
				if (!this.createProject.ltype || !this.fileName) {
					return this.$message.warning('请完善表单信息')
				}
			}
			let formData = new FormData()
			const type = this.createProject.ltype
			const ext = {}
			if (type == 'Java') {
				ext.jdkVersion = this.version
				ext.cp = this.typePath
			}
			if (type == 'Python') {
				ext.pyVersion = this.version
				ext.pyPath = this.typePath
			}
			if (type == 'PHP') {
				ext.phpVersion = this.version
			}
			if (type == 'Visual Studio') {
				ext.slnFile = this.typePath
			}
			this.createProject.extraInfo.dev = { ...ext }
			let extraInfo = JSON.stringify(this.createProject.extraInfo)
			formData.append('file', this.createProject.file)
			formData.append('ltype', this.createProject.ltype)
			formData.append('extraInfo', extraInfo)
			// 发送请求之前设置开启loading效果 成功之后关闭loading
			let load = Loading.service({
				text: '正在上传中',
				background: 'rgba(0, 0, 0, 0.8)',
				target: '.el-dialog'
			})
			createPro(formData).then(res => {
				load.close()
				if (res.code != 0) return this.$message.error(res.msg)
				if (res.code == 0) this.$message.success('上传成功')
				this.dialogVisible = false
				this.getAllPro()
			})
		},
		// 选择项目类型事件
		select() {
			const type = this.createProject.ltype
			if (type == 'Java') {
				this.typeVersionName = 'JDK版本'
				this.typeVersion = ['1.5', '1.6', '1.7', '1.8', '1.9']
				this.typePathName = 'classpath'
				this.version = '1.8'
				this.isMust = false
				this.msg = './lib/A.jar:./lib/B.jar'
				this.flag1 = true
				this.flag2 = true
			}
			if (type == 'Python') {
				this.typeVersionName = 'Python版本'
				this.typeVersion = ['2', '3']
				this.typePathName = 'Python库路径'
				this.version = '3'
				this.isMust = false
				this.msg = './lib/libA:./lib/libB'
				this.flag1 = true
				this.flag2 = true
			}
			if (type == 'JavaScript') {
				this.typeVersionName = 'js版本'
				this.typeVersion = ['1', '2', '3', '4', '5', '6', '7', '8']
				this.flag1 = false
				this.flag2 = false
			}
			if (type == 'PHP') {
				this.typeVersionName = 'PHP版本'
				this.typeVersion = ['5.3', '5.4', '5.5', '5.6', '7.0', '7.1']
				this.version = '7.0'
				this.flag1 = true
				this.flag2 = false
			}
			if (type == 'Visual Studio') {
				this.typePathName = '解决方案文件'
				this.isMust = true
				this.flag1 = false
        this.flag2 = true
        this.msg = './test.sln'
			}
			if (type == 'Make') {
				this.flag1 = false
				this.flag2 = false
			}
		},
		// 删除项目
		async handleDel(index, row) {
			let res = await this.$confirm('确定删除项目?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).catch(() => {
				//catch方法表示此操作失败或者取消的处理函数
				this.$message({
					type: 'info',
					message: '已取消删除'
				})
			})
			if (res == 'confirm') {
				//confirm确认删除
				delPro(row.id).then(res => {
					if (res.code == 0) {
						this.getAllPro()
					}
				})
			}
		},
		// 格式化状态值
		fomatter(row, column) {
			let objStatus = { 0: '等待处理', 1: '扫描中', 2: '解析中', 3: '处理失败', 4: '处理成功' }
			return objStatus[row.status] || row.status
		},
		// 查看详情
		handleDetails(index, row) {
			this.$router.push({
				name: 'details',
				query: {
					id: row.id,
					srcPath: row.srcPath,
					ltype: row.ltype
				}
			})
		}
	},
	watch: {
		queryInfo: function(newVal, oldVal) {
			if (newVal == '') {
				this.getAllPro()
			}
		}
	},
	computed: {
		isPrevent1: function() {
			return function(row) {
				if (row.status == 4) {
					return false
				} else {
					return true
				}
			}
		},
		isPrevent2: function() {
			return function(row) {
				if (row.status == 1 || row.status == 2) {
					return true
				} else {
					return false
				}
			}
		}
	}
}
</script>
<style lang="less" scoped>
/deep/.el-icon-loading {
	font-size: 24px !important;
}
/deep/.el-loading-text {
	font-size: 14px !important;
}
.table-box {
	width: 100%;
	height: 100%;
	overflow: hidden;
	position: relative;
	.box-card {
		margin: 16px auto;
		width: 80%;
		height: 100%;
		.create_icon,
		.del_icon {
			vertical-align: text-top;
			margin-right: 6px;
		}
		.pro_list {
			text-align: center;
			margin: 0;
		}
	}
}
.upload-demo,
/deep/.fileName {
	display: inline-block !important;
	margin-left: 4px;
}
.fileName {
	width: 69%;
	margin-left: 34px;
	margin-bottom: 20px;
}
/deep/.el-form-item__label {
	margin-right: 24px !important;
}
.el-dialog__body {
	.el-select {
		width: 89%;
	}
	.el-form-item__content .el-input {
		width: 89%;
	}
}
/deep/.el-form-item__error {
	left: 24px !important;
}
.pagination {
	margin-top: 20px;
	text-align: right;
}
.el-button--mini {
	padding: 8px 14px;
}
.el-table--border::after,
.el-table--group::after {
	width: 0;
}
/deep/ .el-table td,
.el-table th {
	padding: 8px 0;
}
/deep/ .el-table tbody tr:hover > td {
	background-color: transparent !important;
}
</style>
