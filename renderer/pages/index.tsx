import { useEffect } from 'react'
import Link from 'next/link'
import Layout from '../components/Layout'

const IndexPage = () => {
  useEffect(() => {
    const handleMessage = (_event, args) => alert(args)

    // add a listener to 'message' channel
    global.ipcRenderer.addListener('message', handleMessage)

    return () => {
      global.ipcRenderer.removeListener('message', handleMessage)
    }
  }, [])

  const onSayHiClick = () => {
    global.ipcRenderer.send('message', 'hi from next')
  }

  const onUrlChange = (e) => {
    if(e.keyCode == 13) global.ipcRenderer.send('urlChange', e.target.value)
  }

  return (
    <Layout title="Home | Next.js + TypeScript + Electron Example">
      <div id="bar">
        <input id="url" type="text" onKeyDown={onUrlChange}></input>
      </div>
    </Layout>
  )
}

export default IndexPage
