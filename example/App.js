import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import InstaStory from 'react-native-insta-story';

export default function App() {
    function createData() {
        const array = []

        const userCount = 10;
        const userStoryCount = 15;

        for (let i = 1; i <= userCount; i++) {
            const storyArray = [];
            for (let k = 1; k <= userStoryCount; k++) {
                storyArray.push(
                    {
                        story_id: i,
                        story_image: "https://picsum.photos/500/800?random=" + Math.random(),
                        story_video: Math.random() < 0.3 ? "https://assets.mixkit.co/videos/download/mixkit-portrait-of-a-woman-in-a-pool-1259.mp4" : null,
                        swipeText: 'Custom swipe text for this story',
                        onPress: () => console.log(`story ${i} swiped`),
                    }
                )
            }

            array.push({
                user_id: i,
                user_image: "https://picsum.photos/200/300?random=" + Math.random(),
                user_name: "Test User " + i,
                stories: storyArray
            })
        }
        return array;
    }

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <InstaStory data={createData()}
                duration={30}
                customSwipeUpComponent={<View>
                    <Text>Swipe</Text>
                </View>}

                style={{ marginTop: 30 }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});
