<template>
  <div class="details_box">
    <el-container>
      <!-- 左侧部分 -->
      <el-aside width="600px">
        <!-- 基本信息 -->
        <div class="baseInfo">
          <h4>基本信息</h4>
          <div class="info">
            <el-row :gutter="20">
              <el-col :span="14">
                <div class="grid-content bg-purple">
                  <p><span>项目包名：</span><span>{{this.$route.query.srcPath || ''}}</span></p>
                </div>
              </el-col>
              <el-col :span="10">
                <div class="grid-content bg-purple">
                  <p><span>项目类型：</span><span>{{this.$route.query.ltype || ''}}</span></p>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="14">
                <div class="grid-content bg-purple">
                  <p><span>项目摘要：</span><span><a href="javascript:;" @click="view">查看</a></span></p>
                </div>
              </el-col>
              <el-col :span="10">
                <div class="grid-content bg-purple">
                  <p><span>项目报告：</span><span><a :href="`/tinker/project/report?projectId=${projectId}`">下载</a></span></p>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
        <!-- 问题列表 -->
        <div class="issues_box">
          <h4>问题列表</h4>
          <p>
            <span>视图：</span>
            <el-select v-model="viewType" placeholder="请选择" @change="handleChange">
              <el-option label="快速视图" value="快速视图"></el-option>
              <el-option label="安全审计视图" value="安全审计视图"></el-option>
            </el-select>
          </p>
          <div class="list"  v-loading="loading" element-loading-text="数据加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.5)">
            <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
              <el-tab-pane :name="item.name" :key="index" v-for="(item,index) in issueStat">
                <div slot="label" class="tab_box">
                  <span :class="item.className"></span>
                  {{item.level}}（{{item.issueCount}}）
                </div>
                <!-- <p :class="item.className">{{item.level}}（{{item.issueCount}}）</p> -->
                <div class="scroll_box">
                  <el-scrollbar style="height:100%">
                    <!-- 树形结构 -->
                    <el-tree :data="dataLists" :props="defaultProps" @node-click="handleNodeClick" @node-collapse="closeNode" highlight-current>
                      <span slot-scope="{ node, data }">
                        <svg class="icon" aria-hidden="true">
                          <use xlink:href="#icon-wenjianjia2" v-if="data.children"></use>
                          <use xlink:href="#icon-wenjian1" v-else></use>
                        </svg>
                        {{data.children ? `${node.label}${data.displayLineNum ? ' :' + data.displayLineNum : ''} - (0 / ${data.childCount})` : `${node.label} :${data.displayLineNum}`}}
                      </span>
                    </el-tree>
                  </el-scrollbar>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
        <!-- 分析证据 -->
        <div class="analysis" onselectstart="return false">
          <h4>分析证据</h4>
          <div class="multiple_path">
            <i class="el-icon-arrow-left left" @click="sub"></i>
            <span>{{`${num1} / ${num2 || 1}`}}</span>
            <i class="el-icon-arrow-right right" @click="add"></i>
          </div>
          <div class="evident">
            <div class="scroll_box">
              <el-scrollbar style="height:100%">
                <el-tree highlight-current :data="analysis" :props="defaultProps" @node-click="handleNodeClick1">
                  <span slot-scope="{ node, data }">
                    <!-- <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-wenjianjia2" v-if="data.children"></use>
                      <use xlink:href="#icon-wenjian1" v-else></use>
                    </svg> -->  
                      <img :src="urlArr.includes(data.nodeType) ? require(`../assets/images/${data.nodeType}.png`) :''" alt="" class="evident_icon">
                      {{data.nodeType == 'SecondaryLocation'? '宏扩展：':''}}{{data.addInfo ? `${data.srcFileName} :${data.lineNum} - ${data.addInfo}`:`${data.srcFileName} :${data.lineNum}`}}
                  </span>
                </el-tree>
              </el-scrollbar>
            </div>
          </div>
        </div>
      </el-aside>
      <!-- 右侧主体部分 -->
      <el-main>
        <div class="code">
          <codemirror v-model="code" :options="cmOptions" class="code_box" ref="myCm"></codemirror>
        </div>
        <!-- 底部问题详情介绍 -->
        <div class="description">
          <h5>问题详情</h5>
          <div class="empty" v-if="!description">暂无数据</div>
          <p v-html="description"></p>
        </div>
      </el-main>
      <!-- 查看项目摘要对话框 -->
      <el-dialog title="" :visible.sync="dialogVisible" width="50%" center @opened="callback">
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="grid-content bg-purple">扫描文件数：{{singlePro.scannedFiles}}</div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple">可执行loc：{{singlePro.execLoc}}</div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="grid-content bg-purple">项目类型：{{singlePro.ltype}}</div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple">问题总数：{{total}}</div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="grid-content bg-purple">创建时间：{{singlePro.uploadTime}}</div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple">完成时间：{{singlePro.endTime}}</div>
          </el-col>
        </el-row>
        <!-- 问题统计 -->
        <!-- <p class="stat_view">问题统计图</p> -->
        <div id="myEchart" :style="{width: '700px', height: '280px'}">
        </div>
      </el-dialog>
    </el-container>
  </div>
