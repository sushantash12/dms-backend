const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const multer = require("multer");
const upload = multer({});

router.post("/login", userController.loginUser);
router.post("/register", userController.registerUser);
router.get("/files", userController.getListOfFiles);
router.post("/upload", upload.single("file"), userController.uploadFile);
router.post("/download", userController.downloadFile);
router.post("/delete", userController.deleteFile);

module.exports = router;
