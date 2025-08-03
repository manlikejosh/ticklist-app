import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Button, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ClimbItem from '../components/ClimbItem';
import AddClimbModal from '../components/AddClimbModal';
import AttemptModal from '../components/AttemptModal';
import { Note, STORAGE_KEY, ClimbType } from '../types';

type FilterType = 'all' | 'sent' | 'unsent';

export default function App() {
  const [name, setName] = useState('');
  const [area, setArea] = useState('');
  const [grade, setGrade] = useState('V0');
  const [category, setCategory] = useState<ClimbType>(ClimbType.BOULDER);
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
  const [filter, setFilter] = useState<FilterType>('all');

  console.log('Current modalVisible state:', modalVisible);

  useEffect(() => {
    loadClimbs();
  }, []);

  useEffect(() => {
    saveClimbs();
  }, [notes]);

  const loadClimbs = async () => {
    try {
      const savedClimbs = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedClimbs) {
        const parsedClimbs = JSON.parse(savedClimbs);
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

  const resetForm = () => {
    setName('');
    setArea('');
    setGrade('V0');
    setCategory(ClimbType.BOULDER);
    setDescription('');
    setImage('');
    setVideo('');
    setDate(new Date());
    setSend(false);
    setCurrentAttempts('');
    setAttemptNotes('');
  };

  const handleCategoryChange = (newCategory: ClimbType) => {
    setCategory(newCategory);
    // Set default grade for the new category
    const defaultGrade = newCategory === ClimbType.BOULDER ? 'V0' : '5.0';
    setGrade(defaultGrade);
  };

  const addNote = () => {
    if (name.trim() === '') return;
    const newNote: Note = {
      id: Date.now().toString(),
      name,
      area,
      grade,
      category,
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
    setCategory(note.category);
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
      category,
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

    const newAttempt = {
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

  const getFilteredClimbs = () => {
    switch (filter) {
      case 'sent':
        return notes.filter(climb => climb.attempts.some(a => a.send));
      case 'unsent':
        return notes.filter(climb => !climb.attempts.some(a => a.send));
      default:
        return notes;
    }
  };

  const renderFilterButton = (filterType: FilterType, label: string) => (
    <TouchableOpacity
      style={[styles.filterButton, filter === filterType && styles.filterButtonActive]}
      onPress={() => setFilter(filterType)}
    >
      <Text style={[styles.filterButtonText, filter === filterType && styles.filterButtonTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Ticklist</Text>
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => {
          console.log('Add button pressed, current modalVisible:', modalVisible);
          setModalVisible(true);
          console.log('setModalVisible(true) called');
        }}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
      
      <View style={styles.filterContainer}>
        {renderFilterButton('all', 'All')}
        {renderFilterButton('sent', 'Sent')}
        {renderFilterButton('unsent', 'Unsent')}
      </View>

      <FlatList
        data={getFilteredClimbs()}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ClimbItem
            item={item}
            onEdit={startEditing}
            onDelete={deleteNote}
            onAddAttempt={(note) => {
              setEditingNote(note);
              setAttemptModalVisible(true);
            }}
            expandedClimbs={expandedClimbs}
            onToggleExpand={toggleExpand}
            onDeleteAttempt={deleteAttempt}
          />
        )}
      />
      <AddClimbModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          resetForm();
        }}
        onAdd={addNote}
        isEdit={false}
        name={name}
        setName={setName}
        area={area}
        setArea={setArea}
        grade={grade}
        setGrade={setGrade}
        category={category}
        setCategory={handleCategoryChange}
        description={description}
        setDescription={setDescription}
        image={image}
        setImage={setImage}
        video={video}
        setVideo={setVideo}
      />
      <AddClimbModal
        visible={editModalVisible}
        onClose={() => {
          setEditModalVisible(false);
          setEditingNote(null);
          resetForm();
        }}
        onAdd={saveEdit}
        isEdit={true}
        name={name}
        setName={setName}
        area={area}
        setArea={setArea}
        grade={grade}
        setGrade={setGrade}
        category={category}
        setCategory={handleCategoryChange}
        description={description}
        setDescription={setDescription}
        image={image}
        setImage={setImage}
        video={video}
        setVideo={setVideo}
      />
      <AttemptModal
        visible={attemptModalVisible}
        onClose={() => {
          setAttemptModalVisible(false);
          setDate(new Date());
          setSend(false);
          setCurrentAttempts('');
          setAttemptNotes('');
        }}
        onAdd={() => editingNote && addAttempt(editingNote.id)}
        date={date}
        setDate={setDate}
        currentAttempts={currentAttempts}
        setCurrentAttempts={setCurrentAttempts}
        send={send}
        setSend={setSend}
        attemptNotes={attemptNotes}
        setAttemptNotes={setAttemptNotes}
        showDatePicker={showDatePicker}
        setShowDatePicker={setShowDatePicker}
      />
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
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  filterButtonActive: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  filterButtonText: {
    color: '#333',
    fontSize: 14,
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  addButton: {
    position: 'absolute',
    bottom: 10,
    left: '50%',
    marginLeft: -10,
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
    elevation: 5,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 30,
 
    fontWeight: 'bold',
  },
}); 