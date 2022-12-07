<template>
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
</template>

<script>
export default {
  name: "Select",
  data() {
    return {
      selectkey: [],
      catelist: [],
      cateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    handleChange() {
      // 因为只能选3级 所以加一个判断 如果不是3级就将数组清空
      if (this.selectkey.length !== 3) {
        this.selectkey = [];
        return;
      }
    //   console.log(this.selectkey);
      this.$emit("key", this.selectkey);
    },
    async getCateList() {
      let { data: res } = await this.$axios.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      this.catelist = res.data;
      //   console.log(this.catelist);
    },
  },
};
</script>

<style lang="scss" scoped></style>
