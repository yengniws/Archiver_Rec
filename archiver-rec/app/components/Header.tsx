import { Pressable } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import styled from 'styled-components/native';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  // const hidePlaylistIcon =
  //   pathname === '/myPlaylist' ||
  //   pathname === '/myMusic' ||
  //   pathname === '/addMusic';

  return (
    <Container>
      <Pressable onPress={() => router.push('/main')}>
        <Logo source={require('../assets/image/logo.png')} />
      </Pressable>
      {/* 
      {!hidePlaylistIcon && (
        <Pressable onPress={() => router.push('/myPlaylist')}>
          <MoveToMyPlaylistIcon source={require('../assets/image/Icon.png')} />
        </Pressable>
      )} */}
    </Container>
  );
}

const Container = styled.View`
  height: 60px;
  padding: 0 20px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled.Image.attrs({ resizeMode: 'contain' })`
  width: 120px;
  height: 17px;
`;

const MoveToMyPlaylistIcon = styled.Image.attrs({ resizeMode: 'contain' })`
  width: 30px;
  height: 30px;
`;
