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
              <el-button type="info" @click="del">
                <img class="del_icon" src="../images/u48.png" alt="">
                <span>删除项目</span>
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
      <el-table 
      :data="tablePageData"
      @selection-change="handleSelectionChange" 
      border 
      style="width:100%;margin-top:10px;">
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column type="index" align="center"></el-table-column>
        <el-table-column prop="srcPath" label="项目路径" align="center"></el-table-column>
        <el-table-column prop="ltype" label="项目类型" align="center"></el-table-column>
        <el-table-column prop="scannedFiles" label="扫描文件数" align="center"></el-table-column>
        <el-table-column prop="execLoc" label="可执行loc" align="center"></el-table-column>
        <el-table-column prop="createUser" label="创建用户" align="center"></el-table-column>
        <el-table-column prop="status" label="项目状态" align="center"></el-table-column>
        <el-table-column prop="uploadTime" label="创建时间" align="center" width="160px"></el-table-column>
        <el-table-column prop="endTime" label="完成时间" align="center" width="160px"></el-table-column>
        <el-table-column prop="desInfo" label="描述信息" align="center" width="160px"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-link type="primary" :underline="false" @click="handleDetails(scope.$index, scope.row)">查看详情</el-link>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页展示由前台操作 -->
      <el-pagination 
      class="pagination" 
      @size-change="handleSizeChange" 
      @current-change="handleCurrentChange" 
      :current-page="queryPro.pagenum" 
      :page-sizes="[3, 5, 10]" 
      :page-size="queryPro.pagesize" 
      layout="total, sizes, prev, pager, next, jumper" 
      :total="total"
      ></el-pagination>
      <!-- 创建项目对话框 -->
      <el-dialog title="创建项目" :visible.sync="dialogVisible" width="30%" @close="closeDialog" center>
        <!-- 上传文件 -->
        <el-upload ref="upload" class="upload-demo" action="http://11.0.0.150:6086/server/index.php?g=Web&c=Mock&o=simple&projectID=2&uri=/tinker/project" :auto-upload="false" :on-change="handleChange" multiple :limit="1" accept=".zip" :show-file-list="false" webkitdirectory>
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
import { getLists, delPro, createPro } from '@/api/proLists/api.js'
export default {
	data() {
		return {
			//获取项目列表参数对象
			queryPro: {
				pagenum: 1,
				pagesize: 3
			},
			total: 0,
			// 定义查询信息
			queryInfo: '',
			// 定义对话框打开
      dialogVisible: false,
      // 定义表格总数据
      tableData: [],
      // 定义展示的分页数据
      tablePageData:[],
      // 定义要删除的数据
      delId:[],
			// 定义创建项目信息
			createProject: {
				filePath: '',
				itype: '',
				extraInfo: {
					dev: {}
				}
			},
			flag1: false,
			flag2: false,
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
			proType: ['java', 'python', 'js', 'php', 'vs']
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
          // console.log(this.tableData)
          for( let i = 0; i < 48; i++){
          let add = {...this.tableData[0]}
            add.scannedFiles += i+1
            this.tableData.push(add)
            // console.log(this.tableData);
            
          }
          this.total = res.data.length
          this.getPageData()
					
			})
    },
    // 定义展示的分页数据方法
    getPageData(){
      let pagenum = this.queryPro.pagenum
      let pagesize = this.queryPro.pagesize 
      let total = this.total
      let startIndex = (pagenum - 1) * pagesize 
      let endIndex = startIndex + pagesize
      this.tablePageData = this.tableData.slice(startIndex,endIndex)
    },
		// 页面尺寸发生变化时的处理函数
		handleSizeChange(pagesize) {
			// console.log(pagesize);
      this.queryPro.pagesize = pagesize
      this.getPageData()    
		},
		// 当前页发生变化时的处理函数
		handleCurrentChange(pagenum) {
      this.queryPro.pagenum = pagenum
      this.getPageData()
    },
    // 点击搜索
    search(){
      // endTime: "2019-09-27 14:08:52"
      // execLoc: 644
      // id: 99
      // ltype: "PYTHON"
      // scannedFiles: 10
      // srcPath: "123"
      // status: 4
      // uploadTime: "2019-09-27 09:07:20"
      const searchData = this.queryInfo.trim()
      // console.log(searchData.trim())
      if(searchData == ''){
        this.getAllPro()
      }else{
        const arr = []
        this.tableData.forEach( item => {
          for( let k in item){
            if(item[k] == searchData){
              arr.push(item)
              break
            }
          }
        })
        this.tablePageData = arr
        if(this.tablePageData.length == 0) return this.$message.error('查询不到对应数据')
      }
    },
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
		handleChange(file, fileList) {},
		// 点击创建按钮创建项目
		submitForm() {},
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
    },
    // 删除项目
    del(){
      console.log(this.delId);
      delPro({id:this.delId}).then( res => {
        console.log(res);
      })
    },
    handleSelectionChange(val){
      this.delId = []
      val.forEach(item=>{
        this.delId.push(item.id)
      })
    },
    // 查看详情
    handleDetails(index,row){
     this.$router.push({
       name:'details',
       query:{
         id: row.id
       }
     })
      
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
.el-dialog__body {
	.el-select {
		width: 89%;
	}
	.el-form-item__content .el-input {
		width: 89%;
	}
}
.pagination {
	margin-top: 20px;
	text-align: right;
}
/deep/ .el-table td,
.el-table th {
	padding: 8px 0;
}
/deep/ .el-table tbody tr:hover>td { 
    background-color: transparent !important
}
</style>
