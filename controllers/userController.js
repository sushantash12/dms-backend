const s3Client = require("../services/s3service");
const dynamoDBClient = require("../services/dynamoDBService");
const bcrypt = require("bcrypt");
const { GetItemCommand, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const {
  ListObjectsCommand,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");

// Login API
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }

  const params = {
    TableName: "users",
    Key: {
      username: { S: username },
    },
  };

  try {
    const user = await dynamoDBClient.send(new GetItemCommand(params));
    if (!user.Item) {
      return res.status(400).json({ message: "User does not exist." });
    }

    if (bcrypt.compareSync(password, user.Item.password.S)) {
      return res.status(200).json({
        message: "User logged in successfully.",
        email: user.Item.email.S,
        username: user.Item.username.S,
      });
    } else {
      return res.status(400).json({ message: "Invalid password." });
    }
  } catch (error) {
    return res.status(500).json({ message: "Unable to login." });
  }
};

// Register API
const registerUser = async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }

  const checkParams = {
    TableName: "users",
    Key: {
      username: { S: username },
    },
  };

  const insertParams = {
    TableName: "users",
    Item: {
      username: { S: username },
      password: { S: bcrypt.hashSync(password, 10) },
      email: { S: email },
    },
  };
  // check if user already exists
  const user = await dynamoDBClient.send(new GetItemCommand(checkParams));
  if (user.Item) {
    return res.status(400).json({ message: "User already exists." });
  }

  try {
    await dynamoDBClient.send(new PutItemCommand(insertParams));
    return res.status(200).json({ message: "User registered successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Unable to register user." });
  }
};

// Get list of files API
const getListOfFiles = async (req, res) => {
  const { username } = req.query;
  const params = new ListObjectsCommand({
    Bucket: "ucm-cs5610",
    Prefix: username,
  });

  try {
    const data = await s3Client.send(params);
    return res.status(200).json({
      message: "Files retrieved successfully.",
      files: data.Contents || [],
    });
  } catch (error) {
    return res.status(500).json({ message: "Unable to retrieve files." });
  }
};

// Upload file API
const uploadFile = async (req, res) => {
  var { file, filepath } = req.body;
  if (file === undefined) {
    console.log("Valid file");
    file = req.file.buffer;
  }
  const params = {
    Bucket: "ucm-cs5610",
    Key: `${filepath}/${req.file ? req.file.originalname : ""}`,
    Body: file,
  };
  console.log(params);
  try {
    await s3Client.send(new PutObjectCommand(params));
    return res.status(200).json({ message: "File uploaded successfully." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//Download file API
const downloadFile = async (req, res) => {
  const { filepath } = req.body;

  const params = {
    Bucket: "ucm-cs5610",
    Key: `${filepath}`,
  };
  console.log(params);
  try {
    const data = new GetObjectCommand(params);
    const url = await getSignedUrl(s3Client, data, { expiresIn: 3600 });
    console.log(url);

    return res
      .status(200)
      .json({ message: "File downloaded successfully.", url: url });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Delete file API
const deleteFile = async (req, res) => {
  const { filepath } = req.body;
  console.log(filepath);
  const params = {
    Bucket: "ucm-cs5610",
    Key: `${filepath}`,
  };

  try {
    await s3Client.send(new DeleteObjectCommand(params));
    return res.status(200).json({ message: "File deleted successfully." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  loginUser,
  registerUser,
  getListOfFiles,
  uploadFile,
  downloadFile,
  deleteFile,
};
