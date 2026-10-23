# Inspecteur de page

Outil d'audit de pages **Drupal** assisté par l'IA. Il relève les fautes, les questions de FAQ qui ne s'ouvrent pas, les liens internes cassés et les lames vides, puis situe chaque problème sur un plan de la page.

Le rapport est séparé en deux parties :
- **Pour les contributeurs** : ce qu'ils peuvent corriger eux-mêmes dans Drupal (texte, contenu des lames, réponses de FAQ).
- **À remonter à l'équipe technique** : les défauts de design propres aux lames (alignements, arrondis, polices, contrastes), fixés par le thème.

## Comment ça marche

1. **Le favori « Inspecter »** (`favori/inspecter.js`) s'exécute sur la page à auditer. Il :
   - repère les lames Drupal (classes `paragraph--type--…` et `block-…`) ;
   - relève la position, la police et la couleur de chaque élément ;
   - ouvre chaque question ou menu dépliant comme un visiteur, vérifie que la réponse s'affiche et en relève le texte, puis remet la page dans son état d'origine ;
   - vérifie les liens internes.
2. **L'application** (`index.html`) reçoit ces mesures. Elle fait ses propres contrôles fiables, puis envoie le reste à Claude, qui relit tout le texte (y compris les réponses dépliées) et confirme les défauts de design.
3. **Le rapport** affiche chaque problème avec sa lame, sa gravité, la correction proposée et des détails techniques, sur un plan redessiné de la page ou sur une capture d'écran.

## Règles d'audit

Ce qui n'est **jamais** signalé :
- les liens « # » (vers la page elle-même) ;
- les images ;
- la mise en forme du texte (gras, couleur, police ajoutée dans l'éditeur).

Les questions et menus dépliants obéissent à une règle de prudence : une question n'est signalée que si, après un clic simulé et 2,5 secondes d'attente, la page n'a réagi d'aucune façon et la réponse reste masquée. Dans le doute, elle est classée « à vérifier à la main », jamais en erreur.

Chaque point du rapport a un bouton « Ce n'est pas un problème », qui permet d'ignorer ce point ou de créer une règle « ne plus jamais signaler ». Les règles sont enregistrées dans le navigateur et transmises à l'IA.

## Utilisation

- **Sur claude.ai** (version complète) : l'outil est publié comme artefact, et l'analyse IA utilise le compte Claude de la personne qui l'ouvre.
- **En local** : ouvrir `index.html` dans un navigateur permet de consulter le rapport d'exemple et de copier le favori. L'analyse par l'IA n'est disponible que dans claude.ai.

Installer le favori : dans l'application, cliquer sur « Copier le favori », créer un favori dans le navigateur (Ctrl+D puis Modifier), le nommer *Inspecter* et coller le code à la place de l'adresse.

## Tests

- `tests/accordeons.html` : 16 variantes de questions et menus dépliants (animations lentes, CSS seul, chargement différé, déclencheurs emboîtés, ouverture au survol, cas cassés). Résultat attendu : tous les menus qui fonctionnent sont « OK », le menu au survol est « à vérifier à la main », et seuls les deux cas cassés (sans réaction, réponse vide) sont signalés.
- `tests/page-drupal-exemple.html` : page Drupal fictive avec des erreurs volontaires, qui sert au rapport d'exemple.

Pour tester : ouvrir une de ces pages et lancer le contenu de `favori/inspecter.js` dans la console du navigateur (F12).

## Réalisé avec

Conçu et développé avec Claude Opus 5.5 (Anthropic), dans le cadre d'un projet de démonstration de compétences en IA.
