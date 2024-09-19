import { createContext, useEffect, useState } from "react";
import { getFiles, getFolders } from "../lib/fetch";
import { AuthContext } from "./AuthContext";
import { useContext } from 'react';

export const CloudContext = createContext()

export const CloudProvider = ({ children }) => {
  const { user } = useContext(AuthContext);

  const [folders, setFolders] = useState(null);
  const [files, setFiles] = useState(null);

  const fetchCloudUserFolders = async () => {
    const fetchedFolders = await getFolders(user.displayName);
    const fetchedFiles = await getFiles(user.displayName);
    setFolders(fetchedFolders);
    setFiles(fetchedFiles);
  }

  useEffect(() => {
    if (user) fetchCloudUserFolders();
  }, [user]);

  return (
    <CloudContext.Provider value={{ folders, setFolders, files, setFiles }}>
      {children}
    </CloudContext.Provider>
  )
}