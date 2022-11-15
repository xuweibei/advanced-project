import React, { PureComponent } from 'react'
import shortid from 'shortid'
import EZUIKit from 'ezuikit-js'
import { getYingshiAccessToken } from '../../services/api'

const ID_PRE = 'ysplayer_'

export default class YSPlayer extends PureComponent {
  constructor(props) {
    super(props)
    this.id = shortid.generate()
    this.$node = React.createRef()
  }

  static defaultProps = {
    height: 600,
  }

  async componentDidMount() {
    const { deviceSerial, isPlayBack, begin, end, height } = this.props
    console.log(deviceSerial, 'deviceSerial888')
    try {
      const res = await getYingshiAccessToken()
      const url = isPlayBack
        ? `ezopen://open.ys7.com/${deviceSerial}/1.rec?begin=${begin}&end=${end}`
        : `ezopen://open.ys7.com/${deviceSerial}/1.hd.live`
      this.player = new EZUIKit.EZUIKitPlayer({
        id: ID_PRE + this.id,
        url,
        autoplay: true,
        controls: true,
        accessToken: res.accessToken,
        decoderPath: '/sdk',
        width: this.$node.current.offsetWidth,
        height,
        splitBasis: 1,
      })
    } catch (err) {
      console.error(err)
    }
  }

  componentWillUnmount() {
    if (this.player) {
      try {
        this.player.stop()
      } catch (err) {
        console.log('停止播放出错\n')
        console.error(err)
      }
    }
  }

  render() {
    const { height } = this.props
    return <div id={ID_PRE + this.id} ref={this.$node} style={{ height }} />
  }
}
