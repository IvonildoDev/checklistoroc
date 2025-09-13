


import React, { useEffect, useState } from 'react';
import { View, Text, Button, ScrollView, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import * as Linking from 'expo-linking';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
import { useRoute, useNavigation } from '@react-navigation/native';

const blocks = [
    {
        title: 'Bloco 1',
        questions: [
            'Nível de óleo',
            'Nível fluido de freio',
            'Nível de água do radiador',
        ],
    },
    {
        title: 'Bloco 2',
        questions: [
            'Freio de pé',
            'Freio de estacionamento',
            'Motor de partida',
            'Limpador de para-brisa',
            'Lavador de para-brisa',
            'Buzina',
            'Faróis',
            'Faróis dianteiros (seta)',
            'Lanternas traseiras (seta)',
            'Luz de freio',
            'Luz de ré',
            'Luz da placa',
            'Indicadores de painel',
            'Cinto de segurança',
            'Fechamento de janelas',
        ],
    },
    {
        title: 'Bloco 3',
        questions: [
            'Condições dos pneus',
            'Pneu estepe',
        ],
    },
    {
        title: 'Bloco 4',
        questions: [
            'Triângulo de advertência',
            'Macaco',
            'Chave de roda',
        ],
    },
    {
        title: 'Bloco 5',
        questions: [
            'Vidros',
            'Portas',
            'Para-choque dianteiro',
            'Para-choque traseiro',
            'Lataria',
            'Espelhos retrovisores',
        ],
    },
    {
        title: 'Bloco 6',
        questions: [
            'Habitabilidade em dias',
            'Manutenção preventiva em dias',
            'O veículo possui vazamentos',
        ],
    },
];

const alerta = [
    'Não', 'Não possui', 'Ruim', 'Não funciona', 'Descalibrado', 'Possui avaria'
];



export default function RelatorioScreen(props) {
    // Função para compartilhar relatório completo via WhatsApp
    function handleShareWhatsapp() {
        let resumo = `Relatório do Checklist Veículo Leve`;
        resumo += `\nUsuário: ${userData?.usuario || '-'}`;
        resumo += `\nMatrícula: ${userData?.matricula || '-'}`;
        resumo += `\nVeículo: ${userData?.veiculo || '-'}`;
        resumo += `\nPlaca: ${userData?.placa || '-'}`;
        resumo += `\nData: ${dataStr}`;
        if (answers.periodicidade) {
            resumo += `\nPeriodicidade: ${answers.periodicidade}`;
        }
        let questionNumber = 1;
        blocks.forEach((block, blockIdx) => {
            resumo += `\n\n${block.title}`;
            block.questions.forEach((question) => {
                const answer = answers['q' + questionNumber] || 'Não respondido';
                resumo += `\n${questionNumber}. ${question}: ${answer}`;
                questionNumber++;
            });
            if (answers['obs' + (blockIdx + 1)]) {
                resumo += `\nObservações: ${answers['obs' + (blockIdx + 1)]}`;
            }
        });
        const url = `https://wa.me/?text=${encodeURIComponent(resumo)}`;
        Linking.openURL(url);
    }
    const navigation = useNavigation();
    const route = useRoute();
    const userData = route.params?.userData;
    const [answers, setAnswers] = useState({});
    const periodicidade = answers.periodicidade || '';
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const today = new Date();
    const dataStr = today.toLocaleDateString('pt-BR');

    useEffect(() => {
        (async () => {
            try {
                const data = await AsyncStorage.getItem('checklistAnswers');
                if (data) setAnswers(JSON.parse(data));
            } catch { }
            setLoading(false);
        })();
    }, []);

    let questionNumber = 1;

    // Gera HTML do relatório para PDF
    function generateHtml() {
        let html = `<h2 style='text-align:center'>Relatório do Checklist Veículo leve</h2>`;
        html += `<div style='background:#eaf3fa;padding:10px;border-radius:10px;margin-bottom:12px;'>`;
        html += `<b>Usuário:</b> ${userData?.usuario || '-'}<br/>`;
        html += `<b>Matrícula:</b> ${userData?.matricula || '-'}<br/>`;
        html += `<b>Veículo:</b> ${userData?.veiculo || '-'}<br/>`;
        html += `<b>Placa:</b> ${userData?.placa || '-'}<br/>`;
        html += `<b>Data:</b> ${dataStr}`;
        if (answers.periodicidade) {
            html += `<br/><b>Periodicidade:</b> ${answers.periodicidade}`;
        }
        html += `</div>`;
        const alerta = ['Não', 'Não possui', 'Ruim', 'Não funciona', 'Descalibrado', 'Possui avaria'];
        questionNumber = 1;
        blocks.forEach((block, blockIdx) => {
            html += `<h3>${block.title}</h3><ul style='padding-left:10px'>`;
            block.questions.forEach((question) => {
                const answer = answers['q' + questionNumber] || 'Não respondido';
                const isAlert = alerta.includes(answer);
                const color = isAlert ? ' style="color:#dc2626;font-weight:bold"' : '';
                html += `<li><b>${questionNumber}. ${question}:</b> <span${color}>${answer}</span></li>`;
                questionNumber++;
            });
            html += `</ul>`;
            if (answers['obs' + (blockIdx + 1)]) {
                html += `<div><b>Observações:</b> ${answers['obs' + (blockIdx + 1)]}</div>`;
            }
            // Fotos bloco 6
            if (blockIdx === 5 && Array.isArray(answers.fotos6) && answers.fotos6.length > 0) {
                html += `<div><b>Fotos do bloco 6:</b><br/>`;
                answers.fotos6.forEach((src, idx) => {
                    html += `<img src='${src}' style='max-width:120px;max-height:120px;margin:4px;border-radius:8px;box-shadow:0 1px 4px #0002;' />`;
                });
                html += `</div>`;
            }
        });
        return html;
    }

    async function handleSharePdf() {
        setGenerating(true);
        try {
            const html = generateHtml();
            const { uri } = await Print.printToFileAsync({ html, base64: false });
            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(uri);
            } else {
                Alert.alert('Erro', 'Compartilhamento não disponível neste dispositivo.');
            }
        } catch (e) {
            Alert.alert('Erro', 'Não foi possível gerar ou compartilhar o PDF.');
        }
        setGenerating(false);
    }

    return (
        <ScrollView style={{ flex: 1, backgroundColor: '#f3f4f6' }} contentContainerStyle={{ padding: 20 }}>
            <View style={styles.headerBox}>
                <Text style={styles.headerText}><Text style={{ fontWeight: 'bold' }}>Usuário:</Text> {userData?.usuario || '-'}</Text>
                <Text style={styles.headerText}><Text style={{ fontWeight: 'bold' }}>Matrícula:</Text> {userData?.matricula || '-'}</Text>
                <Text style={styles.headerText}><Text style={{ fontWeight: 'bold' }}>Veículo:</Text> {userData?.veiculo || '-'}</Text>
                <Text style={styles.headerText}><Text style={{ fontWeight: 'bold' }}>Placa:</Text> {userData?.placa || '-'}</Text>
                <Text style={styles.headerText}><Text style={{ fontWeight: 'bold' }}>Data:</Text> {dataStr}</Text>
            </View>
            {periodicidade ? (
                <View style={styles.periodicidadeBox}>
                    <Text style={styles.periodicidadeLabel}><Text style={{ fontWeight: 'bold' }}>Periodicidade:</Text> {periodicidade}</Text>
                </View>
            ) : null}
            <Text style={styles.title}>Relatório do Checklist</Text>
            {loading ? (
                <Text style={{ textAlign: 'center', marginTop: 30 }}>Carregando...</Text>
            ) : (
                blocks.map((block, blockIdx) => {
                    return (
                        <View key={block.title} style={styles.block}>
                            <Text style={styles.blockTitle}>{block.title}</Text>
                            {block.questions.map((question, idx) => {
                                const answer = answers['q' + questionNumber] || 'Não respondido';
                                const isAlert = alerta.includes(answer);
                                const color = answer === 'Não respondido' ? '#dc2626' : isAlert ? '#dc2626' : '#1a2533';
                                const qNum = questionNumber;
                                questionNumber++;
                                return (
                                    <View key={qNum} style={styles.qaItem}>
                                        <Text style={[styles.qaQuestion, { color }]}>{qNum}. {question}</Text>
                                        <Text style={styles.qaAnswer}>{answer}</Text>
                                        {idx < block.questions.length - 1 && <View style={styles.separator} />}
                                    </View>
                                );
                            })}
                            {/* Observação do bloco */}
                            {answers['obs' + (blockIdx + 1)] ? (
                                <Text style={styles.obs}><Text style={{ fontWeight: 'bold' }}>Observações:</Text> {answers['obs' + (blockIdx + 1)]}</Text>
                            ) : null}
                            {/* Fotos do bloco 6 */}
                            {blockIdx === 5 && Array.isArray(answers.fotos6) && answers.fotos6.length > 0 && (
                                <View style={{ marginTop: 10 }}>
                                    <Text style={{ fontWeight: 'bold', marginBottom: 6 }}>Fotos do bloco 6:</Text>
                                    <View style={{ flexDirection: 'row', gap: 12 }}>
                                        {answers.fotos6.map((uri, idx) => (
                                            <Image key={idx} source={{ uri }} style={styles.fotoPreview} />
                                        ))}
                                    </View>
                                </View>
                            )}
                        </View>
                    );
                })
            )}
            <TouchableOpacity
                style={styles.backBtn}
                onPress={() => navigation.navigate('Checklist')}
                activeOpacity={0.85}
            >
                <Text style={styles.backBtnText}>⟵ Voltar para Checklist</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.shareBtn, generating && { opacity: 0.7 }]}
                onPress={handleSharePdf}
                disabled={generating}
                activeOpacity={0.85}
            >
                {generating ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.shareBtnText}>Compartilhar PDF ⤓</Text>
                )}
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.shareBtn, { backgroundColor: '#25D366', marginTop: 10 }]}
                onPress={handleShareWhatsapp}
                activeOpacity={0.85}
            >
                <Text style={[styles.shareBtnText, { color: '#fff' }]}>Compartilhar com WhatsApp</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    separator: {
        height: 1,
        backgroundColor: '#e5e7eb',
        marginVertical: 8,
        borderRadius: 1,
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
    qaItem: {
        marginBottom: 10,
    },
    qaQuestion: {
        fontSize: 15,
        fontWeight: '600',
    },
    qaAnswer: {
        fontSize: 15,
        marginLeft: 8,
        marginBottom: 2,
        color: '#374151',
    },
    obs: {
        marginTop: 10,
        fontSize: 14,
        color: '#374151',
        marginBottom: 6,
    },
    fotoPreview: {
        width: 90,
        height: 90,
        borderRadius: 10,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    backBtn: {
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 10,
        borderWidth: 1.5,
        borderColor: '#2a7ae4',
        width: '100%',
        maxWidth: 340,
        alignSelf: 'center',
        shadowColor: '#2a7ae4',
        shadowOpacity: 0.06,
        shadowRadius: 2,
        elevation: 1,
    },
    backBtnText: {
        color: '#2a7ae4',
        fontWeight: 'bold',
        fontSize: 16,
        letterSpacing: 1,
    },
    shareBtn: {
        backgroundColor: '#2a7ae4',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 18,
        marginBottom: 20,
        width: '100%',
        maxWidth: 340,
        alignSelf: 'center',
        shadowColor: '#2a7ae4',
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 2,
    },
    shareBtnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 17,
        letterSpacing: 1,
    },
});
