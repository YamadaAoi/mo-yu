<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@mo-yu/core](./core.md)

## core package

## Classes

| Class                                      | Description                                                                                                           |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| [BufferReader](./core.bufferreader.md)     | 二进制数据读取                                                                                                        |
| [DragTool](./core.dragtool.md)             | 全屏拖拽                                                                                                              |
| [EventBus](./core.eventbus.md)             |                                                                                                                       |
| [FullscreenTool](./core.fullscreentool.md) | 全屏                                                                                                                  |
| [LocaleTool](./core.localetool.md)         | 国际化工具类 T - 语言类型，例如'zh_cn' \| 'en_us' C - 语言配置，是一个简单的 object 类型，字段类型为 string 或 object |

## Abstract Classes

| Abstract Class                 | Description |
| ------------------------------ | ----------- |
| [ToolBase](./core.toolbase.md) | 工具抽象类  |

## Functions

| Function                                                  | Description                |
| --------------------------------------------------------- | -------------------------- |
| [debounce(this, func, delay)](./core.debounce.md)         | 简易防抖                   |
| [download(url, fileName)](./core.download.md)             | 下载                       |
| [fixed(value, len)](./core.fixed.md)                      | 保留 len 位小数            |
| [getDefault(defaultValue, initial)](./core.getdefault.md) | 初始化变量                 |
| [guid()](./core.guid.md)                                  | 生成唯一 id                |
| [isNull(value)](./core.isnull.md)                         | 是无效数据                 |
| [isNumber(value)](./core.isnumber.md)                     | 是否是数字或者数字字符串   |
| [readText(blob)](./core.readtext.md)                      | 读取 blob 为纯文本         |
| [saveAsJson(data, fileName)](./core.saveasjson.md)        | 下载 json 对象为 json 文件 |

## Interfaces

| Interface                                                | Description                                                                                   |
| -------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| [DragToolOptions](./core.dragtooloptions.md)             | 拖拽工具入参                                                                                  |
| [FullscreenToolOptions](./core.fullscreentooloptions.md) | 全屏工具入参                                                                                  |
| [LocaleSource](./core.localesource.md)                   | 国际化各语言配置                                                                              |
| [LocaleToolEvents](./core.localetoolevents.md)           | 国际化事件                                                                                    |
| [LocaleToolOptions](./core.localetooloptions.md)         | 国际化工具实现类入参 初始化语言优先级：上次选中语言 优先于 defaultLanguage 优先于 source\[0\] |
| [ToolBaseOptions](./core.toolbaseoptions.md)             | 实例化基本参数                                                                                |

## Variables

| Variable                     | Description                                            |
| ---------------------------- | ------------------------------------------------------ |
| [remTool](./core.remtool.md) | PC 端 Rem 适配方案 设计稿默认 1920 设计稿 100px = 1rem |

## Type Aliases

| Type Alias                                 | Description                     |
| ------------------------------------------ | ------------------------------- |
| [LocaleKeys](./core.localekeys.md)         | 国际化配置所有键值              |
| [OriginPosition](./core.originposition.md) | 默认位置 居中，右上，右下，右中 |
