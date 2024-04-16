const User = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

module.exports = {
    // Fonction pour créer un nouvel utilisateur
    createUser: async (req, res) => {
        // Extraire les données du corps de la requête
        const { firstName, lastName, email, numéroTelephone, address, gendre, city, zip, password, confirmPassword } = req.body;

        // Vérifier si confirmPassword est fourni et non vide
        if (!confirmPassword || confirmPassword.trim() === '') {
            return res.status(400).json({ message: "Confirm password is required" });
        }

        // Vérifier si les mots de passe correspondent
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        try {
            // Hasher le mot de passe
            const hashedPassword = await bcrypt.hash(password, 10);

            // Créer un nouvel utilisateur avec les données fournies
            const newUser = new User({
                firstName,
                lastName,
                email,
                numéroTelephone,
                address,
                gendre,
                city,
                zip,
                password: hashedPassword,
                confirmPassword
            });

            // Sauvegarder le nouvel utilisateur dans la base de données
            await newUser.save();
            // Répondre avec un message de succès
            res.status(201).json({ message: "User successfully created" });
        } catch (error) {
            // En cas d'erreur, répondre avec un code d'erreur et un message d'erreur
            res.status(500).json({ message: error.message });
        }
    },

    // Fonction pour connecter un utilisateur existant
    loginUser: async (req, res) => {
        // Extraire les données d'identification du corps de la requête
        const { email, password } = req.body;
        try {
            // Rechercher l'utilisateur dans la base de données par son email
            const user = await User.findOne({ email });
            // Si l'utilisateur n'est pas trouvé, répondre avec un code d'erreur
            if (!user) {
                return res.status(401).json({ message: "User not found" });
            }
    
            // Vérifier si le mot de passe fourni correspond au mot de passe stocké
            const isPasswordMatch = await bcrypt.compare(password, user.password);
            if (!isPasswordMatch) {
                return res.status(401).json({ message: "Wrong password" });
            }
    
            // Créer un jeton d'authentification JWT pour l'utilisateur
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "2d" });
    
            // Supprimer le mot de passe et d'autres données sensibles avant de répondre
            const { password: _, __v, updatedAt, createdAt, ...others } = user._doc;
            
            // Répondre avec un message de bienvenue et le jeton d'authentification
            res.status(200).json({ message: "Welcome to TDiscount!", token });
        } catch (error) {
            // En cas d'erreur, répondre avec un code d'erreur et un message d'erreur
            res.status(500).json({ message: "Failed to login, check your credentials" });
        }
    }
}    