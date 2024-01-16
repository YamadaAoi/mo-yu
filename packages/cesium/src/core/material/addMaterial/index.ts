/*
 * @Author: zhouyinkui
 * @Date: 2024-01-15 14:04:25
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-01-16 15:57:56
 * @Description:
 */
import { ConstantProperty, Event, JulianDate, defined } from 'cesium'

/**
 * 自定义CustomMaterial抽象类
 */
export abstract class CustomMaterialProperty {
  protected _definitionChanged = new Event()

  abstract getType(): string

  abstract getValue(time: JulianDate, result: any): any

  abstract equals(other: any): boolean

  abstract get isConstant(): boolean

  get definitionChanged() {
    return this._definitionChanged
  }

  protected createProperty(this: any, name: string, value: any) {
    const privateName = `_${name}`
    const subscriptionName = `_${name}Subscription`
    const oldValue = this[privateName]
    const subscription = this[subscriptionName]
    if (defined(subscription)) {
      subscription()
      this[subscriptionName] = undefined
    }

    const hasValue = value !== undefined
    if (hasValue && (!defined(value) || !defined(value.getValue))) {
      value = new ConstantProperty(value)
    }

    if (oldValue !== value) {
      this[privateName] = value
      this._definitionChanged.raiseEvent(this, name, value, oldValue)
    }

    if (defined(value) && defined(value.definitionChanged)) {
      this[subscriptionName] = value.definitionChanged.addEventListener(() => {
        this._definitionChanged.raiseEvent(this, name, value, value)
      }, this)
    }
  }
}
