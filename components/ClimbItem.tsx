import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Button, Image } from 'react-native';
import { Note, Attempt } from '../types';

type ClimbItemProps = {
  item: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  onAddAttempt: (note: Note) => void;
  expandedClimbs: Set<string>;
  onToggleExpand: (id: string) => void;
  onDeleteAttempt: (noteId: string, attemptId: string) => void;
};

const renderAttempts = (attempts: Attempt[], noteId: string, onDeleteAttempt: (noteId: string, attemptId: string) => void) => {
  return attempts.map(attempt => (
    <View key={attempt.id} style={styles.attemptItem}>
      <View style={styles.attemptHeader}>
        <Text style={styles.attemptDate}>
          {attempt.date.toLocaleDateString()}
        </Text>
        <TouchableOpacity 
          onPress={() => onDeleteAttempt(noteId, attempt.id)}
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

const ClimbItem = ({ 
  item, 
  onEdit, 
  onDelete, 
  onAddAttempt,
  expandedClimbs,
  onToggleExpand,
  onDeleteAttempt
}: ClimbItemProps) => {
  // Check if any attempt was sent to determine overall send status
  const isSent = item.attempts.some(a => a.send);

  return (
    <TouchableOpacity 
      style={[styles.noteItem, isSent && styles.sentItem]}
      onPress={() => onEdit(item)}
    >
      <View style={styles.mainContent}>
        {/* Image Section */}
        <View style={styles.imageContainer}>
          {item.image ? (
            <Image 
              source={{ uri: item.image }} 
              style={styles.climbImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.placeholderImage}>
              <Text style={styles.placeholderText}>📷</Text>
            </View>
          )}
        </View>

        {/* Text Content Section */}
        <View style={styles.textContent}>
          <View style={styles.noteHeader}>
            <View style={styles.titleContainer}>
              <Text style={styles.noteTitle}>{item.name}</Text>
              <View style={styles.categoryContainer}>
                <Text style={styles.categoryText}>
                  {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                </Text>
              </View>
            </View>
            <TouchableOpacity 
              onPress={() => onDelete(item.id)}
              style={styles.deleteButton}
            >
              <Text style={styles.deleteButtonText}>×</Text>
            </TouchableOpacity>
          </View>
          <Text>Area: {item.area}</Text>
          <Text>Grade: {item.grade}</Text>
          <Text>Total Attempts: {item.attempts.reduce((sum, a) => sum + a.attempts, 0)}</Text>
          <Text style={[styles.statusText, isSent && styles.sentText]}>
            Status: {isSent ? 'Sent' : 'Not Sent'}
          </Text>
          <Text>{item.description}</Text>
        </View>
      </View>

      {item.attempts.length > 0 && (
        <View style={styles.attemptsContainer}>
          <TouchableOpacity 
            style={styles.attemptsHeader} 
            onPress={() => onToggleExpand(item.id)}
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
              {renderAttempts(item.attempts, item.id, onDeleteAttempt)}
            </View>
          )}
        </View>
      )}
      <Button 
        title="Add Attempt" 
        onPress={() => onAddAttempt(item)}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  noteItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 10,
  },
  mainContent: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  imageContainer: {
    width: 80,
    height: 80,
    marginRight: 15,
  },
  climbImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  placeholderText: {
    fontSize: 24,
  },
  textContent: {
    flex: 1,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  categoryContainer: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  categoryText: {
    fontSize: 12,
    color: '#666',
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
});

export default ClimbItem; 