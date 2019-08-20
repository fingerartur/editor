-anonymized- UX test - stará vs. nová verze

Část 1: Projděte všechny úkoly a vyzkoušejte je udělat v nové i staré verzi -anonymized-u, tím se s nástrojem seznámíte. Nezapomeňte využít různé zlepšováky (Ctrl+C, Ctrl+V, Ctrl+Z, Ctrl+Shift+Z, autocomplete…). Na tuto část není žádný časový limit.

Část 2: Proveďte všechny úkoly ve staré verzi a u každého si měřte a zaznamenejte čas. Pak vyplňte dotazník.

Část 3: Proveďte všechny úkoly v nové verzi a u každého si měřte a zaznamenejte čas. Pak vyplňte dotazník 2. Naměřené časy z obou částí přepište do této tabulky.

1. Úkol - jednoduchý algoritmus

Vytvořte nové pravidlo zvané "úkol 1" s popisem "počítá kolik položek je v dokumentu".

Count: real = 0;
Foreach (item: Goods Item in JSD.Goods Item) {
    Count = count + 1;
}
2. Úkol - výraz
Vytvořte nové pravidlo znavé "úkol 2", které obsahuje jen jeden příkaz:

```
X: real = ((1+2)*2 - 7) * 12
```

Uložte hotové pravidlo. (Pravidlo nemažte, použije se znovu v následujícím příkladu).
3. Úkol - copy & paste
Otevřte pravidlo "úkol 2" přidejte dosazení do proměnné y. Nápověda: použijte copy + paste (Ctrl+C, Ctrl+V).

```
X: real = ((1+2)*2 - 7) * 12
Y: real = ((1+2)*2 - 66) * 12
```

4. Úkol - práce s dokumentem
Vytvořte nové pravidlo s příkazy:

```
X: int[] = JSD.GOODS ITEM.TAXES.Tarif measure units
Y: string = JSD.TECHNICAL INFORMATION.Customs place
```

5. Úkol - větší algoritmus
Vytvořte nové pravidlo s příkazy:

```
A: int = 0;
B: int = 1;
C: int = 2;
If (A < B) {
If (A < 2 * B) {
	C = A + 7;
}	
} else {
	D: int = 10;
}
```
Smažte C:int = 2, opravte vzniklé chyby a pak přidejte dosazení do X:
```
A: int = 0;
B: int = 1;
If (A < B) {
If (A < 2 * B) {
	X = A + 7;
}	
} else {
	D: int = 10;
}
```

6. Úkol - orientace ve velkém pravidle

Otevřte pravidlo “Předpřipravený úkol 6”. Najděte příkaz “If date is after tomorrow” a “If customs officer number is 007”. Druhý z těchto příkazů přeneste pod první (tak aby se vykonal hned po něm).
Nápověda: použijte přetažení nebo cut/paste  (Ctrl+X, Ctrl+V).

Návod pro starou verzi:
Zkopírujte si předpřipravené pravidlo k sobě:
Working > 1000 - Working > ArFi > pokus1 > Current version > Rules > Predpripraveny ukol 6 > copy as text
Vytvořte pravidlo “úkol 6” > text > vložit > saved

Serializovaná verze pravidla “Předpřipravený úkol 6” je [zde](mockData/rule6.json)