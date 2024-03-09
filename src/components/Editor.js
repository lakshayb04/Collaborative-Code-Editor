import React, { useEffect, useRef } from "react";
import Codemirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/addon/edit/closetag.js";
import "codemirror/addon/edit/closebrackets.js";

const Editor = ({ socketRef, roomId, changeCode}) => {
  const editorRef = useRef(null);

  function init() {
    editorRef.current = Codemirror.fromTextArea(
      document.getElementById("editor"),
      {
        mode: { name: "javascript", json: true },
        theme: "dracula",
        autoCloseTags: true,
        autoCloseBrackets: true,
        lineNumbers: true,
      }
    );

    editorRef.current.on("change", (instance, changes) => {
      const { origin } = changes;
      const code = instance.getValue();
      changeCode(code);
      if (origin !== "setValue") {
        socketRef.current.emit("code-change", {
          roomId,
          code,
        });
      }
    });

  }

  useEffect(() => {
    init();
  }, []);


  useEffect(()=>{
    if(socketRef.current){
        socketRef.current.on('code-change', ({code})=>{
            if(code){
                editorRef.current.setValue(code);
            }
        })
    }

    return ()=>{
        socketRef.current.off('code-change');
    }
  },[socketRef.current])

  return <textarea id="editor" className="editor-textarea"></textarea>;
};

export default Editor;
