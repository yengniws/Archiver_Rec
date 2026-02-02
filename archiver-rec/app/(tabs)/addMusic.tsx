// import React, { useState, useEffect } from 'react';
// import { Alert, Platform, KeyboardAvoidingView } from 'react-native';
// import styled from 'styled-components/native';
// import { useRouter } from 'expo-router';
// import * as ImagePicker from 'expo-image-picker';
// import * as FileSystem from 'expo-file-system';
// import { decode } from 'base64-arraybuffer';
// import { supabase } from '../../lib/supabase';

// export default function AddMusic() {
//   const router = useRouter();

//   const [image, setImage] = useState<string | null>(null);
//   const [title, setTitle] = useState('');
//   const [artist, setArtist] = useState('');
//   const [note, setNote] = useState('');
//   const [dateString, setDateString] = useState('');

//   // Supabase 로딩 상태 추가 (중복 업로드 방지)
//   const [loading, setLoading] = useState(false);

//   // 금일 날짜 불러오기
//   useEffect(() => {
//     const today = new Date();
//     const year = today.getFullYear();
//     const month = String(today.getMonth() + 1).padStart(2, '0');
//     const day = String(today.getDate()).padStart(2, '0');
//     setDateString(`${year}. ${month}. ${day}`);
//   }, []);

//   const pickImage = async () => {
//     if (Platform.OS !== 'web') {
//       const { status } =
//         await ImagePicker.requestMediaLibraryPermissionsAsync();
//       if (status !== 'granted') {
//         Alert.alert('권한 설정', '갤러리 접근 권한이 필요합니다.');
//         return;
//       }
//     }

//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [1, 1],
//       quality: 0.5,
//     });

//     if (!result.canceled) {
//       setImage(result.assets[0].uri);
//     }
//   };

//   const handleArchive = async () => {
//     // 유효성 검사
//     if (!image || !title || !artist) {
//       Alert.alert('알림', '이미지, 제목, 아티스트는 필수입니다.');
//       return;
//     }

//     try {
//       setLoading(true);

//       // A. 이미지 파일을 Base64 데이터로 변환
//       const base64 = await FileSystem.readAsStringAsync(image, {
//         encoding: 'base64',
//       });

//       // B. 파일명 생성 (겹치지 않게 시간+확장자 조합)
//       const filePath = `${Date.now()}.jpg`;

//       // C. 수파베이스 스토리지('covers')에 업로드
//       const { error: uploadError } = await supabase.storage
//         .from('covers') // 버킷 이름
//         .upload(filePath, decode(base64), {
//           contentType: 'image/jpeg',
//         });

//       if (uploadError) {
//         console.error('Upload Error:', uploadError);
//         throw new Error('이미지 업로드에 실패했습니다.');
//       }

//       // D. 업로드된 이미지의 공개 주소(URL) 가져오기
//       const { data: urlData } = supabase.storage
//         .from('covers')
//         .getPublicUrl(filePath);

//       const coverUrl = urlData.publicUrl;

//       // E. 데이터베이스('musics')에 정보 저장
//       const { error: dbError } = await supabase.from('musics').insert({
//         title: title,
//         artist: artist,
//         note: note,
//         date: dateString,
//         cover_url: coverUrl,
//       });

//       if (dbError) {
//         console.error('DB Error:', dbError);
//         throw new Error('데이터 저장에 실패했습니다.');
//       }

//       Alert.alert('성공', '아카이빙이 완료되었습니다!');
//       router.replace('/main');
//     } catch (error) {
//       Alert.alert('오류', '업로드 중 문제가 발생했습니다.');
//       console.log(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Container>
//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         style={{ flex: 1 }}>
//         <StyledScrollView showsVerticalScrollIndicator={false}>
//           <ContentWrapper>
//             <TitleWrapper>
//               <Title1>Add</Title1>
//               <Title2>Music</Title2>
//             </TitleWrapper>

//             <LPSection>
//               <LPImage source={require('../assets/image/lp.png')} />
//               <CenterButton
//                 onPress={pickImage}
//                 activeOpacity={0.9}
//                 disabled={loading}>
//                 {image ? (
//                   <SelectedImage source={{ uri: image }} />
//                 ) : (
//                   <PlusIcon
//                     source={require('../assets/image/goToAddMusicIcon.png')}
//                   />
//                 )}
//               </CenterButton>
//             </LPSection>

