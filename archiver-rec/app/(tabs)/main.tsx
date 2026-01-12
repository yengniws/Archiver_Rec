import styled from 'styled-components/native';

export default function Main() {
  return (
    <Container>
      <Text>Main Screen</Text>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const Text = styled.Text`
  font-size: 20px;
`;
