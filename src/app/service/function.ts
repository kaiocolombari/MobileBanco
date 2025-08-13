import { router } from "expo-router";

async function open(action: string, params?: any) {
    try {
        switch (action) {
            case 'navegar':
                if (params === undefined) throw new Error('Navegação sem parâmetro');
                else {
                    router.push(params);
                }
                break;
            case 'limpar':
                router.replace(params);
                break;
            default:
                break;
        }
    } catch (e) {
        console.log(e);
    }

}