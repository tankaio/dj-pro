# plan-station

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### 单位

> 采用 px2rem 布局 rem 单位
> 设计稿为 375 宽度.

#### 关于`v2px` 和 `px2rem` 函数

1. `v2px` 函数用于动态将设计稿尺寸转换为当前视窗尺寸.任然是`px`单位,目的是为了兼容 vant 组件,因为`vant`组件部分需要尺寸的都是以`px`为单位. **注意该函数无法根据视窗大小立即动态响应**

2. `px2rem` 函数用于将当前传入的设计稿尺寸转换为`rem`单位,用于需要使用`style`样式动态赋值的`dom`元素.**可动态变更,因为参照物是可动态变更的**


## 私有组件

[组件说明]('./docs/Template.md')
