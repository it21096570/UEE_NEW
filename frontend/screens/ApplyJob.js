import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Animated, KeyboardAvoidingView } from 'react-native';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
// import DocumentPicker from 'react-native-document-picker'
import * as DocumentPicker from 'expo-document-picker';


const ApplyJob = ({ route }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [resume, setResume] = useState(null);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
      });

      console.log("result : ", result);
      if (result && result.assets && result.assets.length > 0) {
        setResume(result.assets[0]);
      } else {
        console.log('Document picker operation was cancelled');
      }
    } catch (error) {
      console.error("DocumentPicker Error: ", error);
      if (error.code === 'E_PICKER_CANCELLED') {
        console.log("Document picker was cancelled");
      } else {
        alert("Failed to pick a document.");
      }
    }
  };

  const applyForJob = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        throw new Error("Token is missing in AsyncStorage");
      }

      const jobId = route.params.jobId;

      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("email", email);
      formData.append("mobileNumber", mobileNumber);
      if (resume) {
        formData.append("resume", {
          uri: resume.uri,
          type: 'application/pdf',
          name: resume.name,
        });
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      };

      const response = await axios.post(`http://192.168.8.100:8090/api/v1/job/apply/${jobId}`, formData, { headers });
      console.log("Response : ", response.data)

      if (response) {
        alert(response.data.message);
      } else {
        alert("Failed to apply");
      }
    } catch (error) {
      console.error('Error applying for job:', error);
      alert("Failed to apply for the job.");
    }
  };


  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Apply Now</Text>
        <Text style={styles.subHeader}>Take the first step towards your dream job</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.inputContainer}>
          {/* Icon placeholder: <Icon name="person" size={20} color="#aaa" /> */}
          <TextInput
            placeholder="Full Name"
            value={fullName}
            onChangeText={setFullName}
            style={styles.input}
            placeholderTextColor='#aaa'
          />
        </View>

        <View style={styles.inputContainer}>
          {/* Icon placeholder: <Icon name="mail" size={20} color="#aaa" /> */}
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            placeholderTextColor='#aaa'
            keyboardType='email-address'
          />
        </View>

        <View style={styles.inputContainer}>
          {/* Icon placeholder: <Icon name="phone" size={20} color="#aaa" /> */}
          <TextInput
            placeholder="Mobile Number"
            value={mobileNumber}
            onChangeText={setMobileNumber}
            style={styles.input}
            placeholderTextColor='#aaa'
            keyboardType='phone-pad'
          />
        </View>

        <TouchableOpacity onPress={pickDocument} style={[styles.button, styles.uploadButton]}>
          <Text style={styles.buttonText}>{resume ? resume.name : "Upload Resume (PDF)"}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.applyButton]} onPress={applyForJob}>
          <Text style={styles.buttonText}>Apply</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
    paddingHorizontal: 20
  },
  headerContainer: {
    paddingTop: 50,
    paddingBottom: 30
  },
  header: {
    fontSize: 34,
    fontWeight: '700',
    color: '#333',
  },
  subHeader: {
    fontSize: 18,
    fontWeight: '500',
    color: '#777',
    marginTop: 10
  },
  card: {
    borderRadius: 15,
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#dcdcdc',
    marginBottom: 25,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    paddingVertical: 15
  },
  button: {
    borderRadius: 10,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },
  uploadButton: {
    backgroundColor: '#e0e0e0',
  },
  applyButton: {
    backgroundColor: '#130160',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff'
  }
});

export default ApplyJob;
