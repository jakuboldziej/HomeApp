import { File, Folder, FolderOpen } from 'lucide-react-native';
import { useState, useRef, useEffect } from 'react';
import { View, Text, Animated } from 'react-native';
import { TouchableRipple } from 'react-native-paper';

const fileTree = [
  {
    name: 'src',
    type: 'folder',
    children: [
      { name: 'App.js', type: 'file' },
      {
        name: 'components', type: 'folder', children: [
          { name: 'Header.js', type: 'file' },
          { name: 'Footer.js', type: 'file' },
        ]
      },
    ],
  },
  {
    name: 'package.json',
    type: 'file',
  },
  {
    name: 'README.md',
    type: 'file',
  }
];

const FileTreeNode = ({ node }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity 0

  const handlePress = () => {
    if (node.type === 'folder') {
      if (!isExpanded) {
        Animated.timing(fadeAnim, {
          toValue: 1, // Fade in
          duration: 300,
          useNativeDriver: true, // Opacity animation can use native driver
        }).start();
      } else {
        Animated.timing(fadeAnim, {
          toValue: 0, // Fade out
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
      setIsExpanded(!isExpanded);
    }
  };

  useEffect(() => {
    if (!isExpanded) {
      fadeAnim.setValue(0); // Reset opacity to 0 when collapsed
    }
  }, [isExpanded, fadeAnim]);

  return (
    <View style={{ paddingLeft: 12 }}>
      <TouchableRipple onPress={handlePress}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4, height: 28 }}>
          <View style={{ marginRight: 4 }}>
            {node.type === 'folder' ? (
              isExpanded ? <FolderOpen color="white" size={20} /> : <Folder color="white" size={20} />
            ) : (
              <File color="white" size={20} />
            )}
          </View>
          <Text style={{ color: 'white', fontSize: 18 }}>{node.name}</Text>
        </View>
      </TouchableRipple>

      {node.children && (
        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={{ paddingLeft: 12 }}>
            {isExpanded && node.children.map((child, index) => (
              <FileTreeNode key={index} node={child} />
            ))}
          </View>
        </Animated.View>
      )}
    </View>
  );
};

const CollapsibleFileTree = () => {
  return (
    <View style={{ flex: 1, padding: 12, backgroundColor: '#1E293B', width: '100%' }}>
      {fileTree.map((node, index) => (
        <FileTreeNode key={index} node={node} />
      ))}
    </View>
  );
};

export default CollapsibleFileTree;
