import { createContext, useEffect, useState } from "react";
import { getCloudUser, getFolder } from "../lib/fetch";
import { AuthContext } from "./AuthContext";
import { useContext } from 'react';

export const CloudContext = createContext()

export const CloudProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [folder, setFolder] = useState(null);
  const [cloudLoading, setCloudLoading] = useState(true);

  const handleChangeFolder = async (folderId) => {
    setCloudLoading(true);
    setFolder(null);
    const fetchedFolder = await getFolder(folderId);
    setFolder(fetchedFolder);
    setCloudLoading(false);
  }

  const fetchCloudUserMainFolder = async () => {
    setCloudLoading(true);
    const cloudUser = await getCloudUser(user.displayName);
    const fetchedFolder = await getFolder(cloudUser.main_folder);
    setFolder(fetchedFolder);
    setCloudLoading(false);
  }

  useEffect(() => {
    if (user) fetchCloudUserMainFolder();
  }, [user]);

  return (
    <CloudContext.Provider value={{ folder, setFolder, handleChangeFolder, cloudLoading }}>
      {children}
    </CloudContext.Provider>
  )
}