# Inspecteur de page

Outil d'audit de pages **Drupal** assisté par l'IA, aux couleurs de la charte Harmonie Mutuelle 2026, avec un motion design sobre (désactivé quand le système demande de réduire les animations). Il relève les fautes, les questions de FAQ qui ne s'ouvrent pas, les liens internes cassés et les lames vides, puis situe chaque problème sur un plan de la page.

Le rapport est séparé en deux parties :
- **Pour les contributeurs** : ce qu'ils peuvent corriger eux-mêmes dans Drupal (texte, contenu des lames, réponses de FAQ).
- **À remonter à l'équipe technique** : les défauts de design propres aux lames (alignements, arrondis, polices, contrastes), fixés par le thème.

## Deux façons de l'utiliser

| | Dans Claude | Sur GitHub Pages |
|---|---|---|
| Adresse | lien de l'artefact claude.ai | https://pg7098l.github.io/analyseur/ |
| Compte nécessaire | un compte Claude | aucun |
| Contrôles automatiques (questions, liens, lames, titres) | oui | oui |
| Relecture du texte par l'IA | oui, avec le compte Claude | oui si une clé API Anthropic est saisie, sinon non |

### Version GitHub Pages
1. Dans le dépôt : *Settings → Pages*, source « Deploy from a branch », branche `main`, dossier `/ (root)`.
2. L'outil est alors accessible à l'adresse https://pg7098l.github.io/analyseur/.
3. Sans clé, l'audit fait tous les contrôles automatiques et donne une note calculée à partir de ces seuls contrôles.
4. Pour la relecture du texte, saisir une **clé API Anthropic** (à demander au service informatique, ou à créer sur console.anthropic.com). Elle est envoyée uniquement à l'API d'Anthropic, depuis le navigateur, et n'est mémorisée dans ce navigateur que si la case est cochée. Chaque audit est facturé sur le compte associé à la clé. Ne jamais écrire une clé dans le code ni la commiter.
5. Si le réseau de l'entreprise bloque l'accès à `api.anthropic.com`, l'outil le signale ; l'audit sans IA reste possible.

## Comment ça marche

1. **Le favori « Inspecter »** (`favori/inspecter.js`) s'exécute sur la page à auditer. Il :
   - repère les lames Drupal (classes `paragraph--type--…` et `block-…`) ;
   - relève la position, la police et la couleur de chaque élément ;
   - ouvre chaque question ou menu dépliant comme un visiteur, vérifie que la réponse s'affiche et en relève le texte, puis remet la page dans son état d'origine ;
   - vérifie les liens internes.
2. **L'application** (`index.html`) reçoit ces mesures. Elle fait ses propres contrôles fiables, puis envoie le reste à Claude, qui relit tout le texte (y compris les réponses dépliées) et confirme les défauts de design.
3. **Le rapport** affiche chaque problème avec sa lame, sa gravité, la correction proposée et des détails techniques, sur un plan redessiné de la page ou sur une capture d'écran.

Installer le favori : dans l'application, cliquer sur « Copier le favori », créer un favori dans le navigateur (Ctrl+D puis Modifier), le nommer *Inspecter* et coller le code à la place de l'adresse.

## Ce que le favori récupère

Un clic sur le favori produit un texte qui commence par `INSPECTEUR:`, suivi de données au format JSON : une « photographie chiffrée » de la page telle qu'elle s'affiche dans le navigateur.

| Donnée | Contenu |
|---|---|
| `el` | chaque élément visible : position et taille en pixels, police, taille, graisse, couleurs, texte, lame d'appartenance |
| `lames` | les lames Drupal repérées : type, emplacement, vide ou non |
| `heads` | les titres H1 à H6 |
| `inter` | le test de chaque question ou menu dépliant : résultat (`ok`, `rien`, `vide`, `incertain`), explication et texte de la réponse |
| `links` | les liens internes cassés et les liens en http |
| `text` | le texte complet de la page |

Le favori ne l'envoie nulle part : il le copie dans le presse-papiers. Les données ne partent vers l'IA qu'au lancement de l'audit. Le favori n'interroge que les pages du site lui-même, pour vérifier les liens internes.

## Règles d'audit

Ce qui n'est **jamais** signalé :
- les liens « # » (vers la page elle-même) ;
- les images ;
- la mise en forme du texte (gras, couleur, police ajoutée dans l'éditeur) ;
- les espaces autour de la ponctuation (avant ou après . , ; : ! ? « ») ;
- les majuscules après deux-points ;
- les âges d'accès qui semblent incohérents entre eux.

Ces exclusions sont données à l'IA et appliquées une seconde fois à sa réponse, par un filtre.

Les questions et menus dépliants obéissent à une règle de prudence : une question n'est signalée que si, après un clic simulé et 2,5 secondes d'attente, la page n'a réagi d'aucune façon et la réponse reste masquée. Dans le doute, elle est classée « à vérifier à la main », jamais en erreur.

Chaque point du rapport a un bouton « Ce n'est pas un problème », qui permet d'ignorer ce point ou de créer une règle « ne plus jamais signaler ». Les règles sont enregistrées dans le navigateur et transmises à l'IA.

## Tests

- `tests/accordeons.html` : 16 variantes de questions et menus dépliants (animations lentes, CSS seul, chargement différé, déclencheurs emboîtés, ouverture au survol, cas cassés). Résultat attendu : tous les menus qui fonctionnent sont « OK », le menu au survol est « à vérifier à la main », et seuls les deux cas cassés (sans réaction, réponse vide) sont signalés.
- `tests/page-drupal-exemple.html` : page Drupal fictive avec des erreurs volontaires, qui sert au rapport d'exemple.

Pour tester : ouvrir une de ces pages et lancer le contenu de `favori/inspecter.js` dans la console du navigateur (F12).

## Réalisé avec

Conçu et développé avec Claude Opus 5.5 (Anthropic), dans le cadre d'un projet de démonstration de compétences en IA.
