const S3Url = 'https://dtx-bucket.s3.amazonaws.com';
const urlSizes = {
  100: `${S3Url}/timg/100-square`,
  300: `${S3Url}/timg/300-square`,
  500: `${S3Url}/timg/500-square`,
  720: `${S3Url}/timg/720`,
};

export const getImageBySize = (keypath: string, size: keyof typeof urlSizes) => {
  return `${urlSizes[size]}/${keypath}.webp`;
};
