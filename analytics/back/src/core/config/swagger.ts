import { DocumentBuilder } from '@nestjs/swagger';
import { appConfig } from './app';

const swaggerConfig = new DocumentBuilder()
  .setTitle(appConfig.name)
  .setDescription('API документация')
  .setVersion('1.0')
  .addTag('address', 'Адреса доставки')
  .addTag('order', 'Управление заказами')
  .addTag('user', 'Операции с пользователями')
  .addTag('app', 'Базовые операции с приложением')
  .addTag('auth', 'Аутентификация и авторизация')
  .addTag('product', 'Управление товарами и меню')
  // .addTag('cart', 'Корзина покупок')
  // .addTag('delivery', 'Доставка и самовывоз')
  // .addTag('payments', 'Оплата и счета')
  // .addTag('promotions', 'Акции и промокоды')
  .addBasicAuth()
  .build();

export { swaggerConfig };