</template>

<script>
import {
	getAllIssue,
	getIssue,
	getIssuePath,
	issueStat,
	getSourceCode,
	downloadReport,
	getList
} from '@/api/proDetails/api.js'
//导入echarts
import echarts from 'echarts'
//导入lodash
import _ from 'lodash'
import {urlArr} from '@/utils/imgUrl.js'
export default {
	name: '',
	data() {
		return {
			echartsData: {
				title: {
					text: '问题统计',
					x: '60px'
				},
				tooltip: {},
				legend: {
					data: ['问题数量'],
					x: '550px',
					y: '0'
				},
				xAxis: {},
				yAxis: { data: ['低', '中', '高', '严重'] },
				series: [
					{
						name: '问题数量',
						type: 'bar',
						data: [],
						itemStyle: {
							normal: {
								//这里是重点
								color: function(params) {
									//注意，如果颜色太少的话，后面颜色不会自动循环，最好多定义几个颜色
									var colorList = ['#DBB604', '#FFC800', '#FF8C00', '#CA3F37']
									return colorList[params.dataIndex]
								},
								label: {
									show: true,
									position: 'right',
									textStyle: {
										//数值样式
										color: 'black',
										fontSize: 16
									}
								}
							}
						}
					}
				]
			},
			code: '',
			cmOptions: {
				// codemirror options
				tabSize: 4,
				mode: 'text/javascript',
				theme: 'eclipse',
				lineNumbers: true,
				line: true,
				indentUnit: 2,
				smartIndent: true,
				lineWrapping: true, //代码折叠
				readOnly: 'true',
				styleActiveLine: true,
				foldGutter: true,
				matchBrackets: true, //括号匹配
				autoCloseBrackets: true,
				// autofocus:true,
				// autoRefresh: true,
				gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers']
				// more codemirror options, 更多 codemirror 的高级配置...
			},
			// 定义项目id
			projectId: '',
			showFlag: false,
			// 定义视图种类
			viewType: '快速视图',
			activeName: 'first',
			// 查询所有问题参数
			queryInfo: {
				projectId: 28, // 项目id
				quickView: 'true', // 是否是快速视图
				level: '1' // 问题等级
			},
			// 问题列表数据源
			dataLists: [],
			defaultProps: {
				children: 'children',
				label: 'displayFile'
			},
			// 问题统计
			issueStat: [
				{
					name: 'first',
					issueCount: 69,
					level: '严重',
					className: 'cricital_icon'
				},
				{
					name: 'second',
					issueCount: 170,
					level: '高',
					className: 'height_icon'
				},
				{
					name: 'third',
					issueCount: 0,
					level: '中',
					className: 'medium_icon'
				},
				{
					name: 'fourth',
					issueCount: 0,
					level: '低',
					className: 'low_icon'
				}
			],
			// 分析证据
			analysisAllData: [],
      analysis: [],
      // 图标路径集合
      urlArr:urlArr,
			// 路径参数
			num1: 1,
			num2: 1,
			// 定义代码定位行号
			lineNum: 1,
			// 项目摘要对话框打开关闭
			dialogVisible: false,
			// 单个项目信息
			singlePro: {},
			// 该项目的问题总数
			total: 0,
			// 项目问题统计数组
			issueArr: [],
			// 问题描述
      description: '',
      // 数据加载
      loading:false,
		}
	},
	created() {
    // console.log(this.$route)
    // console.log(this.urlArr);
		this.$store.commit('setMark', true)
		this.queryInfo.projectId = this.$route.query.id
		this.projectId = this.$route.query.id
		this.issueStat0() // 调用问题统计方法
		this.getAllIssue0() // 调用所有问题方法
	},
	mounted() {
    // 在mounted 确保dom元素加载完毕 调用echarts  
	},
	methods: {
		callback() {
			this.ech()
		},
		ech() {
			let myChart = echarts.init(document.getElementById('myEchart'))
			console.log(myChart)
			this.echartsData.series[0].data = this.issueArr
			myChart.setOption(this.echartsData)
		},
		// 查看项目摘要悬浮框
		view() {
			this.dialogVisible = true
			getList(this.$route.query.id).then(res => {
				if (res.data) {
					this.singlePro = res.data
					console.log(this.total)
				}
			})
		},
		// 项目问题统计
		issueStat0() {
			let queryStat = { ...this.queryInfo }
			delete queryStat.level
			// console.log(queryStat)
			issueStat(queryStat).then(res => {
				if (res.code != 0) return this.$message.error('获取问题统计失败')
				const data = Object.values(res.data)
				this.issueArr = [...data].reverse()
				this.total = data.reduce((total, num) => total + num)
				this.issueStat.forEach((item, index) => {
					item.issueCount = data[index]
				})
				// console.log(this.issueStat)
			})
		},
		// 获取某个项目的所有问题
		getAllIssue0() {
      this.loading = true
			getAllIssue(this.queryInfo).then(res => {
      this.loading = false
				if (res.code != 0) return this.$message.error('获取问题列表失败')
				let data = res.data
				this.dataLists = data.map(item => {
					return {
						displayFile: item.group,
						children: item.issues,
						childCount: item.childCount
					}
				})
				console.log(this.dataLists)
			})
		},
		// 获取某个项目的单独问题
		getIssue0(id) {
			getIssue(id).then(res => {
				console.log(res)
				if (res.code == 0) {
					this.description = res.data.description
				}
			})
		},
		// 视图选择改变事件
		handleChange() {
			this.analysis = []
			this.analysisAllData = []
			this.num1 = 1
			this.num2 = 1
			this.showFlag = false
			if (this.viewType == '快速视图') {
				this.queryInfo.quickView = 'true'
			} else {
				this.queryInfo.quickView = 'false'
			}
			this.issueStat0()
			this.getAllIssue0()
		},
		// tab切换事件
		handleClick(tab, e) {
			this.analysis = []
			this.analysisAllData = []
			this.num1 = 1
			this.num2 = 1
			this.description = ''
			this.showFlag = false
			switch (tab.name) {
				case 'first':
					this.queryInfo.level = '1'
					break
				case 'second':
					this.queryInfo.level = '2'
					break
				case 'third':
					this.queryInfo.level = '3'
					break
				case 'fourth':
					this.queryInfo.level = '4'
					break
			}
			this.getAllIssue0()
		},
		// 点击当前树节点事件(问题列表)
		handleNodeClick(data, node) {
			console.log(data)
			if (data.file) {
				const filePath = data.file
				const projectId = this.$route.query.id
				this.getSourceCode0({ projectId: projectId, filePath: filePath })
			}
			if (data.id) {
				this.showFlag = true
				// console.log(data.id)
				this.getIssuePath0(data.id) // 调用问题路径方法
				this.getIssue0(data.id) // 调用单独问题方法
			}
			this.lineNum = data.lineNum - 1
		},
		// 	// 点击当前树节点事件(分析证据)
		handleNodeClick1(data, node) {
			console.log(data)
			if (data.srcFile) {
				const filePath = data.srcFile
				const projectId = this.$route.query.id
				this.getSourceCode0({ projectId: projectId, filePath: filePath })
			}
			this.lineNum = data.lineNum - 1
		},
		// 关闭当前树节点事件
		closeNode() {
			this.analysis = []
			this.analysisAllData = []
			this.num1 = 1
			this.num2 = 1
			this.description = ''
			this.showFlag = false
		},
		// 根据id查询问题路径
		getIssuePath0(id) {
			this.num1 = 1
			getIssuePath({ id: id }).then(res => {
				console.log(res)
				if (res.code != 0) {
					this.num2 = 1
					return this.$message.error('获取证据失败')
				}
				this.num2 = res.data.length
				this.analysisAllData = res.data
				this.analysis = this.analysisAllData[0]
			})
		},
		// 根据项目id和file路径查询源码
		getSourceCode0(option) {
			getSourceCode(option).then(res => {
				console.log(res)
				if (res.code == 0) {
					this.code = res.data.content
					this.$nextTick(function() {
						this.$refs.myCm.codemirror.setCursor(this.lineNum, 1)
						let scrollHeight = document.querySelector('.CodeMirror-scroll').offsetHeight
						let trHeight = document.querySelector('.CodeMirror-line ').offsetHeight
						let y = this.lineNum * trHeight - scrollHeight / 2
						if (y > 4000) {
							y = this.lineNum * (trHeight + 0.05) - scrollHeight / 2
						}
						this.$refs.myCm.codemirror.scrollTo(0, y)
					})
				}
			})
		},
		// 点击箭头改变数字
		add() {
			this.num1++
			if (this.num1 > this.num2) {
				this.num1 = 1
			}
			this.analysis = this.analysisAllData[this.num1 - 1]
		},
		sub() {
			this.num1--
			if (this.num1 < 1) this.num1 = this.num2
			this.analysis = this.analysisAllData[this.num1 - 1]
		}
	},
	watch: {}
}
</script>

