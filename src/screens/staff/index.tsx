import React, {useEffect, useState} from 'react';
import {useWindowDimensions} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import {TabBar, TabView} from 'react-native-tab-view';
import StaffCharactersScreen from './characters';
import StaffInfoScreen from './info';
import StaffMediaScreen from './staff';
import type {Route, TabViewProps} from 'react-native-tab-view';
import type {IMediaItem} from 'typings/globalTypes';
import type {RootStackScreenProps} from 'typings/navigation';

const RenderTabBar: TabViewProps<Route>['renderTabBar'] = props => {
  const {colors} = useTheme();
  const tabbarStyle = {backgroundColor: colors.elevation.level2};
  const indicatorStyle = {backgroundColor: colors.primary};

  return (
    <TabBar
      {...props}
      activeColor={colors.primary}
      inactiveColor={colors.inversePrimary}
      indicatorStyle={indicatorStyle}
      renderLabel={({route, color}) => (
        <Text style={{color}}>{route.title}</Text>
      )}
      style={tabbarStyle}
    />
  );
};

const routes = [
  {key: 'info', title: 'Information'},
  {key: 'characters', title: 'Characters'},
  {key: 'staffs', title: 'Staffs'},
];

const StaffScreen = ({navigation, route}: RootStackScreenProps<'Staff'>) => {
  const layout = useWindowDimensions();
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    navigation.setOptions({
      title: route.params.name,
    });
  }, []);

  const goToMedia = (item: IMediaItem) => {
    navigation.push('Media', {item});
  };

  const goToCharacter = (id: number, image: string, name: string) => {
    navigation.push('Character', {
      id,
      image,
      name,
    });
  };

  const openGallery = (idx: number, images: string[]) => {
    navigation.navigate('Gallery', {idx, images});
  };

  const renderScene: TabViewProps<Route>['renderScene'] = ({
    route: tabRoute,
  }) => {
    switch (tabRoute.key) {
      case 'info':
        return (
          <StaffInfoScreen
            id={route.params.id}
            image={route.params.image}
            openGallery={openGallery}
          />
        );
      case 'characters':
        return (
          <StaffCharactersScreen
            goToCharacter={goToCharacter}
            goToMedia={goToMedia}
            id={route.params.id}
          />
        );
      case 'staffs':
        return <StaffMediaScreen goToMedia={goToMedia} id={route.params.id} />;
      default:
        return null;
    }
  };

  return (
    <TabView
      lazy
      initialLayout={{width: layout.width}}
      navigationState={{index: tabIndex, routes}}
      renderScene={renderScene}
      renderTabBar={RenderTabBar}
      onIndexChange={setTabIndex}
    />
  );
};

export default StaffScreen;
