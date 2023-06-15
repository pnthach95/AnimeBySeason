import {MMKVLoader, useMMKVStorage} from 'react-native-mmkv-storage';

// TODO: tự thêm/sửa theo nhu cầu sử dụng
type MMKVType = {
  username: string;
};

const MMKV = new MMKVLoader()
  // TODO: đổi id tùy ý
  .withInstanceID('9r7ohsZuNbs')
  .withEncryption()
  .initialize();

export const useStorage = <T extends keyof MMKVType>(
  key: T,
  defaultValue?: MMKVType[T],
) => useMMKVStorage<MMKVType[T]>(key, MMKV, defaultValue);
