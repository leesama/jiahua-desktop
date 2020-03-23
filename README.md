<!--
 * @Author: leecho
 * @Date: 2020-03-06 20:33:19
 * @LastEditors: leecho
 * @LastEditTime: 2020-03-23 15:38:23
 * @FilePath: \jiahua-desktop\README.md
 -->
<p align="center">
  <a href="#简介">简介</a>&nbsp;|&nbsp;<a href="#项目细节">项目细节</a>
</p>

![](https://img.shields.io/badge/版本-1.0.0-lightgrey.svg)
![](https://img.shields.io/badge/脚手架-ElectronReact-lightgrey.svg)
![](https://img.shields.io/badge/license-MIT-lightgrey.svg)
![](https://img.shields.io/badge/developer-@leesama-lightgrey.svg)

## 简介

使用react hooks+redux+antd+electron+typescript 开发的设备管理系统

## 项目概览

redux实现全局loading
使用 react-redux useSelector useDispatch 操作redux
使用useMemo 缓存部分变量和组件 
使用useCallback缓存部分函数
使用useHistory切换路由
添加修改删除设备标签
根据设备标签生成表单
添加修改删除表单
根据不同标签类型显示不同表单控件
antd编辑表格
antd自定义表单验证
所有组件均采用react hooks编写
封装httpapi方法用于请求小程序云服务器
使用两次以上模块封装为组件



