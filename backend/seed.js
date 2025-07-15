const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcryptjs = require('bcryptjs');

dotenv.config();

const User = require('./models/User');
const Activity = require('./models/Activity');

async function seedData() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Activity.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const hashedPassword = await bcryptjs.hash('admin123', 10);
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      isAdmin: true,
    });
    console.log('Created admin user');

    // Create regular user
    const userPassword = await bcryptjs.hash('user123', 10);
    const user = await User.create({
      name: 'John Doe',
      email: 'user@example.com',
      password: userPassword,
      isAdmin: false,
    });
    console.log('Created regular user');

    // Create sample activities
    const activities = [
      {
        name: 'Descente en Kayak',
        description: 'Découvrez les paysages magnifiques du Rhône en kayak accompagné d\'un guide expérimenté. Activité adaptée à tous les niveaux.',
        type: 'Sport nautique',
        place: 'Base nautique de Lyon, Quai Rambaud',
        availableDates: [
          {
            date: new Date('2025-08-15'),
            startTime: '09:00',
            endTime: '17:00',
          },
          {
            date: new Date('2025-08-22'),
            startTime: '09:00',
            endTime: '17:00',
          },
        ],
        price: 45,
        totalPlaces: 16,
        createdBy: admin._id,
      },
      {
        name: 'Initiation Stand-Up Paddle',
        description: 'Apprenez les bases du paddle sur les eaux calmes du Rhône. Matériel fourni, cours adapté aux débutants.',
        type: 'Sport nautique',
        place: 'Parc de la Tête d\'Or, Lyon',
        availableDates: [
          {
            date: new Date('2025-08-20'),
            startTime: '10:00',
            endTime: '16:00',
          },
          {
            date: new Date('2025-08-27'),
            startTime: '10:00',
            endTime: '16:00',
          },
        ],
        price: 35,
        totalPlaces: 12,
        createdBy: admin._id,
      },
      {
        name: 'Croisière Détente',
        description: 'Embarquez pour une croisière relaxante sur le Rhône avec collation et découverte du patrimoine fluvial lyonnais.',
        type: 'Croisière',
        place: 'Embarcadère Bellecour, Lyon',
        availableDates: [
          {
            date: new Date('2025-08-25'),
            startTime: '14:00',
            endTime: '18:00',
          },
          {
            date: new Date('2025-09-01'),
            startTime: '14:00',
            endTime: '18:00',
          },
          {
            date: new Date('2025-09-08'),
            startTime: '14:00',
            endTime: '18:00',
          },
        ],
        price: 28,
        totalPlaces: 25,
        createdBy: admin._id,
      },
      {
        name: 'Canoë Famille',
        description: 'Sortie en canoë spécialement conçue pour les familles. Parcours sécurisé sur une section calme du Rhône.',
        type: 'Activité familiale',
        place: 'Base de Givors, Rhône',
        availableDates: [
          {
            date: new Date('2025-08-16'),
            startTime: '10:00',
            endTime: '15:00',
          },
          {
            date: new Date('2025-08-23'),
            startTime: '10:00',
            endTime: '15:00',
          },
        ],
        price: 32,
        totalPlaces: 20,
        createdBy: admin._id,
      },
      {
        name: 'Rafting Sensation',
        description: 'Vivez des sensations fortes sur les rapides du Rhône ! Encadrement professionnel et équipement de sécurité fourni.',
        type: 'Sport extrême',
        place: 'Sault-Brénaz, Ain',
        availableDates: [
          {
            date: new Date('2025-08-30'),
            startTime: '09:00',
            endTime: '16:00',
          },
        ],
        price: 65,
        totalPlaces: 10,
        createdBy: admin._id,
      },
    ];

    for (const activityData of activities) {
      const activity = await Activity.create(activityData);
      console.log(`Created activity: ${activity.name}`);
    }

    console.log('✅ Seeding completed successfully!');
    console.log('🔑 Login credentials:');
    console.log('   Admin: admin@example.com / admin123');
    console.log('   User:  user@example.com / user123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedData();
