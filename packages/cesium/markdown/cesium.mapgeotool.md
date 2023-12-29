<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@mo-yu/cesium](./cesium.md) &gt; [MapGeoTool](./cesium.mapgeotool.md)

## MapGeoTool class

添加 geojson

**Signature:**

```typescript
export declare class MapGeoTool extends ToolBase<ToolBaseOptions, MapGeoToolEvents>
```

**Extends:** ToolBase&lt;ToolBaseOptions, MapGeoToolEvents&gt;

## Example

```ts
const tool = new MapGeoTool({})

tool.enable()
tool.addGeo(config, false, config.id)
```

## Constructors

| Constructor                                                    | Modifiers | Description                                                    |
| -------------------------------------------------------------- | --------- | -------------------------------------------------------------- |
| [(constructor)(options)](./cesium.mapgeotool._constructor_.md) |           | Constructs a new instance of the <code>MapGeoTool</code> class |

## Methods

| Method                                                  | Modifiers | Description                                         |
| ------------------------------------------------------- | --------- | --------------------------------------------------- |
| [addGeo(option)](./cesium.mapgeotool.addgeo.md)         |           | 添加 GeoJson                                        |
| [clear()](./cesium.mapgeotool.clear.md)                 |           | 清除所有矢量                                        |
| [destroy()](./cesium.mapgeotool.destroy.md)             |           | 销毁                                                |
| [enable()](./cesium.mapgeotool.enable.md)               |           | 启用                                                |
| [getGeoById(id)](./cesium.mapgeotool.getgeobyid.md)     |           | 根据 id 获取 GeoJsonDataSource，请自行维护唯一 name |
| [locateGeo(id)](./cesium.mapgeotool.locategeo.md)       |           | 定位至 GeoJson                                      |
| [toggleGeo(id, show)](./cesium.mapgeotool.togglegeo.md) |           | GeoJson 显隐                                        |