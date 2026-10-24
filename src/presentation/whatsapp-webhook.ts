import express from 'express';
import path from 'path';
import { GenerateWeeklyMenu } from '../application/generate-weekly-menu';
import { INITIAL_RECIPES } from '../seeds/initial-recipes';
import {
  PROGRESSION_LEVELS,
  FatReductionLevel,
  calculateNextLevel,
} from '../application/services/fat-reduction-progression.service';
import { DatabaseConnection } from '../infrastructure/database/database';
import { UserRepository } from '../infrastructure/database/repositories/user.repository';
import { RecipeRepository } from '../infrastructure/database/repositories/recipe.repository';
import { ProductRepository } from '../infrastructure/database/repositories/product.repository';
import { SupermarketRepository } from '../infrastructure/database/repositories/supermarket.repository';
import { telegramService } from '../infrastructure/telegram/telegram.service';
import { ProductPriceRepository } from '../infrastructure/database/repositories/product-price.repository';
import { PriceComparisonService } from '../application/services/price-comparison.service';

/**
 * Webhook de Telegram.
 * Aquí llegan los mensajes del usuario y aquí se envían las respuestas.
 * Esta es la capa de presentación - solo maneja la entrada/salida.
 */

export interface TelegramWebhookDependencies {
  // No necesitamos dependencias externas por ahora
}

let dbInstance: DatabaseConnection | null = null;

async function getDb(): Promise<DatabaseConnection> {
  if (!dbInstance) {
    dbInstance = await DatabaseConnection.getInstance();
  }
  return dbInstance;
}

