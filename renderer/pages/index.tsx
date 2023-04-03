import { useEffect, useState } from 'react'
import Link from 'next/link'
import Layout from '../components/Layout'

const IndexPage = () => {
  useEffect(() => {
    const handleMessage = (_event, args) => alert(args)

    // add a listener to 'message' channel
    global.ipcRenderer.addListener('message', handleMessage)
    global.ipcRenderer.addListener('url-change', onUrlChangedByApp)

    return () => {
      global.ipcRenderer.removeListener('message', handleMessage)
      global.ipcRenderer.removeListener('url-change', onUrlChangedByApp)
    }
  }, [])

  const onSayHiClick = () => {
    global.ipcRenderer.send('message', 'hi from next')
  }

  const onUrlChange = (e) => {
    setUrlState(e.target.value)
    console.log(e);
    /*if(e.keyCode == 13) */ //global.ipcRenderer.send('url-change', e.target.value)
  }

  const onUrlSubmit = (e) => {
    if(e.key == "Enter") global.ipcRenderer.send('url-change', e.target.value)
  }
  const [urlState, setUrlState] = useState("初期値");
  let url_input = <input id="url" type="text" onChange={onUrlChange} onKeyDown={onUrlSubmit} value={urlState}></input>
  const onUrlChangedByApp = (_e, msg) => {
    console.log(msg);
    setUrlState(msg);
  }

  return (
    <Layout title="Home | Next.js + TypeScript + Electron Example">
      <div id="bar">
        {url_input}
      </div>
    </Layout>
  )
}

export default IndexPage
