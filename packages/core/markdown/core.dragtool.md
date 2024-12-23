<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@mo-yu/core](./core.md) &gt; [DragTool](./core.dragtool.md)

## DragTool class

全屏拖拽

**Signature:**

```typescript
export declare class DragTool extends ToolBase<DragToolOptions, any>
```

**Extends:** [ToolBase](./core.toolbase.md)<!-- -->&lt;[DragToolOptions](./core.dragtooloptions.md)<!-- -->, any&gt;

## Example

```ts
const drag = new DragTool({
  handleId: '',
  targetId: ''
})

drag.enable()
drag.locate('center')
```

## Constructors

| Constructor                                                | Modifiers | Description                                                  |
| ---------------------------------------------------------- | --------- | ------------------------------------------------------------ |
| [(constructor)(options)](./core.dragtool._constructor_.md) |           | Constructs a new instance of the <code>DragTool</code> class |

## Methods

| Method                                        | Modifiers | Description            |
| --------------------------------------------- | --------- | ---------------------- |
| [destroy()](./core.dragtool.destroy.md)       |           | 功能销毁               |
| [enable()](./core.dragtool.enable.md)         |           | 功能启用               |
| [locate(position)](./core.dragtool.locate.md) |           | 定位拖动元素到设定位置 |
