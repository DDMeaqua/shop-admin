<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button @click="addUserdialogVisible = true" type="primary"
            >添加角色</el-button
          >
        </el-col>
      </el-row>

      <el-table :data="rolelist" style="width: 100%" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染1级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRight(scope.row, item1.id)">
                  {{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染2级和3级权限 -->
              <el-col :span="19">
                <!-- 通过for循环 嵌套渲染二级权限 -->
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRight(scope.row, item2.id)"
                    >
                      {{ item2.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="(item3, i3) in item2.children"
                      :key="i3"
                      closable
                      @close="removeRight(scope.row, item3.id)"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="500px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeUser(scope.row.id)"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightdialogVisible"
      width="50%"
      @close="setRightdialogClosed"
    >
      <el-tree
        :data="rightlist"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defkeys"
        ref="treeRef"
      >
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addUserdialogVisible"
      width="50%"
      @close="AddClosed"
    >
      <!-- 添加角色表单 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addUserdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改角色对话框 -->
    <el-dialog title="修改角色" :visible.sync="editdialogVisible" width="50%">
      <el-form
        :model="editForm"
        :rules="addFormRules"
        ref="editRef"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 所有角色列表数据
      rolelist: [],
      setRightdialogVisible: false,
      // 所有权限的数据
      rightlist: [],
      treeProps: {
        label: "authName",
        children: "children",
      },
      // 默认选中的节点id数组
      defkeys: [],
      // 当前即将分配权限的角色id
      roleId: "",
      addUserdialogVisible: false,
      addForm: {
        roleName: "",
        roleDesc: "",
      },
      editForm: {},
      addFormRules: {
        roleName: [
          { required: true, message: "请输入角色名", trigger: "blur" },
          // { min: 3, max: 10, message: "用户名长度在3-10之间" },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
          // { min: 6, max: 15, message: "密码长度在6-10之间" },
        ],
      },
      editdialogVisible: false,
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    // 获取角色权限列表
    async getRolesList() {
      let { data: res } = await this.$axios.get("roles");
      // console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色列表失败");
      }

      this.rolelist = res.data;
      // console.log(this.rolelist);
    },

    // 根据id删除权限
    async removeRight(role, rightId) {
      // console.log(role,rightId);
      let res = await this.$confirm("此操作将取消该权限, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).catch((err) => err);

      if (res !== "confirm") {
        return this.$message.info("操作取消");
      }

      let { data } = await this.$axios.delete(
        `roles/${role.id}/rights/${rightId}`
      );
      console.log(data);
      if (data.meta.status !== 200) {
        return this.$message.error("删除失败");
      }
      this.$message.success("删除成功");
      // this.getRolesList()

      // 更新权限且页面不会重新渲染
      role.children = data.data;
    },

    // 展示分配权限的对话框
    async showSetRightDialog(role) {
      this.roleId = role.id;
      // console.log(role);
      // 获取所有权限数据
      let { data: res } = await this.$axios.get("rights/tree");
      if (res.meta.status !== 200) {
        return this.$message.error("获取数据失败");
      }
      // 把获取到的权限数据保存在data中
      this.rightlist = res.data;
      // console.log(this.rolelist);
      // console.log(this.rightlist);

      this.getLeafKeys(role, this.defkeys);

      this.setRightdialogVisible = true;
    },

    // 通过递归获取三级权限的所有id提供给el-tree使用
    getLeafKeys(node, arr) {
      // 如果不包含children 则是三级节点
      if (!node.children) {
        return arr.push(node.id);
      }

      node.children.forEach((item) => {
        this.getLeafKeys(item, arr);
      });
    },

    // 解决权限列表点击后不清空，点其他角色权限叠加的bug
    // 监听分配权限对话框的关闭事件
    setRightdialogClosed() {
      this.defkeys = [];
    },

    // 点击为角色分配权限
    async allotRights() {
      let keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        this.$refs.treeRef.getHalfCheckedKeys(),
      ];

      // console.log(keys);

      let idStr = keys.join(",");
      // console.log(idStr);

      let { data: res } = await this.$axios.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("修改失败");
      }

      this.$message.success("修改成功");

      this.getRolesList();

      this.setRightdialogVisible = false;
    },

    // 添加用户
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        // console.log(valid);
        if (!valid) return;

        let { data: res } = await this.$axios.post("roles", this.addForm);
        console.log(res);
        if (res.meta.status !== 201) {
          return this.$message.error("添加失败");
        }

        this.$message.success("添加成功");

        this.getRolesList();

        this.addUserdialogVisible = false;
      });
    },

    AddClosed() {
      // 重置表单
      this.$refs.addFormRef.resetFields();

      // this.addForm.roleName = "";
      // this.addForm.roleDesc = "";
    },

    // 删除角色
    async removeUser(id) {
      // console.log(id);
      let res = await this.$confirm("是否删除角色？", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).catch((err) => err);
      if (res == "cancel") {
        return this.$message.info("已取消");
      }
      let { data } = await this.$axios.delete(`roles/${id}`);
      if (data.meta.status !== 200) {
        return this.$message.error("删除失败");
      }
      this.$message.success("删除成功");
      this.getRolesList();
    },

    // 编辑角色 前拿到相关信息
    async showEditDialog(id) {
      let { data: res } = await this.$axios.get(`roles/${id}`);
      // console.log(res);
      if (res.meta.status !== 200) return;
      // console.log(res.data);
      this.editForm = res.data;
      this.editdialogVisible = true;
    },

    // 编辑并修改角色
    editUserInfo() {
      this.$refs.editRef.validate(async (valid) => {
        if (!valid) return;
        let { data: res } = await this.$axios.put(
          `roles/${this.editForm.roleId}`,
          { roleName: this.editForm.roleName, roleDesc: this.editForm.roleDesc }
        );
        console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error("修改失败");
        }
        this.editdialogVisible = false;
        this.getRolesList();
        this.$message.success("修改成功");
      });
    },
  },
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>
