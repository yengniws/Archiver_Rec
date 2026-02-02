// import React, { useState } from 'react';
// import { Pressable, ScrollView, Dimensions, StatusBar } from 'react-native';
// import styled from 'styled-components/native';
// import { useRouter } from 'expo-router';
// import Player from '../components/Player';
// import { TRACKS } from '../data/tracks';

// const SCREEN_HEIGHT = Dimensions.get('window').height;

// export default function Main() {
//   const router = useRouter();
//   const [currentIndex, setCurrentIndex] = useState(0);

//   return (
//     <Container>
//       <StatusBar barStyle='dark-content' />
//       <ScrollView
//         contentContainerStyle={{ paddingBottom: 50 }}
//         showsVerticalScrollIndicator={false}>
//         <TopPartWrapper>
//           <TitleWrapper>
//             <Title1>Archive your</Title1>
//             <Title2>fav music</Title2>
//           </TitleWrapper>

//           <Pressable onPress={() => router.push('/addMusic')}>
//             <AddMusicBtn
//               source={require('../assets/image/goToAddMusicIcon.png')}
//             />
//           </Pressable>
//         </TopPartWrapper>

//         <Player
//           currentIndex={currentIndex}
//           setCurrentIndex={setCurrentIndex}
//         />

//         <NotePartWrapper>
//           <ArchivedDate>
//             Archived Date : <DatePoint>{TRACKS[currentIndex].date}</DatePoint>
//           </ArchivedDate>

//           <NoteBox>
//             <NoteText>{TRACKS[currentIndex].note}</NoteText>
//           </NoteBox>
//         </NotePartWrapper>
//       </ScrollView>
//     </Container>
//   );
// }

// const Container = styled.SafeAreaView`
//   flex: 1;
//   background-color: ${({ theme }) => theme.colors.background};
// `;

// const TopPartWrapper = styled.View`
//   flex-direction: row;
//   justify-content: space-between;
//   align-items: flex-end;
//   padding: 30px 20px;
// `;

// const TitleWrapper = styled.View``;

// const Title1 = styled.Text`
//   font-size: ${({ theme }) => theme.typography.title.fontSize};
//   font-family: ${({ theme }) => theme.fonts.bold};
// `;

// const Title2 = styled.Text`
//   font-size: ${({ theme }) => theme.typography.title.fontSize};
//   font-family: ${({ theme }) => theme.fonts.bold};
// `;

// const AddMusicBtn = styled.Image.attrs({ resizeMode: 'contain' })`
//   width: 24px;
//   height: 24px;
//   margin-bottom: 8px;
// `;

// const NotePartWrapper = styled.View`
//   padding: 0 20px;
//   margin-top: 30px;
// `;

// const ArchivedDate = styled.Text`
//   font-family: ${({ theme }) => theme.fonts.bold};
//   color: ${({ theme }) => theme.colors.point};
//   margin-bottom: 12px;
//   font-size: 15px;
//   padding-left: 10px;
// `;

// const DatePoint = styled.Text`
//   font-weight: 600;
// `;

// const NoteBox = styled.View`
//   background-color: ${({ theme }) => theme.colors.fill};
//   border-radius: 20px;
//   padding: 20px 30px;
//   min-height: 120px;
//   justify-content: center;
// `;

// const NoteText = styled.Text`
//   font-size: 14px;
//   font-family: ${({ theme }) => theme.fonts.medium};
//   line-height: 20px;
// `;

import React, { useState, useEffect } from 'react';
import {
  Pressable,
  ScrollView,
  Dimensions,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import styled from 'styled-components/native';
import { useRouter, useFocusEffect } from 'expo-router';
import Player from '../components/Player';
import { supabase } from '../../lib/supabase';

const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function Main() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [tracks, setTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTracks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('musics')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        const formattedData = data.map((item) => ({
          id: item.id,
          title: item.title,
          artist: item.artist,
          cover: { uri: item.cover_url },
          date: item.date,
          note: item.note,
        }));
        setTracks(formattedData);
      }
    } catch (error) {
      console.error(error);
      if (Platform.OS === 'web') {
        window.alert('ERROR!');
      } else {
        Alert.alert(';(', 'ERROR!');
      }
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchTracks();
    }, [])
  );

  if (loading || tracks.length === 0) {
    return (
      <Container>
        <StatusBar barStyle='dark-content' />
      </Container>
    );
  }

  return (
    <Container>
      <StatusBar barStyle='dark-content' />
      <ScrollView
        contentContainerStyle={{ paddingBottom: 50 }}
        showsVerticalScrollIndicator={false}>
        <TopPartWrapper>
          <TitleWrapper>
            <Title1>Archive your</Title1>
            <Title2>fav music</Title2>
          </TitleWrapper>

          <Pressable onPress={() => router.push('/addMusic')}>
            <AddMusicBtn
              source={require('../assets/image/goToAddMusicIcon.png')}
            />
          </Pressable>
        </TopPartWrapper>

        <Player
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
          tracks={tracks}
        />

        <NotePartWrapper>
          <ArchivedDate>
            Archived Date : <DatePoint>{tracks[currentIndex]?.date}</DatePoint>
          </ArchivedDate>

          <NoteBox>
            <NoteText>{tracks[currentIndex]?.note}</NoteText>
          </NoteBox>
        </NotePartWrapper>
      </ScrollView>
    </Container>
  );
}

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const TopPartWrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  padding: 30px 20px;
`;

const TitleWrapper = styled.View``;

const Title1 = styled.Text`
  font-size: ${({ theme }) => theme.typography.title.fontSize};
  font-family: ${({ theme }) => theme.fonts.bold};
`;

const Title2 = styled.Text`
  font-size: ${({ theme }) => theme.typography.title.fontSize};
  font-family: ${({ theme }) => theme.fonts.bold};
`;

const AddMusicBtn = styled.Image.attrs({ resizeMode: 'contain' })`
  width: 24px;
  height: 24px;
  margin-bottom: 8px;
`;

const NotePartWrapper = styled.View`
  padding: 0 20px;
  margin-top: 30px;
`;

const ArchivedDate = styled.Text`
  font-family: ${({ theme }) => theme.fonts.bold};
  color: ${({ theme }) => theme.colors.point};
  margin-bottom: 12px;
  font-size: 15px;
  padding-left: 10px;
`;

const DatePoint = styled.Text`
  font-weight: 600;
`;

const NoteBox = styled.View`
  background-color: ${({ theme }) => theme.colors.fill};
  border-radius: 20px;
  padding: 20px 30px;
  min-height: 120px;
  justify-content: center;
`;

const NoteText = styled.Text`
  font-size: 14px;
  font-family: ${({ theme }) => theme.fonts.medium};
  line-height: 20px;
`;
