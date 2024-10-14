# Better-Moodle
Upgrade for ESIEA ENT

## Installation ([Tuto](https://bashvlas.com/blog/install-chrome-extension-in-developer-mode))
- Download .zip [here](https://github.com/Ne4yl/Better-Moodle/archive/refs/heads/main.zip)
- Unzip the folder
- Go to : chrome://extensions
- Enable developer mode
- Click on : Load unpacked
- Select "BetterMoodle" folder
- Finish ! 

## Features 
- Login page
    - Type ("better" on login page for cool thing !)
- Pin courses 
- Timer for quiz
    - In quizz
    - Better "relecture"
        - Delete "Commencé le"
        - Delete "Etat"
        - Delete "Terminé le"
        - Add "Temps éstimé" 
        - Upgrade "Temps mis"
        - Delete "Points"
- Export dcode
    - Pivot de gauss
        - 1 matrice
        - Relation lineaire
    - Inverse
    - Determinant
        - Simple 
        - Polynôme caractéristique 

## Ideas
- Dark mode
- Next courses

## Explication des URL : 
- Origin = "https://learning.esiea.fr/"

Le login = "login/" <br>
Le tableau de bord = "my/" <br>
Pour s'inscrire a un cour = "enrol/" <br>
Cours (la racinne de tous les cours) = "course/" <br>
Quand on ouvre un pdf (en general) = "pluginfile:" <br>

## Dans un cours ("course/")
- Pour le cours (root) = "course/"
- Pour les participants = "user/"
- Pour les notes = "grade/report/user/"

### Avec le "mod/"
VPL (en algorithme) = "vpl/" <br>
Quizz = "quiz/" <br>
Presence = "attendance/" <br>
Page = "page" | Book = "book/" <br>
Ressources (dl) = "resource/" <br>

### Quiz : 
- Quand on est sur la racinne de la page = "view/"
- Quand on fait un essai = "attempt/"
- Quand on fait une relecture = "review/"

### Algo : ("https://learning.esiea.fr/course/view.php?")
- S1 = "id=323"
- S2 = "id=326"
- S3 = "id=329" ? (= algebre avancé mais pas plus d'info)

### Alèbre : ("https://learning.esiea.fr/course/view.php?")
- S1 = "id=596"
- S2 = "id=602"
- S3 = "id=608" ? (= Algèbre et Géométrie mais pas plus d'info)
