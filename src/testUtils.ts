/**
 * Mock of i18n props. This allows the intantiation of i18n'd components
 */
export const i18nProps = { 
    t: (text: string) => text,
    i18n: {}
};

export function simulateKeyPresses(enzymeComponent: any, characters: string) {
    for (let i = 0; i < characters.length; i++) {
        enzymeComponent.simulate('keyPress', {
            which: characters.charCodeAt(i),
            key: characters[i],
            keyCode: characters.charCodeAt(i)
        });
    }
}