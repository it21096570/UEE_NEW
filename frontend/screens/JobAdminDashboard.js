import * as React from "react";
import { ScrollView, StyleSheet, Text, View, TextInput, Dimensions, TouchableOpacity, Pressable, FlatList } from "react-native";
import { Image } from "expo-image";
import { Color, FontFamily, FontSize, Border, Padding } from "../GlobalStyles";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const { width } = Dimensions.get('window');
const isSmallScreen = width < 360;

const JobAdminDashboard = () => {
    const navigation = useNavigation();

    const handleJobAdd = () => {
        navigation.navigate("AddJob");
    };

    const handleJobView = () => {
        navigation.navigate("AdminJobList");
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={handleJobAdd}>
                <Text style={styles.buttonText}>Job Add</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleJobView}>
                <Text style={styles.buttonText}>Job View</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Color.colorWhitesmoke,
    },
    button: {
        width: '80%',
        height: 50,
        backgroundColor: '#130160',
        borderRadius: 10,
        justifyContent: 'center',
        marginVertical: 10,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontFamily: 'DM Sans',
        fontSize: 16,
        fontStyle: 'normal',
        fontWeight: '700',
    },
});

export default JobAdminDashboard;
