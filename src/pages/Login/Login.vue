<template>
     <section class="loginContainer">
      <div class="loginInner">
        <div class="login_header">
          <h2 class="login_logo">东东外卖</h2>
          <div class="login_header_title">
            <a href="javascript:;" :class="{on:loginWay}" @click="loginWay=true">短信登录</a>
            <a href="javascript:;" :class="{on:!loginWay}" @click="loginWay=false">密码登录</a>
          </div>
        </div>
        <div class="login_content">
          <form @submit.prevent="login">
            <div :class="{on:loginWay}">
              <section class="login_message">
                <input type="tel" maxlength="11" placeholder="手机号" v-model="phone">
                <button :disabled="!rightPhone" class="get_verification" :class="{right_phone:rightPhone}" @click.prevent="getCode">{{computeTime>0?`以发送(${computeTime}s)`:'获取验证码'}}</button>
              </section>
              <section class="login_verification">
                <input type="tel" maxlength="8" placeholder="验证码" v-model="code">
              </section>
              <section class="login_hint">
                温馨提示：未注册东东外卖帐号的手机号，登录时将自动注册，且代表已同意
                <a href="javascript:;">《用户服务协议》</a>
              </section>
            </div>
            <div :class="{on:!loginWay}">
              <section>
                <section class="login_message">
                  <input type="text" maxlength="11" placeholder="手机/邮箱/用户名" v-model="name">
                </section>
                <section class="login_verification">
                  <input type="text" maxlength="8" v-if="showPwd" placeholder="密码" v-model="pwd">
                  <input type="password" maxlength="8" placeholder="密码" v-else v-model="pwd">
                  <div class="switch_button" :class="showPwd? 'on' :'off'" @click="showPwd=!showPwd">
                    <div class="switch_circle" :class="{right:showPwd}"></div>
                    <span class="switch_text">{{showPwd?"abc":"..."}}</span>
                  </div>
                </section>
              </section>
            </div>
            <button class="login_submit">登录</button>
          </form>
          <a href="javascript:;" class="about_us">关于我们</a>
        </div>
        <a href="javascript:" class="go_back" @click="$router.back()">
          <i class="iconfont icon-jiantou2"></i>
        </a>
      </div>
      <AlertTip :alertText="alertText" v-show="showAlert" @closeTip="closeTip"></AlertTip>
    </section>
