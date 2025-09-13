import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';


export default function LoginScreen({ onLogin }) {
    const [usuario, setUsuario] = useState('');
    const [matricula, setMatricula] = useState('');
    const [error, setError] = useState('');

    const handleLogin = () => {
        if (!usuario || !matricula) {
            setError('Preencha todos os campos.');
            return;
        }
        setError('');
        if (onLogin) {
            onLogin({
                usuario,
                matricula,
                veiculo: 'Renault Oroch 1.6 4x2 2018',
                placa: 'QMF-2877',
            });
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bem-vindo!</Text>
            <Text style={styles.subtitle}>Acesse para iniciar o checklist</Text>
            <TextInput
                style={styles.input}
                placeholder="Usuário"
                value={usuario}
                onChangeText={setUsuario}
                placeholderTextColor="#9ca3af"
            />
            <TextInput
                style={styles.input}
                placeholder="Matrícula"
                value={matricula}
                onChangeText={setMatricula}
                keyboardType="numeric"
                placeholderTextColor="#9ca3af"
            />
            <View style={styles.fixedBox}>
                <Text style={styles.fixedLabel}>Modelo do veículo:</Text>
                <Text style={styles.fixedValue}>Renault Oroch 1.6 4x2 2018</Text>
                <Text style={styles.fixedLabel}>Placa:</Text>
                <Text style={styles.fixedValue}>QMF-2877</Text>
            </View>
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <TouchableOpacity
                style={styles.button}
                onPress={handleLogin}
                activeOpacity={0.85}
            >
                <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f3f4f6',
        padding: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#1a2533',
        letterSpacing: 1,
    },
    subtitle: {
        fontSize: 16,
        color: '#64748b',
        marginBottom: 28,
    },
    input: {
        width: '100%',
        maxWidth: 340,
        borderWidth: 1.5,
        borderColor: '#cbd5e1',
        borderRadius: 12,
        padding: 14,
        marginBottom: 18,
        fontSize: 16,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 2,
        elevation: 1,
    },
    fixedBox: {
        width: '100%',
        maxWidth: 340,
        backgroundColor: '#eaf3fa',
        borderRadius: 12,
        padding: 14,
        marginBottom: 22,
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 2,
        elevation: 1,
    },
    fixedLabel: {
        fontWeight: 'bold',
        color: '#1a2533',
        fontSize: 15,
    },
    fixedValue: {
        marginBottom: 8,
        color: '#374151',
        fontSize: 15,
    },
    error: {
        color: '#dc2626',
        marginBottom: 10,
        fontWeight: 'bold',
        fontSize: 15,
    },
    button: {
        backgroundColor: '#2a7ae4',
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 48,
        alignItems: 'center',
        marginTop: 8,
        shadowColor: '#2a7ae4',
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 2,
        width: '100%',
        maxWidth: 340,
    },
    buttonPressed: {
        backgroundColor: '#1e40af',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
        letterSpacing: 1,
    },
});
