export default class GifManager {
    private originalGif: { originalName: string, path: string } | null;
    private captionedGifs: { caption: string, path: string }[];

    constructor() {
        this.originalGif = null;
        this.captionedGifs = [];
    }

    public setOriginalGif(gif: { originalName: string, path: string }) {
        this.originalGif = gif;
    }

    public getCaptionedGif(caption: string): Promise<File> {
        // TODO
        return Promise.reject("Not implemented.");
    }
}