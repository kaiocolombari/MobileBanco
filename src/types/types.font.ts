import { useFonts, Roboto_700Bold, Roboto_400Regular, Roboto_500Medium } from '@expo-google-fonts/roboto';
import { Sanchez_400Regular } from '@expo-google-fonts/sanchez';

export function useFontsApp() {
    const [fontsLoaded] = useFonts({
        Roboto_700Bold,
        Roboto_400Regular,
        Roboto_500Medium,
        Sanchez_400Regular,
    });

    return fontsLoaded;
}
