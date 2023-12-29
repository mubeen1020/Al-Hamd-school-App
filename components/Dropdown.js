import React, { useState } from 'react';
import { View, Picker } from 'react-native';

const DropdownComponent = () => {
  const [selectedValue, setSelectedValue] = useState('option1'); // Initial selected value

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Picker
        selectedValue={selectedValue}
        style={{ height: 50, width: 200 }}
        onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
      >
        <Picker.Item label="Option 1" value="option1" />
        <Picker.Item label="Option 2" value="option2" />
        <Picker.Item label="Option 3" value="option3" />
        {/* Add more Picker.Item components as needed */}
      </Picker>
    </View>
  );
};

export default DropdownComponent;
