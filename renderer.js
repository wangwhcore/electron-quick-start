const openButton = document.getElementById('openButton');
const saveButton = document.getElementById('saveButton');
const debugButton = document.getElementById('debugButton');

const runButton = document.getElementById('runButton');
const tree = document.getElementById('tree');
const editor = document.getElementById('editor');
const React = require('react');
const ReactDOM = require('react-dom');
const { createRoot } = require('react-dom/client');
// 获取主进程中的模块
import TextEditor from './src/editor/TextEditor';
// const TextEditor = require('./editor/TextEditor');
const root = document.getElementById('editor');
const reactRoot = createRoot(root);

// 在根元素中渲染你的 React 组件
ReactDOM.render(

    <TextEditor initialContent="Hello, Electron and React!" />, root
);
// 添加按钮点击事件处理逻辑
openButton.addEventListener('click', async () => {
    try {
        // 向主进程发送消息，请求打开文件对话框
        const filePath = await window.electron.ipcRenderer.invoke('open-file-dialog');

        // 读取文件内容并显示在编辑区域
        const fileContent = await window.electron.fs.readFile(filePath, 'utf-8');
        // editor.innerHTML  = fileContent.replace(/\n/g, '<br>');
        // 在渲染新内容之前卸载已有的组件
        // 在更新之前检查是否已有组件在容器中
        const existingComponent = ReactDOM.unmountComponentAtNode(root);

        // 如果有已有组件，先卸载
        if (existingComponent) {
            // existingComponent.remove();
        }
        ReactDOM.render(<TextEditor initialContent={fileContent.replace(/\n/g, '<br>')} />, root);

    } catch (error) {
        console.error('Error:', error);
    }
});
debugButton.addEventListener('click', () => {
    console.log('Debug clicked');
    // 在编辑区域显示内容
    editor.textContent = 'Debug button clicked';
});
// 添加保存按钮点击事件处理逻辑
saveButton.addEventListener('click', async () => {
    try {
        console.log('saveButton clicked');
        // 获取编辑区域的内容
        const contentToSave = editor.textContent;
        // 弹出保存文件对话框
        const { filePath } = await window.electron.ipcRenderer.invoke('save-file-dialog'); 

        // 使用 fs.writeFile 将内容写入文件
        await window.electron.fs.writeFile(filePath, contentToSave, 'utf-8');

        console.log('File saved successfully!');
    } catch (error) {
        console.error('Error saving file:', error);
    }
});

runButton.addEventListener('click', () => {
    console.log('Run clicked');
    // 在编辑区域显示内容
    editor.textContent = 'Run button clicked';
});

// 添加树节点点击事件处理逻辑
tree.addEventListener('click', (event) => {
    if (event.target.tagName === 'LI') {
        // 处理树节点点击逻辑
        const methodName = event.target.textContent;
        console.log(`Method selected: ${methodName}`);

        // 在编辑区域显示内容
        // editor.textContent = `You selected method: ${methodName}`;
        // const existingComponent = ReactDOM.unmountComponentAtNode(root);

        // // 如果有已有组件，先卸载
        // if (existingComponent) {
        //     existingComponent.remove();
        // }
        setTimeout(() => {
            ReactDOM.render(<TextEditor initialContent={methodName.replace(/\n/g, '<br>')} />, root);
        }, 150);
    }
})
