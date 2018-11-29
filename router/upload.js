const express = require('express'),
	router = express.Router(),
	multer = require("multer");

//上传图片
var storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, './public/image');
	},
	filename: function(req, file, cb) {
		var fileFormat = (file.originalname).split(".");
		cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]);
	}
})
var upload = multer({
	storage: storage
});
router.post('/image', upload.single('image'), function(req, res) {
	res.send({
		"status":true,
		"url":"https://ccskill.club/image/" + req.file.filename
	});
})

module.exports = router