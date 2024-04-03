/*
 * @Author: zhouyinkui
 * @Date: 2024-03-28 10:41:11
 * @LastEditors: zhouyinkui
 * @LastEditTime: 2024-03-28 13:47:01
 * @Description: 资源预加载
 */
import { ToolBase, ToolBaseOptions } from '@mo-yu/core'

export type ResourceType = 'json' | 'blob' | 'arrayBuffer'

export interface ResourceConfig {
  id: string
  type: ResourceType
  url: string
}

interface CacheInfo {
  data?: any
  promise?: Promise<any>
}

interface ResourceToolEvents {}

export const ResourcePrefix = 'MOYU#'

class ResourceTool extends ToolBase<ToolBaseOptions, ResourceToolEvents> {
  #configs: ResourceConfig[] = []
  #cache = new Map<string, CacheInfo>()
  /**
   * 启用
   */
  enable(): void {
    //
  }

  /**
   * 销毁
   */
  destroy(): void {
    //
  }

  /**
   * 初始化资源列表
   * @param configs - 资源列表
   */
  initResource(configs: ResourceConfig[]) {
    this.#configs = configs
  }

  /**
   * 获取资源，若是以MOYU#开头的字符串，则截取MOYU#后的字符串为id，查询资源
   * @param config - 资源参数
   * @returns
   */
  async getResource(config: any) {
    let resource: any
    if (typeof config === 'string' && config.startsWith(ResourcePrefix)) {
      const id = config.split(ResourcePrefix)[1]
      resource = await this.getResourceById(id)
    } else {
      resource = config
    }
    return resource
  }

  /**
   * 根据id获取资源
   * @param id - 资源id
   * @returns
   */
  async getResourceById(id: string) {
    const config = this.#configs.find(c => c.id === id)
    if (config) {
      return await this.#resourceRequest(config)
    }
  }

  async #resourceRequest(config: ResourceConfig) {
    const cache = this.#cache.get(config.id)
    if (cache) {
      if (cache.promise) {
        return await cache.promise
      } else {
        return cache.data
      }
    } else {
      const promise = this.#tryResource(config, 0)
      this.#cache.set(config.id, { promise })
      const data = await promise
      this.#cache.delete(config.id)
      if (data) {
        this.#cache.set(config.id, { data })
      }
      return data
    }
  }

  async #tryResource(config: ResourceConfig, count = 3): Promise<any> {
    try {
      return await this.#fetchResource(config)
    } catch (error) {
      if (count <= 0) {
        console.error(`请求资源【${config.url}】失败！${error}`)
      } else {
        count--
        console.warn(`请求资源【${config.url}】异常！正在重试${count}...`)
        return await this.#tryResource(config, count)
      }
    }
  }

  async #fetchResource(config: ResourceConfig) {
    let res = undefined
    const data = await fetch(config.url, {
      method: 'get'
    })
    if (data.status === 200) {
      const type = config.type ?? 'json'
      if (type === 'json') {
        res = await data.json()
      } else if (type === 'blob') {
        res = await data.blob()
      } else if (type === 'arrayBuffer') {
        res = await data.arrayBuffer()
      }
    } else {
      throw new Error()
    }
    return res
  }
}

/**
 * 地图资源存储对象
 */
export const resourceTool = new ResourceTool({})
