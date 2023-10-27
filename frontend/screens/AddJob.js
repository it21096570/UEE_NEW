import React, { useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";

const AddJob = () => {
  const [title, setTitle] = useState("");
  const [organization, setOrganization] = useState("");
  const [jobType, setJobType] = useState("");
  const [avgAnnualSalary, setAvgAnnualSalary] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [organizations, setOrganizations] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);


  const navigation = useNavigation();

  useEffect(() => {
    // Fetch job types
    axios.get("http://192.168.8.100:8090/api/v1/category/getAllCategories/?type=job")
      .then((response) => {
        setJobTypes(Array.isArray(response.data) ? response.data : []);
        console.log("Cate : ", response.data)
      })
      .catch((error) => {
        console.error("Error fetching job types:", error);
        setJobTypes([]);
      });
  }, []);

  useEffect(() => {
    const fetchOrganizations = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                console.error('Token is missing in AsyncStorage');
                return;
            }
            const headers = {
                'Authorization': `Bearer ${token}`,
            };
            const response = await axios.get('http://192.168.8.100:8090/api/v1/organization/getAll', { headers });

            if (response.data.isSuccessful) {
                const organizationsData = response.data.data;
                const organizationInfo = organizationsData.map(org => ({
                    id: org._id,
                    name: org.orgName,
                }));
                setOrganizations(organizationInfo);
            } else {
                console.error('Failed to fetch organizations:', response.data.message);
            }
        } catch (error) {
            console.error('Error fetching organizations:', error);
        }
    };

    fetchOrganizations();
}, []);

  const handleJobSubmit = async () => {
    setLoading(true);
    setError("");

    const jobData = {
      title,
      type:'64f22756460e1b0a95ad43df',
      avgAnnualSalary,
      description,
      organization: '64f0ac2b958ea9baa678eca0',
    };

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        throw new Error("Token is missing in AsyncStorage");
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      axios.post("http://192.168.8.100:8090/api/v1/job/create", jobData, { headers })
        .then(async (response) => {
          if (response.status === 200) {
            navigation.navigate("SuccessNotify");
          } else {
            const data = await response.data;
            setError(data.message);
          }
        })
        .catch((err) => {
          setError("An error occurred while adding the job." + err);
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (err) {
      setError("An error occurred while adding the job." + err);
    }
  };

  const clearForm = () => {
    setTitle("");
    setOrganization("");
    setJobType("");
    setAvgAnnualSalary("");
    setDescription("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Admin Add Job</Text>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={(text) => setTitle(text)}
      />
      <Picker
        style={styles.input}
        selectedValue={organization}
        onValueChange={(itemValue) => setOrganization(itemValue)}
      >
        <Picker.Item label="Select Organization" value="" />
        {organizations.map((org) => (
          <Picker.Item key={org._id} label={org.orgName} value={org._id} />
        ))}
      </Picker>
      <Picker
        style={styles.input}
        selectedValue={jobType}
        onValueChange={(itemValue) => setJobType(itemValue)}
      >
        <Picker.Item label="Select Job Type" value="" />
        {jobTypes.map((type) => (
          <Picker.Item key={type._id} label={type.name} value={type._id} />
        ))}
      </Picker>
      <TextInput
        style={styles.input}
        placeholder="Average Annual Salary"
        value={avgAnnualSalary}
        onChangeText={(text) => setAvgAnnualSalary(text)}
      />
      <TextInput
        style={styles.descriptionInput}
        placeholder="Description"
        value={description}
        onChangeText={(text) => setDescription(text)}
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={handleJobSubmit}>
        {loading && <ActivityIndicator size="large" style={styles.loader} />}
        <Text style={styles.buttonText}>Add Job</Text>
      </TouchableOpacity>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={clearForm}>
        <Text style={styles.buttonText}>Clear Form</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#f4f6f8',
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 10,
    backgroundColor: 'white',
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  descriptionInput: {
    width: "100%",
    height: 100,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 10,
    backgroundColor: 'white',
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  button: {
    backgroundColor: '#192655',
    width: "100%",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  loader: {
    marginTop: 20,
  },
  error: {
    color: "red",
    marginTop: 10,
  },
});

export default AddJob;
