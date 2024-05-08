import jwt from 'jsonwebtoken';
import { ErrorHandler } from '../middleware/err.js';
// import { Task } from '../models/fileSystem.js';
// import { User } from '../models/user.js';
import db from '../models/index.js';
import { generateUUID } from '../utils/idGenrator.js';
import { Op } from 'sequelize';
import cloudinary from 'cloudinary';
import streamifier from 'streamifier'; // Turns buffers into readable streams
import getDataUri from '../utils/dataUri.js';



// upload file
// rename file

// All devices connected to a network will create a session
// then, create a request by ip:port numbers of a device
// on which the program is running.

// Means now, 
// set a session between the devices 
// connected in same network.

let fileID = null

const uploadFile = async (req, res, next) => {
  try {
    let { parentId } = req.body;
    if (parentId == 'null') {
      parentId = null
    }

    const { token } = req.cookies;
    const file = req.file;
    const fileName = req.file.originalname;
    console.log(file);

    // Get user from token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const fileUri = getDataUri(file);
    // console.log(fileUri);
    
    const options = {
      // folder: "chatyard_profile_pic",
      upload_preset: "PiedPiper",
      use_filename: false,
      unique_filename: true,
      overwrite: true,
    };

    const db_file = await db.fileSystem.findOne({
      where: {
        name: { [Op.like]: `${fileName.toLowerCase()}` },     // Check for case insensitive 
        userId: decoded._id, 
        parentId: parentId,
        isFolder: false,
      }
    })
    if (db_file) {
      return next(new ErrorHandler("File exist with same name!", 400));
    }

    // Upload the image
    const result = await cloudinary.v2.uploader.upload_large(
      fileUri.content, options);
    // return result.public_id;
    console.log('-----------------------');
    console.log(result);
    console.log('file added !!!!');

    const uuid = await generateUUID(db.fileSystem);
    console.log({
      _id: uuid,
      name: fileName,
      parentId: parentId,
      isFolder: false,
      userId: decoded._id,
      url: result.secure_url,
      publicId: result.public_id,
      resourceType: result.resource_type,
      createdAt: new Date(Date.now()),
    });
    await db.fileSystem.create({
      _id: uuid,
      name: fileName,
      parentId: parentId,
      isFolder: false,
      userId: decoded._id,
      url: result.secure_url,
      publicId: result.public_id,
      resourceType: result.resource_type,
      createdAt: new Date(Date.now()),
    });

    res.status(201).json({
      success: true,
      message: "File added Successfully!"
    })
  } catch (error) {
    next(error)
  }  
}


const addFolder = async (req, res, next) => {
  try {
    const { parentId } = req.body;
    if (parentId == 'null') {
      parentId = null
    }

    const folderName = req.body.folderName.trim();
    const { token } = req.cookies;

    // Get user from token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check for existing folder with same name
    const folder = await db.fileSystem.findOne({
      where: {
        name: { [Op.like]: `${folderName.toLowerCase()}` },     // Check for case insensitive 
        userId: decoded._id, 
        parentId: parentId
      }
    })
    if (folder) {
      return next(new ErrorHandler("Folder already exist...", 400));
    }

    // Generate a new id and add folder to DB.
    const uuid = await generateUUID(db.fileSystem);
    console.log({
      _id: uuid,
      name: folderName,
      parentId: parentId,
      isFolder: true,
      userId: decoded._id,
      createdAt: new Date(Date.now()),
    });
    await db.fileSystem.create({
      _id: uuid,
      name: folderName,
      parentId: parentId,
      isFolder: true,
      userId: decoded._id,
      createdAt: new Date(Date.now()),
    });

    res.status(201).json({
      success: true,
      message: "Folder added successfully!"
    })
  } catch (error) {
    next(error)
  }
}

const updateFolder = async (req, res, next) => {
  try {
    const { folderId, parentId } = req.body;
    let updatedName = req.body.updatedName.trim();
    const { token } = req.cookies;

    console.log({
      folderId, parentId, updatedName
    });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check whether a folder exist with the Updated Name.
    const folder = await db.fileSystem.findOne({
      where: {
        userId: decoded._id, 
        _id: folderId,
        parentId
      }
    })
    if (!folder) {
      return next(new ErrorHandler("Folder does not exist...", 400));
    }

    if (!folder.isFolder) {
      const name = folder.name
      const extensionIndex = name.lastIndexOf('.');
      let fileExtension = (extensionIndex === -1)
        ? ''  // No extension found
        : name.substring(extensionIndex);
      
      updatedName = updatedName + fileExtension
    }

    await db.fileSystem.update({ name: updatedName, updatedAt: new Date(Date.now()), }, {
      where: {
        _id: folderId,
        userId: decoded._id
      }
    });

    res.status(201).json({
      success: true,
      message: "Folder name updated!!",
    })
  } catch (error) {
    next(error)
  }
}

const deleteFolder = async (req, res, next) => {
  try {
    const folderId = req.params.id;
    const { token } = req.cookies;

    // Get user from token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check whether a folder exist with the Updated Name.
    const folder = await db.fileSystem.findOne({
      where: {
        _id: folderId, 
        userId: decoded._id
      }
    })
    if (!folder) {
      return next(new ErrorHandler("No folder exist...", 400));
    }

    if (!folder.isFolder) {
      const response = await cloudinary.uploader.destroy(folder.publicId, 
        {resource_type: folder.resourceType})
      if (response.result === 'ok') {
        console.log('File deleted successfully');
      } else {
        console.log('Failed to delete the file:', response);
      }
    }

    await db.fileSystem.destroy({
      where: {
        _id: folderId,
        userId: decoded._id
      }
    })
    const message = (folder.isFolder) ? "Folder deleted!!" : "File deleted!!"
    res.status(201).json({
      success: true,
      message: message,
    })
  } catch (error) {
    next(error);
  }
}

const getFolders = async (req, res, next) => {
  try {
    let folderId = req.params.id;
    if (folderId == "null") {
      folderId = null
    }
    // console.log(`alkdfjaldsjflkj: ${folderId}`);
    const { token } = req.cookies;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check whether a folder exist with the Updated Name.
    const folders = await db.fileSystem.findAll({
      where: {
        userId: decoded._id, 
        parentId: folderId,
        isFolder: true
      },
      order: [
        ['createdAt', 'DESC']
      ],
    })

    res.status(201).json({
      success: true,
      folders: folders,
    })
  } catch (error) {
    next(error)
  }
}

const getFiles = async (req, res, next) => {
  try {
    let folderId = req.params.id;
    if (folderId == "null") {
      folderId = null
    }
    // console.log(`alkdfjaldsjflkj: ${folderId}`);
    const { token } = req.cookies;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check whether a folder exist with the Updated Name.
    const files = await db.fileSystem.findAll({
      where: {
        userId: decoded._id, 
        parentId: folderId,
        isFolder: false
      },
      order: [
        ['createdAt', 'DESC']
      ],
    })

    res.status(201).json({
      success: true,
      files: files,
    })
  } catch (error) {
    next(error)
  }
}

export {
  addFolder,
  updateFolder,
  deleteFolder,
  getFolders,
  getFiles,
  uploadFile,
}
