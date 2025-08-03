import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { V_GRADES, YDS_GRADES, ClimbType } from '../types';

type AddClimbModalProps = {
  visible: boolean;
  onClose: () => void;
  onAdd: () => void;
  isEdit?: boolean;
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
  isEdit = false,
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
  console.log('Modal visible:', visible);
  
  // Get the appropriate grade options based on category
  const getGradeOptions = () => {
    switch (category) {
      case ClimbType.BOULDER:
        return V_GRADES;
      case ClimbType.SPORT:
      case ClimbType.TRAD:
        return YDS_GRADES;
      default:
        return V_GRADES;
    }
  };

  // Reset grade when category changes
  const handleCategoryChange = (newCategory: ClimbType) => {
    setCategory(newCategory);
    // Set default grade for the new category
    const gradeOptions = newCategory === ClimbType.BOULDER ? V_GRADES : YDS_GRADES;
    setGrade(gradeOptions[0]);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalHeader}>
            {isEdit ? 'Edit Climb' : 'Add New Climb'}
          </Text>
          
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Area"
            value={area}
            onChangeText={setArea}
          />
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={category}
              style={styles.picker}
              itemStyle={styles.pickerItem}
              onValueChange={handleCategoryChange}
            >
              {Object.values(ClimbType).map((type) => (
                <Picker.Item key={type} label={type.charAt(0).toUpperCase() + type.slice(1)} value={type} />
              ))}
            </Picker>
          </View>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={grade}
              style={styles.picker}
              itemStyle={styles.pickerItem}
              onValueChange={setGrade}
            >
              {getGradeOptions().map((gradeOption) => (
                <Picker.Item key={gradeOption} label={gradeOption} value={gradeOption} />
              ))}
            </Picker>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            multiline
          />
          <TextInput
            style={styles.input}
            placeholder="Image URL (optional)"
            value={image}
            onChangeText={setImage}
          />
          <TextInput
            style={styles.input}
            placeholder="Video URL (optional)"
            value={video}
            onChangeText={setVideo}
          />
          
          <View style={styles.modalButtons}>
            <View style={styles.buttonContainer}>
              <Button title="Cancel" onPress={onClose} />
            </View>
            <View style={styles.buttonContainer}>
              <Button title={isEdit ? "Save" : "Add"} onPress={onAdd} />
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
    paddingTop: 20,
    paddingHorizontal: 20,
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