//             <FormSection>
//               <LabelWrapper>
//                 <LabelRow>
//                   <EmojiText>🎧</EmojiText>
//                   <LabelText>Music</LabelText>
//                 </LabelRow>
//                 <InputBox>
//                   <TextInputStyled
//                     placeholder='음악 제목'
//                     placeholderTextColor='#D9D9D9'
//                     value={title}
//                     onChangeText={setTitle}
//                     editable={!loading}
//                   />
//                 </InputBox>
//               </LabelWrapper>

//               <LabelWrapper>
//                 <LabelRow>
//                   <EmojiText>🎤</EmojiText>
//                   <LabelText>Artist</LabelText>
//                 </LabelRow>
//                 <InputBox>
//                   <TextInputStyled
//                     placeholder='아티스트명'
//                     value={artist}
//                     placeholderTextColor='#D9D9D9'
//                     onChangeText={setArtist}
//                     editable={!loading}
//                   />
//                 </InputBox>
//               </LabelWrapper>

//               <LabelWrapper>
//                 <LabelRow>
//                   <EmojiText>🗓️</EmojiText>
//                   <LabelText>Archived Date</LabelText>
//                 </LabelRow>
//                 <DateDisplay>{dateString}</DateDisplay>
//               </LabelWrapper>

//               <LabelWrapper>
//                 <LabelRow>
//                   <EmojiText>✏️</EmojiText>
//                   <LabelText>Note</LabelText>
//                 </LabelRow>
//                 <InputBox>
//                   <TextInputStyled
//                     multiline
//                     scrollEnabled={false}
//                     placeholder='이 음악을 아카이빙하는 이유가 궁금해요'
//                     placeholderTextColor='#D9D9D9'
//                     value={note}
//                     onChangeText={setNote}
//                     style={{ minHeight: 100, textAlignVertical: 'top' }}
//                     editable={!loading}
//                   />
//                 </InputBox>
//               </LabelWrapper>
//             </FormSection>

//             <ArchiveButton
//               onPress={handleArchive}
//               disabled={loading}>
//               <ArchiveButtonText>
//                 {loading ? 'UPLOADING...' : 'ARCHIVE'}
//               </ArchiveButtonText>
//             </ArchiveButton>
//           </ContentWrapper>
//         </StyledScrollView>
//       </KeyboardAvoidingView>
//     </Container>
//   );
// }

// const Container = styled.View`
//   flex: 1;
//   background-color: ${({ theme }) => theme.colors.background || '#fff'};
// `;

// const StyledScrollView = styled.ScrollView`
//   flex: 1;
// `;

// const ContentWrapper = styled.View`
//   padding: 0 20px;
//   padding-bottom: 40px;
// `;

// const TitleWrapper = styled.View`
//   margin-top: 30px;
//   margin-bottom: 65px;
//   line-height: 40px;
// `;

// const Title1 = styled.Text`
//   font-size: ${({ theme }) => theme.typography.title.fontSize};
//   font-family: ${({ theme }) => theme.fonts.bold};
// `;

// const Title2 = styled.Text`
//   font-size: ${({ theme }) => theme.typography.title.fontSize};
//   font-family: ${({ theme }) => theme.fonts.bold};
// `;

// const LPSection = styled.View`
//   align-items: center;
//   justify-content: center;
//   margin-bottom: 40px;
//   position: relative;
// `;

// const LPImage = styled.Image.attrs({ resizeMode: 'contain' })`
//   width: 210px;
//   height: 210px;
// `;

// const CenterButton = styled.TouchableOpacity`
//   position: absolute;
//   width: 90px;
//   height: 90px;
//   border-radius: 45px;
//   background-color: #fff;
//   align-items: center;
//   justify-content: center;
//   overflow: hidden;
// `;

// const PlusIcon = styled.Image.attrs({ resizeMode: 'contain' })`
//   width: 24px;
//   height: 24px;
// `;

// const SelectedImage = styled.Image`
//   width: 100px;
//   height: 100px;
//   position: absolute;
//   top: -5px;
//   left: -5px;
// `;

// const FormSection = styled.View`
//   gap: 20px;
//   margin-bottom: 50px;
// `;

// const LabelWrapper = styled.View`
//   gap: 2px;
// `;

// const LabelRow = styled.View`
//   flex-direction: row;
//   align-items: center;
//   margin-bottom: 8px;
//   gap: 6px;
// `;

// const EmojiText = styled.Text`
//   font-size: 18px;
// `;

