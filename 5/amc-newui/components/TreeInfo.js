import { StatusBar } from 'expo-status-bar';
import { Ionicons }  from '@expo/vector-icons';
import { processFontFamily } from 'expo-font';

import   React, { useState, useEffect, useCallback }                       from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { Card }                                                            from 'react-native-elements'
import Svg, { Circle, Line,  }                                         from 'react-native-svg';


// STYLES FOR VARIOUS ELEMENTS =================================================================================================
const win = Dimensions.get('window');

const teal   = 'rgba(  0,  75,  95, 1)'; //global.colors.teal;
const orange = 'rgba(242, 154, 124, 1)'; //global.colors.orange;
const white  = 'rgba(255, 255, 255, 1)'; //global.colors.white;
const grey   = 'rgba(180, 180, 180, 1)'; //global.colors.grey;
const black  = 'rgba(  0,   0,   0, 1)'; //global.colors.black;
const clear  = 'rgba(  0,   0,   0, 0)'; //global.clear;

const screen_dimensions = Dimensions.get('window');
const screen_width  = screen_dimensions.width;   // iPhone 12 Mini: 375
const screen_height = screen_dimensions.height; //  iPhone 12 Mini: 812
const title_bar_height = screen_height*0.11;
const card_width = screen_dimensions.width*0.95;



const tier6th = win.width/6;
const center = win.width / 2;
const tier_height = 100;

const radius = 30;
const border_thickness = 3;
const selection_thickness = 6;

