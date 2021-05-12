import React from 'react';
import {render, cleanup, screen, fireEvent} from '@testing-library/react'
import Dropzone from "../components/Dropzone";

function initDropzone(fileSelectCallback: (files: File[]) => void = jest.fn()): HTMLElement {
    render(<Dropzone onFileSelect={fileSelectCallback}/>);
    return screen.getByTitle("dropzone");
}

export function simulateFileDrop(dropzone: HTMLElement, files: File[]) {
    fireEvent.drop(dropzone, {
        dataTransfer: {
            files: files,
        }});
}

describe("Dropzone", () => {
    let testGif: File;
    let testPdf: File;

    beforeAll(() => {
        testGif = new File(["data"], "toad.gif", { type: "image/gif" });
        testPdf = new File(["data"], "dragonfly.pdf", { type: "application/pdf" });
    })

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
        simulateFileDrop(dropzone, testFiles);

        expect(fileDropCallback).toHaveBeenCalledTimes(1);
        expect(fileDropCallback).toHaveBeenCalledWith(testFiles);
    }

    it("respond to file drop: single file", () => {
        const testFiles: File[] = [testGif];
        testFileDrop(testFiles);
    });

    it("respond to file drop: multiple files", () => {
        const testFiles: File[] = [testGif, testPdf];
        testFileDrop(testFiles);
    });

    it("respond to click for file select", () => {
        const fileDropCallback = jest.fn();
        initDropzone(fileDropCallback);

        const testFile = testGif;
        const fileInput = screen.getByTitle("file input");

        fireEvent.change(fileInput, {
            target: { files: [testFile] },
        });

        expect(fileDropCallback).toHaveBeenCalledTimes(1);
        expect(fileDropCallback).toHaveBeenCalledWith([testFile]);
    });
});