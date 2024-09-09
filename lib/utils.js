// Cloud

import { getFile, getFolder } from "./fetch";

// Folders

export const handleDataShown = async (folder) => {
  const filePromises = folder.files.map(async (fileId) => {
    return await getFile(fileId);
  })

  const ftpFiles = await Promise.all(filePromises);
  ftpFiles.sort((a, b) => {
    return new Date(b.uploadDate) - new Date(a.uploadDate);
  })

  const folderPromises = folder.folders.map(async (folderId) => {
    return await getFolder(folderId);
  })

  const currentFolderFolders = await Promise.all(folderPromises);
  currentFolderFolders && currentFolderFolders.map((folder) => {
    folder.type = "folder"
  });

  const updatedData = [...currentFolderFolders, ...ftpFiles];

  return updatedData.length > 0 ? updatedData : null;
}