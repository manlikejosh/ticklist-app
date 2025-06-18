import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, Modal, TouchableOpacity, Platform, Switch, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Attempt = {
  id: string;
  date: Date;
  attempts: number;
  send: boolean;
  notes: string;
};

type Note = {
  id: string;
  name: string;
  area: string;
  grade: string;
  description: string;
  image?: string;
  video?: string;
  attempts: Attempt[];
};

const V_GRADES = Array.from({ length: 18 }, (_, i) => `V${i}`);
const STORAGE_KEY = '@ticklist_climbs';

export default function App() {
  const [name, setName] = useState('');
  const [area, setArea] = useState('');
  const [grade, setGrade] = useState('V0');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [video, setVideo] = useState('');
  const [notes, setNotes] = useState<Note[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [attemptModalVisible, setAttemptModalVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGradePicker, setShowGradePicker] = useState(false);
  const [send, setSend] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [currentAttempts, setCurrentAttempts] = useState('');
  const [attemptNotes, setAttemptNotes] = useState('');
  const [expandedClimbs, setExpandedClimbs] = useState<Set<string>>(new Set());

  // Load saved climbs when the app starts
  useEffect(() => {
    loadClimbs();
  }, []);

  // Save climbs whenever they change
  useEffect(() => {
    saveClimbs();
  }, [notes]);

  const loadClimbs = async () => {
    try {
      const savedClimbs = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedClimbs) {
        const parsedClimbs = JSON.parse(savedClimbs);
        // Convert string dates back to Date objects
        const climbsWithDates = parsedClimbs.map((climb: any) => ({
          ...climb,
          attempts: climb.attempts.map((attempt: any) => ({
            ...attempt,
            date: new Date(attempt.date)
          }))
        }));
        setNotes(climbsWithDates);
      }
    } catch (error) {
      console.error('Error loading climbs:', error);
    }
  };

  const saveClimbs = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch (error) {
      console.error('Error saving climbs:', error);
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const resetForm = () => {
    setName('');
    setArea('');
    setGrade('V0');
    setDescription('');
    setImage('');
    setVideo('');
    setDate(new Date());
    setSend(false);
    setCurrentAttempts('');
    setAttemptNotes('');
  };

  const addNote = () => {
    if (name.trim() === '') return;
    const newNote: Note = {
      id: Date.now().toString(),
      name,
      area,
      grade,
      description,
      image: image || undefined,
      video: video || undefined,
      attempts: []
    };
    setNotes([...notes, newNote]);
    resetForm();
    setModalVisible(false);
  };

  const deleteNote = (id: string) => {
    Alert.alert(
      "Delete Climb",
      "Are you sure you want to delete this climb?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setNotes(notes.filter(note => note.id !== id));
          }
        }
      ]
    );
  };

  const startEditing = (note: Note) => {
    setEditingNote(note);
    setName(note.name);
    setArea(note.area);
    setGrade(note.grade);
    setDescription(note.description);
    setImage(note.image || '');
    setVideo(note.video || '');
    setEditModalVisible(true);
  };

  const saveEdit = () => {
    if (!editingNote || name.trim() === '') return;
    
    const updatedNote: Note = {
      ...editingNote,
      name,
      area,
      grade,
      description,
      image: image || undefined,
      video: video || undefined
    };

    setNotes(notes.map(note => 
      note.id === editingNote.id ? updatedNote : note
    ));
    
    resetForm();
    setEditingNote(null);
    setEditModalVisible(false);
  };

  const addAttempt = (noteId: string) => {
    const note = notes.find(n => n.id === noteId);
    if (!note) return;

    const newAttempt: Attempt = {
      id: Date.now().toString(),
      date,
      attempts: parseInt(currentAttempts) || 0,
      send,
      notes: attemptNotes
    };

    const updatedNote = {
      ...note,
      attempts: [...note.attempts, newAttempt]
    };

    setNotes(notes.map(n => n.id === noteId ? updatedNote : n));
    setDate(new Date());
    setSend(false);
    setCurrentAttempts('');
    setAttemptNotes('');
    setAttemptModalVisible(false);
  };

  const deleteAttempt = (noteId: string, attemptId: string) => {
    Alert.alert(
      "Delete Attempt",
      "Are you sure you want to delete this attempt?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setNotes(notes.map(note => {
              if (note.id === noteId) {
                return {
                  ...note,
                  attempts: note.attempts.filter(a => a.id !== attemptId)
                };
              }
              return note;
            }));
          }
        }
      ]
    );
  };

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedClimbs);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedClimbs(newExpanded);
  };

  const renderAttempts = (attempts: Attempt[]) => {
    return attempts.map(attempt => (
      <View key={attempt.id} style={styles.attemptItem}>
        <View style={styles.attemptHeader}>
          <Text style={styles.attemptDate}>
            {attempt.date.toLocaleDateString()}
          </Text>
          <TouchableOpacity 
            onPress={() => deleteAttempt(editingNote!.id, attempt.id)}
            style={styles.deleteButton}
          >
            <Text style={styles.deleteButtonText}>×</Text>
          </TouchableOpacity>
        </View>
        <Text>Attempts: {attempt.attempts}</Text>
        <Text style={[styles.statusText, attempt.send && styles.sentText]}>
          Status: {attempt.send ? 'Sent' : 'Not Sent'}
        </Text>
        {attempt.notes && <Text>Notes: {attempt.notes}</Text>}
      </View>
    ));
  };

  const renderNoteItem = ({ item }: { item: Note }) => (
    <TouchableOpacity 
      style={[styles.noteItem, item.attempts.some(a => a.send) && styles.sentItem]}
      onPress={() => startEditing(item)}
    >
      <View style={styles.noteHeader}>
        <Text style={styles.noteTitle}>{item.name}</Text>
        <TouchableOpacity 
          onPress={() => deleteNote(item.id)}
          style={styles.deleteButton}
        >
          <Text style={styles.deleteButtonText}>×</Text>
        </TouchableOpacity>
      </View>
      <Text>Area: {item.area}</Text>
      <Text>Grade: {item.grade}</Text>
      <Text>Total Attempts: {item.attempts.reduce((sum, a) => sum + a.attempts, 0)}</Text>
      <Text style={[styles.statusText, item.attempts.some(a => a.send) && styles.sentText]}>
        Status: {item.attempts.some(a => a.send) ? 'Sent' : 'Not Sent'}
      </Text>
      <Text>{item.description}</Text>
      {item.attempts.length > 0 && (
        <View style={styles.attemptsContainer}>
          <TouchableOpacity 
            style={styles.attemptsHeader} 
            onPress={() => toggleExpand(item.id)}
          >
            <Text style={styles.attemptsHeaderText}>
              Attempt History ({item.attempts.length})
            </Text>
            <Text style={styles.expandIcon}>
              {expandedClimbs.has(item.id) ? '▼' : '▶'}
            </Text>
          </TouchableOpacity>
          {expandedClimbs.has(item.id) && (
            <View style={styles.attemptsList}>
              {renderAttempts(item.attempts)}
            </View>
          )}
        </View>
      )}
      <Button 
        title="Add Attempt" 
        onPress={() => {
          setEditingNote(item);
          setAttemptModalVisible(true);
        }}
      />
    </TouchableOpacity>
  );

  const renderAttemptModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={attemptModalVisible}
      onRequestClose={() => {
        setAttemptModalVisible(false);
        setDate(new Date());
        setSend(false);
        setCurrentAttempts('');
        setAttemptNotes('');
      }}
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
            <Button 
              title="Cancel" 
              onPress={() => {
                setAttemptModalVisible(false);
                setDate(new Date());
                setSend(false);
                setCurrentAttempts('');
                setAttemptNotes('');
              }} 
            />
            <Button 
              title="Add" 
              onPress={() => editingNote && addAttempt(editingNote.id)} 
            />
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderModal = (isEdit: boolean) => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isEdit ? editModalVisible : modalVisible}
      onRequestClose={() => {
        if (isEdit) {
          setEditModalVisible(false);
          setEditingNote(null);
        } else {
          setModalVisible(false);
        }
        resetForm();
      }}
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
          <TouchableOpacity 
            style={styles.pickerButton} 
            onPress={() => setShowGradePicker(!showGradePicker)}
          >
            <Text style={styles.pickerButtonText}>Grade: {grade}</Text>
          </TouchableOpacity>
          {showGradePicker && (
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={grade}
                style={styles.picker}
                onValueChange={(itemValue: string) => {
                  setGrade(itemValue);
                  setShowGradePicker(false);
                }}
              >
                {V_GRADES.map((grade) => (
                  <Picker.Item key={grade} label={grade} value={grade} />
                ))}
              </Picker>
            </View>
          )}
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
            <Button 
              title="Cancel" 
              onPress={() => {
                if (isEdit) {
                  setEditModalVisible(false);
                  setEditingNote(null);
                } else {
                  setModalVisible(false);
                }
                resetForm();
              }} 
            />
            <Button 
              title={isEdit ? "Save" : "Add"} 
              onPress={isEdit ? saveEdit : addNote} 
            />
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Ticklist</Text>
      <Button title="New Climb" onPress={() => setModalVisible(true)} />
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={renderNoteItem}
      />
      {renderModal(false)}
      {renderModal(true)}
      {renderAttemptModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  noteItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 10,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sentItem: {
    backgroundColor: '#f0f8ff',
  },
  noteTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  statusText: {
    color: '#666',
  },
  sentText: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
  deleteButton: {
    padding: 5,
  },
  deleteButtonText: {
    color: '#ff4444',
    fontSize: 24,
    fontWeight: 'bold',
  },
  attemptsContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
  },
  attemptsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  attemptsHeaderText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  expandIcon: {
    fontSize: 16,
    color: '#666',
  },
  attemptsList: {
    marginTop: 5,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  attemptItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 5,
  },
  attemptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  attemptDate: {
    fontWeight: 'bold',
  },
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
  pickerButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '100%',
    backgroundColor: '#f8f8f8',
  },
  pickerButtonText: {
    fontSize: 16,
    color: '#333',
  },
  pickerContainer: {
    width: '100%',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  picker: {
    width: '100%',
    height: 150,
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