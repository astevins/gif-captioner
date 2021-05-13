import {GifCaptioner} from "./GifCaptioner";

export class Session {
    private originalGif: File | null;
    private captionedGifs: {caption: string, gif: File}[]

    constructor() {
        this.originalGif = null;
        this.captionedGifs = [];
    }

    public setOriginalGif(gif: File) {
        // TODO
        return null;
    }

    public getCaptionedGif(caption: string): Promise<File> {
        // TODO
        return Promise.reject("Not implemented.");
    }
}