export const getBase64FromImageUrl = async (url:string):Promise<string> => {
  const c = document.createElement('canvas');
  const img = document.createElement('img');
  img.src = url;
  
  await img.decode();

  c.height = img.naturalHeight;
  c.width = img.naturalWidth;

  const ctx = c.getContext('2d');

  ctx?.drawImage(img, 0, 0, c.width, c.height);
  const base64 = c.toDataURL();
  return base64;
}
