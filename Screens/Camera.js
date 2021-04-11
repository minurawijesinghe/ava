import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, TouchableOpacity, View, FlatList,StatusBar } from 'react-native';
import { RNCamera } from 'react-native-camera';
import LottieView from 'lottie-react-native';
import Voice from '@react-native-community/voice';
import Tts from 'react-native-tts';
import { HttpService } from '../Services/HttpServices';
const patterns = ['checkered', 'dotted', 'floral', 'solid', 'striped', 'zig zag']
class Camera extends Component {
    constructor(props) {
        super(props);
        Voice.onSpeechStart = this.onSpeechStart;
        Voice.onSpeechRecognized = this.onSpeechRecognized;
        Voice.onSpeechEnd = this.onSpeechEnd;
        Voice.onSpeechError = this.onSpeechError;
        Voice.onSpeechResults = this.onSpeechResults;
        Voice.onSpeechPartialResults = this.onSpeechPartialResults;
        Voice.onSpeechVolumeChanged = this.onSpeechVolumeChanged;
        Tts.setDefaultRate(0.5);
        Tts.setDefaultPitch(1.0);
        Tts.setDefaultLanguage('en-US');
        this.state = {
            results: [],
            partialResults: [],
            speaking: false,
            listning: false,
            listningDone: false,
            pictureTaken: false,
            pictureBase64: null,
            processing: false,
            class: null,
            colors: [],

        };
    }
    onSpeechStart = (e) => {
        this.setState({ listningDone: false })
        this.listning.play()

    };

    onSpeechRecognized = (e) => {

    };

    onSpeechEnd = (e) => {
        this.listning.pause()
        this.listning.reset()
        console.log("finished", e)
        this.setState({
            listning: false
        });
    };

    onSpeechError = (e) => {
        this.listning.pause()
        this.listning.reset()
        console.log("ERRR", e)
        Tts.getInitStatus().then(() => {
            Tts.speak("I didn't get that. If you want to take picture , say Take A Picture or just say Proceed ");
        });

    };

    onSpeechResults = (e) => {


        this.setState({
            results: e.value,
            listningDone: true
        });
        console.log("results", e.value)
        this.getinstant(e.value[0])
        // for (let i of e.value) {
        //     if (myarr.indexOf(i) > -1) {

        //     }
        // }
    };
    processImage = async () => {
        this.setState({ processing: true })
        try {
            const res = await HttpService.postImage(this.state.pictureBase64)
            console.log("response", res)
            this.setState({ colors: res.data.colors, class: res.data.class })
            Tts.getInitStatus().then(() => {
                Tts.speak("Your image has " + patterns[res.data.class] + " pattern cloth. Main colors are");
                for (let i of res.data.colors) {
                    Tts.speak(i.percentage + "% of " + i.color);
                }
            });
            this.setState({ processing: false,pictureTaken:false })
        } catch (error) {
            console.log("erroerre", error.response)
            this.setState({ processing: false })
        }
    }
    async getinstant(text) {
        try {

            const res = await HttpService.postquery({
                queryInput: {
                    text: {
                        text: text,
                        languageCode: "en-US"
                    },

                }
            })
            console.log("responseeee", res)

            if (res.data.queryResult.intent.displayName == "turn on camera") {
                if (this.state.class) {
                    this.setState({class:null})
                    Tts.getInitStatus().then(() => {
                        Tts.speak(res.data.queryResult.fulfillmentText+". Please touch the screen to take the picture");
                    });
                }
                else {
                    Tts.getInitStatus().then(() => {
                        Tts.speak("Camera is already ON. Please touch the screen to take the picture");
                    });
                    this.setState({ pictureTaken: false })
                }

            }
            else if (res.data.queryResult.intent.displayName == "proceed") {
                this.processImage()
                Tts.getInitStatus().then(() => {
                    Tts.speak(res.data.queryResult.fulfillmentText);
                });
            }
            else{
                this.setState({ listningDone: false })
                Tts.getInitStatus().then(() => {

                    Tts.speak("I didn't get that. If you want to take picture , say Take A Picture or just say Proceed ");

                });

            }








        } catch (error) {

            console.log(error.response)

        }
    }

    onSpeechPartialResults = (e) => {
        this.setState({
            partialResults: e.value,
        });
    };

    onSpeechVolumeChanged = (e) => {
        this.setState({
            pitch: e.value,
        });
    };

