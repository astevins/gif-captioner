import express from "express";
import multer from "multer";
import path from "path";

const UPLOAD_DEST = "uploads/";

const router = express.Router();
const storage = multer.diskStorage({
    destination: UPLOAD_DEST,
    filename: function (req, file, cb) {
        // Names files by current time, with proper extension
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({storage: storage});

declare module "express-session" {
    interface Session {
        originalGif: { originalName: string, path: string } | null;
        captionedGifs: { caption: string, path: string }[];
    }
}

router.put("/original-gif", upload.single("file"), function (req: express.Request, res: express.Response) {
    console.log("PUT /files/original-gif");
    try {
        let fileToUpload = req.file;
        console.log("Calling setOriginalGif: " + fileToUpload.originalname
            + " " + fileToUpload.path);
        req.session.originalGif = ({
            originalName: fileToUpload.originalname,
            path: fileToUpload.path
        });
        res.status(200).json({name: fileToUpload.originalname});
    } catch (e) {
        console.log(e);
        res.status(400).json({error: e});
    }
});

router.get("/original-gif", function (req: any, res: any) {
    // TODO
    res.status(400).json({message: "Not implemented."});
});

export default router;