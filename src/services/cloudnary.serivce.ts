import { CLOUDINARY_NAME } from "@env";
import axios from "axios";

type CloudinaryResponse = {
  secure_url: string;
  public_id: string;
};

export async function uploadAssinaturaCloudinary(
  assinaturaBase64: string
): Promise<CloudinaryResponse> {
  const cloudName = CLOUDINARY_NAME;
  const uploadPreset = "ml_default";

  const formData = new FormData();

  formData.append("file", assinaturaBase64);
  formData.append("upload_preset", uploadPreset);

  const response = await axios.post(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}

export const uploadImage = async (uri: string) => {
  const cloudName = CLOUDINARY_NAME;
  const uploadPreset = 'ml_default';

  const formData = new FormData();

  formData.append('file', {
    uri,
    type: 'image/jpeg',
    name: 'avatar.jpg',
  } as any);

  formData.append('upload_preset', uploadPreset);

  const res = await axios.post(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return res.data.secure_url;

};