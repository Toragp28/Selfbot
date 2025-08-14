# Selfbot
Framework de Selfbot Discord
Un framework puissant et personnalisable pour créer des selfbots Discord avec discord.js-selfbot-v13. Ce projet permet d'automatiser des tâches, d'exécuter des commandes personnalisées et de gérer plusieurs comptes selfbot facilement. Il est conçu pour les développeurs souhaitant créer leur propre selfbot Discord avec une gestion modulaire des commandes et une robuste gestion des erreurs.

Table des matières

Fonctionnalités
Prérequis
Installation
Configuration
Utilisation
Créer des commandes
Dépannage
Notes importantes
Contribuer
Avertissement


Fonctionnalités

Support multi-comptes : Lancez plusieurs selfbots simultanément à l'aide d'un fichier tokens.txt.
Système de commandes modulaire : Ajoutez, supprimez ou modifiez facilement des commandes dans le dossier commands.
Gestion des erreurs : Gestion robuste des erreurs pour l'exécution des commandes et les connexions des clients.
Préfixe personnalisable : Configurez le préfixe des commandes (par défaut : !).
Variables d'environnement : Gérez les tokens et les paramètres en toute sécurité avec .env.
Arrêt propre : Terminez les selfbots de manière sécurisée en cas d'interruption (par exemple, Ctrl+C).


Prérequis
Avant d'installer et d'exécuter le selfbot, assurez-vous d'avoir :

Node.js (version 16.9.0 ou supérieure)
npm (gestionnaire de paquets Node)
Un token utilisateur Discord valide (pas un token de bot)
Des connaissances de base en JavaScript et sur l'écosystème Discord
Un éditeur de texte (par exemple, VS Code)


Avertissement : L'utilisation de selfbots est contraire aux Conditions d'utilisation de Discord. Utilisez ce framework à vos propres risques. Le développeur n'est pas responsable des conséquences, y compris les bannissements de compte.


Installation
Suivez ces étapes pour configurer le framework de selfbot sur votre machine :

Cloner le dépôtClonez ou téléchargez ce projet sur votre machine :
git clone https://github.com/votre_nom_utilisateur/discord-selfbot-framework.git
cd discord-selfbot-framework


Installer les dépendancesInstallez les paquets Node.js requis :
npm install discord.js-selfbot-v13 dotenv fs path


Créer un fichier .envDans le dossier racine du projet, créez un fichier .env pour stocker les configurations spécifiques (si nécessaire). Exemple :
# Optionnel : Ajoutez des variables d'environnement ici
# Exemple : PREFIX=!


Configurer les tokensCréez un fichier tokens.txt dans le dossier racine et ajoutez vos tokens utilisateur Discord, un par ligne. Exemple :
votre_token_utilisateur_discord_ici
un_autre_token_utilisateur_discord_ici


Comment obtenir votre token :  

Ouvrez Discord dans un navigateur, connectez-vous et ouvrez les outils de développement (F12).  
Allez à l'onglet "Réseau", filtrez par xhr, et envoyez un message.  
Trouvez une requête (par exemple, vers /messages) et vérifiez l'en-tête Authorization pour votre token.  
Ne partagez jamais votre token publiquement !



Créer un dossier de commandesLe framework crée automatiquement un dossier commands s'il n'existe pas. Vous pouvez y ajouter vos fichiers de commandes personnalisées (voir Créer des commandes).



Configuration
Le selfbot est préconfiguré avec des paramètres par défaut, mais vous pouvez personnaliser les éléments suivants :

Préfixe des commandes : Modifiez la variable selfbotPrefix dans le script principal (par défaut : !).
Intents : Le selfbot utilise des intents Discord spécifiques pour plus d'efficacité. Modifiez le tableau intents dans la configuration du Client si nécessaire :intents: [
    1 << 0, // GUILDS
    1 << 1, // GUILD_MEMBERS
    1 << 9, // GUILD_MESSAGES
    1 << 12 // DIRECT_MESSAGES
]




