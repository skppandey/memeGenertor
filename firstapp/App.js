/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect, createRef} from 'react';
import MemeContainer from './MemeContainer';
import CameraRoll from '@react-native-community/cameraroll';
import {PERMISSIONS} from 'react-native-permissions';

import RNFetchBlob from 'rn-fetch-blob';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Button,
  View,
  Text,
  Image,
  StatusBar,
  TextInput,
  ToastAndroid,
  Platform,
  PermissionsAndroid,
  ImageBackground,
  TouchableOpacity,
  BackHandler,
  Animated,
} from 'react-native';
import {Dimensions} from 'react-native';
import FastImage from 'react-native-fast-image';

import {
  Header,
  LearnMoreLinks,
  Colors,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource';
import Share from 'react-native-share';
// import * as Sharing from 'expo-sharing';

const ObjectToQueryParam = obj => {
  const params = Object.entries(obj).map(([key, value]) => `${key}=${value}`);
  return '?' + params.join('&');
};
// const image = {uri: './images/reuben-teo-fUZWpaUknyI-unsplash(1).jpg'};
const image = {uri: 'https://reactjs.org/logo-og.png'};

const win = Dimensions.get('window');

const App = () => {
  const [templates, setTemplates] = useState([]);
  const [template, setTemplate] = useState(null);
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const [meme, setMeme] = useState('');
  const [width, setWidth] = useState();
  const [height, setHeight] = useState();
  const [position, setPosition] = useState(null);
  const [imagepath, setimagePath] = useState('');
  const myRef = createRef<ScrollView>();

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Save file Permission',
          message:
            'Permission required to save the photos ' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('you can save file');
        saveToCameraRoll();
      } else {
        console.log(' permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const dwFile = () => {
    let url = meme;
    let imagePath = null;
    RNFetchBlob.config({
      fileCache: true,
      appendExt: 'jpg',
    })
      .fetch('GET', url)
      // the image is now dowloaded to device's storage
      .then(resp => {
        // the image path you can use it directly with Image component
        imagePath = resp.path();
        return resp.readFile('base64');
      })
      .then(async base64Data => {
        var base64Data = 'data:image/png;base64,' + base64Data;
        // here's base64 encoded image
        const shareOptions = {
          title: 'Title',
          url: base64Data,
          message: 'promotional message',
          type: 'image/jpeg',
        };
        await Share.open({url: base64Data});

        // Sharing.shareAsync(base64Data)
      });
  };

  const saveToCameraRoll = () => {
    let url = meme;
    ToastAndroid.show('Image is Saving...', ToastAndroid.SHORT);
    if (Platform.OS === 'android') {
      RNFetchBlob.config({
        fileCache: true,
        appendExt: 'jpg',
      })
        .fetch('GET', url)
        .then(res => {
          console.log(res.path());
          CameraRoll.saveToCameraRoll(res.path())
            .then(res => {
              console.log('save', res);
              ToastAndroid.show(
                'Image saved Successfully.',
                ToastAndroid.SHORT,
              );
            })
            .catch(error => {
              console.log(error);
              ToastAndroid.show('Ops! Operation Failed', ToastAndroid.SHORT);
            });
        });
    } else {
      CameraRoll.saveToCameraRoll(url).then(
        alert('Success', 'Photo added to camera roll!'),
      );
      ToastAndroid.show('Image saved Successfully.', ToastAndroid.SHORT);
    }
  };
  useEffect(() => {
    fetch('https://api.imgflip.com/get_memes').then(x =>
      x.json().then(response => setTemplates(response.data.memes)),
    );
  }, []);
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      );
    };
  });
  function handleBackButtonClick() {
    console.log(meme);
    console.log(template);
    if (meme) {
      setMeme('');
      return true;
    }
    if (template) {
      setTemplate(null);
      return true;
    }
    if(meme == '' && template == null){
      return false;
    }
    
  }
  let pos = 0;
  const handleScroll = event => {
    // console.log(Math.floor(event.nativeEvent.contentOffset.y));

    if (Math.floor(event.nativeEvent.contentOffset.y) == 0 && pos !== 0) {
      setPosition(pos);
    } else {
      setPosition(Math.floor(event.nativeEvent.contentOffset.y));
    }
    // console.log(position);
  };

  const scrollToTop = () => {
    pos = position;
    myRef.current && myRef.current.scrollTo({x: 0, y: pos, animated: true});
  };
  if (meme) {
    Image.getSize(
      meme,
      (width, height) => {
        // console.log(`The image dimensions are ${width}x${height}`);
        let ratio = height / width;
        setWidth(win.width);
        setHeight(win.width * ratio);
      },
      error => {
        // console.error(`Couldn't get the image size: ${error.message}`);
      },
    );
    return (
      <View
        style={{
          textAlign: 'center',
          flex: 1,
          height: '100%',
          backgroundColor: '#ffccff',
        }}>
        <ImageBackground
          resizeMode={'stretch'} // or cover
          style={{flex: 1}} // must be passed from the parent, the number may vary depending upon your screen size
          source={require('./images/luke-chesser-hQo6Uyo4nBg-unsplash.jpg')}>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <TouchableOpacity
              style={styles.customIcon}
              onPress={() => setMeme('')}>
              {/* <Text style={styles.customBtnText}>Back</Text> */}
              <Image
                style={styles.icon}
                source={require('./images/43339-200.png')}
              />
            </TouchableOpacity>
          </View>
          <Image
            style={{width: width, height: height}}
            source={{uri: meme}}
            alt="Custom Meme"
          />
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <TouchableOpacity
              style={styles.customIcon}
              onPress={requestCameraPermission}>
              {/* <Text style={styles.customBtnText}>Download</Text> */}
              <Image
                style={styles.iconD}
                source={require('./images/icons8-download-52.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.customIcon} onPress={dwFile}>
              {/* <Text style={styles.customBtnText}>Share</Text> */}
              <Image
                style={styles.iconD}
                source={require('./images/icons8-share-104.png')}
              />
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    );
  }

  return (
    <View
      // onLayout={onLayout}
      style={{
        flex: 1,
        height: '100%',
        // backgroundColor: '#ffccff',
      }}>
      <ImageBackground
        resizeMode={'stretch'} // or cover
        style={{flex: 1}} // must be passed from the parent, the number may vary depending upon your screen size
        source={require('./images/luke-chesser-hQo6Uyo4nBg-unsplash.jpg')}>
        <SafeAreaView style={{padding: 10}}>
          <ScrollView
            onScroll={handleScroll}
            ref={myRef}
            onContentSizeChange={scrollToTop}
            contentContainerStyle={{alignItems: 'center'}}>
            {template && (
              <>
                <TouchableOpacity
                  style={styles.customBtnBG}
                  onPress={() => setTemplate(null)}>
                  <Text style={styles.customBtnText}>Back</Text>
                </TouchableOpacity>
                <FastImage
                  style={{width: 300, height: 300}}
                  key={template.id}
                  source={{uri: template.url}}
                  alt={template.name}
                  onLoadStart={() => console.log('123')}
                />
                <TextInput
                  placeholder="Top Text"
                  value={topText}
                  style={styles.textInput}
                  onChangeText={inputText => {
                    setTopText(inputText);
                  }}
                />

                <TextInput
                  placeholder="Bottom Text"
                  value={bottomText}
                  style={styles.textInput}
                  onChangeText={inputText => {
                    setBottomText(inputText);
                  }}
                />
                <TouchableOpacity
                  style={styles.customBtnBG}
                  onPress={async e => {
                    e.preventDefault();

                    const params = {
                      template_id: template.id,
                      text0: topText,
                      text1: bottomText,
                      username: 'shubhamkumarPandey',
                      password: 'Shubham@123',
                    };
                    const response = await fetch(
                      `https://api.imgflip.com/caption_image${ObjectToQueryParam(
                        params,
                      )}`,
                    );
                    const jsonData = await response.json();
                    setMeme(jsonData.data.url);
                  }}>
                  <Text style={styles.customBtnText}>Generate</Text>
                </TouchableOpacity>
                <View style={{marginTop: 220}}>
                  <Text>{'\u00A9'}2020 Ru-De Labs/SKP</Text>
                </View>
              </>
            )}
            {!template &&
              templates.map(template => {
                return (
                  <MemeContainer
                    template={template}
                    onClick={() => {
                      setTemplate(template);
                      // console.log("image is clicked")
                    }}
                  />
                );
              })}
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
  },
  scrollView: {
    backgroundColor: 'pink',
    marginHorizontal: 20,
  },
  tinyLogo: {
    width: 200,
    height: 50,
  },
  logo: {
    width: 66,
    height: 58,
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    width: 680,
    height: 680,
  },
  container1: {
    flex: 1,
    // remove width and height to override fixed static size
    width: null,
    height: null,
  },
  customBtnText: {
    fontSize: 20,
    fontWeight: '400',
    color: '#fff',
    textAlign: 'center',
  },
  customBtnBG: {
    backgroundColor: '#669900',
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 10,
    margin: 10,
    // width: 200,
  },
  customIcon: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 20,
  },
  customIcon1: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 10,
    margin: 10,
    // width: 200,
  },
  textInput: {
    borderColor: '#001a00',
    borderWidth: 2,
    color: '#001a00',
    width: 250,
    height: 40,
    margin: 10,
    fontWeight: 'bold',
  },
  icon: {
    width: 25,
    height: 25,
  },
  iconD: {
    width: 45,
    height: 45,
  },
});

export default App;
