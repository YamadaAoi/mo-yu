/*
 * @Author: zhouyinkui
 * @Date: 2022-06-28 16:03:12
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2022-10-26 17:50:56
 * @Description: maplibre gl evented，扩展maplibregl事件
 */
/**
 * Given a destination object and optionally many source objects,
 * copy all properties from the source objects into the destination.
 * The last source object given overrides properties from previous
 * source objects.
 *
 * @param dest - destination object
 * @param sources - sources from which properties are pulled
 */
export function extend(dest: any, ...sources: any[]): any {
  for (const src of sources) {
    for (const k in src) {
      dest[k] = src[k]
    }
  }
  return dest
}

export type Listener = (a: any) => any

interface Listeners {
  [_: string]: Listener[]
}

function _addEventListener(
  type: string,
  listener: Listener,
  listenerList: Listeners
) {
  const listenerExists = listenerList[type]?.includes(listener)
  if (!listenerExists) {
    listenerList[type] = listenerList[type] || []
    listenerList[type].push(listener)
  }
}

function _removeEventListener(
  type: string,
  listener: Listener,
  listenerList: Listeners
) {
  if (listenerList?.[type]) {
    const index = listenerList[type].indexOf(listener)
    if (index !== -1) {
      listenerList[type].splice(index, 1)
    }
  }
}

export class Event {
  readonly type: string

  constructor(type: string, data: any = {}) {
    extend(this, data)
    this.type = type
  }
}

interface ErrorLike {
  message: string
}

export class ErrorEvent extends Event {
  error!: ErrorLike

  constructor(error: ErrorLike, data: any = {}) {
    super('error', extend({ error }, data))
  }
}

/**
 * Methods mixed in to other classes for event capabilities.
 */
export class Evented {
  _listeners!: Listeners
  _oneTimeListeners!: Listeners
  _eventedParent: Evented | null | undefined
  _eventedParentData: any | (() => any)

  /**
   * Adds a listener to a specified event type.
   *
   * @param type - The event type to add a listen for.
   * @param listener - The function to be called when the event is fired.
   *   The listener function is called with the data object passed to `fire`,
   *   extended with `target` and `type` properties.
   * @returns `this`
   */
  on(type: string, listener: Listener): this {
    this._listeners = this._listeners || {}
    _addEventListener(type, listener, this._listeners)

    return this
  }

  /**
   * Removes a previously registered event listener.
   *
   * @param type - The event type to remove listeners for.
   * @param listener - The listener function to remove.
   * @returns `this`
   */
  off(type: string, listener: Listener) {
    _removeEventListener(type, listener, this._listeners)
    _removeEventListener(type, listener, this._oneTimeListeners)

    return this
  }

  /**
   * Adds a listener that will be called only once to a specified event type.
   *
   * The listener will be called first time the event fires after the listener is registered.
   *
   * @param type - The event type to listen for.
   * @param listener - The function to be called when the event is fired the first time.
   * @returns `this`
   */
  once(type: string, listener: Listener) {
    this._oneTimeListeners = this._oneTimeListeners || {}
    _addEventListener(type, listener, this._oneTimeListeners)

    return this
  }

  fire(event: Event | string, properties?: any) {
    // Compatibility with (type: string, properties: Object) signature from previous versions.
    // See https://github.com/mapbox/mapbox-gl-js/issues/6522,
    //     https://github.com/mapbox/mapbox-gl-draw/issues/766
    if (typeof event === 'string') {
      event = new Event(event, properties || {})
    }

    const type = event.type

    if (this.listens(type)) {
      ;(event as any).target = this

      // make sure adding or removing listeners inside other listeners won't cause an infinite loop
      const listeners = this._listeners?.[type]
        ? this._listeners[type].slice()
        : []
      for (const listener of listeners) {
        listener.call(this, event)
      }

      const oneTimeListeners = this._oneTimeListeners?.[type]
        ? this._oneTimeListeners[type].slice()
        : []
      for (const listener of oneTimeListeners) {
        _removeEventListener(type, listener, this._oneTimeListeners)
        listener.call(this, event)
      }

      const parent = this._eventedParent
      if (parent) {
        extend(
          event,
          typeof this._eventedParentData === 'function'
            ? this._eventedParentData()
            : this._eventedParentData
        )
        parent.fire(event)
      }

      // To ensure that no error events are dropped, print them to the
      // console if they have no listeners.
    } else if (event instanceof ErrorEvent) {
      console.error(event.error)
    }

    return this
  }

  /**
   * Returns a true if this instance of Evented or any forwardeed instances of Evented have a listener for the specified type.
   *
   * @param type - The event type
   * @returns `true` if there is at least one registered listener for specified event type, `false` otherwise
   */
  listens(type: string): any {
    return (
      this._listeners?.[type]?.length > 0 ||
      this._oneTimeListeners?.[type]?.length > 0 ||
      this._eventedParent?.listens(type)
    )
  }

  /**
   * Bubble all events fired by this instance of Evented to this parent instance of Evented.
   *
   * @returns `this`
   */
  setEventedParent(parent?: Evented | null, data?: any | (() => any)) {
    this._eventedParent = parent
    this._eventedParentData = data

    return this
  }
}

export class EventBus<E> extends Evented {
  constructor() {
    super()
  }

  /**
   * 发送事件
   * @param type -
   * @param properties -
   * @returns
   */
  fire<T extends keyof E>(type: T & string, properties: E[T]): this {
    super.fire(type, properties)
    return this
  }

  /**
   * 监听事件
   * @param type -
   * @param listener -
   * @returns
   */
  on<T extends keyof E>(type: T & string, listener: (ev: E[T]) => void): this {
    super.on(type, listener)
    return this
  }

  /**
   * 取消事件监听
   * @param type -
   * @param listener -
   * @returns
   */
  off<T extends keyof E>(type: T & string, listener: (ev: E[T]) => void): this {
    super.off(type, listener)
    return this
  }

  /**
   * 监听一次
   * @param type -
   * @param listener -
   * @returns
   */
  once<T extends keyof E>(
    type: T & string,
    listener: (ev: E[T]) => void
  ): this {
    super.once(type, listener)
    return this
  }
}
