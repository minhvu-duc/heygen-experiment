// src/api/heygenApi.js
const API_BASE_URL = 'https://api.heygen.com';
const UPLOAD_URL = 'https://upload.heygen.com';

export const uploadImage = async (file, apiKey) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${UPLOAD_URL}/v1/asset`, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
    },
    body: file,
  });

  const data = await response.json();
  if (data.code !== 100) throw new Error(data.message || 'Failed to upload image');
  return data.data;
};

export const createAvatarGroup = async (imageKey, apiKey) => {
  const response = await fetch(`${API_BASE_URL}/v2/photo_avatar/avatar_group/create`, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json',
      'x-api-key': apiKey,
    },
    body: JSON.stringify({
      name: 'avatar_' + Date.now(),
      image_key: imageKey,
    }),
  });

  const data = await response.json();
  if (data.error) throw new Error(data.error);
  return data.data;
};

export const checkAvatarStatus = async (avatarId, apiKey) => {
  const response = await fetch(`${API_BASE_URL}/v2/photo_avatar/${avatarId}`, {
    headers: {
      'accept': 'application/json',
      'x-api-key': apiKey,
    },
  });

  const data = await response.json();
  if (data.error) throw new Error(data.error);
  return data.data;
};

export const generateVideo = async (avatarId, inputText, apiKey) => {
  const response = await fetch(`${API_BASE_URL}/v2/video/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': apiKey,
    },
    body: JSON.stringify({
      video_inputs: [
        {
          character: {
            type: "talking_photo",
            talking_photo_id: avatarId
          },
          voice: {
            type: "text",
            input_text: inputText,
            voice_id: "331f1cc78737475b946079cb3d2f5ffc"
          },
          background: {
            type: "color",
            value: "#ACAAA7"
          }
        }
      ]
    }),
  });

  const data = await response.json();
  if (data.error) throw new Error(data.error);
  return data.data;
};

export const checkVideoStatus = async (videoId, apiKey) => {
  const response = await fetch(
    `${API_BASE_URL}/v1/video_status.get?video_id=${videoId}`,
    {
      headers: {
        'accept': 'application/json',
        'x-api-key': apiKey,
      },
    }
  );

  const data = await response.json();
  if (data.code !== 100) throw new Error(data.message || 'Failed to check video status');
  return data.data;
};
