// src/app/api/stores/route.js
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('Début de la requête GET');
    console.log('Prisma instance:', !!prisma);
    
    const stores = await prisma.recordStore.findMany({
      include: {
        postedVinyls: {
          select: {
            id: true,
            title: true,
            artist: true,
            imageUrl: true,
            createdAt: true
          }
        },
        inventory: {
          where: {
            inStock: true
          },
          select: {
            id: true,
            price: true,
            condition: true,
            vinyl: {
              select: {
                title: true,
                artist: true,
                imageUrl: true
              }
            }
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    console.log('Nombre de magasins trouvés:', stores?.length);
    
    return NextResponse.json(stores || []);

  } catch (error) {
    console.error('Erreur détaillée:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    return NextResponse.json(
      { error: 'Erreur serveur', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Validation des données requises
    const requiredFields = ['name', 'address', 'city'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `Le champ ${field} est requis` },
          { status: 400 }
        );
      }
    }

    // Validation des coordonnées GPS
    const latitude = data.latitude ? parseFloat(data.latitude) : null;
    const longitude = data.longitude ? parseFloat(data.longitude) : null;
    
    if ((latitude && (latitude < -90 || latitude > 90)) || 
        (longitude && (longitude < -180 || longitude > 180))) {
      return NextResponse.json(
        { error: 'Coordonnées GPS invalides' },
        { status: 400 }
      );
    }

    const newStore = await prisma.recordStore.create({
      data: {
        name: data.name,
        address: data.address,
        city: data.city,
        latitude: latitude,
        longitude: longitude,
        phone: data.phone || null,
        website: data.website || null,
        rating: data.rating ? parseFloat(data.rating) : null,
        reviewCount: data.reviewCount ? parseInt(data.reviewCount) : null,
        status: data.status || 'ACTIVE',
        openingHours: data.openingHours || null,
        lastInventoryUpdate: data.lastInventoryUpdate ? new Date(data.lastInventoryUpdate) : null
      }
    });

    return NextResponse.json(newStore, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création du magasin:', error);
    
    // Gestion des erreurs spécifiques
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Un magasin avec ces informations existe déjà' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Erreur serveur interne', details: error.message },
      { status: 500 }
    );
  }
}

// Fonction utilitaire pour valider le format des heures d'ouverture
function validateOpeningHours(openingHours) {
  if (!openingHours) return true;
  
  try {
    const parsed = JSON.parse(openingHours);
    const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    
    return daysOfWeek.every(day => {
      if (parsed[day]) {
        return parsed[day].open && parsed[day].close && 
               /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(parsed[day].open) &&
               /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(parsed[day].close);
      }
      return true;
    });
  } catch {
    return false;
  }
}