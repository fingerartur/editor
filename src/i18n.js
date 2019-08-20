import i18n from 'i18next';

/**
 * There are two ways of using i18n - translating the full English text/sentences or translating meaningful IDs.
 * 
 * The second option is better.
 * Pros:
 *  - they solve the rather common problem when one English word has
 *  two different meanings in Czech (e.g. vote -> hlas, hlasovat)
 *  - it makes it easier to slightly change the English text (just change the translation, not the key)
 *  - it is a bit easier to spot untranslated text in the GUI
 *  - the readability of the code stays the same
 * 
 * Cons:
 *  - must have an additional tranlation file for English sentences
 */

//import LanguageDetector from "i18next-browser-languagedetector";
//i18n.use(LanguageDetector)

const ENGLISH = {
    "save": "Save",
    "cancel": "\u2190 Cancel",
    "load": "Load example",
    "zoom": "zoom",
    "elements": "elements",
    "back_to_start": "Back to start",
    "generate": "Generate {{count}}",
    "error": "Error",
    "iteration_var": "Iteration variable",
    "multivalued_var": "Multi-valued variable",
    "var_name": "Variable name",
    "creating_a_new_variable": "You are creating a new variable",
    "enter_var_name": "Enter a name",
    "var_name_overshadows": "This variable name cannot be used, because it is used further in the rule already.",
    "error_expression_unfinished": "Expression is unfinished",
    "error_varname_required": "Variable name is missing",
    "error_var_overshadowing": "Please use a different variable name. (Variable overshadows existing variables)",
    "description": "Description",
    "validated": "Validated",
    "literal": "{{type}} literal",
    "operation": "{{type}} operation",
    "variable": "{{type}} variable or attribute",
    "empty_string": "nothing",
    "save_svg": "Save as SVG",
    "open": "Open",
    "rules": "Rules",
    "create_rule": "Create a new rule",
    "name": "Name",
    "save_text": "Save as text",
    "array_access": "{{type}} multi-valued variable access",
    "auto_variable": "Variable",
    "auto_array": "Multi-valued variable",
    "auto_operation": "Operation",
    "auto_literal": "Literal",
    "error_iteration_varname_required": "Iteration variable is be missing",
    "error_multivalued_variable_required": "Multi-valued variable is missing",
    "condition_unfinished": "The condition is unfinished",
    "error_iteration_varname_taken": "Iteration variable name is already taken",
    "error_expression_type_mismatch": "Type of the expression does not correspond to the type of the variable.",
    "cannot_undo": "Nothing to undo",
    "cannot_redo": "Nothing to redo",
    "validation_undeclared_var_value": "An undeclared variable is used as a value",
    "validation_redeclared_id": "Redeclaration of a variable with the same ID and name",
    "validation_redeclared_name": "Redeclaration of a variable with the same name",
    "validation_undeclared_var_assigned_to": "An undeclared variable is assigned to",
    "search": "search"
};

const CZECH = {
    "save": "Uložit",
    "cancel": "\u2190 Zpět",
    "load": "Načíst ukázkové pravidlo",
    "zoom": "zvětšení",
    "generate": "Vytvořit {{count}} příkazů",
    "elements": "příkazů",
    "back_to_start": "Zpět na začátek",
    "error": "Chyba",
    "iteration_var": "Iterační proměnná",
    "multivalued_var": "Vícehodnotová proměnná",
    "var_name": "Proměnná",
    "creating_a_new_variable": "Vytvoří se nová proměnná",
    "enter_var_name": "Zadejte název proměnné",
    "var_name_overshadows": "Tuto proměnnou nelze použít, protože se vyskytuje dále v pravidle.",
    "error_expression_unfinished": "Výraz není dokončený",
    "error_varname_required": "Chybí název proměnné",
    "error_var_overshadowing": "Použijte prosím jiný název proměnné (tento název je již dále v pravidle zabraný).",
    "description": "Popis",
    "validated": "Zvalidováno",
    "literal": "literál typu {{type}}",
    "operation": "operace typu {{type}}",
    "variable": "proměnná nebo atribut proměnné typu {{type}}",
    "array_access": "prvek proměnné typu {{type}}",
    "empty_string": "nic (prázdný text)",
    "save_svg": "Exportovat ve formátu SVG",
    "open": "Otevřít",
    "rules": "Pravidla",
    "create_rule": "Vytvořit nové pravidlo",
    "name": "Název",
    "save_text": "Exportovat v textovém formátu",
    "auto_variable": "Proměnná",
    "auto_array": "Vícehodnotná proměnná",
    "auto_operation": "Operace",
    "auto_literal": "Literál",
    "error_iteration_varname_required": "Chybí iterační proměnná",
    "error_multivalued_variable_required": "Chybí vícehodnotová proměnná",
    "condition_unfinished": "Podmínka není dokončená",
    "error_iteration_varname_taken": "Název iterační proměnné nelze použít. Koliduje s existující proměnnou.",
    "error_expression_type_mismatch": "Typ výrazu není kompatibilní s typem proměnné.",
    "cannot_undo": "Není co vrátit zpět",
    "cannot_redo": "Není co opakovat",
    "validation_undeclared_var_value": "Použití nedeklarované proměnné",
    "validation_redeclared_id": "Dvojtá deklarace proměnné (stejné ID)",
    "validation_redeclared_name": "Dvojtá deklarace proměnné (stejné jméno)",
    "validation_undeclared_var_assigned_to": "Přiřazení do nedeklarované proměnné",
    "search": "vyhledat"
};

i18n.init({
  resources: {
    en: {
      translations: ENGLISH
    },
    cz: {
      translations: CZECH
    }
  },
  fallbackLng: 'en',
  debug: true,

  // have a common namespace used around the full app
  ns: ['translations'],
  defaultNS: 'translations',

  keySeparator: false, // we use content as keys

  interpolation: {
    escapeValue: false, // not needed for react
    formatSeparator: ','
  },

  react: {
    wait: true
  }
});

export default i18n;
