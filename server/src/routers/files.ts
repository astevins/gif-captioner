import express from "express";
import multer from "multer";
import GifManager from "../model/GifManager";

const UPLOAD_DEST = "uploads/";

const router = express.Router();
const storage = multer.diskStorage({destination: "uploads"});
const upload = multer({storage: storage});

declare module "express-session" {
    interface Session {
        data: GifManager;
    }
}

function initSessionData(req: express.Request) {
    if (!req.session.data) {
        req.session.data = new GifManager();
        console.log("New session created");
    }
}

router.put("/original-gif", upload.single("file"), function (req: express.Request, res: express.Response) {
    console.log("PUT /files/original-gif");
    try {
        let fileToUpload = req.file;
        console.log("Calling setOriginalGif");
        req.session.data.setOriginalGif({
            originalName: fileToUpload.originalname,
            path: fileToUpload.path
        });
        console.log("Uploaded file: " + JSON.stringify(req.file));
        res.status(200).json({name: fileToUpload.originalname});
    } catch (e) {
        res.status(400).json({error: e.message});
    }
});

router.get("/original-gif", function (req: any, res: any) {
    // TODO
    res.status(400).json({message: "Not implemented."});
});

export default router;