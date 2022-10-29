import { defineComponent, onMounted, reactive } from 'vue'
import classes from './index.module.scss'
let mediaRecorder: any;
export default defineComponent({
  setup() {
    console.log(classes)

    const state: any = reactive({
      mimeTypeList: [],
      form: {
        mineType: ''
      },
      recordState: 0,
    });
    const {mimeTypeList, recordState, form} = state;

    const shareScreen = async () => {
      let localStream = await navigator.mediaDevices.getDisplayMedia({
        audio: true,
        video: true,
      })
      // 播放本地视频流
      playStream(localStream)
    }

    const playStream = (stream: MediaStream) => {
      const video = document.querySelector('#localVideo') as HTMLVideoElement
      video.srcObject = stream;
    }

    const getSupportedMimeTypes = () => {
      const media = 'video'
      // 常用的视频格式
      const types = [
        'webm',
        'mp4',
        'ogg',
        'mov',
        'avi',
        'wmv',
        'flv',
        'mkv',
        'ts',
        'x-matroska',
      ]
      // 常用的视频编码
      const codecs = ['vp9', 'vp9.0', 'vp8', 'vp8.0', 'avc1', 'av1', 'h265', 'h264']
      // 支持的媒体类型
      const supported: string[] = []
      const isSupported = MediaRecorder.isTypeSupported
      // 遍历判断所有的媒体类型
      types.forEach((type: string) => {
        const mimeType = `${media}/${type}`
        codecs.forEach((codec: string) =>
          [
            `${mimeType};codecs=${codec}`,
            `${mimeType};codecs=${codec.toUpperCase()}`,
          ].forEach((variation) => {
            if (isSupported(variation)) supported.push(variation)
          }),
        )
        if (isSupported(mimeType)) supported.push(mimeType)
      })
      state.mimeTypeList = supported;
      console.log(state.mimeTypeList, '我打印的')
    }

    // 下载 Blob
    const downloadBlob =  (blob: Blob) => {
      // 将 Blob 对象转换成一个 URL 地址
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      // 设置 a 标签的 href 属性为刚刚生成的 URL 地址
      a.href = url
      // 设置 a 标签的 download 属性为文件名
      a.download = `${new Date().getTime()}.${blob.type.split('/')[1]}`
      // 模拟点击 a 标签
      a.click()
      // 释放 URL 地址
      URL.revokeObjectURL(url)
    }



    const startRecord = async () => {
      const kbps = 1024
      const Mbps = kbps * kbps
      const options = {
        audioBitsPerSecond: 128000,
        videoBitsPerSecond: 2500000,
        mimeType: 'video/webm; codecs="vp8,opus"',
      }
      let localStream = await navigator.mediaDevices.getDisplayMedia({
        audio: true,
        video: true,
      })
      mediaRecorder = new MediaRecorder(localStream, options)
      console.log(mediaRecorder, '我的属性')
      mediaRecorder.start()
      state.recordState = 1;
      

      mediaRecorder.ondataavailable = (e) => {
        // 将录制的数据合并成一个 Blob 对象
        // const blob = new Blob([e.data], { type: e.data.type })

        // 🌸重点是这个地方，我们不要把获取到的 e.data.type设置成 blob 的 type，而是直接改成 mp4
        const blob = new Blob([e.data], { type: 'video/mp4' })
        downloadBlob(blob)
      }
      mediaRecorder.onstop = (e: Event) => {
        // 停止录制
      }
    }

    const stopRecord = () => {
      mediaRecorder.stop();
    }

    const pausedRecord = () => {
      mediaRecorder.pause();
      state.recordState = 2;
      console.log(mediaRecorder, '我的属性')
    }
    
    const reStartRecord = () => {
      mediaRecorder.resume();
      state.recordState = 1;
      console.log(mediaRecorder, '我的属性')
    }



    onMounted(() => {
      getSupportedMimeTypes();
    })

    return () => {
      return (
      <div class={classes.container}>
        <div class={classes.videoBox}>
          <video id="localVideo" autoplay playsinline muted></video>
        </div>
        <div class={classes.footer}>
          <div class={classes.box}>
            <el-select v-model={form.mineType}>
              {
                state.mimeTypeList.map((item: any) => {
                  return (
                    <el-option label={item} value={item}></el-option>
                  )
                })
              }
            </el-select>
          </div>
          <div class={classes.box}>
            <el-button onClick={shareScreen}>分享屏幕</el-button>
            {
              state.recordState === 0 && (
                <el-button onClick={startRecord}>开始录制</el-button>
              )
            }
            {
              state.recordState === 1 && (
                <el-button onClick={pausedRecord}>暂停录制</el-button>
              )
            }
            {
              state.recordState === 2 && (
                <el-button onClick={reStartRecord}>重新开始录制</el-button>
              )
            }
            <el-button onClick={stopRecord}>停止录制</el-button>
          </div>
        </div>
      </div>
      )
    }
  }
})
