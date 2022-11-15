import { useState, useEffect, useRef, createRef, useCallback } from 'react'
import classnames from 'classnames'

import styles from './index.less'

function ImageCapture(props) {
  const { onCapture, onError, userMediaConfig, className } = props
  const [streaming, setStreaming] = useState(false)
  const playerRef = createRef()
  const canvasRef = createRef()
  const tracks = useRef()

  useEffect(() => {
    let timeout
    navigator.mediaDevices
      .getUserMedia(userMediaConfig)
      .then(stream => {
        playerRef.current.srcObject = stream
        tracks.current = stream.getTracks()
        timeout = setTimeout(() => setStreaming(true), 2000)
      })
      .catch(error => {
        if (onError) onError(error)
      })
    return () => {
      if (timeout) clearTimeout(timeout)
    }
  }, [onError, userMediaConfig])

  useEffect(() => {
    return () => {
      // Stop the camera stream
      if (tracks.current) {
        tracks.current[0].stop()
      }
    }
  }, [])

  const captureImage = useCallback(() => {
    const imageWidth = playerRef.current.offsetWidth
    const imageHeight = playerRef.current.offsetHeight
    ;[canvasRef.current.width, canvasRef.current.height] = [imageWidth, imageHeight]
    const context = canvasRef.current.getContext('2d')
    context.drawImage(playerRef.current, 0, 0, imageWidth, imageHeight)

    if (onCapture) {
      canvasRef.current.toBlob(blob => {
        onCapture({
          blob,
          file: new File([blob], `${new Date().getTime()}.jpg`),
        })
      }, 'image/jpg')
    }
  }, [onCapture, canvasRef, playerRef])

  return (
    <div className={classnames(styles.imageContainer, className)}>
      <video ref={playerRef} autoPlay></video>
      {streaming && (
        <>
          <div className={styles.captureBtn} onClick={captureImage} />
          <canvas ref={canvasRef} />
        </>
      )}
    </div>
  )
}

export default ImageCapture
