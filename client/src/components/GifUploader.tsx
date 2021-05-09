import '../stylesheets/GifUploader.scss';
import React from "react";
import Dropzone from "./Dropzone";

type State = {
    selectedFile: File | null;
    errorMessage: string | null;
};

class GifUploader extends React.Component<any, State> {
    state: State = {
        selectedFile: null,
        errorMessage: null
    };

    constructor(props: any) {
        super(props);
        this.onFileSelect = this.onFileSelect.bind(this);
        this.DisplayFile = this.DisplayFile.bind(this);
        this.ErrorMessage = this.ErrorMessage.bind(this);
    }

    onFileSelect(files: FileList) {
        console.log("onUpload called");
        let validFile = null;
        for (let file of files) {
            if (this.validateFile(file)) {
                validFile = file;
            }
        }

        if (validFile) {
            console.log("Got valid file: " + validFile.name);
            this.setState({selectedFile: validFile});
            this.setState({errorMessage: null});
        } else {
            this.setState({errorMessage: "Invalid file uploaded."});
        }
    }

    onClickUpload(e: any) {
        return;
    }

    validateFile(file: File) {
        return file.type === "image/gif";
    }

    fileSize(size: number) {
        if (size === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(size) / Math.log(k));
        return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    ErrorMessage() {
        if (this.state.errorMessage) {
            return (<p className="error-msg">
                        {this.state.errorMessage}
                    </p>);
        } else {
            return null;
        }
    }

    DisplayFile() {
        if (this.state.selectedFile) {
            console.log("Displaying selected file");
            return (
                <div>
                    <div className="file-status-bar">
                        <span> Selected file: </span>
                        <span className="file-name"> {this.state.selectedFile.name} </span>
                        <span className="file-size"> {this.fileSize(this.state.selectedFile.size)} </span>
                    </div>
                </div>);
        } else {
            return (<div className="file-status-bar"></div>);
        }
    }

    render() {
        console.log("Rendering gif uploader")
        return (
            <div>
                <div className="gif-uploader-container">
                    <Dropzone onUpload={this.onFileSelect}/>
                    <this.ErrorMessage />
                    <this.DisplayFile />
                    <button type="button"
                            onClick={this.onClickUpload}
                            className="upload-button"
                            disabled={!this.state.selectedFile}>
                        Upload file
                    </button>
                </div>
            </div>
        );
    }
}

export default GifUploader;