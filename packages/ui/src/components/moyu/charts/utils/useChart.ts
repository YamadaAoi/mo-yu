import { watch, ref, onMounted, onUnmounted, UnwrapNestedRefs } from 'vue'
import { EChartsOption, ECharts, init } from 'echarts'

export interface ChartsOption {
  chartId: string
  option?: EChartsOption
}

export default function useCharts(
  options: UnwrapNestedRefs<ChartsOption>,
  onclick?: (param: any) => void
) {
  let myChart: ECharts | undefined
  const chartId = ref('')

  watch(
    options,
    next => {
      if (next?.chartId) {
        if (next.chartId !== chartId.value) {
          chartId.value = next.chartId
          clearChart()
          initChart(next.chartId)
        }
        refresh(next.option as EChartsOption)
      } else {
        clearChart()
      }
    },
    { immediate: true }
  )

  onMounted(() => {
    window.addEventListener('resize', listenResize, false)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', listenResize)
  })

  function listenResize() {
    setTimeout(() => {
      myChart?.resize()
    }, 300)
  }

  function clearChart() {
    if (myChart) {
      myChart.dispose()
      myChart = undefined
    }
  }

  function refresh(opts?: EChartsOption) {
    if (opts && myChart) {
      myChart.setOption(opts, true)
    }
  }

  function initChart(chartId: string) {
    const chartEle: any = document.getElementById(chartId) as HTMLDivElement
    if (chartEle) {
      myChart = init(chartEle)
    }
    if (onclick) {
      myChart?.on('click', onclick)
    }
  }

  return {
    clearChart
  }
}
