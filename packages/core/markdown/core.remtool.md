<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@mo-yu/core](./core.md) &gt; [remTool](./core.remtool.md)

## remTool variable

PC 端 Rem 适配方案 设计稿默认 1920 设计稿 100px = 1rem 会基于 devicePixelRatio 和设计稿缩放 body

**Signature:**

```typescript
remTool: RemTool
```

## Example

```ts
import { remTool } from '@mo-yu/core'

remTool.resetDesignSize(1440)
remTool.enable()
remTool.eventBus.on('rem-refresh', e => {
  console.log(e.zoom, e.rem)
})
```
