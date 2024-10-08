<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@mo-yu/cesium](./cesium.md) &gt; [BaseMapTool](./cesium.basemaptool.md)

## BaseMapTool class

**Signature:**

```typescript
export declare class BaseMapTool extends ToolBase<ToolBaseOptions, BaseMapToolEvents>
```

**Extends:** ToolBase&lt;ToolBaseOptions, [BaseMapToolEvents](./cesium.basemaptoolevents.md)<!-- -->&gt;

## Constructors

| Constructor                                                     | Modifiers | Description                                                     |
| --------------------------------------------------------------- | --------- | --------------------------------------------------------------- |
| [(constructor)(options)](./cesium.basemaptool._constructor_.md) |           | Constructs a new instance of the <code>BaseMapTool</code> class |

## Properties

| Property                                   | Modifiers | Type   | Description |
| ------------------------------------------ | --------- | ------ | ----------- |
| [baseMap](./cesium.basemaptool.basemap.md) |           | string |             |
| [terrain](./cesium.basemaptool.terrain.md) |           | string |             |

## Methods

| Method                                                                           | Modifiers | Description                                                                            |
| -------------------------------------------------------------------------------- | --------- | -------------------------------------------------------------------------------------- |
| [addImagery(config)](./cesium.basemaptool.addimagery.md)                         |           | 底图添加(默认只有一个底图) 添加时清除前一个底图                                        |
| [addImageryLayer(config)](./cesium.basemaptool.addimagerylayer.md)               |           | 影像切片类图层添加                                                                     |
| [addTerrain(config)](./cesium.basemaptool.addterrain.md)                         |           | 添加地形                                                                               |
| [clear()](./cesium.basemaptool.clear.md)                                         |           | 底图还原                                                                               |
| [destroy()](./cesium.basemaptool.destroy.md)                                     |           | 销毁                                                                                   |
| [enable()](./cesium.basemaptool.enable.md)                                       |           | 启用                                                                                   |
| [getImageryLayerById(id)](./cesium.basemaptool.getimagerylayerbyid.md)           |           | 根据 id 获取影像切片图层列表                                                           |
| [getTerrainProvider(config, update)](./cesium.basemaptool.getterrainprovider.md) |           | 获取地形对象                                                                           |
| [locateImageryLayer(id)](./cesium.basemaptool.locateimagerylayer.md)             |           | 定位至影像                                                                             |
| [removeImageryLayer(id)](./cesium.basemaptool.removeimagerylayer.md)             |           | 移除影像切片                                                                           |
| [toggleImageryLayer(id, show)](./cesium.basemaptool.toggleimagerylayer.md)       |           | 影像切片显隐                                                                           |
| [tryImagery(config)](./cesium.basemaptool.tryimagery.md)                         |           | 按条件地图服务加载，先加载默认地图，判断条件 condition 若为 true，替换为 map           |
| [tryImageryLayer(config)](./cesium.basemaptool.tryimagerylayer.md)               |           | 按条件影像切片类图层加载，先加载默认影像切片，判断条件 condition 若为 true，替换为 map |
