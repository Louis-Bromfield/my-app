const Images = require("../models/Images");

module.exports.UploadImage = async (req, res) => {
    const imageUploaded = new Images({
        image: req.file.path,
    });

    try {
        // await imageUploaded.save();
        // return res.status(200);
        return { message: "YO YO MOTHERFUCKERS" }
    } catch (error) {
        return res.status(400).json({
            message: `Image Upload Failed, check to see the ${error}`,
            status: "error",
        });
    }
};