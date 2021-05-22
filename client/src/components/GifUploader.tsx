import "../stylesheets/GifUploader.scss";
import React from "react";
import Dropzone from "./Dropzone";
import {ErrorMessage} from "./ErrorMessage";
import axios, {AxiosInstance} from "axios";
import {ORIGINAL_GIF} from "../api-paths";

export interface Props {
    onGifUpload: (() => void);
}

enum ErrorMsgType {
    fileSelect,
    fileUpload
}

type State = {
    selectedFile: File | null;
    uploadedFile: string | null;
    uploadState: "none" | "uploading" | "uploaded" | "error";
    error: { [key in ErrorMsgType]: string | null };
};

/** Uploads user-selected gif file to server,
 * using Dropzone for file selection. */
class GifUploader extends React.Component<Props, State> {
    state: State = {
        selectedFile: null,
        uploadedFile: null,
        uploadState: "none",
        error: {[ErrorMsgType.fileSelect]: null, [ErrorMsgType.fileUpload]: null}
    };
    private axiosClient: AxiosInstance;

    constructor(props: any) {
        super(props);
        this.onFileSelect = this.onFileSelect.bind(this);
        this.DisplaySelectedFile = this.DisplaySelectedFile.bind(this);
        this.onClickUpload = this.onClickUpload.bind(this);
        this.onClickNext = this.onClickNext.bind(this);
        this.UploadStatusMessage = this.UploadStatusMessage.bind(this);

        this.axiosClient = axios.create({
            baseURL: process.env.REACT_APP_BASEURL,
            responseType: "json",
            headers: {
                "Content-Type": "application/json"
            }
        });
    }

    // EVENT HANDLERS

    // Handles files selected by Dropzone
    private onFileSelect(files: File[]) {
        let validFile = null;
        for (let file of files) {
            if (this.validateFileType(file)) {
                validFile = file;
            }
        }

        if (validFile) {
            this.setState({selectedFile: validFile});
            this.setErrorMessage(ErrorMsgType.fileSelect, null);
        } else {
            this.setErrorMessage(ErrorMsgType.fileSelect, "No file of type .gif selected.");
        }
    }

    // Attempts to upload selected file to server
    private async onClickUpload(e: any) {
        if (!this.state.selectedFile) {
            this.setErrorMessage(ErrorMsgType.fileUpload, "No selected file to upload.");
            return;
        }

        console.log("Uploading file from GifUploader: " + this.state.selectedFile);
        let formData = new FormData();
        formData.append("file", this.state.selectedFile as File, this.state.selectedFile.name);
        this.setState({uploadState: "uploading"});
        try {
            const res = await this.axiosClient.put("/api" + ORIGINAL_GIF,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                });

            this.setState({uploadState: "uploaded"});
            this.setState({uploadedFile: res.data.name});
            this.setErrorMessage(ErrorMsgType.fileUpload, null);
        } catch (error: any) {
            this.setState({uploadState: "error"});
            if (error && error.response) {
                this.setErrorMessage(ErrorMsgType.fileSelect, error.message);
            } else if (error.request) {
                this.setErrorMessage(ErrorMsgType.fileSelect,
                    "Failed to upload, no response from server.");
            } else {
                this.setErrorMessage(ErrorMsgType.fileSelect,
                    "Failed to upload: " + error.message);
            }
        }
    }

    private onClickNext(e: any) {
        this.props.onGifUpload();
    }

    // UTILITY FUNCTIONS

    // Sets error message of specific type to be displayed
    private setErrorMessage(errorType: ErrorMsgType, message: string | null) {
        let errMessages = this.state.error;
        errMessages[errorType] = message;
        this.setState({error: errMessages});
    }

    // Validates file as gif
    private validateFileType(file: File) {
        return file.type === "image/gif";
    }

    // Formats file size with appropriate units
    private formatFileSize(size: number) {
        if (size === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
        const i = Math.floor(Math.log(size) / Math.log(k));
        return parseFloat((size / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    }

    // Prepares HTML for file preview, if a file has been selected
    DisplaySelectedFile() {
        if (this.state.selectedFile) {
            return (
                <div>
                    <div className="file-status-bar">
                        <span> Selected file: </span>
                        <span className="file-name"> {this.state.selectedFile.name} </span>
                        <span className="file-size"> {this.formatFileSize(this.state.selectedFile.size)} </span>
                    </div>
                </div>);
        } else {
            return (<div className="file-status-bar"></div>);
        }
    }

    UploadStatusMessage() {
        if (this.state.uploadState === "none") {
            return null;
        } else if (this.state.uploadState === "error") {
            return (<ErrorMessage message={this.state.error[ErrorMsgType.fileUpload]}/>);
        }

        let msg: String = "";
        if (this.state.uploadState === "uploading") {
            msg = "Uploading";
        } else if (this.state.uploadState === "uploaded" && this.state.uploadedFile) {
            msg = "File uploaded: " + this.state.uploadedFile;
        }

        return (
            <p className="upload-status-message">
                {msg}
            </p>);
    }

    render() {
        return (
            <div>
                <div className="gif-uploader-container">
                    <Dropzone
                        onFileSelect={this.onFileSelect}
                        acceptedTypes="image/gif"
                        allowMultiple={false}/>
                    <ErrorMessage message={this.state.error[ErrorMsgType.fileSelect]}/>
                    <this.DisplaySelectedFile/>
                    <button type="button"
                            onClick={this.onClickUpload}
                            className="upload-button"
                            disabled={!this.state.selectedFile ||
                            this.state.uploadState === "uploading"}>
                        Upload file
                    </button>
                    <this.UploadStatusMessage/>
                    <button type="button"
                            onClick={this.onClickNext}
                            className="continue-button"
                            disabled={this.state.uploadState !== "uploaded"}>
                        Next
                    </button>
                </div>
            </div>
        );
    }
}

export default GifUploader;