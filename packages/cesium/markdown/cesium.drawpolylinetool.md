<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@mo-yu/cesium](./cesium.md) &gt; [DrawPolylineTool](./cesium.drawpolylinetool.md)

## DrawPolylineTool class

绘制线

**Signature:**

```typescript
export declare class DrawPolylineTool<O extends DrawPolylineToolOptions = DrawPolylineToolOptions, E extends DrawBaseEvents = DrawPolylineToolEvents> extends DrawPointTool<O, E>
```

**Extends:** [DrawPointTool](./cesium.drawpointtool.md)<!-- -->&lt;O, E&gt;

## Example

```ts
const tool = new DrawPolylineTool(options)

tool.enable()

tool.eventBus.on('left-click', onLeftClick)
tool.eventBus.on('mouse-move', onMouseMove)
tool.eventBus.on('right-click', onRightClick)
tool.eventBus.on('left-dbclick', onLeftDBClick)
```

## Constructors

| Constructor                                                          | Modifiers | Description                                                          |
| -------------------------------------------------------------------- | --------- | -------------------------------------------------------------------- |
| [(constructor)(options)](./cesium.drawpolylinetool._constructor_.md) |           | Constructs a new instance of the <code>DrawPolylineTool</code> class |

## Properties

| Property                                                        | Modifiers              | Type                           | Description        |
| --------------------------------------------------------------- | ---------------------- | ------------------------------ | ------------------ |
| [curLine](./cesium.drawpolylinetool.curline.md)                 | <code>protected</code> | any \| undefined               | 绘制中的线实体     |
| [floatLine](./cesium.drawpolylinetool.floatline.md)             | <code>protected</code> | Entity \| undefined            | 移动的线实体       |
| [floatLinePoints](./cesium.drawpolylinetool.floatlinepoints.md) | <code>protected</code> | Cartesian3\[\]                 | 移动的线的点       |
| [onLeftClick](./cesium.drawpolylinetool.onleftclick.md)         | <code>protected</code> | (point: Cartesian3) =&gt; void |                    |
| [onLeftDBClick](./cesium.drawpolylinetool.onleftdbclick.md)     | <code>protected</code> | () =&gt; void                  |                    |
| [onMouseMove](./cesium.drawpolylinetool.onmousemove.md)         | <code>protected</code> | (point: Cartesian3) =&gt; void |                    |
| [onRightClick](./cesium.drawpolylinetool.onrightclick.md)       | <code>protected</code> | () =&gt; void                  |                    |
| [polyCollection](./cesium.drawpolylinetool.polycollection.md)   | <code>protected</code> | PrimitiveCollection            | 绘制完成的实体集合 |

## Methods

| Method                                                                         | Modifiers              | Description                                |
| ------------------------------------------------------------------------------ | ---------------------- | ------------------------------------------ |
| [clear()](./cesium.drawpolylinetool.clear.md)                                  |                        | 清空绘制结果，等待下轮绘制                 |
| [clearFloat()](./cesium.drawpolylinetool.clearfloat.md)                        | <code>protected</code> | 清除浮动实体                               |
| [createLFloatLine()](./cesium.drawpolylinetool.createlfloatline.md)            | <code>protected</code> | 创建拖拽线                                 |
| [createLine(positions)](./cesium.drawpolylinetool.createline.md)               | <code>protected</code> | 创建线                                     |
| [destroy()](./cesium.drawpolylinetool.destroy.md)                              |                        | 销毁                                       |
| [enable()](./cesium.drawpolylinetool.enable.md)                                |                        | 启用                                       |
| [handleLineLeftClick(point)](./cesium.drawpolylinetool.handlelineleftclick.md) | <code>protected</code> | 处理线鼠标左击事件                         |
| [stop()](./cesium.drawpolylinetool.stop.md)                                    |                        | 传递本轮绘制结果，不再绘制，不清空绘制结果 |
