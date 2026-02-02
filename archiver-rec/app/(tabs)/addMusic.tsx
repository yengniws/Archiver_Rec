import React, { useState, useEffect } from 'react';
import { Alert, Platform, KeyboardAvoidingView } from 'react-native';
import styled from 'styled-components/native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

export default function AddMusic() {
  const router = useRouter();

  const [image, setImage] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [note, setNote] = useState('');
  const [dateString, setDateString] = useState('');

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
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleArchive = () => {
    console.log({ title, artist, dateString, note, image });
    router.replace('/main');
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
                activeOpacity={0.9}>
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
                  />
                </InputBox>
              </LabelWrapper>
            </FormSection>

            <ArchiveButton onPress={handleArchive}>
              <ArchiveButtonText>ARCHIVE</ArchiveButtonText>
            </ArchiveButton>
          </ContentWrapper>
        </StyledScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
}

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
