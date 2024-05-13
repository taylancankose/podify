import colors from '@utils/colors';
import React, {useState} from 'react';
import {
  StyleSheet,
  Modal,
  Pressable,
  View,
  Text,
  ScrollView,
} from 'react-native';
import MaterialComIcon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Props<T> {
  data: T[];
  visible?: boolean;
  title?: string;
  renderItem(item: T): JSX.Element;
  onSelect(item: T, index: number): void;
  onRequestClose?(): void;
}

const CategorySelector = <T extends any>({
  visible = false,
  title,
  data,
  renderItem,
  onSelect,
  onRequestClose,
}: Props<T>) => {
  const [active, setActive] = useState<number | null>(null);
  const handleSelect = (item: T, index: number) => {
    setActive(index);
    onSelect(item, index);
    onRequestClose && onRequestClose();
  };

  return (
    <Modal onRequestClose={onRequestClose} visible={visible} transparent>
      <View style={styles.modalContainer}>
        <Pressable onPress={onRequestClose} style={styles.backdrop} />
        <View style={styles.modal}>
          <Text style={styles.title}>{title}</Text>

          <ScrollView>
            {data?.map((item, index) => {
              return (
                <Pressable
                  key={index}
                  style={styles.selectorContainer}
                  onPress={() => handleSelect(item, index)}>
                  {active === index ? (
                    <MaterialComIcon
                      name="radiobox-marked"
                      color={colors.SECONDARY}
                    />
                  ) : (
                    <MaterialComIcon
                      name="radiobox-blank"
                      color={colors.SECONDARY}
                    />
                  )}
                  {renderItem(item)}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.INACTIVE_CONTRAST,
    zIndex: -1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  modal: {
    width: '90%',
    maxHeight: '50%',
    padding: 10,
    backgroundColor: colors.CONTRAST,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.PRIMARY,
    paddingVertical: 10,
  },
  selectorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default CategorySelector;
