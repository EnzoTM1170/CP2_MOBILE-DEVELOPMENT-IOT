import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Image,
  Button,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function App() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [tema, setTema] = useState('escuro');
  const [historico, setHistorico] = useState([]);
  
  // Formulário 1: Dados do Usuário
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [emailUsuario, setEmailUsuario] = useState('');
  
  // Formulário 2: Configurações da Calculadora
  const [precisaoDecimal, setPrecisaoDecimal] = useState('2');

  const temas = {
    escuro: {
      background: '#1a1a1a',
      display: '#2d2d2d',
      textDisplay: '#ffffff',
      button: '#4a4a4a',
      buttonText: '#ffffff',
      operator: '#ff9500',
    },
    claro: {
      background: '#f5f5f5',
      display: '#ffffff',
      textDisplay: '#000000',
      button: '#e0e0e0',
      buttonText: '#000000',
      operator: '#4CAF50',
    },
  };

  const temaAtual = temas[tema];

  const handleNumber = (num) => {
    if (display === '0' || display === 'Erro') {
      setDisplay(num.toString());
    } else {
      setDisplay(display + num);
    }
  };

  const handleOperation = (op) => {
    setPreviousValue(parseFloat(display));
    setOperation(op);
    setDisplay('0');
  };

  const handleEquals = () => {
    const current = parseFloat(display);
    const previous = previousValue;
    let result;

    if (previous === null || operation === null) return;

    switch (operation) {
      case '+':
        result = previous + current;
        break;
      case '-':
        result = previous - current;
        break;
      case '*':
        result = previous * current;
        break;
      case '/':
        if (current === 0) {
          Alert.alert(
            'Erro de Operação',
            'Divisão por zero não é permitida!',
            [{ text: 'OK' }]
          );
          setDisplay('Erro');
          setPreviousValue(null);
          setOperation(null);
          return;
        }
        result = previous / current;
        break;
      default:
        return;
    }

    // Aplicar precisão decimal
    const precisao = parseInt(precisaoDecimal);
    result = parseFloat(result.toFixed(precisao));

    const operacao = `${previous} ${operation} ${current} = ${result}`;
    setHistorico([operacao, ...historico.slice(0, 9)]);
    setDisplay(result.toString());
    setPreviousValue(null);
    setOperation(null);
  };

  const handleClear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
  };

  const limparHistorico = () => {
    Alert.alert(
      'Confirmar',
      'Deseja limpar todo o histórico?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Limpar', onPress: () => setHistorico([]) },
      ]
    );
  };

  const salvarPerfil = () => {
    if (nomeUsuario && emailUsuario) {
      Alert.alert('Sucesso', `Perfil de ${nomeUsuario} salvo!`);
    } else {
      Alert.alert('Atenção', 'Preencha todos os campos do formulário!');
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: temaAtual.background }]}>
      {/* Image - Logo da Calculadora */}
      <View style={styles.header}>
        <Image
          source={{
            uri: 'https://cdn-icons-png.flaticon.com/512/4807/4807989.png',
          }}
          style={styles.logo}
        />
        <Text style={[styles.title, { color: temaAtual.textDisplay }]}>
          Calculadora Pro
        </Text>
      </View>

      {/* FORMULÁRIO 1: Dados do Usuário */}
      <View style={[styles.formContainer, { backgroundColor: temaAtual.display }]}>
        <Text style={[styles.formTitle, { color: temaAtual.textDisplay }]}>
          📝 Formulário 1: Dados do Usuário
        </Text>

        <Text style={[styles.label, { color: temaAtual.textDisplay }]}>Nome:</Text>
        <TextInput
          style={[styles.input, {
            backgroundColor: temaAtual.background,
            color: temaAtual.textDisplay,
            borderColor: temaAtual.button,
          }]}
          placeholder="Digite seu nome"
          placeholderTextColor="#888"
          value={nomeUsuario}
          onChangeText={setNomeUsuario}
        />

        <Text style={[styles.label, { color: temaAtual.textDisplay }]}>Email:</Text>
        <TextInput
          style={[styles.input, {
            backgroundColor: temaAtual.background,
            color: temaAtual.textDisplay,
            borderColor: temaAtual.button,
          }]}
          placeholder="Digite seu email"
          placeholderTextColor="#888"
          keyboardType="email-address"
          value={emailUsuario}
          onChangeText={setEmailUsuario}
        />

        <Button title="Salvar Perfil" onPress={salvarPerfil} color="#4CAF50" />
      </View>

      {/* FORMULÁRIO 2: Configurações da Calculadora */}
      <View style={[styles.formContainer, { backgroundColor: temaAtual.display }]}>
        <Text style={[styles.formTitle, { color: temaAtual.textDisplay }]}>
          ⚙️ Formulário 2: Configurações
        </Text>

        <Text style={[styles.label, { color: temaAtual.textDisplay }]}>
          Tema da Calculadora:
        </Text>
        <View style={[styles.pickerContainer, { backgroundColor: temaAtual.background }]}>
          <Picker
            selectedValue={tema}
            onValueChange={(itemValue) => setTema(itemValue)}
            style={{ color: temaAtual.textDisplay }}>
            <Picker.Item label="🌙 Tema Escuro" value="escuro" />
            <Picker.Item label="☀️ Tema Claro" value="claro" />
          </Picker>
        </View>

        <Text style={[styles.label, { color: temaAtual.textDisplay }]}>
          Casas Decimais:
        </Text>
        <View style={[styles.pickerContainer, { backgroundColor: temaAtual.background }]}>
          <Picker
            selectedValue={precisaoDecimal}
            onValueChange={(itemValue) => setPrecisaoDecimal(itemValue)}
            style={{ color: temaAtual.textDisplay }}>
            <Picker.Item label="0 casas decimais" value="0" />
            <Picker.Item label="1 casa decimal" value="1" />
            <Picker.Item label="2 casas decimais" value="2" />
            <Picker.Item label="3 casas decimais" value="3" />
            <Picker.Item label="4 casas decimais" value="4" />
          </Picker>
        </View>
      </View>

      {/* Display da Calculadora */}
      <View style={[styles.displayContainer, { backgroundColor: temaAtual.display }]}>
        <Text style={[styles.displayText, { color: temaAtual.textDisplay }]}>
          {display}
        </Text>
      </View>

      {/* Botões da Calculadora usando TouchableOpacity */}
      <View style={styles.buttonsContainer}>
        {/* Linha 1 */}
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: temaAtual.button }]}
            onPress={handleClear}>
            <Text style={[styles.buttonText, { color: temaAtual.buttonText }]}>C</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: temaAtual.button }]}
            onPress={() => setDisplay(display.slice(0, -1) || '0')}>
            <Text style={[styles.buttonText, { color: temaAtual.buttonText }]}>⌫</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: temaAtual.button }]}
            onPress={() => setDisplay((parseFloat(display) / 100).toString())}>
            <Text style={[styles.buttonText, { color: temaAtual.buttonText }]}>%</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: temaAtual.operator }]}
            onPress={() => handleOperation('/')}>
            <Text style={[styles.buttonText, { color: '#fff' }]}>÷</Text>
          </TouchableOpacity>
        </View>

        {/* Linha 2 */}
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: temaAtual.button }]}
            onPress={() => handleNumber(7)}>
            <Text style={[styles.buttonText, { color: temaAtual.buttonText }]}>7</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: temaAtual.button }]}
            onPress={() => handleNumber(8)}>
            <Text style={[styles.buttonText, { color: temaAtual.buttonText }]}>8</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: temaAtual.button }]}
            onPress={() => handleNumber(9)}>
            <Text style={[styles.buttonText, { color: temaAtual.buttonText }]}>9</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: temaAtual.operator }]}
            onPress={() => handleOperation('*')}>
            <Text style={[styles.buttonText, { color: '#fff' }]}>×</Text>
          </TouchableOpacity>
        </View>

        {/* Linha 3 */}
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: temaAtual.button }]}
            onPress={() => handleNumber(4)}>
            <Text style={[styles.buttonText, { color: temaAtual.buttonText }]}>4</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: temaAtual.button }]}
            onPress={() => handleNumber(5)}>
            <Text style={[styles.buttonText, { color: temaAtual.buttonText }]}>5</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: temaAtual.button }]}
            onPress={() => handleNumber(6)}>
            <Text style={[styles.buttonText, { color: temaAtual.buttonText }]}>6</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: temaAtual.operator }]}
            onPress={() => handleOperation('-')}>
            <Text style={[styles.buttonText, { color: '#fff' }]}>−</Text>
          </TouchableOpacity>
        </View>

        {/* Linha 4 */}
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: temaAtual.button }]}
            onPress={() => handleNumber(1)}>
            <Text style={[styles.buttonText, { color: temaAtual.buttonText }]}>1</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: temaAtual.button }]}
            onPress={() => handleNumber(2)}>
            <Text style={[styles.buttonText, { color: temaAtual.buttonText }]}>2</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: temaAtual.button }]}
            onPress={() => handleNumber(3)}>
            <Text style={[styles.buttonText, { color: temaAtual.buttonText }]}>3</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: temaAtual.operator }]}
            onPress={() => handleOperation('+')}>
            <Text style={[styles.buttonText, { color: '#fff' }]}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Linha 5 */}
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.buttonWide, { backgroundColor: temaAtual.button }]}
            onPress={() => handleNumber(0)}>
            <Text style={[styles.buttonText, { color: temaAtual.buttonText }]}>0</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: temaAtual.button }]}
            onPress={() => {
              if (!display.includes('.')) {
                setDisplay(display + '.');
              }
            }}>
            <Text style={[styles.buttonText, { color: temaAtual.buttonText }]}>.</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: temaAtual.operator }]}
            onPress={handleEquals}>
            <Text style={[styles.buttonText, { color: '#fff' }]}>=</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Histórico de Operações */}
      <View style={[styles.historicoContainer, { backgroundColor: temaAtual.display }]}>
        <Text style={[styles.formTitle, { color: temaAtual.textDisplay }]}>
          📋 Histórico de Operações
        </Text>
        {historico.length === 0 ? (
          <Text style={[styles.historicoEmpty, { color: '#888' }]}>
            Nenhuma operação realizada
          </Text>
        ) : (
          <>
            {historico.map((item, index) => (
              <Text key={index} style={[styles.historicoItem, { color: temaAtual.textDisplay }]}>
                • {item}
              </Text>
            ))}
            <View style={{ marginTop: 10 }}>
              <Button title="Limpar Histórico" onPress={limparHistorico} color="#d32f2f" />
            </View>
          </>
        )}
      </View>

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: temaAtual.textDisplay }]}>
          Desenvolvido com React Native 💙
        </Text>
        <Text style={[styles.footerText, { color: temaAtual.textDisplay }]}>
          Checkpoint 2 - Calculadora Estilizada
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  logo: {
    width: 70,
    height: 70,
    marginBottom: 10,
    borderRadius: 35,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  formContainer: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 8,
  },
  input: {
    padding: 10,
    borderRadius: 8,
    fontSize: 15,
    marginBottom: 12,
    borderWidth: 1,
  },
  pickerContainer: {
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
  },
  displayContainer: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    minHeight: 80,
    justifyContent: 'center',
    alignItems: 'flex-end',
    elevation: 4,
  },
  displayText: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  buttonsContainer: {
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  button: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginHorizontal: 4,
    elevation: 3,
  },
  buttonWide: {
    flex: 2,
    aspectRatio: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginHorizontal: 4,
    elevation: 3,
  },
  buttonText: {
    fontSize: 24,
    fontWeight: '600',
  },
  historicoContainer: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    maxHeight: 250,
    elevation: 3,
  },
  historicoItem: {
    fontSize: 13,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  historicoEmpty: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 15,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 12,
    fontStyle: 'italic',
    marginVertical: 2,
  },
});