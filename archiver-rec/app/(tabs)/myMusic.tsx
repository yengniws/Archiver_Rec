import React from 'react';
import styled from 'styled-components/native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function MyMusic() {
  const router = useRouter();

  const params = useLocalSearchParams();
  const { title, artist, date, note, cover } = params;

  const handleGoMain = () => {
    router.replace('/main');
  };

  return (
    <Container>
      <StyledScrollView showsVerticalScrollIndicator={false}>
        <ContentWrapper>
          <TitleWrapper>
            <Title1>My</Title1>
            <Title2>Music</Title2>
          </TitleWrapper>

          <LPSection>
            <LPImage source={require('../assets/image/lp.png')} />
            <CenterCircle>
              <SelectedImage
                source={cover ? { uri: cover as string } : undefined}
              />
            </CenterCircle>
          </LPSection>

          <InfoSection>
            <LabelWrapper>
              <LabelRow>
                <EmojiText>🎧</EmojiText>
                <LabelText>Music</LabelText>
              </LabelRow>
              <DisplayText>
                {title} / {artist}
              </DisplayText>
            </LabelWrapper>

            <LabelWrapper>
              <LabelRow>
                <EmojiText>🗓️</EmojiText>
                <LabelText>Archived Date</LabelText>
              </LabelRow>
              <DisplayText>{date}</DisplayText>
            </LabelWrapper>

            <LabelWrapper>
              <LabelRow>
                <EmojiText>✏️</EmojiText>
                <LabelText>Note</LabelText>
              </LabelRow>
              <NoteBox>
                <NoteText>{note}</NoteText>
              </NoteBox>
            </LabelWrapper>
          </InfoSection>

          <GoMainButton onPress={handleGoMain}>
            <GoMainButtonText>BACK TO MAIN</GoMainButtonText>
          </GoMainButton>
        </ContentWrapper>
      </StyledScrollView>
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
`;

const Title1 = styled.Text`
  font-size: ${({ theme }) => theme.typography.title.fontSize};
  font-family: ${({ theme }) => theme.fonts.bold};
  color: #000;
`;

const Title2 = styled.Text`
  font-size: ${({ theme }) => theme.typography.title.fontSize};
  font-family: ${({ theme }) => theme.fonts.bold};
  color: #000;
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

const CenterCircle = styled.View`
  position: absolute;
  width: 90px;
  height: 90px;
  border-radius: 45px;
  background-color: #fff;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const SelectedImage = styled.Image`
  width: 100px;
  height: 100px;
  position: absolute;
  top: -5px;
  left: -5px;
`;

const InfoSection = styled.View`
  gap: 30px;
  margin-bottom: 50px;
`;

const LabelWrapper = styled.View`
  gap: 10px;
`;

const LabelRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 6px;
`;

const EmojiText = styled.Text`
  font-size: 18px;
`;

const LabelText = styled.Text`
  font-size: 20px;
  font-family: ${({ theme }) => theme.fonts.bold};
  color: #000;
`;

const DisplayText = styled.Text`
  font-size: 16px;
  font-family: ${({ theme }) => theme.fonts.medium};
  color: #000;
  margin-left: 2px;
`;

const NoteBox = styled.View`
  background-color: ${({ theme }) => theme.colors.fill || '#F8F8F8'};
  border-radius: 20px;
  padding: 20px;
  min-height: 150px;
  justify-content: flex-start;
`;

const NoteText = styled.Text`
  font-size: 15px;
  font-family: ${({ theme }) => theme.fonts.medium};
  color: #000;
  line-height: 22px;
`;

const GoMainButton = styled.TouchableOpacity`
  width: 100%;
  height: 50px;
  background-color: ${({ theme }) => theme.colors.point};
  border-radius: 30px;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

const GoMainButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.background};
  font-size: 20px;
  font-family: ${({ theme }) => theme.fonts.medium};
`;
