const processFileUpload = async (req, res) => {
  const { originalname } = req.file;
  const { uid } = req.body;

  res.json({
    success: true,
    filePath: `/profile-photos/${uid}-${originalname}`,
  })
}

exports.processFileUpload = processFileUpload;
