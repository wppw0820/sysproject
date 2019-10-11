<template>
  <div class="table-box">
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 标题 -->
      <h3 class="pro_list">项目列表</h3>
      <!-- 表格数据操作 -->
      <el-row>
        <el-col :span="16">
          <div class="gird-content bg-purple">
            <div>
              <el-button type="primary" @click="createPro">
                <img class="create_icon" src="../images/u47.png" alt="">
                <span>创建项目</span>
              </el-button>
              <el-button type="info">
                <img class="del_icon" src="../images/u48.png" alt="">
                <span>删除项目</span>
              </el-button>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="gird-content bg-purple">
            <el-input placeholder="请输入内容" clearable v-model="queryInfo">
              <el-button slot="append">搜索</el-button>
            </el-input>
          </div>
        </el-col>
      </el-row>
      <!-- 数据列表 -->
      <el-table :data="tableData" border style="width:100%;margin-top:10px;">
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column type="index" align="center"></el-table-column>
        <el-table-column prop="projectpath" label="项目路径" align="center"></el-table-column>
        <el-table-column prop="projecttype" label="项目类型" align="center"></el-table-column>
        <el-table-column prop="projectfiles" label="扫描文件数" align="center"></el-table-column>
        <el-table-column prop="executable" label="可执行loc" align="center"></el-table-column>
        <el-table-column prop="createuser" label="创建用户" align="center"></el-table-column>
        <el-table-column prop="projectstate" label="项目状态" align="center"></el-table-column>
        <el-table-column prop="createtime" label="创建时间" align="center"></el-table-column>
        <el-table-column prop="finishtime" label="完成时间" align="center"></el-table-column>
        <el-table-column prop="desinfo" label="描述信息" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-link type="primary" :underline="false">查看详情</el-link>
          </template>
        </el-table-column>
      </el-table>
      <!-- 创建项目对话框 -->
      <el-dialog title="创建项目" :visible.sync="dialogVisible" width="30%" @close="closeDialog" center>
        <!-- 上传文件 -->
        <el-upload class="upload-demo" action="http://11.0.0.150:6086/server/index.php?g=Web&c=Mock&o=simple&projectID=2&uri=/tinker/project" :auto-upload="false" :on-change="handleChange" multiple :limit="1" accept=".zip">
          <el-button size="small" type="primary">上传项目源代码</el-button>
        </el-upload>
        <el-input v-model="createProject.filePath" class="filePath"></el-input>
        <!-- 表单 -->
        <el-form :model="createProject" ref="addFormRef" status-icon label-position="right" label-width="100px">
          <el-form-item label="项目类型" prop="itype">
            <el-select placeholder="请选择项目类型" clearable v-model="createProject.itype" @change="select">
              <el-option :key="index" v-for="(item,index) in proType" :value="item"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item :label="typeVersionName" v-show="flag1">
            <el-select placeholder="请选择项目版本" clearable v-model="version" @change="select">
              <el-option :key="index" v-for="(item,index) in typeVersion" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="typePathName" v-show="flag2">
            <el-input v-model="typePath"></el-input>
          </el-form-item>
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
export default {
	data() {
		return {
			// 定义查询信息
			queryInfo: '',
			// 定义对话框打开
			dialogVisible: false,
			tableData: [
				{
					projectpath: ' ',
					projecttype: ' ',
					projectfiles: ' ',
					executable: ' ',
					createuser: ' ',
					projectstate: ' ',
					createtime: ' ',
					finishtime: ' ',
					desinfo: ' ',
					operation: '查看详情'
				},
				{
					projectpath: ' ',
					projecttype: ' ',
					projectfiles: ' ',
					executable: ' ',
					createuser: ' ',
					projectstate: ' ',
					createtime: ' ',
					finishtime: ' ',
					desinfo: ' ',
					operation: '查看详情'
				}
			],
			// 定义创建项目信息
			createProject: {
				filePath: '',
				itype: '',
				extraInfo: {
					dev: {}
				}
      },
      flag1:false,
      flag2:false,
			// 定义项目类型的版本名字
			typeVersionName: '',
			// typeVersionName:{
			//   java:'JDK版本',
			//   python:'Python版本',
			//   js:'js版本',
			//   php:'php版本'
			// },
			// 定义项目类型版本号
			typeVersion: [],
			version: '',
			// 定义项目类型库路径名字
			typePathName: '',
			// 定义项目类型路径
			typePath: '',
			// 定义项目类型
			proType: ['java', 'python', 'js', 'php', 'vs']
		}
	},
	methods:{
		// 点击创建项目按钮打kai创建对话框
		createPro() {
			this.dialogVisible = true
		},
		//任何使对话框关闭会触发close事件使表单清空
		closeDialog() {
      this.$refs.addFormRef.resetFields()
      this.flag1 = false
      this.flag2 = false
		},
		// 上传文件的change事件
		handleChange(event) {},
		// 点击创建按钮创建项目
		submitForm() {
			console.log(1)
		},
		// 选择项目类型事件
		select() {
			const type = this.createProject.itype
			if (type == 'java') {
				this.typeVersionName = 'JDK版本'
				this.typeVersion = [
					'1.0',
					'1.1',
					'1.2',
					'1.3',
					'1.4',
					'1.5',
					'1.6',
					'1.7',
					'1.8',
					'9.0',
					'10',
					'11'
				]
        this.typePathName = 'classpath'
        this.flag1 = true
        this.flag2 = true
			}
			if (type == 'python') {
				this.typeVersionName = 'Python版本'
				this.typeVersion = ['1.0', '2.0', '3.0']
        this.typePathName = 'python库路径'
        this.flag1 = true
        this.flag2 = true
			}
			if (type == 'js') {
				this.typeVersionName = 'js版本'
				this.typeVersion = ['1', '2', '3', '4', '5', '6', '7', '8']
        this.typePathName = 'js库路径'
        this.flag1 = true
        this.flag2 = true
			}
			if (type == 'php') {
				this.typeVersionName = 'php版本'
				this.typeVersion = ['5.2', '5.3', '5.4', '5.5', '5.6']
        this.typePathName = 'php库路径'
        this.flag1 = true
        this.flag2 = true
			}
			if (type == 'vs') {
        this.typePathName = '解决方案文件'
        this.flag1 = false
        this.flag2 = true
			}
		}
	}
}
</script>
<style lang="less" scoped>
.table-box {
	width: 100%;
	height: 100%;
	overflow: hidden;
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
		}
	}
}
.upload-demo,
/deep/.filePath {
  display: inline-block !important;
  margin-left: 12px;
	margin-bottom: 20px;
}
.filePath {
	width: 60%;
}
.el-dialog__body{
  .el-select{
    width: 89%;
  }
  .el-form-item__content .el-input{
    width: 89%;
  }
}
</style>
