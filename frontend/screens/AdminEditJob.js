import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";

const AdminEditJob = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { jobId } = route.params;

  const [job, setJob] = useState(null);

  useEffect(() => {
    // Fetch job details by jobId when the page loads
    const fetchJobDetails = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const response = await axios.get(`http://192.168.8.100/api/v1/job/getJobById/${jobId}`,{}, { headers });
        setJob(response.data.data);
      } catch (error) {
        Alert.alert("Error", "There was an error fetching job details.");
      }
    };

    fetchJobDetails();
  }, [jobId]);

  const handleSaveChanges = async () => {
    try {
        const token = await AsyncStorage.getItem("token");
        const headers = {
          Authorization: `Bearer ${token}`,
        };
  
        const response = await axios.patch(`http://192.168.8.100/api/v1/job/update/${jobId}`, {
          title: job.title,
          description: job.description,
          avgAnnualSalary: job.avgAnnualSalary,
        }, { headers });
  
        if (response.data.success) {
          Alert.alert("Success", "Job details have been updated.");
          navigation.navigate('AdminJobList');
        } else {
          throw new Error(response.data.message || "Failed to update job details.");
        }
      } catch (error) {
        Alert.alert("Error", error.message);
      }
  };

  if (!job) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Edit Job Details</Text>
      
      <Text style={styles.label}>Title</Text>
      <TextInput 
        value={job.title} 
        onChangeText={(text) => setJob({...job, title: text})} 
        style={styles.input} 
      />

      <Text style={styles.label}>Description</Text>
      <TextInput 
        value={job.description} 
        onChangeText={(text) => setJob({...job, description: text})}
        style={styles.input} 
        multiline
      />

      <Text style={styles.label}>Average Salary</Text>
      <TextInput 
        value={job.avgAnnualSalary.toString()} 
        onChangeText={(text) => setJob({...job, avgAnnualSalary: parseFloat(text)})}
        style={styles.input} 
        keyboardType="numeric"
      />

      <Button title="Save Changes" onPress={handleSaveChanges} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 15,
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#555',
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    marginBottom: 10,
  },
});

export default AdminEditJob;
