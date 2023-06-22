import {useIsFocused} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Platform, StatusBar, StyleSheet, Text, View} from 'react-native';
import AwesomeGallery from 'react-native-awesome-gallery';
import FastImage from 'react-native-fast-image';
import Animated, {FadeInUp, FadeOutUp} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useAppColorScheme} from 'stores';
import {useAppTheme} from 'utils/themes';
import type {GalleryRef, RenderItemInfo} from 'react-native-awesome-gallery';
import type {RootStackScreenProps} from 'typings/navigation';

const renderItem = ({
  item,
  setImageDimensions,
}: RenderItemInfo<{uri: string}>) => {
  return (
    <FastImage
      resizeMode={FastImage.resizeMode.contain}
      source={{uri: item.uri}}
      style={StyleSheet.absoluteFillObject}
      onLoad={e => {
        const {width, height} = e.nativeEvent;
        setImageDimensions({width, height});
      }}
    />
  );
};

const GalleryScreen = ({
  navigation,
  route,
}: RootStackScreenProps<'Gallery'>) => {
  const {colors} = useAppTheme();
  const appTheme = useAppColorScheme();
  const {top} = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const gallery = useRef<GalleryRef>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(colors.card);
        StatusBar.setTranslucent(false);
      }
      StatusBar.setBarStyle(
        appTheme === 'dark' ? 'light-content' : 'dark-content',
      );
    };
  }, []);

  const [infoVisible, setInfoVisible] = useState(true);

  useEffect(() => {
    StatusBar.setBarStyle(isFocused ? 'light-content' : 'dark-content', true);
    if (Platform.OS === 'android') {
      StatusBar.setTranslucent(isFocused);
    }
    if (!isFocused) {
      StatusBar.setHidden(false, 'fade');
    }
  }, [isFocused]);

  const onIndexChange = useCallback(
    (index: number) => {
      isFocused && navigation.setParams({idx: index});
    },
    [isFocused],
  );

  const onTap = () => {
    StatusBar.setHidden(infoVisible, 'slide');
    setInfoVisible(!infoVisible);
  };

  return (
    <View className="flex-1">
      {infoVisible && (
        <Animated.View
          className="absolute z-10 w-full bg-black/50"
          entering={mounted ? FadeInUp.duration(250) : undefined}
          exiting={FadeOutUp.duration(250)}
          style={{
            height: top + 60,
            paddingTop: top,
          }}>
          <View className="flex-1 items-center justify-center">
            <Text className="text-base font-semibold text-white">
              {route.params.idx + 1} / {route.params.images.length}
            </Text>
          </View>
        </Animated.View>
      )}
      <AwesomeGallery
        ref={gallery}
        loop
        data={route.params.images.map(uri => ({uri}))}
        doubleTapInterval={150}
        initialIndex={route.params.idx}
        keyExtractor={item => item.uri}
        numToRender={3}
        renderItem={renderItem}
        onIndexChange={onIndexChange}
        onScaleEnd={scale => {
          if (scale < 0.8) {
            navigation.goBack();
          }
        }}
        onSwipeToClose={navigation.goBack}
        onTap={onTap}
      />
    </View>
  );
};

export default GalleryScreen;