<style lang='less' scoped>
#myEchart {
	margin: 20px auto;
}
.code_box {
	height: 100%;
	/deep/.CodeMirror {
		height: 100% !important;
	}
}
.icon {
	width: 1em;
	height: 1em;
	vertical-align: -0.15em;
	fill: currentColor;
	overflow: hidden;
}
.details_box {
	height: 100%;
	.el-container {
		height: 100%;
	}
	.el-aside {
		height: 100%;
		overflow-x: hidden;
		.baseInfo {
			text-align: center;
			padding-bottom: 16px;
			border-bottom: 1px solid #ccc;
			background-color: #fff;
			h4 {
				margin: 0;
				padding: 10px 10px 0;
				text-align: left;
				padding-left: 30px;
				// border-bottom: 1px solid #ccc;
			}
			.grid-content {
				min-height: 18px;
			}
			p {
				text-align: left;
				margin: 0;
				margin-left: 30px;
				font-size: 14px;
				margin-top: 8px;
				span {
					margin-right: 10px;
					a {
						text-decoration: none;
					}
				}
			}
		}
		.issues_box {
			// text-align: center;
			// padding-bottom: 16px;
			// border-bottom: 1px solid #ccc;
			background-color: #fff;
			margin-top: 2px;
			h4 {
				margin: 0;
				padding: 12px 12px 4px;
				margin-left: 18px;
				display: inline-block;
				// border-bottom: 1px solid #ccc;
			}
			p {
				display: inline-block;
				text-align: left;
				margin: 0;
				margin-left: 190px;
				font-size: 14px;
				margin-top: 8px;
				margin-bottom: 12px;
				.el-select {
					/deep/.el-input__inner {
						height: 30px !important;
					}
					/deep/.el-input__icon {
						line-height: 30px !important;
					}
				}
				span {
					margin-right: 4px;
				}
			}
			.list {
				/deep/.el-tabs {
					.el-tabs__header {
						margin-bottom: 8px !important;
					}
					/deep/.el-tabs__header {
						background: -webkit-linear-gradient(top, #999999, #bebebe);
					}
					.el-tabs__content {
						padding-top: 0;
						padding-bottom: 10px !important;
						padding-left: 12px !important;
					}
					.el-tabs__item.is-active {
						color: #409eff;
					}
					.el-tabs__item {
						height: 30px;
						line-height: 30px;
						color: #000;
						border-right: 1px solid #eee;

						.tab_box {
							display: flex;
							align-items: center;
							span {
								display: inline-block;
								width: 24px;
								height: 14px;
								background-color: #ca3f37;
								margin-right: 10px;
								border-radius: 4px;
								border: 1px solid #555;
							}
							.cricital_icon {
								background-color: #ca3f37;
							}
							.height_icon {
								background-color: #ff8c00;
							}
							.medium_icon {
								background-color: #ffc800;
							}
							.low_icon {
								background-color: #dbb604;
							}
						}
					}
					.el-tab-pane {
						.scroll_box {
							// border-top: 1px solid #ccc;
							padding-top: 8px;
							height: 388px;
							.el-scrollbar__wrap {
								overflow-x: hidden;
							}
						}
						p[class$='icon'] {
							margin: 0 0 8px 8px;
							padding: 0;
							width: 97%;
							border-radius: 8px;
							height: 30px;
							line-height: 30px;
							padding-left: 16px;
						}
						.cricital_icon {
							background-color: #ca3f37;
							color: #fff;
						}
						.height_icon {
							background-color: #ff8c00;
							color: #000;
							font-weight: 700;
						}
						.medium_icon {
							background-color: #ffc800;
							font-weight: 700;
						}
						.low_icon {
							background-color: #dbb604;
							font-weight: 700;
						}
					}
				}
			}
		}
		.analysis {
			// text-align: center;
			padding-bottom: 10px;
			// border-bottom: 1px solid #ccc;
			background-color: #fff;
      margin-top: 2px;
      -moz-user-select: none; //禁止双击选中（火狐专用）ie和chrome可以直接在元素上写 onselectstart="return fasle"

			h4 {
				margin: 0;
				padding: 12px;
				padding-bottom: 4px;
				margin-left: 18px;
				display: inline-block;
				// border-bottom: 1px solid #ccc;
			}
			.multiple_path {
				margin-top: 4px;
				margin-bottom: 6px;
				display: inline-block;
				margin-left: 320px;
				.left,
				.right {
					font-weight: 700;
					font-size: 16px;
					cursor: pointer;
					width: 30px;
				}
				span {
					margin: 0 16px;
					margin-right: 26px;
				}
			}
			.evident {
				.scroll_box {
					border-top: 1px solid #ccc;
					padding-top: 8px;
					height: 240px;
					/deep/.el-scrollbar__wrap {
						overflow-x: hidden !important;
					}
				}
				.evident_icon {
					vertical-align: middle;
				}
			}
		}
	}
	.el-main {
		padding: 0;
		padding-left: 10px;
		.code {
			background-color: #fff;
			height: 760px;
			/deep/.CodeMirror-activeline-background {
				background-color: #c6d87c;
			}
		}
		/deep/.description {
			margin-top: 8px;
			background-color: #fff;
			padding: 12px;
			height: 108px;
			.empty {
				text-align: center;
				color: #909399;
				margin-top: 18px;
			}
			h5 {
				margin: 0;
				margin-bottom: 6px;
				padding-bottom: 6px;
				border-bottom: 1px solid #ccc;
			}
			p {
				margin: 0;
				word-break: break-word;
				/deep/code {
					color: blue !important;
				}
			}
		}
	}
	/deep/.el-tree-node.is-current > .el-tree-node__content {
		background-color: #c6d87c !important;
	}
	.el-row {
		// margin-bottom: 4px;
		&:last-child {
			margin-bottom: 0;
		}
	}
	.el-col {
		border-radius: 4px;
		font-size: 16px;
	}
	// .bg-purple-dark {
	//   background: #99a9bf;
	// }
	// .bg-purple {
	//   background: #d3dce6;
	// }
	.bg-purple-light {
		background: #e5e9f2;
	}
	.grid-content {
		border-radius: 4px;
		min-height: 36px;
	}
	/deep/.el-dialog__title {
		font-weight: 700;
	}
	/deep/.el-dialog__body {
		.el-col {
			.grid-content {
				margin-left: 120px;
			}
		}
	}
	.stat_view {
		text-align: center;
		line-height: 24px;
		font-size: 18px;
		color: #303133;
		font-weight: 700;
	}
}
</style>
