// TextEditor.js

import React, { useState, useEffect } from 'react';

import SimpleMDEEditor from 'react-simplemde-editor'
import 'easymde/dist/easymde.min.css';
import * as marked from 'marked';
const TextEditor = ({ initialContent }) => {
    const [markdown, setMarkdown] = useState(initialContent || '');

    const handleChange = (e) => {
        console.log(123123)
        setMarkdown(e.target.value);
    };
    useEffect(() => {
        updatePreview();
    }, [markdown])

    const updatePreview = () => {
        const htmlContent = marked.parse(markdown);
        document.getElementById('editor').innerHTML = htmlContent;
    }
    const activeFile = { id: 123, body: 456 };
    return (
        <div>
        <div> 
             {/* <textarea
                    value={markdown}
                    onChange={handleChange}
                    rows="10"
                    cols="80"
                    placeholder="Type your Markdown here..."
                ></textarea> */}
            <SimpleMDEEditor
                value={markdown}
                onChange={setMarkdown}
                options={{
                    spellChecker: false, // 关闭拼写检查
                }}
                autoFocus
                onBlur={() => {
                    // Manually focus on the editor when it loses focus
                    document.querySelector('.CodeMirror textarea').focus();
                  }}
                ></SimpleMDEEditor>
        </div>
        <div>
        <h2>Markdown Output</h2>
   
      </div>
      </div>
    );
}
export default TextEditor;
