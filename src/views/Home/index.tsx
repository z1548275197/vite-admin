import { defineComponent, onMounted, reactive } from 'vue'
import classes from './index.module.scss'
export default defineComponent({
  setup() {
    console.log(classes)

    const state: any = reactive({
      topMenuList: [],
      imgList: [],
      title: '我的名字'
    });
    const {imgList, title} = state;

    // 获取本地视频流
    const getLocalStream = async (constraints: MediaStreamConstraints) => {
      // 获取媒体流
      console.log(navigator)
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      // 将媒体流设置到 video 标签上播放
      playLocalStream(stream)
    }

    // 把本地的视频流放在video标签上
    const playLocalStream = (stream: MediaStream) => {
      const videoEl = document.getElementById('localVideo') as HTMLVideoElement;
      console.log(videoEl, 'videoEl')
      console.log(stream, 'stream')
      
      videoEl.srcObject = stream
      console.log(videoEl.srcObject, 'stream')
    }

    // 拍照
    const takePhoto = () => {
      const imgList: any = [];
      const videoEl = document.getElementById('localVideo') as HTMLVideoElement
      const canvas = document.createElement('canvas')
      canvas.width = videoEl.videoWidth
      canvas.height = videoEl.videoHeight
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height)
      imgList.push(canvas.toDataURL('image/png'))
      console.log('🚀🚀🚀 / imgList', imgList)

      // 添加滤镜
      const filterList = [
        'blur(5px)', // 模糊
        'brightness(0.5)', // 亮度
        'contrast(200%)', // 对比度
        'grayscale(100%)', // 灰度
        'hue-rotate(90deg)', // 色相旋转
        'invert(100%)', // 反色
        'opacity(90%)', // 透明度
        'saturate(200%)', // 饱和度
        'saturate(20%)', // 饱和度
        'sepia(100%)', // 褐色
        'drop-shadow(4px 4px 8px blue)', // 阴影
      ]

      for (let i = 0; i < filterList.length; i++) {
        ctx.filter = filterList[i]
        ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height)
        imgList.push(canvas.toDataURL('image/png'))
      }
      state.imgList = imgList
      console.log(state.imgList, 'state.imgList')
    }

    // 获取所有视频输入设备
    async function getDevices() {
      const devices = await navigator.mediaDevices.enumerateDevices()
      console.log('🚀🚀🚀 / devices', devices)
      let videoDevices = devices.filter((device) => device.kind === 'videoinput')
    }

    // 切换设备
    // const handleDeviceChange = async () => {
    //   getLocalStream()
    //   const stream = await navigator.mediaDevices.getUserMedia({
    //     audio: false,
    //     video: {
    //       deviceId: { exact: '需要切换的设备id' },
    //     },
    //   })
    // }

    // 获取屏幕共享的媒体流
    // async function shareScreen() {
    //   let localStream = await navigator.mediaDevices.getDisplayMedia({
    //     audio: true,
    //     video: true,
    //   })
    //   // 播放本地视频流
    //   playStream(localStream)
    // }

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



    onMounted(() => {
      // getLocalStream({
      //   audio: false,
      //   video: true,
      // })
    })

    return () => {
      return (
      <div class={classes.container}>
        <div class={classes.leftContent}>
          {
            state.imgList.map((item: any) => {
              return (
                <div class={classes.imgBox}>
                  <img src={item} alt="" />
                </div>
              )
            })
          }
        </div>
        <div class={classes.rightContent}>
          <h4>{title}</h4>
          <video id="localVideo" autoplay playsinline muted></video>
          <button onClick={takePhoto}>拍照</button>
          <button onClick={shareScreen}>分享屏幕</button>
        </div>
      </div>
      )
    }
  }
})