    _startRecognizing = async () => {
        this.setState({
            results: [],
            partialResults: [],
        });

        try {
            await Voice.start('en-US');
        } catch (e) {
            console.error(e);
        }
    };

    _stopRecognizing = async () => {
        try {
            await Voice.stop();
        } catch (e) {
            console.error(e);
        }
    };

    _cancelRecognizing = async () => {
        try {
            await Voice.cancel();
        } catch (e) {
            console.error(e);
        }
    };

    _destroyRecognizer = async () => {
        try {
            await Voice.destroy();
        } catch (e) {
            console.error(e);
        }
        this.setState({
            results: [],
            partialResults: [],
        });
    };
    componentWillUnmount() {
        Voice.destroy().then(Voice.removeAllListeners);
        Tts.removeEventListener('tts-start', (event) => { });
        Tts.removeEventListener('tts-finish', (event) => { });
    }
    takePicture = async () => {
        if (this.camera) {
            Tts.stop();
            const options = { quality: 0.5, base64: true };
            const data = await this.camera.takePictureAsync(options);

            this.setState({ pictureBase64: data.base64, pictureTaken: true })
            Tts.getInitStatus().then(() => {
                this.setState({ listningDone: false })
                Tts.speak("Picture has taken. Do you want to proceed or retake photo?");
            });
        }
    }
    componentDidMount() {

        Tts.addEventListener('tts-start', (event) => {
            this.setState({ speaking: true })
            if (!this.state.processing) {
                this.speaking.play(30, 70)
            }

        });
        Tts.addEventListener('tts-finish', (event) => {
            if (!this.state.processing) {
                this.speaking.reset()
                this.speaking.pause()
            }
            this.setState({ speaking: false })
            if (!this.state.listningDone) this._startRecognizing()
        });
        Tts.getInitStatus().then(() => {
            this.setState({ listningDone: true })
            Tts.speak("Please touch the screen to take a picture");
        });
    }
    render() {
        return (
            <View style={styles.container}>
                <StatusBar backgroundColor='black' barStyle={'light-content'} />
                {
                    this.state.processing ?
                        <LottieView
                            autoPlay
                            loop
                            source={require('../data/lf30_editor_nUZkNJ.json')}
                        />
                        :
                        <>
                            {
                                this.state.class ?
                                    <>
                                        <Text style={{ fontSize: 25, color: 'white', textAlign: 'center',marginVertical:20 }}>Pattern : {patterns[this.state.class]}</Text>
                                        <FlatList data={this.state.colors} renderItem={({ item }) => (
                                            <View style={{ height: 100,borderRadius:10,margin:15, backgroundColor:'white', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <View style={{ height: 60, width: 60, marginHorizontal: 10, backgroundColor: item.color, }} />
                                                <Text style={{ fontSize: 25 }}>Percentage : </Text>
                                                <Text style={{ fontSize: 25, marginRight: 10 }}>{item.percentage}%</Text>
                                            </View>
                                        )}
                                        />
                                    </>
                                    :
                                    <RNCamera
                                        onTap={this.takePicture.bind(this)}
                                        ref={(ref) => {
                                            this.camera = ref;
                                        }}
                                        playSoundOnCapture
                                        style={styles.preview}
                                        type={RNCamera.Constants.Type.back}
                                    />
                            }

                            <View style={{ height: 100, flexDirection: 'row', justifyContent: 'center' }}>
                                {
                                    this.state.speaking ?
                                        <LottieView
                                            ref={speaking => {
                                                this.speaking = speaking;
                                            }}
                                            loop
                                            source={require('../data/4031-voice-recognition.json')}
                                        />
                                        :

                                        <LottieView
                                            ref={listning => {
                                                this.listning = listning;
                                            }}
                                            loop
                                            source={require('../data/7833-voice.json')}
                                        />

                                }
                            </View>
                            {

                                <TouchableOpacity disabled={this.state.speaking || this.state.pictureTaken} onPress={() => {
                                    if(this.state.class){
                                        this._startRecognizing()
                                    }
                                    else{
                                        this.takePicture()
                                    }
                                    
                                }} style={{ flex: 1, position: 'absolute', height: '100%', width: '100%' }} />


                            }
                        </>
                }
            </View>
        );
    }


}

export default Camera;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black'
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    capture: {
        flex: 0,
        borderRadius: 5,
        padding: 15,
        paddingHorizontal: 20,
        alignSelf: 'center',
        margin: 20,
    },
});