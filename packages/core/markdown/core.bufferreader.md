<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@mo-yu/core](./core.md) &gt; [BufferReader](./core.bufferreader.md)

## BufferReader class

二进制数据读取

**Signature:**

```typescript
export declare class BufferReader
```

## Constructors

| Constructor                                                                 | Modifiers | Description                                                      |
| --------------------------------------------------------------------------- | --------- | ---------------------------------------------------------------- |
| [(constructor)(buffer, littleEndian)](./core.bufferreader._constructor_.md) |           | Constructs a new instance of the <code>BufferReader</code> class |

## Properties

| Property                                    | Modifiers             | Type        | Description      |
| ------------------------------------------- | --------------------- | ----------- | ---------------- |
| [buffer](./core.bufferreader.buffer.md)     | <code>readonly</code> | ArrayBuffer | 获取数据缓冲区   |
| [dataView](./core.bufferreader.dataview.md) | <code>readonly</code> | DataView    | 获取数据视图     |
| [offset](./core.bufferreader.offset.md)     | <code>readonly</code> | number      | 获取当前指针位置 |

## Methods

| Method                                                 | Modifiers | Description                                                   |
| ------------------------------------------------------ | --------- | ------------------------------------------------------------- |
| [readBuffer(count)](./core.bufferreader.readbuffer.md) |           | 读取指定字节数量的数据缓冲，并 skip(指定字节数量)             |
| [readFloat32()](./core.bufferreader.readfloat32.md)    |           | 读取一个 32 位单精度浮点数，并 skip(4)                        |
| [readFloat64()](./core.bufferreader.readfloat64.md)    |           | 读取一个 64 位双精度浮点数，并 skip(8)                        |
| [readInt16()](./core.bufferreader.readint16.md)        |           | 读取一个有符号双字节，并 skip(2)                              |
| [readInt32()](./core.bufferreader.readint32.md)        |           | 读取一个有符号整数，并 skip(4)                                |
| [readInt8()](./core.bufferreader.readint8.md)          |           | 读取一个有符号单字节，并 skip(1)                              |
| [readString(count)](./core.bufferreader.readstring.md) |           | 读取指定字节数量的数据缓冲转换为字符串，并 skip(指定字节数量) |
| [readUint16()](./core.bufferreader.readuint16.md)      |           | 读取一个无符号双字节，并 skip(2)                              |
| [readUint32()](./core.bufferreader.readuint32.md)      |           | 读取一个无符号整数，并 skip(4)                                |
| [readUint8()](./core.bufferreader.readuint8.md)        |           | 读取一个无符号单字节，并 skip(1)                              |
| [reset()](./core.bufferreader.reset.md)                |           | 指针复位                                                      |
| [seek(to)](./core.bufferreader.seek.md)                |           | 指针跳转到指定位置                                            |
| [skip(count)](./core.bufferreader.skip.md)             |           | 指针跳过指定字节数                                            |
