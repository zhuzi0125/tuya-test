/**
 * react-native-swiper
 * @author leecade<leecade@163.com>
 */
import React, { Component,FC,useState,useEffect,useRef } from 'react';
import PropTypes, { any } from 'prop-types';
import {
  Text,
  View,
  ViewPropTypes,
  ScrollView,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  Dimensions,
  
} from 'react-native';

interface SwiperProps {
  horizontal?: boolean,
  containerStyle?:StyleProp<any>
  style?:StyleProp<any>,
  autoplay?:boolean,
  showsButtons?:boolean,
  loop?:boolean,
  children?:React.ReactChild[]|any
  onIndexChanged?:(e:number)=>void,
  width?:number|any,
  showsHorizontalScrollIndicator?:boolean,
  onScrollBeginDrag?:(x:any,y:any)=>void
  onMomentumScrollEnd?:(x:any,y:any)=>void
}

const {width:screenWidth}=Dimensions.get('window')

const Swiper:FC<SwiperProps>=(props)=>{

  const {children,style,width,onScrollBeginDrag,onMomentumScrollEnd,horizontal}=props
  const [pages,setPages]=useState(children)
  const [offset,setOffset]=useState({x:0,y:0})
  const [internals,setInternals]=useState({isScrolling:false,offset:{x:0,y:0}})
  const [index,setIndex]=useState(0)
  const [dir,setDir]=useState<any>()
  
  const siwperRef=useRef<any>(null)
  useEffect(() => {
    //setPages(children)
    setDir(horizontal?'x':'y')
  }, []);
  const onLayout=()=>{

  }
  const fullState=()=> {
    return Object.assign({},internals);
  }
  const updateIndex=(e,dir,callback)=>{
    const direction=horizontal?offset.x:offset.y
    const step=Math.round(index+direction/width)
    setIndex(step)
    console.log(step,'测试')
    if(step===0) {
      siwperRef && siwperRef.current.scrollTo({ x:0,y:0, animated:true});
    } 
    callback(e)
  }
  const scrollBy=(index_,animated=true)=>{
     if(internals.isScrolling) return false
     const diff=index+index_
     let x=0;
     let y=0;
     if(dir==='x') x=diff*width
     siwperRef && siwperRef.current.scrollTo({ x,y, animated});
     internals.isScrolling=true
     setInternals(internals)
  }
  const autoplay=(e)=>{
    scrollBy(1)
  };
  const loopJump=()=>{

  };
  const onScrollBegin=(e)=>{

    internals.isScrolling=true
    setInternals(internals)
    onScrollBeginDrag && onScrollBeginDrag(e, fullState());
  }
  const onScrollEnd=(e)=>{
   
    internals.isScrolling=false
    setInternals(internals)
    if(!e.nativeEvent.contentOffset){
      e.nativeEvent.contentOffset = {
        x: e.nativeEvent.position * width,
      };
     }
    updateIndex(e.nativeEvent.contentOffset, dir, (info) => {
        autoplay(info);
        loopJump();
    });
    // if `onMomentumScrollEnd` registered will be called here
    onMomentumScrollEnd && onMomentumScrollEnd(e, fullState());
  }
  
  const  onScrollEndDrag = e => {
    console.log(e.nativeEvent.contentOffset,'相信 ')
    const { contentOffset } = e.nativeEvent;
    const { offset } = internals;
    const previousOffset = horizontal ? offset.x : offset.y;
    const newOffset = horizontal ? contentOffset.x : contentOffset.y;
    setOffset(e.nativeEvent.contentOffset)
    if (previousOffset === newOffset && (index === 0 || index === children.length - 1)) {
      internals.isScrolling = false;
      setInternals(internals)
    }
  };
  const renderScrollView=pages=>{
   return (
    <ScrollView
     {...props}
     ref={siwperRef}
     contentOffset={offset}
     contentContainerStyle={[styles.wrapperIOS ]}
  
     onScrollBeginDrag={onScrollBegin}
     onMomentumScrollEnd={onScrollEnd}
     onScrollEndDrag={onScrollEndDrag}
     >
      {pages?.map((item,index)=><View key={index}  style={{width}}>{item}</View>)}
    </ScrollView>
   )
  }
  
  return <View style={[styles.container, style]} onLayout={onLayout}>
       {renderScrollView(pages)}
  </View>

}
Swiper.defaultProps={
  showsHorizontalScrollIndicator:false,
  width:screenWidth
}
export default Swiper

const styles = {
  container: {
    backgroundColor: 'transparent',
    position: 'relative',
    flex: 1,
  },

  wrapperIOS: {
    backgroundColor: 'transparent',
  },

  wrapperAndroid: {
    backgroundColor: 'transparent',
    flex: 1,
  },

  slide: {
    backgroundColor: 'transparent',
  },

  pagination_x: {
    position: 'absolute',
    bottom: 25,
    left: 0,
    right: 0,
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },

  pagination_y: {
    position: 'absolute',
    right: 15,
    top: 0,
    bottom: 0,
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },

  title: {
    height: 30,
    justifyContent: 'center',
    position: 'absolute',
    paddingLeft: 10,
    bottom: -30,
    left: 0,
    flexWrap: 'nowrap',
    width: 250,
    backgroundColor: 'transparent',
  },

  buttonWrapper: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    position: 'absolute',
    top: 0,
    left: 0,
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  buttonText: {
    fontSize: 50,
    color: '#007aff',
  },
};

