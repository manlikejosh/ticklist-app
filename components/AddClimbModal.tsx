import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { V_GRADES, ClimbType } from '../types';

type AddClimbModalProps = {
  visible: boolean;
  onClose: () => void;
  onAdd: () => void;
  name: string;
  setName: (value: string) => void;
  area: string;
  setArea: (value: string) => void;
  grade: string;
  setGrade: (value: string) => void;
  category: ClimbType;
  setCategory: (value: ClimbType) => void;
  description: string;
  setDescription: (value: string) => void;
  image: string;
  setImage: (value: string) => void;
  video: string;
  setVideo: (value: string) => void;
};

const AddClimbModal = ({
  visible,
  onClose,
  onAdd,
  name,
  setName,
  area,
  setArea,
  grade,
  setGrade,
  category,
  setCategory,
  description,
  setDescription,
  image,
  setImage,
  video,
  setVideo,
}: AddClimbModalProps) => {

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalHeader}>Add New Climb</Text>
          {/* Name */}
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />

          {/* Area */}
          <TextInput
            style={styles.input}
            placeholder="Area"
            value={area}
            onChangeText={setArea}
          />

          {/* Category */}
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={category}
              style={styles.picker}
              itemStyle={styles.pickerItem}
              onValueChange={(itemValue: ClimbType) => setCategory(itemValue)}
            >
              {Object.values(ClimbType).map((type) => (
                <Picker.Item  key={type} label={type.charAt(0).toUpperCase() + type.slice(1)} value={type} />
              ))}
            </Picker>
          </View>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={grade}
              style={styles.picker}
              itemStyle={styles.pickerItem}
              onValueChange={(itemValue: string) => setGrade(itemValue)}
            >
              {V_GRADES.map((grade) => (
                <Picker.Item key={grade} label={grade} value={grade} />
              ))}
            </Picker>
          </View>
          {/* Description */}
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            multiline
          />
          {/* Image */}
          <TextInput
            style={styles.input}
            placeholder="Image URL (optional)"
            value={image}
            onChangeText={setImage}
          />
          {/* Video */}
          <TextInput
            style={styles.input}
            placeholder="Video URL (optional)"
            value={video}
            onChangeText={setVideo}
          />
          {/* Buttons */}
          <View style={styles.modalButtons}>
            <View style={styles.buttonContainer}>
              <Button title="Cancel" onPress={onClose} />
            </View>
            <View style={styles.buttonContainer}>
              <Button title="Add" onPress={onAdd} />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    padding: 10,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 10,
  },
  modalHeader: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '100%',
  },
 
  pickerContainer: {
    width: '100%',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  pickerItem: {
    height: 50,
    fontSize: 18,
    textAlign: 'center',
    
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  padding: 10,    
  },
  buttonContainer: {
    width: '45%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    overflow: 'hidden',
  },
});

export default AddClimbModal; 