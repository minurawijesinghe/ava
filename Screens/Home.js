import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    StatusBar,
    TouchableOpacity
} from 'react-native';
import LottieView from 'lottie-react-native';
import Voice from '@react-native-community/voice';
import Tts from 'react-native-tts';
import { HttpService } from '../Services/HttpServices'
class Home extends Component {


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
        };
    }

    componentWillUnmount() {
        console.log("unmounting")
        Voice.destroy().then(Voice.removeAllListeners);
        Tts.removeEventListener('tts-start', (event) => { });
        Tts.removeEventListener('tts-finish', (event) => { });
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
        this.setState({
            listning: false
        });
    };

    onSpeechError = (e) => {
        this.listning.pause()
        this.listning.reset()
        console.log("ERRRR", e)
    };

    onSpeechResults = (e) => {


        this.setState({
            results: e.value,
            listningDone: true
        });
        this.getinstant(e.value[0])

        // for (let i of e.value) {
        //     if (myarr.indexOf(i) > -1) {
        //         this.props.navigation.navigate("Camera")
        //     }
        // }
    };

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
            Tts.getInitStatus().then(() => {
                Tts.speak(res.data.queryResult.fulfillmentText);
            });
            if (res.data.queryResult.intent.displayName == "turn on camera") {
                Voice.destroy().then(Voice.removeAllListeners);
                this.props.navigation.navigate("Camera")
            }






        } catch (error) {

            console.log(error.response)

        }
    }
    async componentDidMount() {
        Tts.addEventListener('tts-start', (event) => {
            this.setState({ speaking: true })
            this.speaking.play()
        });
        Tts.addEventListener('tts-finish', (event) => {
            this.speaking.reset()
            this.speaking.pause()
            this.setState({ speaking: false })
            if (!this.state.listningDone) this._startRecognizing()
        });
        Tts.getInitStatus().then(() => {
            Tts.speak("Hi! ,I am Ava. I can help you to choose your cloth. How can I help you?");
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar backgroundColor='black' barStyle={'light-content'} />
                <View style={{ flex: 1 }}>
                    <Text style={{fontSize:30,fontWeight:'bold',marginHorizontal:20,marginVertical:30,color:'white',}}>Hi, I am AVA</Text>
                </View>
                <View style={{ flex: 2,justifyContent: 'center',height:300,width:'100%',
        alignItems: 'center', }}>
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

                            <TouchableOpacity style={{ flex: 1, width: '100%' }} onPress={this._startRecognizing}>
                                <LottieView
                                    ref={listning => {
                                        this.listning = listning;
                                    }}
                                    loop
                                    source={require('../data/7833-voice.json')}
                                />
                                <Text style={{ color: "white", fontSize: 20, fontWeight: '300', marginTop: 30, textAlign: 'center', marginHorizontal: 10, position: 'absolute', bottom: 50, alignSelf: 'center' }}>{this.state.results.length > 0 ? this.state.results[0] : "How can I help You"}</Text>
                            </TouchableOpacity>

                    }
                </View>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
    },
});

export default Home;