<template>
  <el-container class="home-container">
    <!-- 页面头部 -->
    <el-header>
      <div>
        <img src="../assets/head.gif" />
        <span>后台管理系统</span>
      </div>
      <el-button @click="logout" type="info">退出</el-button>
    </el-header>
    <!-- 页面主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggle">|||</div>
        <!-- 侧边栏菜单 -->
        <el-menu
          :collapse="isCollapse"
          :collapse-transition="false"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          unique-opened
          router
          :default-active="activePath"
        >
          <!-- 一级菜单的模板区 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menulist"
            :key="item.id"
          >
            <template slot="title">
              <i :class="icons[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/' + subItem.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧主体内容 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      // 侧边栏数据
      menulist: [],
      icons: {
        125: "el-icon-s-custom",
        103: "el-icon-s-platform",
        101: "el-icon-s-goods",
        102: "el-icon-s-order",
        145: "el-icon-s-data",
      },
      // 是否折叠
      isCollapse: false,
      // 保活
      activePath:''
    };
  },
  created() {
    this.getMenuList();
    this.activePath = window.sessionStorage.getItem('active')
  },
  methods: {
    // 退出登录
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    async getMenuList() {
      let { data: res } = await this.$axios.get("menus");
      // console.log(res);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.menulist = res.data;
      console.log(this.menulist);
    },
    // 侧边栏折叠
    toggle() {
      this.isCollapse = !this.isCollapse;
    },
    //  保活 
    saveNavState(e){
      window.sessionStorage.setItem('active',e)
      this.activePath = e
    },
  },
};
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}

.el-aside{
  transition: 0.5s;
}

.el-menu {
  border-right: none;
}

.el-header {
  background-color: rgb(88, 198, 231);
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 26px;
  > div {
    display: flex;
    align-items: center;
    font-weight: 600;
  }
  img {
    width: 50px;
    height: 44px;
    background-color: #fff;
    border-radius: 50%;
  }
  span {
    margin-left: 8px;
  }
}

.el-aside {
  // background-color: rgb(242, 221, 157);
  background-color: #545c64;
}

.el-main {
  background-color: #ccc;
}

.toggle-button {
  background-color: #545c64;
  color: #fff;
  font-size: 10px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
