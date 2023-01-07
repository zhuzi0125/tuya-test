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
}

const {width:screenWidth}=Dimensions.get('window')

const Swiper:FC<SwiperProps>=(props)=>{

  const {children,style,width,horizontal,loop}=props
  const [pages,setPages]=useState(0)
  const [offset,setOffset]=useState({x:0,y:0})
  const [start,setStart]=useState(true)
  const [timer,setTimer]=useState<any>(null)
  const siwperRef=useRef<any>(null)

  const [data_,setData]=useState<any>([])


  useEffect(()=>{
    let childrens=[...children ]
    childrens.push(childrens[0])
    setData(childrens)
  })
  useEffect(()=>{
   
    const timer=setInterval(()=>{
      autoScroll()
    },3000)
    setTimer(timer)
    return ()=>{
      timer&&clearInterval(timer)
    }
  },[pages,start])

  const autoScroll=()=>{
    
    const len=children.length
    let currentPages=0
    if(pages+1>=len){
      currentPages=0
 
    }else{
      currentPages=pages+1
      setPages(currentPages)
    }

   
    const distance=currentPages*width
    offset.x=distance
    setOffset(offset) //记录滚动距离
    siwperRef.current.scrollTo({ x:distance,y:0, animated:true});

  }
  const onLayout=(e)=>{
    
  }
  const autoplay=(e)=>{

  };
  const loopJump=()=>{
     
  };
  //每一帧滚动结束的时候调用
  const onScrollBegin=(e)=>{
    const distance=e.nativeEvent.contentOffset.x
    offset.x=distance
    setOffset(offset) //记录滚动距离
    setPages(Math.round(distance/width)) //记录分页
    
  }
  /**开始拖动的时候 */
  const onScrollBeginDrag=()=>{
    setStart(false)
     //停止定时器
     timer&&clearInterval(timer)
     setTimer(null)
     
   
  }
  /**停止拖拽的时候 */
  const  onScrollEndDrag = e => {
    setStart(true)
  };
  const renderScrollView=pages=>{
   return (
    <ScrollView
     {...props}
     ref={siwperRef}
     horizontal={true}//水平垂直
     alwaysBounceHorizontal={true} //是否水平有弹窗效果
     pagingEnabled={true} //是否点击自动分页
     showsHorizontalScrollIndicator={false} //是否显示水平滚动条
     onMomentumScrollEnd={onScrollBegin}/*当开始滚动的时候*/

     onScrollBeginDrag ={onScrollBeginDrag}/*当开始拖动的时候调用*/

     onScrollEndDrag  ={onScrollEndDrag}/*当停止拖拽的时候*/
     >
      {data_?.map((item,index)=><View key={index}  style={{width}}>{item}</View>)}
    </ScrollView>
   )
  }
  
  return <View style={[styles.container, style]} onLayout={onLayout}>
       {renderScrollView(pages)}
  </View>

}
Swiper.defaultProps={
  showsHorizontalScrollIndicator:false,
  width:screenWidth,
  loop:true
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

