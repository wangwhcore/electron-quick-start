const { contextBridge, ipcRenderer } = require('electron')

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})

contextBridge.exposeInMainWorld('electron', {
    fs: require('fs').promises, // 将 fs.promises 暴露给渲染进程
    ipcRenderer: {
        invoke: async (channel, ...args) => {
            return await ipcRenderer.invoke(channel, ...args);
        },
    },
})