export function createServer(port: number): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const app = express();
      app.use(express.json());

      // Ruta de prueba: interfaz simulada de Telegram
      app.get('/test', (req, res) => {
        res.sendFile(path.join(__dirname, 'test-interface.html'));
      });

      // Endpoint de prueba: recibe un mensaje y devuelve respuesta simulada
      app.post('/test/message', (req, res) => {
        const { message, from } = req.body;
        const text = (message || '').toLowerCase().trim();

        console.log(`📨 Mensaje de prueba de ${from}: ${message}`);

        let reply = '';

        if (text.includes('menú') || text.includes('menu')) {
          reply = `🍎 *Tu menú semanal*\n\nLunes:\n- Desayuno: Avena con frutas y frutos secos\n- Comida: Ensalada de garbanzos con verduras\n- Cena: Salmón al horno con brócoli\n- Merienda: Yogur natural con frutas\n\nMartes:\n- Desayuno: Tostada integral con aguacate\n- Comida: Lentejas estofadas con verduras\n- Cena: Salmón al horno con brócoli\n- Merienda: Yogur natural con frutas\n\n... (y así toda la semana)\n\nReducción de grasas: nivel 1/5 (progresiva)\n\nResponde "lista" para recibir la lista de compras.`;
        } else if (text.includes('lista') || text.includes('compra')) {
          reply = `🛒 *Tu lista de compras*\n\n📍 Mercadona (más barato):\n- Avena: 1,20 €/kg\n- Garbanzos: 0,90 €/kg\n- Brócoli: 1,50 €/kg\n- Salmón: 9,90 €/kg\n- Yogur natural: 0,60 €/unidad\n- Aguacate: 1,80 €/kg\n- Pan integral: 1,10 €/barra\n\n📍 Carrefour:\n- Avena: 1,35 €/kg\n- Garbanzos: 1,05 €/kg\n\n💰 Ahorro estimado esta semana: ~4,20 €\n\n¿Quieres que ajuste algo de la lista?`;
        } else if (text.includes('instagram') || text.includes('youtube') || text.includes('http')) {
          reply = `📱 *Receta externa recibida*\n\nGracias por compartir ese enlace. Lo he validado:\n\n✅ La receta es apta para colesterol alto.\n✅ No contiene ultraprocesados.\n\n¿Quieres que la incluya en tu menú de esta semana? Responde "sí" o "no".`;
        } else if (text.includes('ayuda')) {
          reply = `📋 *Comandos disponibles:*\n\n- "menú" → Recibir tu menú semanal\n- "lista" → Recibir tu lista de compras\n- Envía un enlace de Instagram o YouTube → Importar una receta\n- "ayuda" → Ver esta ayuda\n\nTodo adaptado a tu colesterol alto con reducción progresiva de grasas.`;
        } else {
          reply = `No entiendo ese mensaje. Escribe "ayuda" para ver qué puedo hacer por ti, o simplemente escribe "menú" para recibir tu menú semanal.`;
        }

        res.json({ reply, from, timestamp: new Date().toISOString() });
      });

      // Endpoint de prueba: generar menú semanal con progresividad de colesterol
      app.post('/test/menu', (req, res) => {
        const { weekStartDate, fatReductionLevel, userMood } = req.body;

        const testUser = {
          id: 'usuario-prueba-1',
          phoneNumber: '+34600000000',
          name: 'Usuario de prueba',
          hasHighCholesterol: true,
          fatReductionLevel: (fatReductionLevel || 1) as FatReductionLevel,
          preferences: [],
          allergies: [],
          dislikes: [],
          mood: userMood || 'bien',
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const availableRecipes = INITIAL_RECIPES.map((r) => ({
          id: r.id,
          title: r.title,
          ingredients: r.ingredients,
          steps: r.steps,
          preparationTimeMinutes: r.preparationTimeMinutes,
          servings: r.servings,
          isCholesterolFriendly: r.isCholesterolFriendly,
          saturatedFatLevel: r.saturatedFatLevel,
          fiberLevel: r.fiberLevel,
          source: r.source as 'internal' | 'instagram' | 'youtube',
          externalUrl: r.externalUrl,
          createdByUserId: undefined,
          createdAt: new Date(),
        }));

        const generator = new GenerateWeeklyMenu();
        const startDate = weekStartDate ? new Date(weekStartDate) : new Date();

        generator
          .execute({
            user: testUser,
            weekStartDate: startDate,
            availableRecipes,
            userRecipes: [],
            fatReductionLevel: testUser.fatReductionLevel,
          })
          .then((result) => {
            const nextProgression = calculateNextLevel(
              testUser.fatReductionLevel,
              1,
              testUser.mood as 'bien' | 'regular' | 'mal'
            );

            const levelInfo = PROGRESSION_LEVELS[testUser.fatReductionLevel];

            const menuText = result.menu.meals
              .reduce((acc, meal) => {
                const dayIndex = Math.floor(
                  result.menu.meals.indexOf(meal) / 4
                );
                const dayNames = [
                  'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo',
                ];
                const mealTypeEmoji: Record<string, string> = {
                  desayuno: '🌅',
                  comida: '☀️',
                  cena: '🌙',
                  merienda: '🍪',
                };

                if (
                  acc.length === 0 ||
                  !acc[acc.length - 1].includes(dayNames[dayIndex])
                ) {
                  acc.push(`\n*${dayNames[dayIndex]}:*`);
                }
                acc.push(
                  `${mealTypeEmoji[meal.type]} ${meal.recipeTitle}`
                );
                return acc;
              }, [] as string[])
              .join('\n');

            res.json({
              menu: result.menu,
              evaluation: result.evaluation,
              nextProgression,
              levelInfo,
              menuText,
              disclaimer:
                '⚠️ Recuerda: este sistema no sustituye el consejo de un médico o nutricionista. Consulta con tu profesional de la salud antes de hacer cambios importantes en tu dieta.',
            });
          })
          .catch((err) => {
            res.status(500).json({ error: err.message });
          });
      });

      // Endpoint de prueba: calcular progresión de grasas
      app.post('/test/progression', (req, res) => {
        const { currentLevel, weekNumber, userMood } = req.body;

        const progression = calculateNextLevel(
          (currentLevel || 1) as FatReductionLevel,
          weekNumber || 1,
          (userMood || 'bien') as 'bien' | 'regular' | 'mal'
        );

        res.json({ progression });
      });

      // ============ ENDPOINTS DE BASE DE DATOS (Fase 3) ============

      // Crear usuario de prueba
      app.post('/test/db/user', async (req, res) => {
        try {
          const db = await getDb();
          const userRepo = new UserRepository(db.getDb());

          const { phoneNumber, name, allergies, dislikes } = req.body;

          const user = userRepo.create({
            phoneNumber,
            name,
            allergies: allergies || [],
            dislikes: dislikes || [],
          });

          db.persist();

          res.json({ success: true, user });
        } catch (err: any) {
          res.status(500).json({ error: err.message });
        }
      });

      // Listar usuarios
      app.get('/test/db/users', async (req, res) => {
        try {
          const db = await getDb();
          const userRepo = new UserRepository(db.getDb());

          const user = userRepo.findByPhone(req.query.phone as string) || null;
          res.json({ user });
        } catch (err: any) {
          res.status(500).json({ error: err.message });
        }
      });

      // Crear receta de prueba
      app.post('/test/db/recipe', async (req, res) => {
        try {
          const db = await getDb();
          const recipeRepo = new RecipeRepository(db.getDb());

          const { title, ingredients, steps, source } = req.body;

          const recipe = recipeRepo.create({
            title,
            ingredients: ingredients || [],
            steps: steps || [],
            preparationTimeMinutes: 30,
            servings: 4,
            source: source || 'internal',
          });

          db.persist();

          res.json({ success: true, recipe });
        } catch (err: any) {
          res.status(500).json({ error: err.message });
        }
      });

      // Listar recetas
      app.get('/test/db/recipes', async (req, res) => {
        try {
          const db = await getDb();
          const recipeRepo = new RecipeRepository(db.getDb());

          const recipes = recipeRepo.findAll();
          res.json({ recipes });
        } catch (err: any) {
          res.status(500).json({ error: err.message });
        }
      });

      // Listar productos
      app.get('/test/db/products', async (req, res) => {
        try {
          const db = await getDb();
          const productRepo = new ProductRepository(db.getDb());

          const products = productRepo.findAll();
          res.json({ products });
        } catch (err: any) {
          res.status(500).json({ error: err.message });
        }
      });

      // Listar supermercados
      app.get('/test/db/supermarkets', async (req, res) => {
        try {
          const db = await getDb();
          const supermarketRepo = new SupermarketRepository(db.getDb());

          const supermarkets = supermarketRepo.findAll();
          res.json({ supermarkets });
        } catch (err: any) {
          res.status(500).json({ error: err.message });
        }
      });

      // ============ ENDPOINTS DE PRECIOS (Fase 5) ============

      // Insertar o actualizar precio de un producto
      app.post('/test/db/price', async (req, res) => {
        try {
          const db = await getDb();
          const priceRepo = new ProductPriceRepository(db.getDb());

          const {
            productId,
            productName,
            supermarket,
            pricePerKg,
            currency,
            ingredients,
            isUltraProcessed,
            notes,
          } = req.body;

          if (!productId || !productName || !supermarket || pricePerKg === undefined) {
            return res.status(400).json({
              error: 'Faltan campos requeridos: productId, productName, supermarket, pricePerKg',
            });
          }

          const price = priceRepo.savePrice({
            productId,
            productName,
            supermarket,
            pricePerKg,
            currency: currency || 'EUR',
            ingredients: ingredients || [],
            isUltraProcessed: isUltraProcessed || false,
            notes: notes || '',
          });

          db.persist();

          res.json({ success: true, price });
        } catch (err: any) {
          res.status(500).json({ error: err.message });
        }
      });

      // Obtener precios de un producto (ordenados de más barato a más caro)
      app.get('/test/db/prices/:productId', async (req, res) => {
        try {
          const db = await getDb();
          const priceRepo = new ProductPriceRepository(db.getDb());

          const prices = priceRepo.getPricesForProduct(req.params.productId);
          res.json({ productId: req.params.productId, prices });
        } catch (err: any) {
          res.status(500).json({ error: err.message });
        }
      });

      // Obtener todos los precios
      app.get('/test/db/prices', async (req, res) => {
        try {
          const db = await getDb();
          const priceRepo = new ProductPriceRepository(db.getDb());

          const prices = priceRepo.getAllPrices();
          res.json({ prices });
        } catch (err: any) {
          res.status(500).json({ error: err.message });
        }
      });

      // Obtener el supermercado más barato para un producto
      app.get('/test/db/compare/:productId', async (req, res) => {
        try {
          const db = await getDb();
          const priceRepo = new ProductPriceRepository(db.getDb());

          const result = priceRepo.getCheapestSupermarketForProduct(
            req.params.productId
          );

          if (!result) {
            return res.status(404).json({
              error: 'No hay precios para este producto',
            });
          }

          res.json({
            productId: req.params.productId,
            cheapestSupermarket: result.supermarket,
            cheapestPrice: result.price,
            allPrices: result.allPrices,
          });
        } catch (err: any) {
          res.status(500).json({ error: err.message });
        }
      });

      // Eliminar un precio
      app.delete('/test/db/price/:priceId', async (req, res) => {
        try {
          const db = await getDb();
          const priceRepo = new ProductPriceRepository(db.getDb());

          const deleted = priceRepo.deletePrice(req.params.priceId);

          if (!deleted) {
            return res.status(404).json({ error: 'Precio no encontrado' });
          }

          db.persist();

          res.json({ success: true, message: 'Precio eliminado' });
        } catch (err: any) {
          res.status(500).json({ error: err.message });
        }
      });

      // Webhook real de Telegram (para cuando se conecte el bot)
      app.post('/webhook', async (req, res) => {
        try {
          const { message } = req.body;

          if (!message) {
            res.status(200).json({ status: 'no message' });
            return;
          }

          const chatId = message.chat?.id;
          const text = (message.text || '').toLowerCase().trim();

          console.log(`📨 Mensaje de Telegram de ${chatId}: ${message.text}`);

          // Procesar el mensaje y generar respuesta
          let reply = '';

          if (text.includes('menú') || text.includes('menu') || text === '/menu') {
            reply = `🍎 *Tu menú semanal*\n\nLunes:\n- Desayuno: Avena con frutas y frutos secos\n- Comida: Ensalada de garbanzos con verduras\n- Cena: Salmón al horno con brócoli\n- Merienda: Yogur natural con frutas\n\n... (y así toda la semana)\n\nReducción de grasas: nivel 1/5 (progresiva)\n\nResponde "lista" para recibir la lista de compras.`;
          } else if (text.includes('lista') || text.includes('compra') || text === '/lista') {
            reply = `🛒 *Tu lista de compras*\n\n📍 Mercadona (más barato):\n- Avena: 1,20 €/kg\n- Garbanzos: 0,90 €/kg\n- Brócoli: 1,50 €/kg\n- Salmón: 9,90 €/kg\n- Yogur natural: 0,60 €/unidad\n- Aguacate: 1,80 €/kg\n- Pan integral: 1,10 €/barra\n\n📍 Carrefour:\n- Avena: 1,35 €/kg\n- Garbanzos: 1,05 €/kg\n\n💰 Ahorro estimado esta semana: ~4,20 €\n\n¿Quieres que ajuste algo de la lista?`;
          } else if (text.includes('instagram') || text.includes('youtube') || text.includes('http')) {
            reply = `📱 *Receta externa recibida*\n\nGracias por compartir ese enlace. Lo he validado:\n\n✅ La receta es apta para colesterol alto.\n✅ No contiene ultraprocesados.\n\n¿Quieres que la incluya en tu menú de esta semana? Responde "sí" o "no".`;
          } else if (text.includes('ayuda') || text === '/ayuda' || text === '/start') {
            reply = `📋 *Comandos disponibles:*\n\n- "menú" → Recibir tu menú semanal\n- "lista" → Recibir tu lista de compras\n- Envía un enlace de Instagram o YouTube → Importar una receta\n- "ayuda" → Ver esta ayuda\n\nTodo adaptado a tu colesterol alto con reducción progresiva de grasas.`;
          } else {
            reply = `No entiendo ese mensaje. Escribe "ayuda" para ver qué puedo hacer por ti, o simplemente escribe "menú" para recibir tu menú semanal.`;
          }

          // Enviar respuesta por Telegram real si está configurado
          if (telegramService.isReady() && chatId) {
            await telegramService.sendMessage(chatId, reply);
          }

          res.status(200).json({ status: 'received', reply });
        } catch (err: any) {
          console.error('Error procesando webhook de Telegram:', err.message);
          res.status(500).json({ status: 'error', error: err.message });
        }
      });

      // Endpoint de salud
      app.get('/health', (req, res) => {
        res.status(200).json({ status: 'ok' });
      });

      const server = app.listen(port, () => {
        console.log(`🚀 Servidor escuchando en el puerto ${port}`);
        resolve();
      });

      server.on('error', (err: Error) => {
        reject(err);
      });
    } catch (error) {
      reject(error as Error);
    }
  });
}