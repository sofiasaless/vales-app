import AntDesign from '@expo/vector-icons/AntDesign';
import { Button, Text } from '@ui-kitten/components';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Image, Platform, StyleSheet, View } from 'react-native';
import { alert } from '../util/alertfeedback.util';
import { customTheme } from '../theme/custom.theme';

interface AvatarUploadProps {
  value?: string;
  onChange: (url: string) => void;
}

export const AvatarUpload = ({ value, onChange }: AvatarUploadProps) => {
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert('Permission required', 'Permission to access the media library is required.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (result.canceled) return;
    onChange(result.assets[0].uri);
  };

  const pickImagemWeb = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          onChange(result); // Salva a URL da imagem
        }
      };
      reader.readAsDataURL(file); // Lê o arquivo como base64
    }
  };

  return (
    <View style={styles.container}>
      <Text category="label">Foto do funcionário</Text>

      {value ? (
        <Image source={{ uri: value }} style={styles.avatar} />
      ) : (
        <View style={styles.placeholder}>
          <AntDesign name="cloud-upload" size={30} color="gray" />
        </View>
      )}

      {
        (Platform.OS === 'web')?
        <input type="file" id="userImage" onChange={(e) => pickImagemWeb(e)} placeholder='Selecionar imagem de perfil' style={styles.inputBtn}/>
        :
        <Button
          size="small"
          status='info'
          appearance="outline"
          onPress={pickImage}
          disabled={loading}
        >
          {loading ? 'Enviando...' : 'Selecionar imagem de perfil'}
        </Button>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
    alignItems: 'center',
  },

  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },

  placeholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    textAlign: 'center'
  },
  inputBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: customTheme['color-info-700'],
    color: '#fff',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 500,
  }
});
