import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, Modal, TouchableOpacity, Switch, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

type AttemptModalProps = {
  visible: boolean;
  onClose: () => void;
  onAdd: () => void;
  date: Date;
  setDate: (date: Date) => void;
  currentAttempts: string;
  setCurrentAttempts: (value: string) => void;
  send: boolean;
  setSend: (value: boolean) => void;
  attemptNotes: string;
  setAttemptNotes: (value: string) => void;
  showDatePicker: boolean;
  setShowDatePicker: (value: boolean) => void;
};

const AttemptModal = ({
  visible,
  onClose,
  onAdd,
  date,
  setDate,
  currentAttempts,
  setCurrentAttempts,
  send,
  setSend,
  attemptNotes,
  setAttemptNotes,
  showDatePicker,
  setShowDatePicker,
}: AttemptModalProps) => {
  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
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
          <Text style={styles.modalHeader}>Add Attempt</Text>
          <TouchableOpacity 
            style={styles.dateButton} 
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateButtonText}>
              Date: {date.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onDateChange}
            />
          )}
          <TextInput
            style={styles.input}
            placeholder="Number of Attempts"
            value={currentAttempts}
            onChangeText={setCurrentAttempts}
            keyboardType="numeric"
          />
          <View style={styles.sendContainer}>
            <Text style={styles.sendLabel}>Send Status:</Text>
            <Switch
              value={send}
              onValueChange={setSend}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={send ? '#2196F3' : '#f4f3f4'}
            />
            <Text style={styles.sendText}>{send ? 'Sent' : 'Not Sent'}</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Notes"
            value={attemptNotes}
            onChangeText={setAttemptNotes}
            multiline
          />
          <View style={styles.modalButtons}>
            <Button title="Cancel" onPress={onClose} />
            <Button title="Add" onPress={onAdd} />
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
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '100%',
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '100%',
    backgroundColor: '#f8f8f8',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
  },
  sendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#f8f8f8',
  },
  sendLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  sendText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
});

export default AttemptModal; 