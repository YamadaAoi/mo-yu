<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@mo-yu/core](./core.md) &gt; [LocaleTool](./core.localetool.md)

## LocaleTool class

国际化工具类 T - 语言类型，例如'zh\_cn' \| 'en\_us' C - 语言配置，是一个简单的object类型，字段类型为string或object

<b>Signature:</b>

```typescript
export declare class LocaleTool<T, C> extends ToolBase<ToolBaseOptions, RemToolEvents<T>> 
```
<b>Extends:</b> [ToolBase](./core.toolbase.md)<!-- -->&lt;[ToolBaseOptions](./core.toolbaseoptions.md)<!-- -->, RemToolEvents&lt;T&gt;&gt;

## Example


```ts
type LocaleType = 'zh_cn' | 'en_us'

interface LocaleConfig {
  common: {
    confirm: string
    cancel: string
  }
}

const locale = new LocaleTool<LocaleType, LocaleConfig>({})
locale.setLocale('zh_cn', () => import('../../locale/zh_cn'))
locale.setLocale('en_us', () => import('../../locale/en_us'))
locale.changeLanguage('zh_cn')
console.log(locale.current?.common.confirm)
console.log(locale.i18n('common.confirm'))
```

## Properties

|  Property | Modifiers | Type | Description |
|  --- | --- | --- | --- |
|  [cache](./core.localetool.cache.md) | <code>readonly</code> | Map&lt;T, LocaleCache&lt;C&gt;&gt; | 获取多个语言环境缓存 |
|  [current](./core.localetool.current.md) | <code>readonly</code> | C \| undefined | 获取当前语言环境语言配置 |

## Methods

|  Method | Modifiers | Description |
|  --- | --- | --- |
|  [changeLanguage(language)](./core.localetool.changelanguage.md) |  | 改变语言环境 |
|  [destroy()](./core.localetool.destroy.md) |  | 功能销毁 |
|  [enable()](./core.localetool.enable.md) |  | 功能启用 |
|  [i18n(key)](./core.localetool.i18n.md) |  | 根据国际化键值返回字符串 |
|  [setLocale(type, generate)](./core.localetool.setlocale.md) |  | 设置国际化配置 |
