/*
 * @Author: zhouyinkui
 * @Date: 2024-09-30 09:29:32
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-09-30 10:29:12
 * @Description:
 */
/**
 * 二进制数据读取
 */
export class BufferReader {
  #offset = 0
  #buffer: ArrayBuffer
  #littleEndian: boolean
  #view: DataView
  constructor(buffer: ArrayBuffer, littleEndian = true) {
    this.#buffer = buffer
    this.#littleEndian = littleEndian
    this.#view = new DataView(buffer)
  }

  /**
   * 指针跳转到指定位置
   * @param to - 指定位置
   */
  seek(to: number) {
    this.#offset = to
  }

  /**
   * 指针复位
   */
  reset() {
    this.seek(0)
  }

  /**
   * 指针跳过指定字节数
   * @param count - 指定字节数
   */
  skip(count: number) {
    const next = this.#offset + count
    this.seek(next)
  }

  /**
   * 读取一个无符号单字节，并skip(1)
   */
  readUint8() {
    const val = this.#view.getUint8(this.#offset)
    this.skip(1)
    return val
  }

  /**
   * 读取一个无符号双字节，并skip(2)
   */
  readUint16() {
    const val = this.#view.getUint16(this.#offset, this.#littleEndian)
    this.skip(2)
    return val
  }

  /**
   * 读取一个无符号整数，并skip(4)
   */
  readUint32() {
    const val = this.#view.getUint32(this.#offset, this.#littleEndian)
    this.skip(4)
    return val
  }

  /**
   * 读取一个有符号单字节，并skip(1)
   */
  readInt8() {
    const val = this.#view.getInt8(this.#offset)
    this.skip(1)
    return val
  }

  /**
   * 读取一个有符号双字节，并skip(2)
   */
  readInt16() {
    const val = this.#view.getInt16(this.#offset, this.#littleEndian)
    this.skip(2)
    return val
  }

  /**
   * 读取一个有符号整数，并skip(4)
   */
  readInt32() {
    const val = this.#view.getInt32(this.#offset, this.#littleEndian)
    this.skip(4)
    return val
  }

  /**
   * 读取一个32位单精度浮点数，并skip(4)
   */
  readFloat32() {
    const val = this.#view.getFloat32(this.#offset, this.#littleEndian)
    this.skip(4)
    return val
  }

  /**
   * 读取一个64位双精度浮点数，并skip(8)
   */
  readFloat64() {
    const val = this.#view.getFloat64(this.#offset, this.#littleEndian)
    this.skip(8)
    return val
  }

  /**
   * 读取指定字节数量的数据缓冲，并skip(指定字节数量)
   * @param count - 指定字节数量
   * @returns
   */
  readBuffer(count: number) {
    const buffer = this.#buffer.slice(this.#offset, this.#offset + count)
    this.skip(count)
    return buffer
  }

  /**
   * 读取指定字节数量的数据缓冲转换为字符串，并skip(指定字节数量)
   * @param count - 指定字节数量
   * @returns
   */
  readString(count: number) {
    return new TextDecoder().decode(new Uint8Array(this.readBuffer(count)))
  }

  /**
   * 获取当前指针位置
   */
  get offset() {
    return this.#offset
  }

  /**
   * 获取数据缓冲区
   */
  get buffer() {
    return this.#buffer
  }

  /**
   * 获取数据视图
   */
  get dataView() {
    return this.#view
  }
}
