export const getBase64FromImageUrl = async (url:string):Promise<string> => {
  var c = document.createElement('canvas');
  var img = document.createElement('img');
  img.src = url;
  
  await img.decode();

  c.height = img.naturalHeight;
  c.width = img.naturalWidth;

  var ctx = c.getContext('2d');

  ctx?.drawImage(img, 0, 0, c.width, c.height);
  var base64 = c.toDataURL();
  return base64;
}
