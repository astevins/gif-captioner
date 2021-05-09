import React from "react";
import '../stylesheets/Dropzone.scss';

export interface Props {
    onUpload: (files: FileList) => void
}

type State = {
    dragCounter: number;
};

// Used tutorial to help with file drop zone:
// https://blog.logrocket.com/create-a-drag-and-drop-component-with-react-dropzone/
export default class Dropzone extends React.Component<Props, State> {
    private readonly onUpload: (files: FileList) => void;

    state: State = {dragCounter: 0};

    constructor(props: Props) {
        super(props);
        this.onUpload = props.onUpload;
        this.fileDropHandler = this.fileDropHandler.bind(this);
        this.dragEnterHandler = this.dragEnterHandler.bind(this);
        this.dragLeaveHandler = this.dragLeaveHandler.bind(this);
        this.dragOverHandler = this.dragOverHandler.bind(this);
    }

    dragOverHandler(e: React.DragEvent) {
        e.preventDefault();
    }

    dragEnterHandler(e: React.DragEvent) {
        e.preventDefault();
        console.log("Drag enter")
        this.setState({dragCounter: 1});
    }

    dragLeaveHandler(e: React.DragEvent) {
        e.preventDefault();
        console.log("Drag leave")
        this.setState({dragCounter: 0});
    }

    fileDropHandler(e: React.DragEvent) {
        e.preventDefault();
        console.log("fileDrop");
        if (e.dataTransfer && e.dataTransfer.files.length) {
            this.onUpload(e.dataTransfer.files);
        }
        this.setState({dragCounter: 0});
    }

    onClick(e: React.MouseEvent) {
        e.preventDefault();
    }

    render() {
        return (
            <div className="drop-container"
                 onDragEnter={this.dragEnterHandler}
                 onDragLeave={this.dragLeaveHandler}
                 onDragOver={this.dragOverHandler}
                 onDrop={this.fileDropHandler}
                 onClick={this.onClick}
                 style={{
                     background: this.state.dragCounter? "#e2e2e2" : "#ffffff"
                 }}>
                <div className="drop-message"
                     id="drop-message-container"
                     onDrop={this.fileDropHandler}>
                    <div className="upload-icon"></div>
                    <p id="drop-message"
                       onDrop={this.fileDropHandler}>
                        {this.state.dragCounter?
                            "Drop file"
                            : "Drag & drop gif here or click to select"}
                    </p>
                </div>
            </div>
        )
    }
}