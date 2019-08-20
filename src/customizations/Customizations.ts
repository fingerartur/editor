import { Customization } from './Customization';

declare type CustomizationMap = Map<Customization, any>;

export class Customizations {
    /**
     * Customizations are stored in /src/customizations/[customer id]
     */
    static async loadCustomizationsFor(customerId: string): Promise<Customizations> {
        const configModule = await import ('./' + customerId + '/config.ts'); // webpack code-split
        return new Customizations(configModule.config);
    }

    constructor(
        private customizations: CustomizationMap
    ) {}

    get(key: Customization, defaultPieceOfCode?: any): any {
        let pieceOfCode = this.customizations.get(key);
        if (pieceOfCode === undefined) {
            pieceOfCode = defaultPieceOfCode;
        }
        return pieceOfCode;
    } 
}
