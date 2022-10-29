// 获取本地音视频流
export const getLocalStream = async (constraints: MediaStreamConstraints) => {
  // 获取媒体流
  const stream = await navigator.mediaDevices.getUserMedia(constraints)
}
