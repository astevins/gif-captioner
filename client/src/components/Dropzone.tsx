import React, {ChangeEvent} from "react";
import "../stylesheets/Dropzone.scss";

// Used tutorial to help with file drop zone:
// https://blog.logrocket.com/create-a-drag-and-drop-component-with-react-dropzone/

export interface Props {
    /** Callback when files are selected by drag & drop
     * or by click & select. */
    onFileSelect: (files: File[]) => void;

    /** If true, dropzone will allow multiple files to be selected.
     * If false, dropzone will only accept one selected file. */
    allowMultiple: boolean;

    /** File types to be accepted by "click & select" file selector window
     * (not drag & drop).
     *
     * See valid types:
     * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#unique_file_type_specifiers */
    acceptedTypes: string;
}

export type State = {
    draggedOver: boolean;
};

/** Offers two options for user file selection:
 * * Drag and drop file(s) into the dropzone
 * * Click to select files from file selection window */
export default class Dropzone extends React.Component<Props, State> {
    public static defaultProps: Partial<Props> = {
        allowMultiple: true,
        acceptedTypes: "*"
    };

    state: State = {draggedOver: false};

    constructor(props: Props) {
        super(props);
        this.dragEnterHandler = this.dragEnterHandler.bind(this);
        this.dragLeaveHandler = this.dragLeaveHandler.bind(this);
        this.fileDropHandler = this.fileDropHandler.bind(this);
        this.clickFileSelectHandler = this.clickFileSelectHandler.bind(this);
    }

    private dragOverHandler(e: React.DragEvent) {
        e.preventDefault();
    }

    private dragEnterHandler(e: React.DragEvent) {
        e.preventDefault();
        this.setState({draggedOver: true});
    }

    private dragLeaveHandler(e: React.DragEvent) {
        e.preventDefault();
        this.setState({draggedOver: false});
    }

    private fileDropHandler(e: React.DragEvent) {
        e.preventDefault();
        console.log("fileDrop");
        if (e.dataTransfer && e.dataTransfer.files.length) {
            if (this.props.allowMultiple) {
                this.props.onFileSelect(Array.from(e.dataTransfer.files));
            } else {
                this.props.onFileSelect([e.dataTransfer.files[0]]);
            }
        }
        this.setState({draggedOver: false});
    }

    private clickFileSelectHandler(e: ChangeEvent<HTMLInputElement>) {
        e.preventDefault();
        console.log("file select");
        if (e.target.files) {
            this.props.onFileSelect(Array.from(e.target.files));
        }
    }

    render() {
        const dropContainerClassName = "drop-container"
            + (this.state.draggedOver ? "-dragged-over" : "");

        return (
            <label htmlFor="file-input">
                <div className={dropContainerClassName}
                     aria-label="dropzone"
                     title="dropzone"
                     onDragEnter={this.dragEnterHandler}
                     onDragLeave={this.dragLeaveHandler}
                     onDragOver={this.dragOverHandler}
                     onDrop={this.fileDropHandler}>
                    <input id="file-input"
                           type="file"
                           title="file input"
                           accept={this.props.acceptedTypes}
                           style={{display: "none"}}
                           multiple={this.props.allowMultiple}
                           onChange={this.clickFileSelectHandler}/>
                    <div className="drop-message-container"
                         onDrop={this.fileDropHandler}>
                        <div className="upload-icon"></div>
                        <p onDrop={this.fileDropHandler}>
                            {this.state.draggedOver ?
                                "Drop file"
                                : "Drag & drop file here or click to select"}
                        </p>
                    </div>
                </div>
            </label>
        );
    }
}