// const LabelText = styled.Text`
//   font-size: 20px;
//   font-family: ${({ theme }) => theme.fonts.bold};
// `;

// const InputBox = styled.View`
//   background-color: ${({ theme }) => theme.colors.fill};
//   border-radius: 20px;
//   padding: 20px;
//   justify-content: center;
// `;

// const TextInputStyled = styled.TextInput`
//   font-size: 15px;
//   font-family: ${({ theme }) => theme.fonts.bold};
//   padding: 0;
//   outline-style: none;
// `;

// const DateDisplay = styled.Text`
//   font-size: 16px;
//   font-family: ${({ theme }) => theme.fonts.regular};
//   margin-left: 5px;
//   margin-bottom: 10px;
// `;

// const ArchiveButton = styled.TouchableOpacity`
//   width: 100%;
//   height: 50px;
//   background-color: ${({ theme }) => theme.colors.point};
//   border-radius: 30px;
//   align-items: center;
//   justify-content: center;
//   margin-bottom: 20px;
// `;

// const ArchiveButtonText = styled.Text`
//   color: ${({ theme }) => theme.colors.background};
//   font-size: 20px;
//   font-family: ${({ theme }) => theme.fonts.medium};
// `;
import React, { useState, useEffect } from 'react';
import { Alert, Platform, KeyboardAvoidingView } from 'react-native';
import styled from 'styled-components/native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../../lib/supabase';

