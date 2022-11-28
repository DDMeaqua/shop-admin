<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">搜索</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区 -->
      <el-table :data="userlist" style="width: 100%" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column
          prop="username"
          label="姓名"
          width="180"
        ></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip
              :enterable="false"
              class="item"
              effect="dark"
              content="修改"
              placement="top-start"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                circle
              ></el-button>
            </el-tooltip>
            <el-tooltip
              :enterable="false"
              class="item"
              effect="dark"
              content="删除"
              placement="top-start"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                circle
              ></el-button>
            </el-tooltip>
            <el-tooltip
              :enterable="false"
              class="item"
              effect="dark"
              content="分配角色"
              placement="top-start"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                circle
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

    <!-- 分页区 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>


    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        query: "",
        // 当前页数
        pagenum: 1,
        // 当前每页显示多少数据
        pagesize: 2,
      },
      userlist: [],
      total: 0,
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      let { data } = await this.$axios.get("users", { params: this.queryInfo });
      if (data.meta.status !== 200) {
        return this.$message.error("获取用户列表失败");
      }
      this.userlist = data.data.users;
      this.total = data.data.total;
      //   console.log(data);
      console.log(this.userlist);
    },

    // 监听pagesize改变的事件
    handleSizeChange(newSize){
        console.log(newSize);
        this.queryInfo.pagesize = newSize
        this.getUserList()  //重新获取数据
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage){
        console.log(newPage);
        this.queryInfo.pagenum = newPage
        this.getUserList()  //重新获取数据
    }
  },
};
</script>

<style lang="less" scoped></style>