const styles = StyleSheet.create({
  // PREDICTION PAGE TITLE BAR STYLE -------------------------------------------
  prediction_title_bar: {
    height: title_bar_height,
    width: screen_width,
    backgroundColor: white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  close_icon: {
    position: 'absolute',
    left: title_bar_height*0.3,
    bottom: title_bar_height*-0.55,
    fontSize: 55,
    color: teal
  },
  art_translate_logo: {
    alignSelf:'center',
    top: 25,
    resizeMode: 'contain',
    width:title_bar_height/1.6
  },
  camera_icon: {
    position: 'absolute',
    right: title_bar_height*0.3,
    bottom: title_bar_height*-0.48,
    fontSize:42,
    color: teal
  },
  // MODEL INFO BOX STYLES -----------------------------------------------------
  section_title: {
    fontSize: 16,
    textAlign: 'left',
    color: black,
    fontFamily: 'ArgentumSansRegular'
  },
  section_content: {
    color: black,
    fontSize: 16,
    paddingBottom: 15,
    textAlign: 'left',
    fontFamily: 'ArgentumSansLight'
  },
})

function rounded_box(color1, color2) {
  return {
    width: card_width,
    height: card_width*0.9,
    paddingLeft:  15,
    paddingRight: 15,
    backgroundColor: white,
    shadowOffset: {
      width: -7,
      height: 11
    },
    shadowOpacity: 0.35,
    shadowRadius: 13
   }
}



function print_list(movements) {
  var string = "\n";
  for (var i=0; i < movements.length-1; i++) {
    string += "     " + movements[i] + "\n";
  }
  string += "     " + movements[movements.length-1];

  return string;
}

function TreeInfo ({navigation})
{
  const [modelInfo, setModelInfo] = useState(global.treeInfo.a2o);
  const [color1, setColor1] = useState(white);
  const [color2, setColor2] = useState(teal);
  const [index, setIndex] = useState(0);

  function get_model_info(abbr)
  {
    var model = null;

    switch (abbr) {
      case 'a2o':
        model = global.treeInfo.a2o;
        if (index === 0) { setIndex(-1); }
        else             { setIndex(0);  }
        setColor1(white);
        setColor2(teal);
        break;
      case 'arc':
        model = global.treeInfo.arc;
        if (index === 1) { setIndex(-1); }
        else             { setIndex(1);  }
        setColor1(white);
        setColor2(teal);
        break;
      case 'two':
        model = global.treeInfo.two;
        if (index === 2) { setIndex(-1); }
        else             { setIndex(2);  }
        setColor1(white);
        setColor2(teal);
        break;
      case 'obj':
        model = global.treeInfo.obj;
        if (index === 3) { setIndex(-1); }
        else             { setIndex(3);  }
        setColor1(white);
        setColor2(teal);
        break;
      case 'abs':
        model = global.treeInfo.abs;
        if (index === 4) { setIndex(-1); }
        else             { setIndex(4);  }
        setColor1(white);
        setColor2(teal);
        break;
      case 'ren':
        model = global.treeInfo.ren;
        if (index === 5) { setIndex(-1); }
        else             { setIndex(5);  }
        setColor1(white);
        setColor2(teal);
        break;
      default:
        model = null;
        setIndex(-1);
        break;
    }
    setModelInfo(model);
  }

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent:'space-between', backgroundColor:'#fff'}}>
      <View style={[StyleSheet.absoluteFill, {alignItems: 'center'}]}>

        <View style={styles.prediction_title_bar}>
          <View>
            <TouchableOpacity style={{alignItems:'center'}}>
              <Ionicons name="ios-close" style={styles.close_icon}/>
            </TouchableOpacity>
          </View>
          <View>
            <Image source={require('../assets/icons/AT.png')} style={styles.art_translate_logo}/>
          </View>
          <View>
            <TouchableOpacity style={{alignItems:'center'}} onPress={ () => navigation.navigate('Home')}>
              <Ionicons name="ios-camera" style={styles.camera_icon}/>
            </TouchableOpacity>
          </View>
          <StatusBar style="dark" />
        </View>

        <Text style={{fontFamily:'ArgentumSansLight', fontSize:24, textAlign:'center', position:'absolute', left:center-21, top:tier_height/2+74}}>a2o</Text>
        <Text style={{fontFamily:'ArgentumSansLight', fontSize:24, textAlign:'center', position:'absolute', left:tier6th-19, top:tier_height*1.5+74}}>arc</Text>
        <Text style={{fontFamily:'ArgentumSansLight', fontSize:24, textAlign:'center', position:'absolute', left:tier6th*3-22, top:tier_height*1.5+74}}>two</Text>
        <Text style={{fontFamily:'ArgentumSansLight', fontSize:24, textAlign:'center', position:'absolute', left:tier6th*5-20, top:tier_height*1.5+74}}>obj</Text>
        <Text style={{fontFamily:'ArgentumSansLight', fontSize:24, textAlign:'center', position:'absolute', left:tier6th*2-22, top:tier_height*2.5+74}}>abs</Text>
        <Text style={{fontFamily:'ArgentumSansLight', fontSize:24, textAlign:'center', position:'absolute', left:tier6th*4-19, top:tier_height*2.5+74}}>ren</Text>


        <Svg height="40%" width="100%">

          <Line x1={center} y1={tier_height/2+radius} x2={tier6th*1} y2={tier_height*1.5-radius} stroke={teal} strokeWidth={border_thickness} />
          <Line x1={center} y1={tier_height/2+radius} x2={tier6th*3} y2={tier_height*1.5-radius} stroke={teal} strokeWidth={border_thickness} />
          <Line x1={center} y1={tier_height/2+radius} x2={tier6th*5} y2={tier_height*1.5-radius} stroke={teal} strokeWidth={border_thickness} />
          { (index === 0) ? (
            <Circle
              cx={center}
              cy={tier_height/2}
              r={radius+border_thickness}
              stroke={orange}
              strokeWidth={selection_thickness}
              fill={clear}
            />
          ) : (null)}
          <Circle
            cx={center}
            cy={tier_height/2}
            r={radius}
            stroke={teal}
            strokeWidth={border_thickness}
            fill={clear}
            onPress={()=>get_model_info('a2o')}
          />


          <Line x1={center} y1={tier_height*1.5+radius} x2={tier6th*2} y2={tier_height*2.5-radius} stroke={teal} strokeWidth={border_thickness} />
          <Line x1={center} y1={tier_height*1.5+radius} x2={tier6th*4} y2={tier_height*2.5-radius} stroke={teal} strokeWidth={border_thickness} />
          { (index === 1) ? (
            <Circle
              cx={tier6th}
              cy={tier_height*1.5}
              r={radius+border_thickness}
              stroke={orange}
              strokeWidth={selection_thickness}
              fill={clear}
            />
          ) : (null)}
          <Circle
            cx={tier6th}
            cy={tier_height*1.5}
            r={radius}
            stroke={teal}
            strokeWidth={border_thickness}
            fill={clear}
            onPress={()=>get_model_info('arc')}
          />
          { (index === 2) ? (
            <Circle
              cx={tier6th*3}
              cy={tier_height*1.5}
              r={radius+border_thickness}
              stroke={orange}
              strokeWidth={selection_thickness}
              fill={clear}
            />
          ) : (null)}
          <Circle
            cx={tier6th*3}
            cy={tier_height * 1.5}
            r={radius}
            stroke={teal}
            strokeWidth={border_thickness}
            fill={clear}
            onPress={()=>get_model_info('two')}
          />
          { (index === 3) ? (
            <Circle
              cx={tier6th*5}
              cy={tier_height*1.5}
              r={radius+border_thickness}
              stroke={orange}
              strokeWidth={selection_thickness}
              fill={clear}
            />
          ) : (null)}
          <Circle
            cx={tier6th*5}
            cy={tier_height * 1.5}
            r={radius}
            stroke={teal}
            strokeWidth={border_thickness}
            fill={clear}
            onPress={()=>get_model_info('obj')}
          />
          { (index === 4) ? (
            <Circle
              cx={tier6th*2}
              cy={tier_height * 2.5}
              r={radius+border_thickness}
              stroke={orange}
              strokeWidth={selection_thickness}
              fill={clear}
            />
          ) : (null)}
          <Circle
            cx={tier6th*2}
            cy={tier_height * 2.5}
            r={radius}
            stroke={teal}
            strokeWidth={border_thickness}
            fill={clear}
            onPress={()=>get_model_info('abs')}
          />
          { (index === 5) ? (
            <Circle
              cx={tier6th*4}
              cy={tier_height * 2.5}
              r={radius+border_thickness}
              stroke={orange}
              strokeWidth={selection_thickness}
              fill={clear}
            />
          ) : (null)}
          <Circle
            cx={tier6th*4}
            cy={tier_height * 2.5}
            r={radius}
            stroke={teal}
            strokeWidth={border_thickness}
            fill={clear}
            onPress={()=>get_model_info('ren')}
          />
        </Svg>

        { (index !== -1) ? (
          <View style={rounded_box(color1, color2)}>
            <ScrollView>
              <Text/>
              <Card.Title style={styles.section_title}>{modelInfo.name}</Card.Title>
              <Card.Divider/>

              <Text style={styles.section_content}>Type: {modelInfo.type}</Text>
              <Card.Divider/>

              <Text style={styles.section_content}>Labels: {print_list(modelInfo.desc)}</Text>
              <Card.Divider/>

              <Text style={styles.section_content}>Average Precision: {modelInfo.accu}</Text>
              <Card.Divider/>

              <Text style={styles.section_content}>Size: {modelInfo.size} MB</Text>
            </ScrollView>
          </View>
        ) : ( null )
        }
        <Text/>
      </View>
    </View>
  );
}

TreeInfo.navigationOptions = navigation => ({ headerShown: false });

export default TreeInfo;