export default function AddMusic() {
  const router = useRouter();

  const [image, setImage] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [note, setNote] = useState('');
  const [dateString, setDateString] = useState('');

  const [loading, setLoading] = useState(false);

  // 금일 날짜 불러오기
  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    setDateString(`${year}. ${month}. ${day}`);
  }, []);

  const pickImage = async () => {
    if (Platform.OS !== 'web') {
      // 웹용
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('권한 설정', '갤러리 접근 권한이 필요합니다.');
        return;
      }
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleArchive = async () => {
    if (!image || !title || !artist) {
      Alert.alert('알림', '이미지, 제목, 아티스트는 필수 입력 항목입니다.');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(image);
      const arrayBuffer = await response.arrayBuffer();

      // 2. 수파베이스 스토리지에 업로드
      const filePath = `${Date.now()}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from('covers')
        .upload(filePath, arrayBuffer, {
          contentType: 'image/jpeg',
        });

      if (uploadError) {
        console.error('Upload Error:', uploadError);
        throw new Error('ERROR!');
      }

      // 3. 이미지 다운로드 URL 가져오기
      const { data: urlData } = supabase.storage
        .from('covers')
        .getPublicUrl(filePath);

      const coverUrl = urlData.publicUrl;

      // 4. 데이터베이스에 정보 저장
      const { error: dbError } = await supabase.from('musics').insert({
        title: title,
        artist: artist,
        note: note,
        date: dateString,
        cover_url: coverUrl,
      });

      if (dbError) {
        console.error('DB Error:', dbError);
        throw new Error('ERROR');
      }

      // 5. 성공 알림 및 이동
      if (dbError) {
        console.error('DB Error:', dbError);
        throw new Error('ERROR');
      }

      if (Platform.OS === 'web') {
        window.alert('ARHCIVED!');
        router.replace('/main');
      } else {
        Alert.alert('>_<', 'ARHCIVED!', [
          {
            text: '확인',
            onPress: () => router.replace('/main'),
          },
        ]);
      }
    } catch (error) {
      Alert.alert(';(', 'ERROR!');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}>
        <StyledScrollView showsVerticalScrollIndicator={false}>
          <ContentWrapper>
            <TitleWrapper>
              <Title1>Add</Title1>
              <Title2>Music</Title2>
            </TitleWrapper>

            <LPSection>
              <LPImage source={require('../assets/image/lp.png')} />
              <CenterButton
                onPress={pickImage}
                activeOpacity={0.9}
                disabled={loading}>
                {image ? (
                  <SelectedImage source={{ uri: image }} />
                ) : (
                  <PlusIcon
                    source={require('../assets/image/goToAddMusicIcon.png')}
                  />
                )}
              </CenterButton>
            </LPSection>

            <FormSection>
              <LabelWrapper>
                <LabelRow>
                  <EmojiText>🎧</EmojiText>
                  <LabelText>Music</LabelText>
                </LabelRow>
                <InputBox>
                  <TextInputStyled
                    placeholder='음악 제목'
                    placeholderTextColor='#D9D9D9'
                    value={title}
                    onChangeText={setTitle}
                    editable={!loading}
                  />
                </InputBox>
              </LabelWrapper>

              <LabelWrapper>
                <LabelRow>
                  <EmojiText>🎤</EmojiText>
                  <LabelText>Artist</LabelText>
                </LabelRow>
                <InputBox>
                  <TextInputStyled
                    placeholder='아티스트명'
                    value={artist}
                    placeholderTextColor='#D9D9D9'
                    onChangeText={setArtist}
                    editable={!loading}
                  />
                </InputBox>
              </LabelWrapper>

              <LabelWrapper>
                <LabelRow>
                  <EmojiText>🗓️</EmojiText>
                  <LabelText>Archived Date</LabelText>
                </LabelRow>
                <DateDisplay>{dateString}</DateDisplay>
              </LabelWrapper>

              <LabelWrapper>
                <LabelRow>
                  <EmojiText>✏️</EmojiText>
                  <LabelText>Note</LabelText>
                </LabelRow>
                <InputBox>
                  <TextInputStyled
                    multiline
                    scrollEnabled={false}
                    placeholder='이 음악을 아카이빙하는 이유가 궁금해요'
                    placeholderTextColor='#D9D9D9'
                    value={note}
                    onChangeText={setNote}
                    style={{ minHeight: 100, textAlignVertical: 'top' }}
                    editable={!loading}
                  />
                </InputBox>
              </LabelWrapper>
            </FormSection>

            <ArchiveButton
              onPress={handleArchive}
              disabled={loading}>
              <ArchiveButtonText>
                {loading ? 'UPLOADING...' : 'ARCHIVE'}
              </ArchiveButtonText>
            </ArchiveButton>
          </ContentWrapper>
        </StyledScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
}

// --- Styles (기존과 동일) ---
const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background || '#fff'};
`;

const StyledScrollView = styled.ScrollView`
  flex: 1;
`;

const ContentWrapper = styled.View`
  padding: 0 20px;
  padding-bottom: 40px;
`;

const TitleWrapper = styled.View`
  margin-top: 30px;
  margin-bottom: 65px;
  line-height: 40px;
`;

const Title1 = styled.Text`
  font-size: ${({ theme }) => theme.typography.title.fontSize};
  font-family: ${({ theme }) => theme.fonts.bold};
`;

const Title2 = styled.Text`
  font-size: ${({ theme }) => theme.typography.title.fontSize};
  font-family: ${({ theme }) => theme.fonts.bold};
`;

const LPSection = styled.View`
  align-items: center;
  justify-content: center;
  margin-bottom: 40px;
  position: relative;
`;

const LPImage = styled.Image.attrs({ resizeMode: 'contain' })`
  width: 210px;
  height: 210px;
`;

const CenterButton = styled.TouchableOpacity`
  position: absolute;
  width: 90px;
  height: 90px;
  border-radius: 45px;
  background-color: #fff;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const PlusIcon = styled.Image.attrs({ resizeMode: 'contain' })`
  width: 24px;
  height: 24px;
`;

const SelectedImage = styled.Image`
  width: 100px;
  height: 100px;
  position: absolute;
  top: -5px;
  left: -5px;
`;

const FormSection = styled.View`
  gap: 20px;
  margin-bottom: 50px;
`;

const LabelWrapper = styled.View`
  gap: 2px;
`;

const LabelRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
  gap: 6px;
`;

const EmojiText = styled.Text`
  font-size: 18px;
`;

const LabelText = styled.Text`
  font-size: 20px;
  font-family: ${({ theme }) => theme.fonts.bold};
`;

const InputBox = styled.View`
  background-color: ${({ theme }) => theme.colors.fill};
  border-radius: 20px;
  padding: 20px;
  justify-content: center;
`;

const TextInputStyled = styled.TextInput`
  font-size: 15px;
  font-family: ${({ theme }) => theme.fonts.bold};
  padding: 0;
  outline-style: none;
`;

const DateDisplay = styled.Text`
  font-size: 16px;
  font-family: ${({ theme }) => theme.fonts.regular};
  margin-left: 5px;
  margin-bottom: 10px;
`;

const ArchiveButton = styled.TouchableOpacity`
  width: 100%;
  height: 50px;
  background-color: ${({ theme }) => theme.colors.point};
  border-radius: 30px;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

const ArchiveButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.background};
  font-size: 20px;
  font-family: ${({ theme }) => theme.fonts.medium};
`;
