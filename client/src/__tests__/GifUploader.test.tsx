import React from 'react';
import {render, screen} from '@testing-library/react'
import GifUploader from "../components/GifUploader";
import {initMockServer} from "../mock/mock-server";
import {Server, Registry, Response} from 'miragejs';
import {ModelDefinition, AnyFactories} from 'miragejs/-types';
import {simulateFileDrop} from "./Dropzone.test";
import userEvent from "@testing-library/user-event";

let server: Server<Registry<{ gif: ModelDefinition<{}>; }, AnyFactories>>;

describe("GifUploader", () => {
    let testGif: File;
    let testPdf: File;

    beforeAll(() => {
        testGif = new File(["data"], "toad.gif", { type: "image/gif" });
        testPdf = new File(["data"], "dragonfly.pdf", { type: "application/pdf" });
    })

    beforeEach(() => {
        server = initMockServer();
    });

    afterEach(() => {
        server.shutdown();
    })

    function initGifUploader(uploadCallback: () => void = jest.fn()) {
        server = initMockServer();
        render(<GifUploader onGifUpload={uploadCallback}/>);
    }

    function getUploadBtn(): HTMLElement {
        return screen.getByRole("button", {name: /Upload/i});
    }

    function getNextBtn(): HTMLElement {
        return screen.getByRole("button", {name: /Next/i});
    }

    function dropAndUploadFile() {
        const dropzone = screen.getByTitle("dropzone");
        const uploadBtn = getUploadBtn();
        simulateFileDrop(dropzone, [testGif]);

        userEvent.click(uploadBtn);
    }

    it("renders GifUploader", () => {
        initGifUploader();
        expect(getUploadBtn()).toBeTruthy();
    });

    it("enables upload button after file drop in Dropzone", () => {
        initGifUploader();

        const dropzone = screen.getByTitle("dropzone");
        const uploadBtn = getUploadBtn();

        expect(uploadBtn).toBeDisabled();
        simulateFileDrop(dropzone, [testGif]);
        expect(uploadBtn).toBeEnabled();
    });

    it("shows uploading status after upload button clicked", () => {
        initGifUploader();
        dropAndUploadFile();
        expect(screen.getByText("Uploading")).toBeTruthy();
    });

    it("uploads file after upload button clicked", async () => {
        initGifUploader();
        dropAndUploadFile();
        const uploadMsg = await screen.findByText(/[Uu]ploaded/,
            {}, {timeout: 4000});
        expect (uploadMsg).toBeTruthy()
    });

    it("displays error after upload fails", async () => {
        initGifUploader();

        server.post("/original-gifs", () => {
            return new Response(400, {}, { errors: ["No response from server."] })
        })

        dropAndUploadFile();

        userEvent.click(getUploadBtn());
        const uploadMsg = await screen.findByText(/Error/,
            {}, {timeout: 4000});
        expect (uploadMsg).toBeTruthy()
    });

    it("call callback function after file uploaded and confirmed", async () => {
        const uploadCallback = jest.fn();
        initGifUploader(uploadCallback);
        dropAndUploadFile();

        await screen.findByText(/[Uu]ploaded/,
            {}, {timeout: 4000});
        userEvent.click(getNextBtn());
        expect(uploadCallback).toHaveBeenCalled();
    });

    it("don't allow upload if no file is selected", async () => {
        initGifUploader();
        expect(getUploadBtn()).toBeDisabled();
    });

    it("don't allow continue if no file is uploaded", async () => {
        initGifUploader();
        const dropzone = screen.getByTitle("dropzone");
        simulateFileDrop(dropzone, [testGif]);

        expect(getUploadBtn()).toBeEnabled();
        expect(getNextBtn()).toBeDisabled();
    });
});