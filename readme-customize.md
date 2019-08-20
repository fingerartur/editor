# Customized versions
Currently there are two versions 1 and 2. To launch version 1, log in as user 1. To launch version 2, log in as user 2.

The code affected by cutomizations includes ```src/App.tsx, src/rule/RuleEditor.tsx```.


# How to write customized versions of this software
The class that loads and provides version-specific code is ```src/customizations/Customizations.ts```. It is instantiated in ```src/Login.tsx``` where customizations are loaded after user logs in and passed to ```src/App.tsx``` from where it can be passed to any part of the application.

## Version specific code
All code related to one version should be placed in ```src/customizations/[customer]```.

## Configuration files
Customizations are loaded from config files located in ```src/customizations/[customer]/config.ts```. Currently there are two:
- ```src/customizations/1/config.ts``` for customer 1
- ```src/customizations/2/config.ts``` for customer 2

## Best practices for writing customizations
All customizations should be reduced to one of the following code scenarios:
- new / changed sub-component (pass sub-component as a prop)
- new layout of an existing component (pass rendering method as a prop)
- configurations to a component (pass as a prop)
- configurations or strategies to a pure class (pass as an argument)