import{n as e}from"./chunk-BneVvdWh.js";import{n as t,t as n}from"./Header-DLU7i4cD.js";var r,i,a,o,s;e((()=>{t(),{fn:r}=__STORYBOOK_MODULE_TEST__,i={title:`Example/Header`,component:n,render:e=>({components:{MyHeader:n},setup(){return{args:e}},template:`<my-header :user="args.user" />`}),parameters:{layout:`fullscreen`},args:{onLogin:r(),onLogout:r(),onCreateAccount:r()},tags:[`autodocs`]},a={args:{user:{name:`Jane Doe`}}},o={args:{user:null}},a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    user: {
      name: 'Jane Doe'
    }
  }
}`,...a.parameters?.docs?.source}}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    user: null
  }
}`,...o.parameters?.docs?.source}}},s=[`LoggedIn`,`LoggedOut`]}))();export{a as LoggedIn,o as LoggedOut,s as __namedExportsOrder,i as default};