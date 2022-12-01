<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button
            @click="showAddCate"
            style="margin-bottom: 20px"
            type="primary"
            >添加分类</el-button
          >
        </el-col>
      </el-row>

      <!-- 表格 -->
      <tree-table
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i
            style="color: lightgreen"
            v-if="scope.row.cat_deleted === false"
            class="el-icon-success"
          ></i>
          <i style="color: red" v-else class="el-icon-error"></i>
        </template>

        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level === 1" type="success"
            >二级</el-tag
          >
          <el-tag v-else type="warning">三级</el-tag>
        </template>

        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button icon="el-icon-edit" size="mini" type="primary" @click="showedit(scope.row.cat_id)"
            >编辑</el-button
          >
          <el-button icon="el-icon-delete" size="mini" type="danger" @click="remove(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>

        <!-- 编辑商品分类对话框 -->
      <el-dialog
        title="编辑商品分类"
        :visible.sync="editdialogVisible"
        width="50%"
        @close="editCateForm.cat_name = ''"
      >
        <el-form
          :model="editCateForm"
          :rules="addCateFormRules"
          ref="editRef"
          label-width="100px"
        >
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="editCateForm.cat_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editdialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editCateInfo">确 定</el-button>
        </span>
      </el-dialog>

        
      <!-- 添加分类对话框 -->
      <el-dialog
        title="添加分类"
        :visible.sync="addCatedialogVisible"
        width="50%"
        @close="addCatedialogClosed"
      >
        <el-form
          :model="addCateForm"
          :rules="addCateFormRules"
          ref="addCateRuleForm"
          label-width="100px"
        >
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>

          <el-form-item label="父级分类">
            <el-cascader
              size="medium"
              clearable
              v-model="selectKey"
              :options="parentCateList"
              :props="{
                expandTrigger: 'hover',
                ...cascaderProps,
                checkStrictly: true,
              }"
              @change="parentCateChange"
            ></el-cascader>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="addCatedialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCate">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectKey: [],
      // 商品分类数据列表
      catelist: [],
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      total: 0,
      columns: [
        { label: "分类名称", prop: "cat_name" },
        {
          label: "是否有效",
          // prop:'cat_deleted',
          type: "template",
          template: "isok",
        },
        {
          label: "排序",
          // prop:'cat_deleted',
          type: "template",
          template: "order",
        },
        {
          label: "操作",
          // prop:'cat_deleted',
          type: "template",
          template: "opt",
        },
      ],
      addCatedialogVisible: false,
      //   添加分类的表单数据对象
      addCateForm: {
        // 添加分类的名称
        cat_name: "",
        // 分类的等级
        cat_level: 0,
        // 父级分类的id
        cat_pid: 0,
      },
      addCateFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
        // cat_level: [
        //   { required: true, message: "请输入分类层级", trigger: "blur" },
        // ],
      },
      editCateForm:{
        cat_pid: 0,
        cat_name: "",
      },
      //   父级分类数据列表
      parentCateList: [],
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      editdialogVisible:false,
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    // 获取商品分类数据
    async getCateList() {
      let { data: res } = await this.$axios.get("categories", {
        params: this.querInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      //   console.log(res);
    //   this.$message.success(res.meta.msg);
      this.catelist = res.data.result;
      this.total = res.data.total;
      //   console.log(this.catelist);
    },

    // 监听pagesize改变
    handleSizeChange(newSize) {
      this.querInfo.pagesize = newSize;
      this.getCateList();
    },

    // 监听pageNum的改变
    handleCurrentChange(newPage) {
      this.querInfo.pagenum = newPage;
      this.getCateList();
    },

    // 点击按钮 展示添加分类界面
    showAddCate() {
      // 先获取父级分类数据列表
      this.getParentCateList();
      this.addCatedialogVisible = true;
    },

    // 获取父级分类数据列表
    async getParentCateList() {
      let { data: res } = await this.$axios.get("categories", {
        params: { type: 2 },
      });
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      this.parentCateList = res.data;
    },

    // 选择项发生变化触发的函数
    parentCateChange() {
      if (this.selectKey.length > 0) {
        this.addCateForm.cat_pid = this.selectKey[this.selectKey.length - 1];
        this.addCateForm.cat_level = this.selectKey.length;
        return;
      } else {
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
      }
    },

    // 点击按钮添加分类
    addCate() {
      //   console.log(this.addCateForm);
      this.$refs.addCateRuleForm.validate(async valid => {
        if(!valid) return
        let {data:res} = await this.$axios.post('categories',this.addCateForm)
        if(res.meta.status !== 201){
            return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.getCateList()
        this.addCatedialogVisible = false
      })
    },

    // 监听对话框关闭事件
    addCatedialogClosed() {
      this.$refs.addCateRuleForm.resetFields();
      this.selectKey = [];
      this.addCateForm.cat_level = 0;
      this.addCateForm.cat_pid = 0;
    },

    // 展示编辑区
    showedit(id){
        this.editdialogVisible = true
        this.editCateForm.cat_pid = id
    },

    // 最终确定编辑按钮
    editCateInfo(){
        this.$refs.editRef.validate(async valid => {
        if(!valid) return
        let {data:res} = await this.$axios.put(`categories/${this.editCateForm.cat_pid}`,this.editCateForm)
        if(res.meta.status !== 200){
            return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.getCateList()
        this.editdialogVisible = false
      })
    },

    // 删除
    async remove(id){
        let res = await this.$confirm('此操作将永久删除该分类, 是否继续?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err);
        if(res == "cancel"){
            return this.$message.info("已取消");
        }
        let {data} = await this.$axios.delete(`categories/${id}`)
        if(data.meta.status !== 200){
            return this.$message.error(data.meta.msg)
        }
        this.$message.success(data.meta.msg)
        this.getCateList()
    },


  },
};
</script>

<style lang="less" scoped></style>
