import { View, Text } from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import { IconButton, Searchbar, TouchableRipple } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import LoadingScreen from '../../../../components/LoadingScreen';
import { CloudContext } from '../../../../context/CloudContext';
import FolderNode from '../../../../components/Cloud/Nodes/FolderNode';
import FileNode from '../../../../components/Cloud/Nodes/FileNode';

const SearchScreen = () => {
  const { folders, files } = useContext(CloudContext);

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDocuments, setFilteredDocuments] = useState([]);

  const clearSearch = () => {
    setSearchQuery('');
    setFilteredDocuments([]);
  };

  const redirectToDocument = (document) => {
    if (document.type === "file") router.push({ pathname: `/cloud/${document.filename}`, params: { file: JSON.stringify(document) } });
    else if (document.type === "folder") router.push({ pathname: `/cloud/${document.name}`, params: { folder: JSON.stringify(document) } });
  }

  useEffect(() => {
    if (searchQuery === '' || !folders || !files) return clearSearch();
    else {
      const mergedDocuments = [...folders, ...files];
      const filtered = mergedDocuments.filter((document) => {
        if (document.type === "folder") {
          if (document.name.toLowerCase().includes(searchQuery.toLowerCase()) && document.name !== "Cloud drive") return document;
        } else if (document.type === "file") {
          if (document.filename.toLowerCase().includes(searchQuery.toLowerCase())) return document;
        }
      });
      setFilteredDocuments(filtered);
    }
  }, [searchQuery, folders, files]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
      <View style={{ flex: 1 }}>
        <Searchbar
          theme={{ colors: { elevation: { level3: 'pink' } } }}
          placeholder="Search disk"
          icon="arrow-left"
          onIconPress={() => router.back()}
          autoFocus
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearIcon={() =>
            searchQuery && (
              <View className="justify-center">
                <IconButton icon="close" onPress={clearSearch} />
              </View>
            )
          }
          loading={false}
        />

        <View className="mt-4">
          {folders && files ? (
            filteredDocuments.length > 0 ? (
              filteredDocuments.map((document) => (
                <View key={document._id}>
                  {document.type === "folder" ? <FolderNode folder={document} /> : <FileNode file={document} />}
                </View>
              ))
            ) : (
              <Text className="text-white text-xl text-center">No matches found...</Text>
            )
          ) : (
            <LoadingScreen text="Loading data" />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SearchScreen;