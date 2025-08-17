# Componentes do Formulário de Registro

Esta pasta contém todos os componentes modulares do formulário de registro, organizados de forma a facilitar a manutenção e reutilização.

## Estrutura de Arquivos

### Componentes Principais

- **`StepIndicator.tsx`** - Indicador visual dos steps do formulário
- **`ValidatedInput.tsx`** - Input com validação e mensagens de erro
- **`AccountTypeSelector.tsx`** - Seletor de tipo de conta (corrente/poupança)
- **`FormNavigation.tsx`** - Botões de navegação entre steps

### Componentes de Steps

- **`steps/Step1PersonalData.tsx`** - Step 1: Dados pessoais (CPF, telefone, nome)
- **`steps/Step2Credentials.tsx`** - Step 2: Credenciais (email, senha)
- **`steps/Step3Address.tsx`** - Step 3: Endereço (rua, número, cidade, UF)
- **`steps/Step4Account.tsx`** - Step 4: Conta bancária (tipo, senha)

### Arquivos de Suporte

- **`index.ts`** - Arquivo de índice para facilitar importações
- **`README.md`** - Esta documentação

## Como Usar

### Importação Simples

```typescript
import {
  StepIndicator,
  ValidatedInput,
  Step1PersonalData,
  // ... outros componentes
} from "../components";
```

### Importação Individual

```typescript
import StepIndicator from "../components/StepIndicator";
import ValidatedInput from "../components/ValidatedInput";
```

## Benefícios da Modularização

1. **Manutenibilidade**: Cada componente tem uma responsabilidade específica
2. **Reutilização**: Componentes podem ser usados em outros formulários
3. **Testabilidade**: Cada componente pode ser testado isoladamente
4. **Legibilidade**: Código mais limpo e fácil de entender
5. **Escalabilidade**: Fácil adicionar novos steps ou funcionalidades

## Padrões Utilizados

- **Props Interface**: Cada componente define claramente suas props
- **TypeScript**: Tipagem forte para evitar erros em tempo de execução
- **Styled Components**: Estilos encapsulados em cada componente
- **Composition**: Componentes compostos para criar funcionalidades complexas

## Exemplo de Uso

```typescript
<Step1PersonalData
  formData={formData}
  errors={errors}
  cpfChecked={cpfChecked}
  loading={loading}
  onUpdateField={updateField}
  onCpfChange={handleCpfChange}
  onTelefoneChange={handleTelefoneChange}
/>
```