</template>
<script>
import AlertTip from '../../components/AlertTip/AlertTip.vue'
/* eslint-disable */
import {reqSendCode, reqSmsLogin, reqPwdLogin,reqcaptcha} from '../../api'
import {mapState,mapMutations} from 'vuex'
export default {
  data () {
    return {
      loginWay: true, // true代表短信登陆 ，false密码登陆
      computeTime: 0,
      showPwd: false, // 是否显示密码
      phone: '',
      code: '', // 短信验证码
      codes: '', // session短信验证码
      pwd: '',
      name: '', // 用户名
      captcha: '', // 图形验证码
      alertText: '',
      showAlert: false // 是否显示提示框
    }
  },
  computed: {
    rightPhone () {
      return /^1\d{10}$/.test(this.phone)
    }
  },
  methods: {
     ...mapMutations(['changeName']),
    // 异步获取短信验证码
  async getCode () {
      // 倒计时
      // 如果当前没有几时
      if (!this.computeTime) {
        this.computeTime = 30
       this.timer = setInterval(() => {
          this.computeTime--
          if (this.computeTime === 0) {
            clearInterval(this.timer)
          }
        }, 1000)
        const result=await reqSendCode(this.phone)
        if(result.code===0){
          //显示提示
          console.log(result)
          sessionStorage.setItem("code",result.msg);
          console.log(sessionStorage.getItem('code'))
          this.codes=sessionStorage.getItem('code')
            this.showAlert1("请输入验证码")
          //停止倒计时
          if(this.computeTime){
            this.computeTime=0
            clearInterval(this.timer)
            this.timer=undefined;
          }
        }
      }

      // 发送ajax请求
    },
    showAlert1 (alertText) {
      this.showAlert = true
      this.alertText = alertText
    },
    async login () {
      let result
      /* eslint-disable */
      if (this.loginWay) {
        // 短信登陆
        const {rightPhone, phone, code} = this
        if(!this.rightPhone){
            this.showAlert1('手机号不正确')
            return
        }else if(!/^\d{6}$/.test(code)){
          //验证码必须是6位
           this.showAlert1('验证码必须是6位')
           return
        }
       //result=await reqSmsLogin(phone,code)
       result=this.codes

       if(this.codes==this.code){ 
         sessionStorage.setItem("phone",this.phone);
         this.$router.replace('/profile')}
       else{return console.log("大错误")}
        //if(result.code===0){
          //const user=result.data
          //console.log(result)}
         //else{ const msg=result.msg}
         } 
      else {
        const {name, pwd, captcha} = this
        if(!this.name){
          //用户名必须制定
           this.showAlert1('用名错误')
           return
        }else if(!this.pwd){
             this.showAlert1('密码错误')
             return
        }
       
       result=await reqPwdLogin({name, pwd});
   
      }
        if(this.computeTime){
            this.computeTime=0
            clearInterval(this.timer)
            this.timer=undefined;
          }
      //根据结果处理
      if(result.code==0){
         //console.log(this.name,this.pwd)
          const user=result.data
          console.log("处理结果")
          console.log(result.data.name)
          console.log(result.code)
          sessionStorage.setItem("name",result.data.name);
          sessionStorage.setItem("code",result.code);
          console.log(sessionStorage.getItem('name'))
          //将user保存到vuex的state;
          //this.$store.dispatch("recordUser",user)
           //this.$store.dispatch('recordUser', user)
           
          //去个人中心页面
         this.$router.replace('/profile')
         

           


        }else{ 
          console.log(result.code)
          const msg=result.msg
          //显示新的图片验证码
          
          this.showAlert1(msg)
        }
    },
    closeTip(){
      this.showAlert = false
      this.alertText = ""
    }
  },
  components:{
    AlertTip
  },
  created() {

  
    
  
  },
}
</script>
<style lang="stylus" rel="stylesheet/stylus"  type="text/stylus">
       .loginInner
        padding-top 60px
        width 80%
        margin 0 auto
        .login_header
          .login_logo
            font-size 40px
            font-weight bold
            color #02a774
            text-align center
          .login_header_title
            padding-top 40px
            text-align center
            >a
              color #333
              font-size 14px
              padding-bottom 4px
              &:first-child
                margin-right 40px
              &.on
                color #02a774
                font-weight 700
                border-bottom 2px solid #02a774
        .login_content
          >form
            >div
              display none
              &.on
                display block
              input
                width 100%
                height 100%
                padding-left 10px
                box-sizing border-box
                border 1px solid #ddd
                border-radius 4px
                outline 0
                font 400 14px Arial
                &:focus
                  border 1px solid #02a774
              .login_message
                position relative
                margin-top 16px
                height 48px
                font-size 14px
                background #fff
                .get_verification
                  position absolute
                  top 50%
                  right 10px
                  transform translateY(-50%)
                  border 0
                  color #ccc
                  font-size 14px
                  background transparent
                  &.right_phone
                    color black
              .login_verification
                position relative
                margin-top 16px
                height 48px
                font-size 14px
                background #fff
                .switch_button
                  font-size 12px
                  border 1px solid #ddd
                  border-radius 8px
                  transition background-color .3s,border-color .3s
                  padding 0 6px
                  width 30px
                  height 16px
                  line-height 16px
                  color #fff
                  position absolute
                  top 50%
                  right 10px
                  transform translateY(-50%)
                  &.off
                    background #fff
                    .switch_text
                      float right
                      color #ddd
                  &.on
                    background #02a774
                  >.switch_circle
                    position absolute
                    top -1px
                    left -1px
                    width 16px
                    height 16px
                    border 1px solid #ddd
                    border-radius 50%
                    background #fff
                    box-shadow 0 2px 4px 0 rgba(0,0,0,.1)
                    transition transform 2s
                    &.right
                      transform translateX(30px)
              .login_hint
                margin-top 12px
                color #999
                font-size 14px
                line-height 20px
                >a
                  color #02a774
            .login_submit
              display block
              width 100%
              height 42px
              margin-top 30px
              border-radius 4px
              background #4cd96f
              color #fff
              text-align center
              font-size 16px
              line-height 42px
              border 0
          .about_us
            display block
            font-size 12px
            margin-top 20px
            text-align center
            color #999
        .go_back
          position absolute
          top 5px
          left 5px
          width 30px
          height 30px
          >.iconfont
            font-size 20px
            color #999
</style>
