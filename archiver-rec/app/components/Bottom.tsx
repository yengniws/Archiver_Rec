import styled from 'styled-components/native';

export default function Bottom() {
  return (
    <Container>
      <Text>ⓒ yengniws</Text>
    </Container>
  );
}

const Container = styled.View`
  height: 40px;
  align-items: center;
  justify-content: center;
`;

const Text = styled.Text`
  color: ${({ theme }) => theme.colors.bottom};
  font-size: 12px;
  font-family: ${({ theme }) => theme.fonts.medium};
`;
