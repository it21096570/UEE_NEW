import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Text, Button, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";

const ViewSavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);


  const applyForJob = (jobId) => {

    alert(`Applied for job: ${jobId}`);
  };

  const fetchAppliedJobs = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        throw new Error("Token is missing in AsyncStorage");
      }
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get('http://192.168.8.100:8090/api/v1/job/getAppliedJobs', { headers });
      setAppliedJobs(response.data.data.map(job => job._id)); // assuming it returns a list of jobs and you're interested in IDs
    } catch (error) {
      console.error('Error fetching applied jobs:', error);
    }
  };


  const fetchSavedJobs = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        throw new Error("Token is missing in AsyncStorage");
      }
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get('http://192.168.8.100:8090/api/v1/job/getSavedJobs', { headers });
      setSavedJobs(response.data.data);
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
    fetchAppliedJobs();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.jobItem}>
      <Text style={styles.jobTitle}>{item.title}</Text>
      <Text style={styles.jobDescription}>{item.description}</Text>
      <Text style={styles.jobOrganization}>Organization: {item.organization.orgName}</Text>
      <View style={styles.buttonContainer}>
        {
          appliedJobs.includes(item._id) ?
            <View style={[styles.button, styles.disabledButton]}>
              <Text style={styles.buttonText}>Already Applied</Text>
            </View> :
            <TouchableOpacity style={[styles.button, styles.applyButton]} onPress={() => applyForJob(item._id)}>
              <Text style={styles.buttonText}>Apply</Text>
            </TouchableOpacity>
        }
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Saved Jobs</Text>
      <FlatList
        data={savedJobs}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.flatlistContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
    paddingHorizontal: 15
  },
  header: {
    fontSize: 32,
    fontWeight: '700',
    color: '#333',
    paddingTop: 20,
    paddingBottom: 10,
    marginTop: 40
  },
  flatlistContainer: {
    paddingBottom: 15
  },
  jobItem: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 18,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  jobTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10
  },
  jobDescription: {
    fontSize: 16,
    color: '#777',
    marginBottom: 12
  },
  jobOrganization: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15
  },
  button: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 25,
    justifyContent: 'center',
    alignItems: 'center'
  },
  applyButton: {
    backgroundColor: '#2d87f0'
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff'
  },
  disabledButton: {
    backgroundColor: '#130160' // some grayish color indicating a disabled state
},

});




export default ViewSavedJobs;
