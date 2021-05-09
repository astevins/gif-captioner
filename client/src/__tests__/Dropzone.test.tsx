import React from 'react';
import {render, cleanup, screen, fireEvent} from '@testing-library/react'
import Dropzone from "../components/Dropzone";

afterEach(cleanup)

describe("Dropzone", () => {
    function initDropzone(uploadCallback = jest.fn(), acceptedTypes?: string): HTMLElement {
        render(acceptedTypes?
            <Dropzone onFileSelect={uploadCallback} acceptedTypes={acceptedTypes}/>
            : <Dropzone onFileSelect={uploadCallback}/>);
        return screen.getByTitle("dropzone");
    }

    it("renders dropzone", () => {
        const dropzone = initDropzone();
        expect(dropzone).toBeTruthy();
    });

    it("respond to drag enter event: change text & appearance", () => {
        const dropzone = initDropzone();
        const startClassName = dropzone.className;
        fireEvent.dragEnter(dropzone);
        expect(screen.getByText(/[dD]rop/)).toHaveTextContent(/Drop file/);
        expect(dropzone).not.toHaveClass(startClassName);
    });

    it("respond to drag leave after drag enter: change text & appearance", () => {
        const dropzone = initDropzone();
        fireEvent.dragEnter(dropzone);
        const startClassName = dropzone.className;
        fireEvent.dragLeave(dropzone);
        expect(screen.getByText(/[dD]rop/)).toHaveTextContent(/Drag & drop/);
        expect(dropzone).not.toHaveClass(startClassName);
    });

    function testFileDrop(testFiles: File[]) {
        const fileDropCallback = jest.fn();
        const dropzone = initDropzone(fileDropCallback);

        fireEvent.drop(dropzone, {
            dataTransfer: {
                files: testFiles,
            }});

        expect(fileDropCallback).toHaveBeenCalledTimes(1);
        expect(fileDropCallback).toHaveBeenCalledWith(testFiles);
    }

    it("respond to file drop: single file", () => {
        const testFiles: File[] = [new File(["data"], "toad.gif", { type: "image/gif" })];
        testFileDrop(testFiles);
    });

    it("respond to file drop: multiple files", () => {
        const testFiles: File[] = [
            new File(["data"], "toad.gif", { type: "image/gif" }),
            new File(["data"], "dragonfly.pdf", { type: "application/pdf" })];
        testFileDrop(testFiles);
    });

    it("respond to click for file select", () => {
        const fileDropCallback = jest.fn();
        initDropzone(fileDropCallback);

        const testFile: File = new File(["data"], "toad.gif", { type: "image/gif" });
        const fileInput = screen.getByTitle("file input");

        fireEvent.change(fileInput, {
            target: { files: [testFile] },
        });

        expect(fileDropCallback).toHaveBeenCalledTimes(1);
        expect(fileDropCallback).toHaveBeenCalledWith([testFile]);
    });
});