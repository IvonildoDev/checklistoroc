
import React, { useState } from 'react';
import { View, Text, Button, TouchableOpacity, TextInput, StyleSheet, Image, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const blocks = [
    {
        title: 'Bloco 1',
        questions: [
            { label: '1. Nível de óleo', name: 'q1', options: ['No nível', 'Completar'] },
            { label: '2. Nível fluido de freio', name: 'q2', options: ['No nível', 'Completar'] },
            { label: '3. Nível de água do radiador', name: 'q3', options: ['No nível', 'Completar'] },
        ],
        obs: 'obs1',
    },
    {
        title: 'Bloco 2',
        questions: [
            { label: '4. Freio de pé', name: 'q4', options: ['Funciona', 'Não funciona'] },
            { label: '5. Freio de estacionamento', name: 'q5', options: ['Funciona', 'Não funciona'] },
            { label: '6. Motor de partida', name: 'q6', options: ['Funciona', 'Não funciona'] },
            { label: '7. Limpador de para-brisa', name: 'q7', options: ['Funciona', 'Não funciona'] },
            { label: '8. Lavador de para-brisa', name: 'q8', options: ['Funciona', 'Não funciona'] },
            { label: '9. Buzina', name: 'q9', options: ['Funciona', 'Não funciona'] },
            { label: '10. Faróis', name: 'q10', options: ['Funciona', 'Não funciona'] },
            { label: '11. Faróis dianteiros (seta)', name: 'q11', options: ['Funciona', 'Não funciona'] },
            { label: '12. Lanternas traseiras (seta)', name: 'q12', options: ['Funciona', 'Não funciona'] },
            { label: '13. Luz de freio', name: 'q13', options: ['Funciona', 'Não funciona'] },
            { label: '14. Luz de ré', name: 'q14', options: ['Funciona', 'Não funciona'] },
            { label: '15. Luz da placa', name: 'q15', options: ['Funciona', 'Não funciona'] },
            { label: '16. Indicadores de painel', name: 'q16', options: ['Funciona', 'Não funciona'] },
            { label: '17. Cinto de segurança', name: 'q17', options: ['Funciona', 'Não funciona'] },
            { label: '18. Fechamento de janelas', name: 'q18', options: ['Funciona', 'Não funciona'] },
        ],
        obs: 'obs2',
    },
    {
        title: 'Bloco 3',
        questions: [
            { label: '19. Condições dos pneus', name: 'q19', options: ['Bom', 'Ruim', 'Calibrado', 'Descalibrado'] },
            { label: '20. Pneu estepe', name: 'q20', options: ['Bom', 'Ruim', 'Calibrado', 'Descalibrado'] },
        ],
        obs: 'obs3',
    },
    {
        title: 'Bloco 4',
        questions: [
            { label: '21. Triângulo de advertência', name: 'q21', options: ['Possui', 'Não possui'] },
            { label: '22. Macaco', name: 'q22', options: ['Possui', 'Não possui'] },
            { label: '23. Chave de roda', name: 'q23', options: ['Possui', 'Não possui'] },
        ],
        obs: 'obs4',
    },
    {
        title: 'Bloco 5',
        questions: [
            { label: '24. Vidros', name: 'q24', options: ['Normal', 'Possui avaria'] },
            { label: '25. Portas', name: 'q25', options: ['Normal', 'Possui avaria'] },
            { label: '26. Para-choque dianteiro', name: 'q26', options: ['Normal', 'Possui avaria'] },
            { label: '27. Para-choque traseiro', name: 'q27', options: ['Normal', 'Possui avaria'] },
            { label: '28. Lataria', name: 'q28', options: ['Normal', 'Possui avaria'] },
            { label: '29. Espelhos retrovisores', name: 'q29', options: ['Normal', 'Possui avaria'] },
        ],
        obs: 'obs5',
    },
    {
        title: 'Bloco 6',
        questions: [
            { label: '30. Habilitação em dia', name: 'q30', options: ['Sim', 'Não'] },
            { label: '31. Manutenção preventiva em dias', name: 'q31', options: ['Sim', 'Não'] },
            { label: '32. O veículo possui vazamentos', name: 'q32', options: ['Sim', 'Não'] },
        ],
        obs: 'obs6',
    },
];

import { useRoute, useNavigation } from '@react-navigation/native';

export default function ChecklistScreen(props) {
    const navigation = useNavigation();
    const route = useRoute();
    const userData = route.params?.userData;

    // Se vier reset, volta para o início do checklist
    React.useEffect(() => {
        if (route.params?.reset) {
            setCurrentBlock(0);
            setAnswers({});
            setFotos([]);
            setSuccess(false);
            setSubmitting(false);
            navigation.setParams({ reset: undefined });
        }
    }, [route.params?.reset]);
    const [answers, setAnswers] = useState({});
    const [periodicidade, setPeriodicidade] = useState('');
    const [fotos, setFotos] = useState([]);
    const [currentBlock, setCurrentBlock] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const today = new Date();
    const dataStr = today.toLocaleDateString('pt-BR');

    const handleOption = (name, value) => {
        setAnswers({ ...answers, [name]: value });
    };

    const handleObs = (name, value) => {
        setAnswers({ ...answers, [name]: value });
    };

    const pickImage = async () => {
        if (fotos.length >= 2) return;
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7,
            base64: true,
        });
        if (!result.canceled && result.assets && result.assets[0].uri) {
            setFotos([...fotos, result.assets[0].uri]);
        }
    };

    const handleNext = async () => {
        // Checar se todas as perguntas do bloco atual foram respondidas
        const block = blocks[currentBlock];
        let allAnswered = true;
        for (let q of block.questions) {
            if (!answers[q.name]) {
                allAnswered = false;
                break;
            }
        }
        if (!allAnswered) {
            Alert.alert('Atenção', 'Responda todas as perguntas deste bloco antes de continuar.');
            return;
        }
        if (currentBlock < blocks.length - 1) {
            setCurrentBlock(currentBlock + 1);
        } else {
            // Último bloco: salvar e finalizar
            setSubmitting(true);
            const allAnswers = { ...answers, fotos6: fotos, periodicidade };
            try {
                await AsyncStorage.setItem('checklistAnswers', JSON.stringify(allAnswers));
                setSuccess(true);
            } catch { }
            setSubmitting(false);
            // Não navega imediatamente, mostra mensagem de sucesso
        }
    };

    const block = blocks[currentBlock];

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
        >
            <ScrollView style={{ flex: 1, backgroundColor: '#f3f4f6' }} contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">
                <View style={styles.headerModern}>
                    <View style={styles.headerRow}>
                        <View style={styles.avatarCircle}>
                            <Text style={styles.avatarText}>{(userData?.usuario?.[0] || '-').toUpperCase()}</Text>
                        </View>
                        <View style={{ flex: 1, marginLeft: 12 }}>
                            <Text style={styles.headerUser}>{userData?.usuario || '-'}</Text>
                            <Text style={styles.headerSub}>{userData?.matricula || '-'}</Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text style={styles.headerSub}>{dataStr}</Text>
                        </View>
                    </View>
                    <View style={styles.headerInfoRow}>
                        <View style={{ flex: 1, marginRight: 8 }}>
                            <Text style={styles.headerInfo} numberOfLines={2} ellipsizeMode="tail">
                                <Text style={{ fontWeight: 'bold' }}>Veículo:</Text> {userData?.veiculo || '-'}
                            </Text>
                        </View>
                        <View style={{ maxWidth: 120, flexShrink: 1 }}>
                            <Text style={styles.headerInfo} numberOfLines={2} ellipsizeMode="tail">
                                <Text style={{ fontWeight: 'bold' }}>Placa:</Text> {userData?.placa || '-'}
                            </Text>
                        </View>
                    </View>
                </View>
                <Text style={styles.title}>Checklist de Veículo Leve</Text>
                <View style={styles.periodicidadeBox}>
                    <Text style={styles.periodicidadeLabel}>Periodicidade:</Text>
                    <View style={styles.periodicidadeRow}>
                        {['Semanal', 'Mensal', 'Mudança de Condutor', 'Troca de Turno'].map(opt => (
                            <TouchableOpacity
                                key={opt}
                                style={[styles.periodicidadeBtn, periodicidade === opt && styles.periodicidadeBtnSelected]}
                                onPress={() => setPeriodicidade(opt)}
                                activeOpacity={0.85}
                            >
                                <Text style={[styles.periodicidadeText, periodicidade === opt && styles.periodicidadeTextSelected]}>{opt}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
                <View style={[styles.block, styles.blockHighlight]}>
                    <Text style={styles.blockTitle}>{block.title}</Text>
                    {block.questions.map((q, idx) => (
                        <View key={q.name} style={styles.question}>
                            <Text style={styles.questionLabel}>{q.label}</Text>
                            <View style={styles.optionsRow}>
                                {q.options.map(opt => (
                                    <TouchableOpacity
                                        key={opt}
                                        style={[styles.optionBtn, answers[q.name] === opt && styles.optionBtnSelected]}
                                        onPress={() => handleOption(q.name, opt)}
                                        activeOpacity={0.85}
                                    >
                                        <Text style={[styles.optionText, answers[q.name] === opt && styles.optionTextSelected]}>{opt}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                            {idx < block.questions.length - 1 && <View style={styles.separator} />}
                        </View>
                    ))}
                    <TextInput
                        style={styles.obsInput}
                        placeholder={`Observações do ${block.title.toLowerCase()} (até 100 caracteres)`}
                        maxLength={100}
                        value={answers[block.obs] || ''}
                        onChangeText={text => handleObs(block.obs, text)}
                        placeholderTextColor="#9ca3af"
                        multiline
                        returnKeyType="done"
                    />
                    <TouchableOpacity style={[styles.submitBtn, submitting && { opacity: 0.7 }]} onPress={handleNext} disabled={submitting || (success && currentBlock === blocks.length - 1)} activeOpacity={0.85}>
                        <Text style={styles.submitBtnText}>
                            {currentBlock < blocks.length - 1
                                ? 'Próximo ➔'
                                : (submitting
                                    ? 'Salvando...'
                                    : (success ? 'Salvo!' : 'Salvar ✔'))}
                        </Text>
                    </TouchableOpacity>
                    {success && currentBlock === blocks.length - 1 && (
                        <Text style={styles.successMsg}>Checklist salvo com sucesso!</Text>
                    )}
                </View>
                <View style={styles.progressBarContainer}>
                    {blocks.map((b, i) => (
                        <View key={b.title} style={[styles.progressDot, i === currentBlock && styles.progressDotActive]} />
                    ))}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    periodicidadeBox: {
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingVertical: 18,
        paddingHorizontal: 10,
        marginBottom: 22,
        marginTop: 2,
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 2,
        elevation: 1,
        alignItems: 'center',
    },
    periodicidadeLabel: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#1a2533',
        marginBottom: 14,
        textAlign: 'center',
    },
    periodicidadeRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 14,
        rowGap: 12,
    },
    periodicidadeBtn: {
        borderWidth: 1.5,
        borderColor: '#2a7ae4',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 18,
        marginRight: 0,
        marginBottom: 0,
        backgroundColor: '#fff',
        minWidth: 120,
        alignItems: 'center',
        marginHorizontal: 4,
        marginVertical: 4,
    },
    periodicidadeBtnSelected: {
        backgroundColor: '#2a7ae4',
        borderColor: '#1e40af',
    },
    periodicidadeText: {
        color: '#2a7ae4',
        fontWeight: '600',
        fontSize: 16,
    },
    periodicidadeTextSelected: {
        color: '#fff',
    },
    headerModern: {
        backgroundColor: '#2a7ae4',
        borderRadius: 18,
        padding: 18,
        marginBottom: 24,
        shadowColor: '#2a7ae4',
        shadowOpacity: 0.10,
        shadowRadius: 8,
        elevation: 4,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    avatarCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 2,
        elevation: 2,
    },
    avatarText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2a7ae4',
    },
    headerUser: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        letterSpacing: 0.5,
    },
    headerSub: {
        fontSize: 14,
        color: '#dbeafe',
    },
    headerInfoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 6,
    },
    headerInfo: {
        color: '#e0e7ef',
        fontSize: 15,
        marginRight: 12,
    },
    blockHighlight: {
        borderWidth: 2,
        borderColor: '#2a7ae4',
        shadowOpacity: 0.16,
        elevation: 4,
    },
    separator: {
        height: 1,
        backgroundColor: '#e5e7eb',
        marginVertical: 8,
        borderRadius: 1,
    },
    progressBarContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 10,
        gap: 8,
    },
    progressDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#cbd5e1',
        marginHorizontal: 2,
    },
    progressDotActive: {
        backgroundColor: '#2a7ae4',
        width: 18,
        height: 18,
        borderRadius: 9,
        borderWidth: 2,
        borderColor: '#1e40af',
    },
    successMsg: {
        color: 'green',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 12,
    },
    headerBox: {
        backgroundColor: '#eaf3fa',
        borderRadius: 14,
        padding: 14,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 2,
        elevation: 1,
    },
    headerText: {
        fontSize: 15,
        color: '#1a2533',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 18,
        textAlign: 'center',
        color: '#1a2533',
        letterSpacing: 1,
    },
    block: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 18,
        marginBottom: 22,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    blockTitle: {
        fontSize: 19,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#2a7ae4',
        letterSpacing: 0.5,
    },
    question: {
        marginBottom: 14,
    },
    questionLabel: {
        fontSize: 15,
        marginBottom: 6,
        color: '#1a2533',
        fontWeight: '600',
    },
    optionsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    optionBtn: {
        borderWidth: 1.5,
        borderColor: '#2a7ae4',
        borderRadius: 8,
        paddingVertical: 6,
        paddingHorizontal: 16,
        marginRight: 10,
        marginBottom: 6,
        backgroundColor: '#fff',
        minWidth: 80,
        alignItems: 'center',
        shadowColor: '#2a7ae4',
        shadowOpacity: 0.04,
        shadowRadius: 2,
        elevation: 1,
    },
    optionBtnSelected: {
        backgroundColor: '#2a7ae4',
        borderColor: '#1e40af',
        shadowOpacity: 0.12,
        elevation: 2,
    },
    optionText: {
        color: '#2a7ae4',
        fontWeight: '600',
        fontSize: 15,
    },
    optionTextSelected: {
        color: '#fff',
    },
    obsInput: {
        borderWidth: 1.2,
        borderColor: '#cbd5e1',
        borderRadius: 10,
        padding: 10,
        marginTop: 10,
        marginBottom: 8,
        fontSize: 15,
        backgroundColor: '#f8fafc',
    },
    fotoPreview: {
        width: 70,
        height: 70,
        borderRadius: 8,
        marginRight: 8,
    },
    fotoBtn: {
        width: 70,
        height: 70,
        borderRadius: 8,
        borderWidth: 1.5,
        borderColor: '#2a7ae4',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#eaf3fa',
    },
    submitBtn: {
        backgroundColor: '#2a7ae4',
        borderRadius: 12,
        paddingVertical: 16,
        marginTop: 16,
        marginBottom: 10,
        alignItems: 'center',
        shadowColor: '#2a7ae4',
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 2,
    },
    submitBtnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 17,
        letterSpacing: 1,
    },
});
