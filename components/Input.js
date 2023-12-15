// CSTextField.js

import React, { useState } from 'react';
import { View, TextInput, Text, Image, StyleSheet } from 'react-native';

function CSTextField(props) {
  const {
    placeholder,
    disable,
    imageleft,
    inlineImagePadding,
    keyboardType,
    multiline,
    onBlur,
    onChangeText,
    placeholderTextColor,
    imageSource, 
    secureTextEntry
  } = props;

  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const placeholderStyle = [
    styles.placeholderText,
    isFocused && styles.focusedPlaceholder,
  ];

  return (
    <View style={styles.inputContainer}>
      <Text style={placeholderStyle}>{placeholder}</Text>
      <TextInput
        placeholder=""
        editable={!disable}
        inlineImageLeft={imageleft}
        inlineImagePadding={inlineImagePadding}
        keyboardType={keyboardType}
        multiline={multiline}
        onChangeText={onChangeText}
        placeholderTextColor={placeholderTextColor}
        style={styles.input}
        onFocus={handleFocus}
        onBlur={handleBlur}
        secureTextEntry={secureTextEntry}
      />
      {imageSource && (
        <Image
          source={imageSource}
          resizeMode="cover"
          style={styles.image}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    borderColor: 'gray',
    marginBottom: 15,
    borderWidth: 1,
    borderRadius: 30,
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 10,
    padding: 5,
    flexDirection: 'row', // Added flexDirection for proper alignment
    alignItems: 'center', // Added alignItems for proper alignment
  },
  input: {
    height: 40,
    fontSize: 16,
    color: 'black',
    paddingVertical: 5,
    flex: 1, // Added flex to TextInput for it to take the available space
  },
  placeholderText: {
    position: 'absolute',
    left: 20,
    top: -10,
    fontSize: 12,
    color: 'gray',
    backgroundColor: '#f2f2f2',
    paddingLeft: 10,
    paddingRight: 10,
  },
  focusedPlaceholder: {
    color: 'skyblue',
  },
  image: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
});

export default CSTextField;