Utilisation

Lancer le selfbotDémarrez le selfbot en exécutant le script principal :
node index.js

Le selfbot va :

Charger tous les tokens depuis tokens.txt.
Lancer un client pour chaque token.
Charger les commandes depuis le dossier commands.
Journaliser l'état de la connexion et l'exécution des commandes.


Exécuter des commandesEnvoyez un message dans Discord commençant par le préfixe (!) suivi du nom de la commande. Par exemple :
!ping


Note : Le selfbot ne répond qu'aux commandes envoyées par le compte sur lequel il s'exécute.


Arrêter le selfbotAppuyez sur Ctrl+C dans le terminal pour arrêter proprement tous les clients selfbot.



Créer des commandes
Le framework prend en charge des commandes modulaires stockées dans le dossier commands. Chaque commande est un fichier JavaScript avec la structure suivante :

Créer un fichier de commandeCréez un fichier .js dans le dossier commands, par exemple, ping.js.

Structure de la commandeExemple commands/ping.js :
module.exports = {
    name: 'ping',
    description: 'Vérifie si le selfbot est réactif',
    async execute(message, args) {
        await message.reply('Pong !');
    }
};


Exigences des commandes  

name : Le nom de la commande (utilisé pour déclencher la commande, par exemple, !ping).
description : Une brève description de la commande (facultatif, pour la documentation).
execute : Une fonction asynchrone qui gère la logique de la commande, recevant message (l'objet message Discord) et args (les arguments de la commande sous forme de tableau).


Recharger les commandesLes commandes sont chargées automatiquement au démarrage du selfbot. Pour ajouter ou modifier des commandes, modifiez les fichiers dans le dossier commands et redémarrez le selfbot.



Dépannage

"tokens.txt introuvable"Assurez-vous que le fichier tokens.txt existe dans le dossier racine et contient des tokens valides.

"Token invalide"Vérifiez que les tokens dans tokens.txt sont corrects et non expirés. Les tokens doivent être des tokens utilisateur, pas des tokens de bot.

"Commande introuvable"Vérifiez que le fichier de commande se trouve dans le dossier commands, se termine par .js et possède un name et une fonction execute valides.

"Erreur lors du chargement de la commande"Vérifiez le fichier de commande pour des erreurs de syntaxe ou des exports manquants. Consultez la console pour des messages d'erreur détaillés.

Le selfbot ne répond pasAssurez-vous que le client Discord a les intents nécessaires activés et que le compte n'est pas limité ou banni.



Notes importantes

Contre les conditions d'utilisation de Discord : L'utilisation d'un selfbot peut entraîner la résiliation de votre compte. Utilisez-le de manière responsable et à vos propres risques.
Sécurisez vos tokens : Ne partagez jamais votre fichier tokens.txt ou ne l'incluez pas dans un contrôle de version (par exemple, Git). Ajoutez tokens.txt à .gitignore.
Limites de taux : Discord impose des limites de taux sur les requêtes API. Évitez d'envoyer des commandes en masse pour éviter les blocages temporaires.
Journalisation : Le selfbot enregistre l'état de la connexion, l'exécution des commandes et les erreurs dans la console pour le débogage.


Contribuer
Les contributions sont les bienvenues ! Pour contribuer :

Forkez le dépôt.
Créez une nouvelle branche pour votre fonctionnalité ou correction de bug.
Soumettez une pull request avec une description claire de vos modifications.

Assurez-vous que votre code suit le style existant et inclut une gestion appropriée des erreurs.

Avertissement
Ce projet est destiné à des fins éducatives uniquement. Le développeur n'est pas responsable de toute utilisation abusive de ce logiciel ou des violations des Conditions d'utilisation de Discord. Utilisez à vos propres risques.

Bonne automatisation ! 🚀
