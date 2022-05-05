import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, StyleSheet, Image, TouchableWithoutFeedback, TouchableOpacity, Text } from 'react-native';
import { Video } from 'expo-av';
import Ionicons from '@expo/vector-icons/Ionicons';

type Props = {
    uri: string,
    isMuted: boolean,
    shouldPlay: boolean,
    onToggleMuted: (isMuted: boolean) => void,
    onLoadEnd: () => void
};


export const StoryVideoPlayer = ({ uri, isMuted, shouldPlay, onToggleMuted, onLoadEnd }) => {
    const video = useRef(null);
    const [source, setSource] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)
    const [isBuffering, setIsBuffering] = useState(false)

    const isInitialMount = useRef(true);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            // Your useEffect code here to be run on update
        }
    });

    useEffect(() => {
        if ((uri && !source) || (uri && source && source.uri != uri)) {
            console.log('set new source from uri:', uri)
            setSource({ uri: uri })
        }
    }, [uri])

    useEffect(() => {
        if (video.current) {
            if (shouldPlay) {
                video.current.playAsync()
            }
            else {
                video.current.pauseAsync()
            }
        }
    }, [shouldPlay])

    useEffect(() => {
        if (source && video.current) {
            console.log('start playback on set source')
            // playbackObject.loadAsync(source, initialStatus = {}, downloadFirst = true)
            video.current.loadAsync(source, {
                progressUpdateIntervalMillis: 500,
                positionMillis: 0,
                shouldPlay: false,
                isLooping: false,
                isMuted: isMuted
            },
                false)
        }
    }, [source])

    useEffect(() => {
        video.current?.setIsMutedAsync(isMuted)
    }, [isMuted])

    useEffect(() => {
        if (isLoaded && onLoadEnd != undefined) {
            console.log('trigger OnLoadEnd')
            onLoadEnd()
        }
    }, [isLoaded])

    function onStatusUpdate(status) {
        if (status.isLoaded) {
            if (!isLoaded) {
                setIsLoaded(true)
            }
            if (status.isMuted != isMuted) {
                setIsMuted(status.isMuted)
            }
            if (status.isPlaying != isPlaying) {
                setIsPlaying(status.isPlaying)
            }
        }
        else {
            if (isLoaded) {
                setIsLoaded(false)
            }
        }
    }

    _onPlaybackStatusUpdate = playbackStatus => {
        if (!playbackStatus.isLoaded) {
            // Update your UI for the unloaded state
            setIsLoaded(playbackStatus.isLoaded)
            if (playbackStatus.error) {
                console.log(`Encountered a fatal error during playback: ${playbackStatus.error}`);
                // Send Expo team the error on Slack or the forums so we can help you debug!
            }
        } else {
            // Update your UI for the loaded state
            setIsMuted(playbackStatus.isMuted)
            setIsPlaying(playbackStatus.isPlaying)

            if (playbackStatus.isPlaying) {
                // Update your UI for the playing state
            } else {
                // Update your UI for the paused state
            }

            if (playbackStatus.isBuffering) {
                // Update your UI for the buffering state
            }

            if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
                // The player has just finished playing and will stop. Maybe you want to play something else?
            }
        }
    };


    return (
        <View style={styles.container}>
            {source ?
                <View>
                    <Video
                        ref={video}
                        style={styles.video}
                        onPlaybackStatusUpdate={onStatusUpdate}
                    />
                    {isLoaded && <TouchableOpacity
                        onPress={() => {
                            props.onToggleMuted(!isMuted)
                        }}
                        style={styles.soundButton}
                    >
                        <Ionicons name={isMuted ? 'volume-off' : 'volume-high'} size={24} color="#ffffff" />
                    </TouchableOpacity>}

                    {isBuffering && <View style={styles.bufferingIndicator} >
                        <Ionicons name={'cloud-outline'} size={24} color="#ffffff" />
                    </View>}
                </View>
                : <View />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },
    video: {
        width: '100%',
        height: '100%',
        padding: 0,
        margin: 0,
    },
    soundButton: {
        position: 'absolute',
        top: 10,
        left: 5,
        backgroundColor: 'rgba(20, 20, 20, 0.3)',
        borderRadius: 50,
        height: 35,
        width: 35,
        zIndex: 9999,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bufferingIndicator: {
        position: 'absolute',
        top: 10,
        right: 5,
        backgroundColor: 'rgba(20, 20, 20, 0.3)',
        borderRadius: 50,
        height: 35,
        width: 35,
        zIndex: 9999,
        alignItems: 'center',
        justifyContent: 'center',
    }
});
