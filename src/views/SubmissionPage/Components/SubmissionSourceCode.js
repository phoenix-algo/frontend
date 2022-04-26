import React from "react";
import CodeEditor from '@uiw/react-textarea-code-editor';
import util from "../../../util/util";

export default function SubmissionSourceCode({problem, submission}) {
   
    const editorStyles = () => {
        return {
            fontSize: 20,
            backgroundColor: "#e0e0e0",
            fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
        }
    }

    return (
        <div>    
            <h3>Source Code</h3>
            <div style={{overflow: "auto", maxHeight: "500px"}}>
                <CodeEditor 
                    value={util.decodeBase64String(submission.SourceCode)} 
                    language={submission.Language}
                    minHeight={200}
                    placeholder=""
                    readOnly={true}
                    padding={12}
                    style={editorStyles()}
                /> 
            </div>
        </div>
    );
}
