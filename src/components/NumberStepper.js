import { View, StyleSheet } from 'react-native'
import { TouchableRipple, Text } from 'react-native-paper'
import configuration from '../configuration'

const styles = StyleSheet.create({
  container: {
    flexDirection: "row"
  },
  leftActionButton: {
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    backgroundColor: configuration.ACCENT_COLOR_1,
    paddingVertical: 10,
    paddingHorizontal: 15
  },
  rightActionButton: {
    justifyContent: "center",
    alignItems: "center",
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    backgroundColor: configuration.ACCENT_COLOR_1,
    paddingVertical: 10,
    paddingHorizontal: 15
  },
  valueContainer: {
    backgroundColor: configuration.BACKGROUND_COLOR,
    justifyContent: "center",
    alignItems: "center"
  },
  valueText: {
    textAlign: "center",
    color: configuration.ACCENT_COLOR_1,
    paddingVertical: 10,
    paddingHorizontal: 25
  }
})

export default ({ value, onChange, min, max }) => {
  const increment = () => {
    if (value + 1 > max) {
      return
    }

    onChange(value + 1)
  }

  const decrement = () => {
    if (value - 1 < min) {
      return
    }

    onChange(value - 1)
  }

  return (
    <View style={styles.container}>
      <TouchableRipple
        onPress={decrement}
      >
        <View style={styles.leftActionButton}>
          <Text
            variant="titleLarge"
            style={{ color: "white" }}
          >
            -
          </Text>
        </View>
      </TouchableRipple>

      <View style={styles.valueContainer}>
        <Text
          variant="bodyLarge"
          style={styles.valueText}
        >
          {value}
        </Text>
      </View>

      <TouchableRipple
        onPress={increment}
      >
        <View style={styles.rightActionButton}>
          <Text
            variant="titleLarge"
            style={{ color: "white" }}
          >
            +
          </Text>
        </View>
      </TouchableRipple>
    </View>
  )
}
