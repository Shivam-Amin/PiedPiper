import jwt from 'jsonwebtoken';
import { ErrorHandler } from '../middleware/err.js';
// import { Task } from '../models/fileSystem.js';
// import { User } from '../models/user.js';
import db from '../models/index.js';
import { generateUUID } from '../utils/idGenrator.js';
import { Op } from 'sequelize';


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
    const data = req.body.data;

    // Use the uploaded file's name as the asset's public ID and 
    // allow overwriting the asset with new versions
    const options = {
      // folder: "chatyard_profile_pic",
      upload_preset: "chatyard_profile_pic",
      use_filename: true,
      unique_filename: true,
      overwrite: true,
    };

    // Upload the file
    fileID = await cloudinary.v2.uploader.upload(
      data, 
      options);
    // return result.public_id;

    res.status(201).json({
      success: true,
      message: "file added successfully!!"
    })
  } catch (error) {
    next(error)
  }
}


const addFolder = async (req, res, next) => {
  try {
    const { parentId } = req.body;
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
      message: "Folder added successfully!",
    })
  } catch (error) {
    next(error)
  }
}

const updateFolder = async (req, res, next) => {
  try {
    const { folderId, parentId } = req.body;
    const updatedName = req.body.updatedName.trim();
    const { token } = req.cookies;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check whether a folder exist with the Updated Name.
    const folder = await db.fileSystem.findOne({
      where: {
        userId: decoded._id, 
        name: updatedName,
        parentId
      }
    })
    if (folder) {
      return next(new ErrorHandler("Folder already exist...", 400));
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

    await db.fileSystem.destroy({
      where: {
        _id: folderId,
        userId: decoded._id
      }
    })

    res.status(201).json({
      success: true,
      message: "Folder deleted!!",
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
        parentId: folderId
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

export {
  addFolder,
  updateFolder,
  deleteFolder,
  getFolders,
}
