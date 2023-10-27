import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Text, TouchableOpacity, TextInput, Button } from 'react-native';
import axios from 'axios';
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UserJobList = () => {
    const [jobs, setJobs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [appliedJobs, setAppliedJobs] = useState([]);
    const navigation = useNavigation();

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


    const applyForJob = (jobId) => {
        navigation.navigate("ApplyJob", { jobId });
    };

    const saveJob = async (jobId) => {
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                throw new Error("Token is missing in AsyncStorage");
            }
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            await axios.put(`http://192.168.8.100:8090/api/v1/job/save/${jobId}`, {}, { headers });
            alert("Job saved successfully!");
        } catch (error) {
            console.error('Error saving job:', error);
            alert("Failed to save the job.");
        }
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
            setJobs(response.data.data);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    };

    useEffect(() => {
        fetchJobs();
        fetchAppliedJobs();
    }, []);

    const filteredJobs = jobs.filter(job => job.title.toLowerCase().includes(searchTerm.toLowerCase()));

    const renderItem = ({ item }) => (
        <View style={styles.jobItem}>
            <Text style={styles.jobTitle}>{item.title}</Text>
            <Text style={styles.jobDescription}>{item.description}</Text>
            <View style={styles.jobDetails}>
                <Text style={styles.jobSalary}>Average Salary: ${item.avgAnnualSalary.toLocaleString()}</Text>
                <Text style={styles.jobDate}>Posted: {new Date(item.createdAt).toLocaleDateString()}</Text>
            </View>
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
                <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={() => saveJob(item._id)}>
                    <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Jobs for You !</Text>
            <TouchableOpacity style={[styles.button, styles.savedJobsButton]} onPress={() => navigation.navigate('ViewSavedJob')}>
                <Text style={styles.buttonText}>View Saved Jobs</Text>
            </TouchableOpacity>
            <TextInput
                style={styles.searchBar}
                placeholder="Search for jobs..."
                value={searchTerm}
                onChangeText={setSearchTerm}
                placeholderTextColor='#aaa'
            />
            <FlatList
                data={filteredJobs}
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
    searchBar: {
        padding: 12,
        borderRadius: 10,
        borderColor: '#dcdcdc',
        borderWidth: 1,
        marginVertical: 15,
        fontSize: 16,
        fontWeight: '500'
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
    jobDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10
    },
    jobSalary: {
        fontSize: 16,
        fontWeight: '500'
    },
    jobOrganization: {
        fontSize: 16,
        color: '#555',
        marginBottom: 10
    },
    jobDate: {
        fontSize: 14,
        color: '#aaa'
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
    saveButton: {
        backgroundColor: '#E1AA74'
    },
    savedJobsButton: {
        backgroundColor: '#3876BF',
        alignSelf: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginBottom: 10,
        marginTop: 20
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff'
    },
    disabledButton: {
        backgroundColor: '#130160' // some grayish color indicating a disabled state
    }
    
});

export default UserJobList;
