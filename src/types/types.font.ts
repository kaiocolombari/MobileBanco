import { useFonts, Roboto_700Bold, Roboto_400Regular, Roboto_500Medium, Roboto_600SemiBold } from '@expo-google-fonts/roboto';
import { Sanchez_400Regular } from '@expo-google-fonts/sanchez';

export function useFontsApp() {
    const [fontsLoaded] = useFonts({
        Roboto_700Bold,
        Roboto_400Regular,
        Roboto_500Medium,
        Sanchez_400Regular,
        Roboto_600SemiBold
    });

    return fontsLoaded;
}
