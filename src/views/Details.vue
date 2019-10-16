<template>
  <div class="details_box">
    <el-container>
      <!-- 左侧部分 -->
      <el-aside width="650px">
        <!-- 基本信息 -->
        <div class="baseInfo">
          <h5>基本信息</h5>
          <div class="info">
            <p><span>项目目录：</span><span>D:\code\projects\test</span></p>
            <p><span>创建用户：</span><span>admin</span></p>
            <p><span>项目摘要：</span><span><a href="javascript:;">查看</a></span></p>
            <p><span>项目报告：</span><span><a href="javascript:;">下载</a></span></p>
          </div>
        </div>
        <!-- 问题列表 -->
        <div class="issues_box">
          <h5>问题列表</h5>
          <div class="list">
            <p>
              <span>视图：</span>
              <el-select v-model="viewType" placeholder="请选择">
                <el-option label="快速视图" value="快速视图"></el-option>
                <el-option label="安全审计视图" value="安全审计视图"></el-option>
              </el-select>
            </p>
            <el-tabs v-model="activeName" type="border-card">
              <el-tab-pane name="first">
                <div slot="label" class="tab_box">
                  <span class="cricital_icon"></span>
                  69
                </div>
                <p class="cricital_icon">严重（69）</p>
                <div class="scroll_box">
                  <el-scrollbar style="height:100%">
                    <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick">
                      <span slot-scope="{ node, data }">
                        <svg class="icon" aria-hidden="true">
                          <use xlink:href="#icon-wenjianjia2" v-if="data.children"></use>
                          <use xlink:href="#icon-wenjian1" v-else></use>
                        </svg>
                        {{node.label}}
                      </span>
                    </el-tree>
                  </el-scrollbar>
                </div>
              </el-tab-pane>
              <el-tab-pane name="second">
                <div slot="label" class="tab_box">
                  <span class="height_icon"></span>
                  170
                </div>
                <p class="height_icon">高（170）</p>
                <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick">
                  <span slot-scope="{ node, data }">
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-wenjianjia2" v-if="data.children"></use>
                      <use xlink:href="#icon-wenjian1" v-else></use>
                    </svg>
                    {{node.label}}
                  </span>
                </el-tree>
              </el-tab-pane>
              <el-tab-pane name="third">
                <div slot="label" class="tab_box">
                  <span class="medium_icon"></span>
                  0
                </div>
                <p class="medium_icon">中等（0）</p>
                <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick">
                  <span slot-scope="{ node, data }">
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-wenjianjia2" v-if="data.children"></use>
                      <use xlink:href="#icon-wenjian1" v-else></use>
                    </svg>
                    {{node.label}}
                  </span>
                </el-tree>
              </el-tab-pane>
              <el-tab-pane name="fourth">
                <div slot="label" class="tab_box">
                  <span class="low_icon"></span>
                  0
                </div>
                <p class="low_icon">低(默认)（0）</p>
                <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick">
                  <span slot-scope="{ node, data }">
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-wenjianjia2" v-if="data.children"></use>
                      <use xlink:href="#icon-wenjian1" v-else></use>
                    </svg>
                    {{node.label}}
                  </span>
                </el-tree>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
        <!-- 分析证据 -->
        <div class="analysis">
          <h5>分析证据</h5>
          <div class="multiple_path">
            <i class="el-icon-arrow-left left"></i>
            <span>问题路径：1 / 5</span>
            <i class="el-icon-arrow-right right"></i>
          </div>
          <div class="evident">
            <div class="scroll_box">
              <el-scrollbar style="height:100%">
                <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick">
                  <span slot-scope="{ node, data }">
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-wenjianjia2" v-if="data.children"></use>
                      <use xlink:href="#icon-wenjian1" v-else></use>
                    </svg>
                    {{node.label}}
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
          aaaa
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
	name: '',

	created() {
		this.$store.commit('setMark', true)
	},
	mounted() {
		console.log(this.$route.query)
	},
	data() {
		return {
			// 定义视图种类
			viewType: '快速视图',
			activeName: 'first',
			data: [
				{
					label: '一级 1',
					children: [
						{
							label: '二级 1-1',
							children: [
								{
									label: '三级 1-1-1'
								}
							]
						}
					]
				},
				{
					label: '一级 2',
					children: [
						{
							label: '二级 2-1',
							children: [
								{
									label: '三级 2-1-1'
								}
							]
						},
						{
							label: '二级 2-2',
							children: [
								{
									label: '三级 2-2-1'
								}
							]
						}
					]
				},
				{
					label: '一级 3',
					children: [
						{
							label: '二级 3-1',
							children: [
								{
									label: '三级 3-1-1'
								}
							]
						},
						{
							label: '二级 3-2',
							children: [
								{
									label: '三级 3-2-1'
								}
							]
						}
					]
				}
			],
			defaultProps: {
				children: 'children',
				label: 'label'
			}
		}
	},

	methods: {
		handleNodeClick(data) {
			console.log(data)
		}
	}
}
</script>

<style lang='less' scoped>
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
		.baseInfo {
			text-align: center;
			padding-bottom: 16px;
			border-bottom: 1px solid #ccc;
			background-color: #fff;
			h5 {
				margin: 0;
				padding: 12px;
				border-bottom: 1px solid #ccc;
			}
			p {
				text-align: left;
				margin: 0;
				margin-left: 90px;
				font-size: 14px;
				margin-top: 12px;
				span {
					margin-right: 20px;
					a {
						text-decoration: none;
					}
				}
			}
		}
		.issues_box {
			text-align: center;
			// padding-bottom: 16px;
			border-bottom: 1px solid #ccc;
			background-color: #fff;
			margin-top: 8px;
			h5 {
				margin: 0;
				padding: 12px;
				border-bottom: 1px solid #ccc;
			}
			.list {
				p {
					text-align: left;
					margin: 0;
					margin-left: 90px;
					font-size: 14px;
					margin-top: 12px;
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
						margin-right: 20px;
					}
				}
				/deep/.el-tabs {
					.el-tabs__header {
						margin-bottom: 8px !important;
					}
					/deep/.el-tabs__header {
						background: -webkit-linear-gradient(top, #999999, #bebebe);
					}
					.el-tabs__content {
						padding-top: 0;
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
							border-top: 1px solid #ccc;
							padding-top: 8px;
							height: 180px;
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
			text-align: center;
			padding-bottom: 16px;
			border-bottom: 1px solid #ccc;
			background-color: #fff;
			margin-top: 8px;

			h5 {
				margin: 0;
				padding: 12px;
				border-bottom: 1px solid #ccc;
			}
			.multiple_path {
				margin-top: 10px;
				margin-bottom: 8px;
				.left,
				.right {
					font-weight: 700;
					font-size: 20px;
					cursor: pointer;
					width: 30px;
				}
				span {
					margin: 0 40px;
				}
			}
			.evident {
				.scroll_box {
					border-top: 1px solid #ccc;
					padding-top: 8px;
					height: 171px;
					/deep/.el-scrollbar__wrap {
            	overflow-x: hidden !important;
					}
				}
			}
		}
	}
	.el-main {
		padding: 0;
		padding-left: 20px;
		.code {
			background-color: #fff;
			height: 100%;
		}
	}
}
</style>
