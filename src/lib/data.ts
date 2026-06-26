import type { Category } from '@/lib/types';
import { BeerIcon, WineIcon, MartiniIcon, ZapIcon, GlassWater } from '@/components/icons';

// ATENÇÃO: As categorias agora são buscadas do Firestore.
// Este array serve como um fallback inicial ou para referência.
// A gestão real é feita em /admin/categories
export const categories: Category[] = [
  { id: 'cervejas', name: 'Cervejas' },
  { id: 'vinhos', name: 'Vinhos' },
  { id: 'destilados', name: 'Destilados' },
  { id: 'energeticos', name: 'Energéticos' },
  { id: 'sem-alcool', name: 'Sem Álcool' },
];

// The products array is now fetched from Firestore.
// You can remove this mock data.
export const products = [];
