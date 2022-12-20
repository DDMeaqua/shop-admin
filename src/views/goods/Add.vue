<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-alert title="添加商品信息" type="info" show-icon :closable="false">
      </el-alert>

      <!-- 步骤条 -->
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- tab栏 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          v-model="activeIndex"
          :tab-position="'left'"
          :before-leave="beforeTabLeave"
          @tab-click="tabClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>

            <!-- 级联选择器组件 -->
            <el-form-item label="商品分类" prop="goods_cat">
              <Select @key="key"></Select>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyTableData"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="cb"
                  v-for="(cb, i) in item.attr_vals"
                  :key="i"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTableData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="商品图片" name="3">
            <!-- action图片上传的api地址 -->
            <el-upload
              :on-success="handleSuccess"
              :headers="headerObj"
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </el-tab-pane>

          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button type="primary" class="addbtn" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览 -->
    <el-dialog
      title="图片预览"
      :visible.sync="previewVisible"
      width="50%"
    >
      <img :src="previewPath" class="pic">
    </el-dialog>
  </div>
</template>

<script>
import Select from "../../components/Select";
export default {
  components: { Select },
  data() {
    return {
      activeIndex: "0",
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品分类的数组
        goods_cat: [],
        // 图片的数组
        pics: [],
        // 商品详情
        goods_introduce:'',
        attrs:[]
      },
      addFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" },
        ],
      },
      manyTableData: [],
      onlyTableData: [],
      // 上传图片请求头
      headerObj: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      previewPath: "",
      previewVisible:false,
    };
  },
  methods: {
    // 父子组件传参
    key(keys) {
      // console.log(keys);
      this.addForm.goods_cat = keys;
      // console.log(this.addForm.goods_cat);
    },
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === "0" && this.addForm.goods_cat.length !== 3) {
        this.$message.error("请选择商品分类");
        return false;
      }
    },
    async tabClick() {
      // console.log(this.activeIndex);
      // 如果是'1' 证明访问的是动态参数面板
      if (this.activeIndex === "1") {
        let { data: res } = await this.$axios.get(
          `categories/${this.cateId}/attributes`,
          { params: { sel: "many" } }
        );
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg);
        }
        // console.log(res.data);
        res.data.forEach((item) => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(",");
        });
        this.manyTableData = res.data;
        console.log('manyTableData:',this.manyTableData);
      }

      if (this.activeIndex === "2") {
        let { data: res } = await this.$axios.get(
          `categories/${this.cateId}/attributes`,
          { params: { sel: "only" } }
        );
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg);
        }
        // console.log(res.data);
        this.onlyTableData = res.data;
        console.log('onlyTableData:',this.onlyTableData);
      }
    },

    // 处理图片预览效果
    handlePreview(file) {
      // console.log(file);
      this.previewPath = file.response.data.url;
      this.previewVisible = true
    },

    // 处理移除图片的操作
    handleRemove(file) {
      // 获取将要删除图片的临时路径
      let filePath = file.response.data.tmp_path;
      // 从pics数组中找到这个图片对应的索引值
      let i = this.addForm.pics.findIndex((x) => x.pic === filePath);
      // 调用数组的splice方法把图片信息对象从pics数组中移除
      this.addForm.pics.splice(i, 1);
      console.log(this.addForm);
    },

    // 监听函数上传成功的事件
    handleSuccess(response) {
      // console.log(response);
      // 拼接得到一个图片信息对象
      let picInfo = { pic: response.data.tmp_path };
      // 将图片信息对象push到pics数组中
      this.addForm.pics.push(picInfo);
      console.log(this.addForm);
    },

    add(){
      this.$refs.addFormRef.validate(async valid => {
        if(!valid){
          return this.$message.error('请填写必要的表单项')
        }
        // 执行添加的业务逻辑
        this.addForm.goods_cat = this.addForm.goods_cat.join(',') 
        // 处理动态参数
        this.manyTableData.forEach(item => {
          let newInfo = {attr_id:item.attr_id,attr_value:item.attr_vals.join(',')}    
          // console.log(newInfo);
          this.addForm.attrs.push(newInfo)
        })
        // 处理静态属性
        this.onlyTableData.forEach(item => {
          let newInfo = {attr_id:item.attr_id,attr_value:item.attr_vals}
          this.addForm.attrs.push(newInfo)
        })

        console.log(this.addForm);

        let {data:res} = await this.$axios.post('goods',this.addForm)
        if(res.meta.status !== 201){
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.$router.push('/goods')
      
      })
    },
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2];
      }
      return null;
    },
  },
};
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0;
}
.pic{
  width: 100%;
}

.addbtn{
  margin-top: 15px;
}
</style>
