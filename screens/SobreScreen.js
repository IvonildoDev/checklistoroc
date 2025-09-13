import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SobreScreen() {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.headerBox}>
                <Ionicons name="information-circle-outline" size={48} color="#2a7ae4" style={{ marginBottom: 8 }} />
                <Text style={styles.title}>Sobre o App</Text>
                <Text style={styles.dev}>Desenvolvido por Ivonildo Lima</Text>
            </View>
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Descrição</Text>
                <Text style={styles.text}>
                    Este aplicativo foi desenvolvido para facilitar o checklist de veículos leves, permitindo o registro digital de inspeções, geração de relatórios e compartilhamento rápido das informações.
                </Text>
            </View>
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Funcionalidades</Text>
                <Text style={styles.text}>
                    • Checklist digital de itens obrigatórios e de segurança{"\n"}
                    • Registro de periodicidade (semanal, mensal, mudança de condutor, troca de turno){"\n"}
                    • Geração de relatório em PDF{"\n"}
                    • Compartilhamento do relatório por WhatsApp{"\n"}
                    • Histórico salvo localmente
                </Text>
            </View>
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Como Usar</Text>
                <Text style={styles.text}>
                    1. Faça login com seus dados.{"\n"}
                    2. Escolha a periodicidade e preencha o checklist.{"\n"}
                    3. Salve e gere o relatório.{"\n"}
                    4. Compartilhe o relatório conforme necessário.
                </Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#f3f4f6',
        padding: 24,
        alignItems: 'center',
    },
    headerBox: {
        alignItems: 'center',
        marginBottom: 18,
        backgroundColor: '#eaf3fa',
        borderRadius: 16,
        padding: 18,
        width: '100%',
        shadowColor: '#2a7ae4',
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 2,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2a7ae4',
        marginBottom: 4,
        textAlign: 'center',
    },
    dev: {
        fontSize: 15,
        color: '#374151',
        marginBottom: 2,
        textAlign: 'center',
        fontStyle: 'italic',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 16,
        marginBottom: 16,
        width: '100%',
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 2,
        elevation: 1,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a2533',
        marginBottom: 6,
    },
    text: {
        fontSize: 15,
        color: '#374151',
        marginBottom: 2,
        lineHeight: 22,
    },
});
