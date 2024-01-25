import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import * as A from "@automerge/automerge"

import { isValidAutomergeUrl, Repo } from '@automerge/automerge-repo'
import { BroadcastChannelNetworkAdapter } from '@automerge/automerge-repo-network-broadcastchannel'
import { IndexedDBStorageAdapter } from '@automerge/automerge-repo-storage-indexeddb'
import { RepoContext } from '@automerge/automerge-repo-react-hooks'

const repo = new Repo({
  network: [new BroadcastChannelNetworkAdapter()],
  storage: new IndexedDBStorageAdapter(),
})

declare global {
  interface Window {
      handle: DocHandle<unknown>
  }
}

const rootDocUrl = `${document.location.hash.substr(1)}`
let handle
if (isValidAutomergeUrl(rootDocUrl)) {
  console.log('valid');
  handle = repo.find(rootDocUrl)
} else {
  handle = repo.create<{counter?: A.Counter}>()
  handle.change(d => d.counter = new A.Counter())
}
const docUrl = document.location.hash = handle.url
window.handle = handle

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RepoContext.Provider value={repo}>
      <App docUrl={docUrl} />
    </RepoContext.Provider>
  </React.StrictMode>,
)
