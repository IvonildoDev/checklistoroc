


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
            { label: '1. Nível de óleo', name: 'q1' },
            { label: '2. Nível fluido de freio', name: 'q2' },
            { label: '3. Nível de água do radiador', name: 'q3' },
        ],
        obs: 'obs1',
    },
    {
        title: 'Bloco 2',
        questions: [
            { label: '4. Freio de pé', name: 'q4' },
            { label: '5. Freio de estacionamento', name: 'q5' },
            { label: '6. Motor de partida', name: 'q6' },
            { label: '7. Limpador de para-brisa', name: 'q7' },
            { label: '8. Lavador de para-brisa', name: 'q8' },
            { label: '9. Buzina', name: 'q9' },
            { label: '10. Faróis', name: 'q10' },
            { label: '11. Faróis dianteiros (seta)', name: 'q11' },
            { label: '12. Lanternas traseiras (seta)', name: 'q12' },
            { label: '13. Luz de freio', name: 'q13' },
            { label: '14. Luz de ré', name: 'q14' },
            { label: '15. Luz da placa', name: 'q15' },
            { label: '16. Indicadores de painel', name: 'q16' },
            { label: '17. Cinto de segurança', name: 'q17' },
            { label: '18. Fechamento de janelas', name: 'q18' },
        ],
        obs: 'obs2',
    },
    {
        title: 'Bloco 3',
        questions: [
            { label: '19. Condições dos pneus', name: 'q19' },
            { label: '20. Pneu estepe', name: 'q20' },
        ],
        obs: 'obs3',
    },
    {
        title: 'Bloco 4',
        questions: [
            { label: '21. Triângulo de advertência', name: 'q21' },
            { label: '22. Macaco', name: 'q22' },
            { label: '23. Chave de roda', name: 'q23' },
        ],
        obs: 'obs4',
    },
    {
        title: 'Bloco 5',
        questions: [
            { label: '24. Vidros', name: 'q24' },
            { label: '25. Portas', name: 'q25' },
            { label: '26. Para-choque dianteiro', name: 'q26' },
            { label: '27. Para-choque traseiro', name: 'q27' },
            { label: '28. Lataria', name: 'q28' },
            { label: '29. Espelhos retrovisores', name: 'q29' },
        ],
        obs: 'obs5',
    },
    {
        title: 'Bloco 6',
        questions: [
            { label: '30. Habilitação em dia', name: 'q30' },
            { label: '31. Manutenção preventiva em dias', name: 'q31' },
            { label: '32. O veículo possui vazamentos', name: 'q32' },
        ],
        obs: 'obs6',
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

    //

    // Gera HTML do relatório para PDF
    function generateHtml() {
        let html = `
                <div style="border:2px solid #1e40af;border-radius:12px;padding:0 0 8px 0;margin-bottom:18px;background:#f8fafc;box-shadow:0 2px 8px #0001;">
                    <table style='width:100%;border-collapse:collapse;font-size:13px;'>
                        <tr>
                            <td rowspan='3' style='width:110px;padding:10px 16px 10px 10px;'>
                                <img src='https://raw.githubusercontent.com/IvonildoDev/checklistoroc/main/assets/logoperbras.png' alt='PERBRAS' style='height:48px;object-fit:contain;display:block;margin:auto;'/>
                            </td>
                            <td colspan='2' style='text-align:center;font-weight:700;font-size:15px;color:#1e293b;padding:8px 0 2px 0;letter-spacing:1px;'>SISTEMA DE GESTÃO</td>
                            <td style='text-align:right;font-size:12px;padding:8px 12px 2px 4px;'><b>Código:</b> <span style='color:#1e40af'>PS-008</span></td>
                        </tr>
                        <tr>
                            <td colspan='2' style='text-align:center;padding:2px 0;font-size:13px;color:#334155;'>
                                <span style='font-weight:600;'>ANEXO 02 - CONTROLE E CONDUÇÃO DE VEÍCULOS PRÓPRIOS OU CONTRATADOS</span><br/>
                                <span style='font-weight:700;font-size:14px;color:#1e40af;'>CHECK LIST VEÍCULO LEVE</span>
                            </td>
                            <td style='text-align:right;font-size:12px;padding:2px 12px 2px 4px;'><b>Data:</b> <span style='color:#1e40af'>27/08/2025</span></td>
                        </tr>
                        <tr>
                            <td colspan='2'></td>
                            <td style='text-align:right;font-size:12px;padding:2px 12px 8px 4px;'><b>Revisão:</b> <span style='color:#1e40af'>00</span><br/><b>Página:</b> <span style='color:#1e40af'>1 de 1</span></td>
                        </tr>
                    </table>
                </div>
                <h2 style='text-align:center;font-size:20px;color:#1e293b;margin-bottom:10px;margin-top:0;font-weight:800;letter-spacing:1px;'>Relatório do Checklist Veículo leve</h2>`;
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
                            {block.questions.map((q, idx) => {
                                const answer = answers[q.name] || 'Não respondido';
                                const isAlert = alerta.includes(answer);
                                const color = answer === 'Não respondido' ? '#dc2626' : isAlert ? '#dc2626' : '#1a2533';
                                return (
                                    <View key={q.name} style={styles.qaItem}>
                                        <Text style={[styles.qaQuestion, { color }]}>{q.label}</Text>
                                        <Text style={styles.qaAnswer}>{answer}</Text>
                                        {idx < block.questions.length - 1 && <View style={styles.separator} />}
                                    </View>
                                );
                            })}
                            {/* Observação do bloco */}
                            {answers[block.obs] ? (
                                <Text style={styles.obs}><Text style={{ fontWeight: 'bold' }}>Observações:</Text> {answers[block.obs]}</Text>
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
