<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@mo-yu/core](./core.md) &gt; [EventBus](./core.eventbus.md) &gt; [on](./core.eventbus.on.md)

## EventBus.on() method

监听事件

**Signature:**

```typescript
on<T extends keyof E>(type: T & string, listener: (ev: E[T]) => void): this;
```

## Parameters

| Parameter | Type                    | Description |
| --------- | ----------------------- | ----------- |
| type      | T &amp; string          |             |
| listener  | (ev: E\[T\]) =&gt; void |             |

**Returns:**

this
