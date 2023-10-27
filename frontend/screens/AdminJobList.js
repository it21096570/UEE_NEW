import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Text, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const FeaturedJobList = () => {
  const [jobs, setJobs] = useState([]);
  const navigation = useNavigation();

  const goToEditPage = (jobId) => {
    navigation.navigate("AdminEditJob", { jobId }); // Passing the job ID to the edit page
  };


  const fetchJobs = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        throw new Error("Token is missing in AsyncStorage");
      }
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get('http://192.168.8.100:8090/api/v1/job/allJobs', { headers });

      console.log("Fetched Jobs:", response.data.data);  // log the fetched jobs

      // Only set jobs that have a status of 1
      const activeJobs = response.data.data.filter(job => job.status === 1);
      setJobs(activeJobs);

    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const deleteJob = async (jobId) => {
    try {
      const token = await AsyncStorage.getItem("token");
      console.log("Token:", token);

      if (!token) {
        throw new Error("Token is missing in AsyncStorage");
      }
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.put(`http://192.168.8.100:8090/api/v1/job/delete/${jobId}`, {}, { headers });

      console.log("Job deleted:", response.data);

      fetchJobs();

    } catch (error) {

      console.error('Error deleting job:', error);
      
      if (error.response) {
        console.error('Server Response:', error.response.data);
        console.error('Server Status:', error.response.status);
      }
    }

  };




  useEffect(() => {
    fetchJobs();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.jobItem}>
      <Text style={styles.jobTitle}>{item.title}</Text>
      <Text style={styles.jobDescription}>{item.description}</Text>
      <View style={styles.jobDetails}>
        <Text style={styles.jobSalary}>Average Salary: ${item.avgAnnualSalary.toLocaleString()}</Text>
        <Text style={styles.jobDate}>Posted on: {new Date(item.createdAt).toLocaleDateString()}</Text>
      </View>
      <Text style={styles.jobOrganization}>Organization: {item.organization.orgName}</Text>
      <View style={styles.icons}>
        <TouchableOpacity style={styles.iconButton} onPress={() => goToEditPage(item._id)}>
          <Icon name="create-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={() => {
          Alert.alert(
            "Delete Job",
            "Are you sure you want to delete this job?",
            [
              {
                text: "Cancel",
                onPress: () => console.log("Delete Cancelled"),
                style: "cancel"
              },
              {
                text: "OK",
                onPress: () => deleteJob(item._id)
              }
            ],
            { cancelable: false }
          );
        }}>
          <Icon name="trash-outline" size={24} color="#FF3B30" />
        </TouchableOpacity>


      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Featured Jobs</Text>
      <FlatList
        data={jobs}
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
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    padding: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#dcdcdc',
    marginTop: 60
  },
  flatlistContainer: {
    padding: 10,
  },
  jobItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  jobTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  jobDescription: {
    fontSize: 16,
    color: '#777',
    marginBottom: 10,
  },
  jobDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  jobSalary: {
    fontSize: 15,
    fontWeight: '500',
  },
  jobOrganization: {
    fontSize: 15,
    color: '#555',
    marginBottom: 10,
  },
  jobDate: {
    fontSize: 14,
    color: '#aaa',
  },
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginHorizontal: 10,
  },
});

export default FeaturedJobList;
