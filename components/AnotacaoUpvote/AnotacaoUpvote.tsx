import { Pressable, Text } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { styles } from './styles';

type Props = {
  total: number;
  votouUsuario: boolean;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'anotacao' | 'local';
};

export function AnotacaoUpvote({
  total,
  votouUsuario,
  onPress,
  disabled = false,
  variant = 'anotacao',
}: Readonly<Props>) {
  const rotulo =
    variant === 'local'
      ? votouUsuario
        ? `Remover upvote do local. ${total} upvotes`
        : `Dar upvote ao local. ${total} upvotes`
      : votouUsuario
        ? `Remover confirmação. ${total} confirmações`
        : `Confirmar anotação como verídica. ${total} confirmações`;

  return (
    <Pressable
      style={[
        styles.container,
        votouUsuario && styles.containerAtivo,
        disabled && styles.containerDisabled,
      ]}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={rotulo}
    >
      <Icon
        name={votouUsuario ? 'thumb-up' : 'thumb-up-outline'}
        size={20}
        color={votouUsuario ? '#2E7D32' : '#888'}
      />
      <Text
        style={[
          styles.contador,
          votouUsuario && styles.contadorAtivo,
        ]}
      >
        {total}
      </Text>
    </Pressable>
  );
}
