<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-alert
        title="注意:只允许为第三级分类设置相关参数!"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>

      <!-- 商品分类 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类:</span>

          <!-- 选择商品分类级联选择框 -->
          <el-cascader
            v-model="selectkey"
            :options="catelist"
            :props="{
              expandTrigger: 'hover',
              ...cateProps,
            }"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>

      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            :disabled="btnDisabled"
            @click="dialogVisible = true"
            >添加参数</el-button
          >
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag closable v-for="(item, i) in scope.row.attr_vals"
                  :key="i" @close="handleClose(i,scope.row)"
                  >{{ item }}</el-tag>

                <!-- 文本输入框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <!-- 操作 -->
              <template slot-scope="scope">
                <el-button
                  icon="el-icon-edit"
                  size="mini"
                  type="primary"
                  @click="showedit(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  icon="el-icon-delete"
                  size="mini"
                  type="danger"
                  @click="remove(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            :disabled="btnDisabled"
            @click="dialogVisible = true"
            >添加属性</el-button
          >
          <!-- 静态参数表格 -->
          <el-table :data="onlyTableData" border stripe>
            <!-- 展开行 -->
                        <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag closable v-for="(item, i) in scope.row.attr_vals"
                  :key="i" @close="handleClose(i,scope.row)"
                  >{{ item }}</el-tag>

                <!-- 文本输入框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <!-- 操作 -->
              <template slot-scope="scope">
                <el-button
                  icon="el-icon-edit"
                  size="mini"
                  type="primary"
                  @click="showedit(scope.row.attr_id)"
                  >修改</el-button
                >
                <el-button
                  icon="el-icon-delete"
                  size="mini"
                  type="danger"
                  @click="remove(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数对话框 -->
    <el-dialog
      :title="'添加' + title"
      :visible.sync="dialogVisible"
      width="50%"
      @close="addForm.attr_name = ''"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addForm"
        label-width="100px"
      >
        <el-form-item :label="title + ':'" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改参数对话框 -->
    <el-dialog
      :title="'修改' + title"
      :visible.sync="editdialogVisible"
      width="50%"
      @close="editForm.attr_name = ''"
    >
      <el-form
        :model="editForm"
        :rules="addFormRules"
        ref="editForm"
        label-width="100px"
      >
        <el-form-item :label="title + ':'" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 级联选择框双向绑定的数组
      selectkey: [],
      catelist: [],
      cateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      activeName: "many",
      manyTableData: [],
      onlyTableData: [],
      dialogVisible: false,
      addForm: {
        attr_name: "",
      },
      addFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },
      editdialogVisible: false,
      // 修改的表单
      editForm: {
        attr_name: "",
      },
      // 这样写有有bug
      // inputVisible: false,
      // inputValue: "",
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      let { data: res } = await this.$axios.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      this.catelist = res.data;
      // console.log(this.catelist);
    },

    // 级联选择框变化会触发这个函数
    handleChange() {
      this.getParamsData();
    },

    //
    handleTabClick() {
      this.getParamsData();
      // console.log(this.activeName);
    },

    // 获取数据
    async getParamsData() {
      // 因为只能选3级 所以加一个判断 如果不是3级就将数组清空
      if (this.selectkey.length !== 3) {
        this.selectkey = [];
        this.manyTableData = [],
        this.onlyTableData = []
        return;
      }
      // console.log(this.selectkey);
      // 根据所选分类的id 和当前所选面板 获取对应参数
      let { data: res } = await this.$axios.get(
        `categories/${this.cateId}/attributes`,
        { params: { sel: this.activeName } }
      );
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }

      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(",") : [];
        // 添加一个布尔值控制文本框的显示
        item.inputVisible = false;
        item.inputValue = "";
      });
      console.log(res.data);

      if (this.activeName === "many") {
        this.manyTableData = res.data;
      } else {
        this.onlyTableData = res.data;
      }
    },

    // 点击按钮添加参数
    addParams() {
      this.$refs.addForm.validate(async (valid) => {
        if (!valid) return;
        let { data: res } = await this.$axios.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName,
          }
        );
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg);
        }
        this.$message.success(res.meta.msg);
        this.getParamsData();
        this.dialogVisible = false;
      });
    },

    // 确定提交修改
    editParams() {
      this.$refs.editForm.validate(async (valid) => {
        if (!valid) return;
        let { data: res } = await this.$axios.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          { attr_name: this.editForm.attr_name, attr_sel: this.activeName }
        );
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg);
        }
        this.$message.success(res.meta.msg);
        this.getParamsData();
        this.editdialogVisible = false;
      });
    },
    // 打开修改对话框
    async showedit(id) {
      let { data: res } = await this.$axios.get(
        `categories/${this.cateId}/attributes/${id}`,
        {
          params: {
            attr_sel: this.activeName,
          },
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      this.editForm = res.data;
      // console.log(this.editForm);
      // console.log(this.addForm);
      // add和edit这两个表单可以公用一个data

      this.editdialogVisible = true;
    },

    // 删除参数
    async remove(id) {
      let res = await this.$confirm(
        "此操作将永久删除该分类, 是否继续?",
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (res == "cancel") {
        return this.$message.info("已取消");
      }
      let { data } = await this.$axios.delete(
        `categories/${this.cateId}/attributes/${id}`
      );
      if (data.meta.status !== 200) {
        return this.$message.error(data.meta.msg);
      }
      this.$message.success(data.meta.msg);
      this.getParamsData();
    },

    // 文本框失去焦点或摁下enter
    handleInputConfirm(row) {
      if(row.inputValue.trim().length === 0){
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      // 如果没有return 则证明输入的内容需要做后续处理
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false

      this.saveAttrVals(row)
    },

    async saveAttrVals(row){
      // 改变数组发起请求保存这次操作
      let {data:res} = await this.$axios.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
        attr_name:row.attr_name,attr_sel:row.attr_sel,attr_vals:row.attr_vals.join(',')
      })
      if(res.meta.status !== 200){
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
    },

    showInput(row) {
      row.inputVisible = true;
      // 让文本框自动获得焦点
      // $nextTick方法的作用:当页面上元素被重新渲染之后才会指定回调函数中的代码
      this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    // 删除对应的参数的可选项
    handleClose(i,row){
      row.attr_vals.splice(i,1)
      this.saveAttrVals(row)
    },


  },
  computed: {
    btnDisabled() {
      if (this.selectkey.length !== 3) {
        return true;
      }
      return false;
    },
    // 当前选中的三级id值
    cateId() {
      if (this.selectkey.length === 3) {
        // return最后一项
        return this.selectkey[2];
      }
    },
    // 动态计算标题文本
    title() {
      if (this.activeName === "many") {
        return "动态参数";
      } else {
        return "静态属性";
      }
    },
  },
};
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}
.el-tag {
  margin: 0 15px;
}
.input-new-tag {
  width: 150px;
  margin-left: 15px;
}
.button-new-tag{
  margin-left: 15px;
}
</style>
