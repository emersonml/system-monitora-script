import useTranslationState from '@states/TranslationState';

type EnumType =
    | 'type_price'
    | 'product_status'
    | 'document_status'
    | 'fee'
    | 'payment_method'
    | 'plan_status'
    | 'project_status'
    | 'task_status'
    | 'project_user_role'
    | 'period_date'
    | 'list_priority'
    | 'proce_status'
    | 'gender_types'
    | 'sexual_orientation_types'
    | 'schooling_levels'
    | 'etnia_types'
    | 'system_types'
    | 'civil_state'
    | 'status_have_procedure'
    | 'team_user_role';

export type Enumerate = {
    list: (enumType: EnumType) => { value: string; label: string; color?: string }[];
    get: (enumType: EnumType, value: string) => string;
    getColor: (enumType: EnumType, value: string) => { value: string; label: string; color?: string };
};

export default function useEnumerate(): Enumerate {
    const { translation } = useTranslationState();

    const list = (enumType: EnumType) => {
        switch (enumType) {
            case 'type_price':
                return [
                    { value: 'default', label: translation('Padrão') },
                    { value: 'm2', label: translation('Preço m²') },
                    { value: 'cm2', label: translation('Preço cm²') },
                    { value: 'editable', label: translation('Preço editável') }
                ];

            case 'product_status':
                return [
                    { value: 'public', label: translation('Público') },
                    { value: 'private', label: translation('Privado') },
                    { value: 'draft', label: translation('Rascunho') },
                    { value: 'pending', label: translation('Pendente') }
                ];

            case 'document_status':
                return [
                    { value: 'published', label: translation('Publicado'), color: '#92d050' },
                    { value: 'draft', label: translation('Rascunho'), color: '#ea4335' }
                ];

            case 'fee':
                return [
                    { value: 'discount', label: translation('Desconto') },
                    { value: 'addTax', label: translation('Acréscimo de imposto/taxa') },
                    { value: 'subTax', label: translation('Dedução de imposto/taxa') }
                ];

            case 'payment_method':
                return [
                    { value: 'money', label: translation('Dinheiro') },
                    { value: 'check', label: translation('Cheque') },
                    { value: 'card', label: translation('Cartão') },
                    { value: 'deposit', label: translation('Depósito') },
                    { value: 'transfer', label: translation('Transferência') },
                    { value: 'billet', label: translation('Boleto') }
                ];

            case 'plan_status':
                return [
                    { value: 'on_hold', label: translation('Em espera') },
                    { value: 'running', label: translation('Em execução') },
                    { value: 'completed', label: translation('Concluído') },
                    { value: 'cancelled', label: translation('Cancelado') }
                ];

            case 'project_status':
                return [
                    { value: 'on_hold', label: translation('Em espera') },
                    { value: 'running', label: translation('Em execução') },
                    { value: 'completed', label: translation('Concluído') },
                    { value: 'cancelled', label: translation('Cancelado') }
                ];

            case 'task_status':
                return [
                    { value: 'on_hold', label: translation('Em espera') },
                    { value: 'running', label: translation('Em execução') },
                    { value: 'completed', label: translation('Concluído') },
                    { value: 'cancelled', label: translation('Cancelado') }
                ];

            case 'project_user_role':
                return [
                    { value: 'manager', label: translation('Gerente') },
                    { value: 'member', label: translation('Membro') },
                    { value: 'observer', label: translation('Observador') }
                ];

            case 'team_user_role':
                return [
                    { value: 'manager', label: translation('Chefe') },
                    { value: 'member', label: translation('Agente') },
                    { value: 'observer', label: translation('Escrivão') }
                ];

            case 'period_date':
                return [
                    { value: 'today', label: translation('Hoje') },
                    { value: 'week', label: translation('Esta semana') },
                    { value: 'month', label: translation('Este mês') },
                    { value: 'year', label: translation('Este ano') },
                    { value: 'custom', label: translation('Personalizado') }
                ];

            case 'list_priority':
                return [
                    { value: '3', label: translation('Alta Prioridade'), color: '#ea4335' },
                    { value: '2', label: translation('Média Prioridade'), color: '#eaae35' },
                    { value: '1', label: translation('Baixa Prioridade'), color: '#92d050' }
                ];

            case 'proce_status':
                return [
                    { value: 'instituted', label: translation('Instaurado') },
                    { value: 'completed', label: translation('Concluído') },
                    { value: 'referred', label: translation('Remetido') },
                    { value: 'cancelled', label: translation('Arquivado') }
                ];

            case 'gender_types':
                return [
                    { value: 'masculine', label: translation('Masculino') },
                    { value: 'feminine', label: translation('Feminino') },
                    { value: 'intersexo', label: translation('Intersexo') },
                    { value: 'others', label: translation('Outros') }
                ];

            case 'sexual_orientation_types':
                return [
                    { value: 'heterossexual', label: translation('Heterossexual') },
                    { value: 'homossexual', label: translation('Homossexual') },
                    { value: 'bissexualidade', label: translation('Bissexualidade') },
                    { value: 'assexual', label: translation('Assexual') },
                    { value: 'others', label: translation('Outros') }
                ];

            case 'etnia_types':
                return [
                    { value: 'white', label: translation('Branco(a)') },
                    { value: 'black', label: translation('Negro(a)') },
                    { value: 'brown', label: translation('Pardo(a)') },
                    { value: 'indigenous', label: translation('Indígena') },
                    { value: 'yellow', label: translation('Amarelo(a)') },
                    { value: 'others', label: translation('Outros') }
                ];

            case 'schooling_levels':
                return [
                    { value: 'elementaryIncompleted', label: translation('Fundamental incompleto') },
                    { value: 'elementaryCompleted', label: translation('Fundamental completo') },
                    { value: 'mediumIncompleted', label: translation('Ensino médio incompleto') },
                    { value: 'mediumCompleted', label: translation('Ensino médio completo') },
                    { value: 'higherIncomplete', label: translation('Superior incompleto') },
                    { value: 'higherCompleted', label: translation('Superior completo') },
                    { value: 'others', label: translation('Outros') }
                ];

            case 'system_types':
                return [
                    { value: 'SISPOL', label: translation('SISPOL') },
                    { value: 'PPE', label: translation('PPE') }
                ];

            case 'civil_state':
                return [
                    { value: 'single', label: translation('Solteiro(a)') },
                    { value: 'married', label: translation('Casado(a)') },
                    { value: 'separate', label: translation('Separado(a)') },
                    { value: 'divorced', label: translation('Divorciado(a)') },
                    { value: 'widower', label: translation('Viúvo(a)') },
                    { value: 'others', label: translation('Outros') }
                ];

            case 'status_have_procedure':
                return [
                    { value: 'have', label: translation('Possuí procedimento') },
                    { value: 'noHave', label: translation('Sem procedimentos') }
                ];

            default:
                return null;
        }
    };

    const get = (enumType: EnumType, value: string) => list(enumType).find(item => item.value == value)?.label || '';
    const getColor = (enumType: EnumType, value: string) => list(enumType).find(item => item.value == value);

    return { list, get, getColor };
}
