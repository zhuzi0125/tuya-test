import React, { FC, useMemo, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  ImageSourcePropType,
  ScrollView,
  Text,
} from 'react-native';
import { Utils, TYText, Button, TYSdk, SwitchButton } from 'tuya-panel-kit';
import { useDispatch } from 'react-redux';
import _ from 'lodash';
import { jumpToPage } from '@utils';
import { ScaleSlider, Swiper } from '@components';
import Strings from '@i18n';
import Res from '@res';
import { useSelector, actions } from '@models';

import { getToken, handleCommands } from '@api/test';

const { convertX: cx } = Utils.RatioUtils;

interface INavItem {
  icon: ImageSourcePropType;
  title: string;
  onPress: () => void;
  hide?: boolean;
}
const lang = {
  en: {
    dsc_default: 'Default',
    dsc_custom: 'Custom Dark background',
  },
  zh: {
    dsc_default: '默认效果',
    dsc_custom: '自定义展示',
  },
};
const getLang = key => {
  return lang.en[key];
};
const Home: FC = () => {
  const { switchList } = useSelector(state => state);

  const dispatch = useDispatch();

  const functionalConfigList: INavItem[] = useMemo(
    () => [
      // 语音场景
      {
        title: Strings.getLang('voiceScene'),
        icon: Res.iconSpeak,
        onPress: () => jumpToPage('sceneList'),
        hide: false,
      },
      // 场景管理
      {
        title: Strings.getLang('scenes'),
        icon: Res.iconScenes,
        onPress: () => jumpToPage('scene'),
        hide: false,
      },
      // 设备管理
      {
        title: Strings.getLang('devices'),
        icon: Res.iconSub,
        onPress: () => jumpToPage('device'),
        hide: false,
      },
    ],
    []
  );

  const otherServiceList: INavItem[] = useMemo(
    () => [
      // 网关
      {
        title: Strings.getLang('gateway'),
        icon: Res.iconGate,
        onPress: () => toGatewayPanel(),
      },
      // 音乐入口
      {
        title: Strings.getLang('music'),
        icon: Res.music,
        onPress: () => toMusicPanel(),
      },
      // 更多功能（包括快捷指令提示和自定义唤醒词）
      {
        title: Strings.getLang('moreFunction'),
        icon: Res.moreFunction,
        onPress: () => jumpToPage('moreFunction'),
      },
      // 继电器开关，如果存在继电器开关的dp，则显示
      {
        title: Strings.getLang('switch'),
        icon: Res.switch,
        onPress: () => jumpToPage('switch'),
        hide: !switchList.length,
      },
    ],
    [switchList]
  );
  const [slider, useSlider] = useState<string>(0);
  useEffect(() => {
    dispatch(actions.async.getSwitchList());
  }, []);

  // 跳转网关的面板
  const toGatewayPanel = () => {
    // 跳转支持蓝牙和zigbee的多模网关
    // TYSdk.mobile.uiIdNavEventEmitter.pushWithUiID('000000womb', {});

    // 跳转仅支持zigbee的网关
    jumpToPage('gateway');
  };

  // 跳转背景音乐的面板
  const toMusicPanel = () => {
    TYSdk.mobile.uiIdNavEventEmitter.pushWithUiID('000001c9rm', {});
  };

  const renderTopContent = () => {
    return (
      <View style={styles.topContent}>
        <TouchableOpacity activeOpacity={0.88} onPress={() => jumpToPage('voiceControlSkill')}>
          <ImageBackground source={Res.card} style={styles.card}>
            <TYText text={Strings.getLang('voiceDesc')} style={styles.cardSubtitle} />
            <TYText text={Strings.getLang('voiceControl')} style={styles.cardTitle} />
          </ImageBackground>
        </TouchableOpacity>
      </View>
    );
  };

  const renderNav = ({
    title,
    subTitle,
    dataSource,
  }: {
    title: string;
    subTitle?: string;
    dataSource: INavItem[];
  }) => {
    return (
      <View>
        <View style={styles.navContainer}>
          <TYText
            text={title}
            color="#000"
            weight="bold"
            size={cx(16)}
            style={{ lineHeight: cx(22) }}
          />
          {subTitle && (
            <TYText text={subTitle} color="#A2A3AA" size={cx(12)} style={{ lineHeight: cx(22) }} />
          )}
        </View>
        <View style={styles.navList}>{dataSource.map(d => renderNavItem(d))}</View>
      </View>
    );
  };
  const renderNavItem = (item: INavItem) => {
    const { title, icon, onPress } = item;
    return (
      <Button
        image={icon as any}
        text={title}
        size={cx(52)}
        key={title}
        onPress={() => onPress()}
        textStyle={styles.btnText}
        wrapperStyle={styles.entryButton}
      />
    );
  };

  const renderFunctionalConfig = () => {
    return renderNav({
      title: Strings.getLang('funConfig'),
      subTitle: Strings.getLang('funConfigDesc'),
      dataSource: functionalConfigList.filter(d => !d.hide),
    });
  };

  const renderOtherService = () => {
    return renderNav({
      title: Strings.getLang('otherConfig'),
      dataSource: otherServiceList.filter(d => !d.hide),
    });
  };
  const handleSpecification = () => {
    // getToken({
    //   grant_type: 1,
    // }).then(res => {
    //   console.log(res);
    // });
    handleCommands({
      commands: [
        {
          code: 'quick_feed',
          value: true,
        },
      ],
    });
  };
  const handleChange = v => {
    console.log(v);
  };
  const renderPanel = () => {
    const themeColor = 'pink';
    const themeColor2 = '#34C495';

    return (
      <View style={styles.panel_box}>
        {/* <View style={styles.panel}>
          <Text>Remaining desiccant 25 day(s) left</Text>
        </View>
        <View style={styles.panel}>
          <Text>Event description</Text>
        </View> */}
        <View style={[styles.panel, styles.flex_between]}>
          <View>
            <View>
              <Text>2/3</Text>
            </View>
            <View>
              <Text>Total meal(times)</Text>
            </View>
          </View>
          <View>
            <View>
              <Text>2/3</Text>
            </View>
            <View>
              <Text>Feed amount(g)</Text>
            </View>
          </View>
        </View>

        <View style={styles.panel}>
          <View>
            <Text>Feeding Plan</Text>
          </View>
          <View style={styles.flex_between}>
            <Text>Auto Feeding</Text>
            <SwitchButton defaultValue={true} onValueChange={e => {}} />
          </View>
          <View style={styles.flex_between}>
            <Text>Meal schedule</Text>
          </View>
        </View>
        <Text>{slider}</Text>

        <ScaleSlider
          width={375}
          max={60}
          min={0}
          onChange={e => {
            useSlider(e);
          }}
        />

        <View style={[styles.flex_between, { backgroundColor: 'transparent' }]}>
          <View style={styles.panel_btn}>
            <Text
              onPress={() => {
                handleSpecification();
              }}
            >
              Extra Sanck
            </Text>
          </View>
          <View style={styles.panel_btn}>
            <Text>Call Pet</Text>
          </View>
        </View>
      </View>
    );
  };
  return (
    <View style={styles.container}>
     
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
      <Swiper
          style={styles.wrapper}
          autoplay={true}
          showsButtons={true}
          loop={true}
          horizontal={true}
          onIndexChanged={(e)=>{console.log(e)}}
        >
          <View style={styles.slide}>
            <Text style={styles.text}>Hello Swiper</Text>
          </View>
          <View style={styles.slide}>
            <Text style={styles.text}>Beautiful</Text>
          </View>
          <View style={styles.slide}>
            <Text style={styles.text}>Beautiful2</Text>
          </View>
        </Swiper>
        {renderPanel()}
        {renderTopContent()}
        {!!functionalConfigList.length && renderFunctionalConfig()}
        {!!otherServiceList.length && renderOtherService()}
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topContent: {
    marginTop: cx(10),
  },
  card: {
    width: cx(348),
    height: cx(210),
    justifyContent: 'flex-end',
    alignSelf: 'center',
    paddingLeft: cx(22),
    paddingBottom: cx(50),
  },
  cardSubtitle: {
    fontSize: 16,
    lineHeight: cx(22),
    color: '#FFF',
  },
  cardTitle: {
    fontSize: 30,
    lineHeight: cx(42),
    color: '#FFF',
    fontWeight: 'bold',
  },
  navContainer: {
    paddingHorizontal: cx(24),
  },
  navList: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    marginTop: cx(20),
  },
  entryButton: {
    width: '33.3%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    marginTop: cx(12),
    fontSize: 12,
    color: '#333',
    lineHeight: 17,
    marginBottom: cx(24),
  },
  panel_box: {
    paddingVertical: cx(10),
    paddingHorizontal: cx(10),
  },
  panel: {
    backgroundColor: '#fff',
    borderRadius: cx(12),
    paddingVertical: cx(20),
    paddingHorizontal: cx(20),
    marginTop: cx(10),
  },
  flex_between: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  panel_btn: {
    backgroundColor: '#fff',
    borderRadius: cx(6),
    height: cx(40),
    marginTop: cx(20),
    width: '40%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapper: {
    width: '100%',
    height: 300,
    backgroundColor:'#ccc',
  },
  slide: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
  },

  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
});
export default Home;
