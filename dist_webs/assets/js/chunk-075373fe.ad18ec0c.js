(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-075373fe"],{"5cf1":function(e,o,t){},"8de4":function(e,o,t){"use strict";t.d(o,"a",(function(){return s}));var r=t("720d"),i=t.n(r),n="MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBANL378k3RiZHWx5AfJqdH9xRNBmD9wGD\n2iRe41HdTNF8RUhNnHit5NpMNtGL0NPTSSpPjjI1kJfVorRvaQerUgkCAwEAAQ==";function s(e){var o=new i.a;return o.setPublicKey(n),o.encrypt(e)}},b13e:function(e,o,t){e.exports=t.p+"assets/img/background.9fbb9927.jpg"},dd7b:function(e,o,t){"use strict";t.r(o);var r=function(){var e=this,o=e.$createElement,t=e._self._c||o;return t("div",{staticClass:"login",style:"background-image:url("+e.Background+");"},[t("el-form",{ref:"loginForm",staticClass:"login-form",attrs:{model:e.loginForm,rules:e.loginRules,"label-position":"left","label-width":"0px"}},[t("h3",{staticClass:"title"},[e._v("后台管理系统")]),e._v(" "),t("el-form-item",{attrs:{prop:"username"}},[t("el-input",{attrs:{type:"text","auto-complete":"off",placeholder:"账号"},model:{value:e.loginForm.username,callback:function(o){e.$set(e.loginForm,"username",o)},expression:"loginForm.username"}},[t("svg-icon",{staticClass:"el-input__icon input-icon",attrs:{slot:"prefix","icon-class":"user"},slot:"prefix"})],1)],1),e._v(" "),t("el-form-item",{attrs:{prop:"password"}},[t("el-input",{attrs:{type:"password","auto-complete":"off",placeholder:"密码"},nativeOn:{keyup:function(o){return!o.type.indexOf("key")&&e._k(o.keyCode,"enter",13,o.key,"Enter")?null:e.handleLogin(o)}},model:{value:e.loginForm.password,callback:function(o){e.$set(e.loginForm,"password",o)},expression:"loginForm.password"}},[t("svg-icon",{staticClass:"el-input__icon input-icon",attrs:{slot:"prefix","icon-class":"password"},slot:"prefix"})],1)],1),e._v(" "),t("el-form-item",{attrs:{prop:"code"}},[t("el-input",{staticStyle:{width:"63%"},attrs:{"auto-complete":"off",placeholder:"验证码"},nativeOn:{keyup:function(o){return!o.type.indexOf("key")&&e._k(o.keyCode,"enter",13,o.key,"Enter")?null:e.handleLogin(o)}},model:{value:e.loginForm.code,callback:function(o){e.$set(e.loginForm,"code",o)},expression:"loginForm.code"}},[t("svg-icon",{staticClass:"el-input__icon input-icon",attrs:{slot:"prefix","icon-class":"validCode"},slot:"prefix"})],1),e._v(" "),t("div",{staticClass:"login-code"},[t("img",{attrs:{src:e.codeUrl},on:{click:e.getCode}})])],1),e._v(" "),t("el-checkbox",{staticStyle:{margin:"0 0 25px 0"},model:{value:e.loginForm.rememberMe,callback:function(o){e.$set(e.loginForm,"rememberMe",o)},expression:"loginForm.rememberMe"}},[e._v("\n      记住我\n    ")]),e._v(" "),t("el-form-item",{staticStyle:{width:"100%"}},[t("el-button",{staticStyle:{width:"100%"},attrs:{loading:e.loading,size:"medium",type:"primary"},nativeOn:{click:function(o){return o.preventDefault(),e.handleLogin(o)}}},[e.loading?t("span",[e._v("登 录 中...")]):t("span",[e._v("登 录")])])],1)],1),e._v(" "),e.$store.state.settings.showFooter?t("div",{attrs:{id:"el-login-footer"}},[t("span",{domProps:{innerHTML:e._s(e.$store.state.settings.footerTxt)}}),e._v(" "),t("span",[e._v(" ⋅ ")]),e._v(" "),t("a",{attrs:{href:"http://www.beian.miit.gov.cn",target:"_blank"}},[e._v(e._s(e.$store.state.settings.caseNumber))])]):e._e()],1)},i=[],n=t("8de4"),s=t("83d6"),a=t.n(s),l=t("7ded"),c=t("a78e"),d=t.n(c),u=t("b13e"),m=t.n(u),p={name:"Login",data:function(){return{Background:m.a,codeUrl:"",cookiePass:"",loginForm:{username:"",password:"",rememberMe:!1,code:"",uuid:""},loginRules:{username:[{required:!0,trigger:"blur",message:"用户名不能为空"}],password:[{required:!0,trigger:"blur",message:"密码不能为空"}],code:[{required:!0,trigger:"change",message:"验证码不能为空"}]},loading:!1,redirect:void 0}},watch:{$route:{handler:function(e){this.redirect=e.query&&e.query.redirect},immediate:!0}},created:function(){this.getCode(),this.getCookie(),this.point()},methods:{getCode:function(){var e=this;Object(l["a"])().then((function(o){e.codeUrl=o.img,e.loginForm.uuid=o.uuid}))},getCookie:function(){var e=d.a.get("username"),o=d.a.get("password"),t=d.a.get("rememberMe");this.cookiePass=void 0===o?"":o,o=void 0===o?this.loginForm.password:o,this.loginForm={username:void 0===e?this.loginForm.username:e,password:o,rememberMe:void 0!==t&&Boolean(t),code:""}},handleLogin:function(){var e=this;this.$refs.loginForm.validate((function(o){var t={username:e.loginForm.username,password:e.loginForm.password,rememberMe:e.loginForm.rememberMe,code:e.loginForm.code,uuid:e.loginForm.uuid};if(t.password!==e.cookiePass&&(t.password=Object(n["a"])(t.password)),!o)return!1;e.loading=!0,t.rememberMe?(d.a.set("username",t.username,{expires:a.a.passCookieExpires}),d.a.set("password",t.password,{expires:a.a.passCookieExpires}),d.a.set("rememberMe",t.rememberMe,{expires:a.a.passCookieExpires})):(d.a.remove("username"),d.a.remove("password"),d.a.remove("rememberMe")),e.$store.dispatch("Login",t).then((function(){e.loading=!1,e.$router.push({path:e.redirect||"/"})})).catch((function(){e.loading=!1,e.getCode()}))}))},point:function(){var e=void 0!==d.a.get("point");e&&(this.$notify({title:"提示",message:"当前登录状态已过期，请重新登录！",type:"warning",duration:8e3}),d.a.remove("point"))}}},g=p,f=(t("eecc"),t("2877")),v=Object(f["a"])(g,r,i,!1,null,null,null);o["default"]=v.exports},eecc:function(e,o,t){"use strict";var r=t("5cf1"),i=t.n(r);i.a}}]);